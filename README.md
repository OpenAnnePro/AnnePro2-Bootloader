# Anne Pro 2 Bootloader Reverse Engineering

This repository contains a dump of the Anne Pro 2 Keyboard bootloader. This bootloader resides on the Keyboard Matrix
controller IC (U2). This is the code that runs when you boot the uController while holding down `esc` key.

The `bootloader.bin` file is a direct dump of the flash content. Meanwhile the `bootloader.idb` is an IDA database
for my current reversing work.

The `writeFirmware.js` is largely copy-pasta from the Windows distribution of ObinsKit app. It contains the important routines
for firmware download through the Obins IAP. I will soon<sup>TM</sup> write a tool for flashing file onto the Anne Pro 2 as a POC.

# Other Resources
Look around in this Github Org it has all kind of information about the Anne Pro 2. Inclduing a copy of my current reversing
schematics.

# Contributing
If you are interested in helping out, feel free to look around in this Org or contact me Codetector<codetector@codetector.org>.