function(e, t, a) {
    'use strict';

    function o(e) {
        return p.writeHostToTarget(u.DistSource.MCU_MAIN, [u.L2_CMD.LED, f.KEY_LED_TABLE, e])
    }

    function n(e, t, a, o) {
        if (36 < o.length) {
            const n = 2 === e ? u.DistSource.MCU_MAIN : m,
                r = `${u.sourceDist(n,u.DistSource.USB_HOST)}-${u.L2_CMD.LED}-${e}`,
                i = u.sourceDist(u.DistSource.USB_HOST, n),
                l = u.generateBigData(i, [u.L2_CMD.LED, e, t, a], o);
            return new Promise(async (e, t) => {
                try {
                    for (const e of l) await p.write(r, e);
                    e()
                } catch (e) {
                    log.error('ledPreviewOrDownload error'), t(e)
                }
            })
        }
        return e === f.KEY_LED_ON_DL ? p.writeHostToTarget(u.DistSource.MCU_MAIN, [u.L2_CMD.LED, e, t, a].concat(o)) : p.writeHostToTarget(m, [u.L2_CMD.LED, e, t, a].concat(o))
    }

    function r(e) {
        return p.writeHostToTarget(m, [u.L2_CMD.LED, f.KEY_LED_PRE, 255, 1].concat(e))
    }

    function i(e) {
        return p.writeHostToTarget(m, [u.L2_CMD.LED, f.KEY_LED_AUDIO_VISUALIZE, 0, 1].concat(e))
    }

    function l(e) {
        const t = m,
            a = `${u.sourceDist(t,u.DistSource.USB_HOST)}-${u.L2_CMD.LED}-${f.KEY_LED_AUDIO_VISUALIZE}`,
            o = u.sourceDist(u.DistSource.USB_HOST, t),
            n = u.generateBigData(o, [u.L2_CMD.LED, f.KEY_LED_AUDIO_VISUALIZE, 0, 2], e);
        return new Promise(async (e, t) => {
            try {
                for (const e of n) await p.write(a, e);
                e()
            } catch (e) {
                log.error('ledPreviewOrDownload error'), t(e)
            }
        })
    }

    function d(e) {
        return p.writeHostToTarget(u.DistSource.MCU_MAIN, [u.L2_CMD.LED, f.KEY_LED_HOLD_ON, e])
    }

    function s(e) {
        return p.writeHostToTarget(u.DistSource.MCU_MAIN, [u.L2_CMD.LED, f.KEY_BACKLIGHT_BRIGHTNESS, e])
    }

    function c(e) {
        return p.writeHostToTarget(u.DistSource.MCU_MAIN, [u.L2_CMD.LED, f.KEY_INDICATOR_BRIGHTNESS, e])
    }
    Object.defineProperty(t, '__esModule', {
        value: !0
    });
    const p = a(111),
        u = a(132);
    let m = u.DistSource.MCU_LED;
    var f;
    (function(e) {
        e[e.KEY_RESERVED = 0] = 'KEY_RESERVED', e[e.KEY_LED_ON_OFF = 1] = 'KEY_LED_ON_OFF', e[e.KEY_LED_ON_DL = 2] = 'KEY_LED_ON_DL', e[e.KEY_LED_PRE = 3] = 'KEY_LED_PRE', e[e.KEY_LED_TABLE = 4] = 'KEY_LED_TABLE', e[e.KEY_LED_HOLD_ON = 13] = 'KEY_LED_HOLD_ON', e[e.KEY_LED_AUDIO_VISUALIZE = 17] = 'KEY_LED_AUDIO_VISUALIZE', e[e.KEY_INDICATOR_BRIGHTNESS = 20] = 'KEY_INDICATOR_BRIGHTNESS', e[e.KEY_BACKLIGHT_BRIGHTNESS = 21] = 'KEY_BACKLIGHT_BRIGHTNESS'
    })(f = t.LedKeys || (t.LedKeys = {})), t.setCmdDist = function(e) {
        m = e
    }, t.lightTable = o, t.ledPreviewOrDownload = n, t.previewPureLed = r, t.audioVisualizePureLed = i, t.audioVisualizeMutiLed = l, t.writeLedHold = d, t.writeBacklightBrightness = s, t.writeIndicatorBrightness = c
}