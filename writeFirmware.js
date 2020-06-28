// DistSource
USB_HOST = 1; // 'USB_HOST'
BLE_HOST = 2;
MCU_MAIN = 3;
MCU_LED = 4;
MCU_BLE = 5;

// L2_CMD
GLOBAL = 1;
FW = 2;
KEYBOARD = 16;
LED = 32;
MACRO = 48;
BLE = 64;

// KEY_*
KEY_RESERVED = 0;
KEY_IAP_MODE = 1;
KEY_IAP_GET_MODE = 2;
KEY_IAP_GET_FW_VERSION = 3;
KEY_IAP_WIRTE_MEMORY = 49;
KEY_IAP_WRITE_AP_FLAG = 50;
KEY_IAP_ERASE_MEMORY = 67;

function generateData(source, targetDevice, dataToSend) {
    const packedHostTarget = (targetDevice << 4) + source;
    var data = [123, 16, packedHostTarget, 16, dataToSend.length, 0, 0, 125];
    data.unshift(0); 
    return data.concat(dataToSend)
}

function execWrite(usbAddress, t, a = false) {
    return new Promise((accept, reject) => {
        if (a) try {
            m.write(t), accept()
        } catch (e) {
            log.error('write failed.'), d.printHex('Write failed for data:', t), reject(e.message)
        } else {
            const a = setTimeout(() => {
                d.printHex('Write timeout for data:', t), reject('write timeout')
            }, 3e3);
            p.once(usbAddress, (e) => {
                a && clearTimeout(a), accept(e)
            });
            try {
                m.write(t)
            } catch (e) {
                a && clearTimeout(a), log.error('write failed.'), d.printHex('Write failed for data:', t), reject(e.message)
            }
        }
    })
}

function writeHostToTarget(targetDevice, firmwareStruct, a = false) { // a is false, not passed in
    const usbAddress = `${l.sourceDist(targetDevice,l.DistSource.USB_HOST)}-${firmwareStruct[0]}-${firmwareStruct[1]}`,
        data = l.generateData(l.DistSource.USB_HOST, targetDevice, firmwareStruct);
    return execWrite(usbAddress, data, a)
}


function iapWriteMemory(targetDevice, address, chunk) {
    return s.writeHostToTarget(targetDevice, [c.L2_CMD.FW, p.KEY_IAP_WIRTE_MEMORY].concat(address, chunk))
}

t.writeFireware = async function(targetDevice, firmwareBinary, a) {
    let chunkSize = 48;
    if (targetDevice == l.DistSource.MCU_BLE) {
        chunkSize = 32;
    }
    return new Promise(async (accept, reject) => {
        try {
            const firmwareLength = firmwareBinary.length,
            s = await i.iapGetFwVersion();
            let startAddress;
            startAddress = targetDevice === l.DistSource.MCU_MAIN ? s.slice(2, 6) : targetDevice === l.DistSource.MCU_LED ? s.slice(12, 16) : targetDevice === l.DistSource.MCU_BLE ? s.slice(22, 26) : [], await i.iapEraseMemory(targetDevice, startAddress);
            const p = Math.ceil(firmwareLength / chunkSize),
            firmwareUneventDivideBytes = firmwareLength % chunkSize;
            console.log('startAddress:', startAddress);
            let addressValue = startAddress[0] + (startAddress[1] << 8) + (startAddress[2] << 16) + (startAddress[3] << 24);
            console.log('addressValue:', addressValue);
            for (let n = 0; n < p; n++) {
                if (u) {
                    reject('Update Interrupted!');
                    break
                }
                let addrValue_ = addressValue;
                const addressValueHighestByte = addressValue >> 24;
                addrValue_ -= addressValueHighestByte << 24; // Addr Value Lower 3 bytes
                const g = addrValue_ >> 16;
                addrValue_ -= g << 16;
                const h = addrValue_ >> 8;
                addrValue_ -= h << 8;
                const l = addrValue_,
                littleEndianAddr = [l, h, g, addressValueHighestByte];
                if (n === p - 1) { // last iteration of loop
                    const firmwareBinaryChunk = firmwareBinary.splice(0, chunkSize);
                    if (firmwareBinaryChunk.length < chunkSize)
                    for (let e = 0; e < chunkSize - firmwareUneventDivideBytes; e++) firmwareBinaryChunk.push(0); // zero pad firmware
                    const n = await i.iapWriteMemory(targetDevice, littleEndianAddr, firmwareBinaryChunk);
                    if (1 === n[0]) {
                        reject('iapWriteMemory err');
                        break
                    }
                } else {
                    const firmwareBinaryChunk = firmwareBinary.splice(0, chunkSize),
                    n = await i.iapWriteMemory(targetDevice, littleEndianAddr, firmwareBinaryChunk);
                    if (1 === n[0]) {
                        reject('iapWriteMemory err');
                        break
                    }
                }
                a(`(${n*chunkSize}/${firmwareLength}bytes)`, chunkSize), addressValue += chunkSize
            }
            accept(0)
        } catch (e) {
            reject(e)
        }
    })
}