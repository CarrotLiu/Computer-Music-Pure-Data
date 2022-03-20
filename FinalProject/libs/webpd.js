! function(e, t, n) {
    "use strict";

    function i(e) {
        e && (e.setTargetAtTime ||
            (e.setTargetAtTime = e.setTargetValueAtTime))
    }
    window.hasOwnProperty("webkitAudioContext") && !window.hasOwnProperty("AudioContext") && (window.AudioContext = webkitAudioContext, AudioContext.prototype.hasOwnProperty("createGain") ||
        (AudioContext.prototype.createGain = AudioContext.prototype.createGainNode), AudioContext.prototype.hasOwnProperty("createDelay") ||
        (AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode), AudioContext.prototype.hasOwnProperty("createScriptProcessor") ||
        (AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode), AudioContext.prototype.hasOwnProperty("createPeriodicWave") ||
        (AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable), AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain, AudioContext.prototype.createGain = function() { var e = this.internal_createGain(); return i(e.gain), e }, AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay, AudioContext.prototype.createDelay = function(e) { var t = e ? this.internal_createDelay(e) : this.internal_createDelay(); return i(t.delayTime), t }, AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource, AudioContext.prototype.createBufferSource = function() { var e = this.internal_createBufferSource(); return e.start ? (e.internal_start = e.start, e.start = function(t, n, i) { "undefined" != typeof i ? e.internal_start(t || 0, n, i) : e.internal_start(t || 0, n || 0) }) : e.start = function(e, t, n) { t || n ? this.noteGrainOn(e || 0, t, n) : this.noteOn(e || 0) }, e.stop ? (e.internal_stop = e.stop, e.stop = function(t) { e.internal_stop(t || 0) }) : e.stop = function(e) { this.noteOff(e || 0) }, i(e.playbackRate), e }, AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor, AudioContext.prototype.createDynamicsCompressor = function() { var e = this.internal_createDynamicsCompressor(); return i(e.threshold), i(e.knee), i(e.ratio), i(e.reduction), i(e.attack), i(e.release), e }, AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter, AudioContext.prototype.createBiquadFilter = function() { var e = this.internal_createBiquadFilter(); return i(e.frequency), i(e.detune), i(e.Q), i(e.gain), e }, AudioContext.prototype.hasOwnProperty("createOscillator") && (AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator, AudioContext.prototype.createOscillator = function() { var e = this.internal_createOscillator(); return e.start ? (e.internal_start = e.start, e.start = function(t) { e.internal_start(t || 0) }) : e.start = function(e) { this.noteOn(e || 0) }, e.stop ? (e.internal_stop = e.stop, e.stop = function(t) { e.internal_stop(t || 0) }) : e.stop = function(e) { this.noteOff(e || 0) }, e.setPeriodicWave || (e.setPeriodicWave = e.setWaveTable), i(e.frequency), i(e.detune), e })), window.hasOwnProperty("webkitOfflineAudioContext") && !window.hasOwnProperty("OfflineAudioContext") && (window.OfflineAudioContext = webkitOfflineAudioContext)
}(window),
function e(t, n, i) {
    function r(s, a) {
        if (!n[s]) {
            if (!t[s]) { var c = "function" == typeof require && require; if (!a && c) return c(s, !0); if (o) return o(s, !0); var u = new Error("Cannot find module '" + s + "'"); throw u.code = "MODULE_NOT_FOUND", u }
            var l = n[s] = { exports: {} };
            t[s][0].call(l.exports, function(e) { var n = t[s][1][e]; return r(n ? n : e) }, l, l.exports, e, t, n, i)
        }
        return n[s].exports
    }
    for (var o = "function" == typeof require && require, s = 0; s < i.length; s++) r(i[s]);
    return r
}({
    1: [function(e, t, n) {
        var i = e("underscore"),
            r = e("pd-fileutils.parser"),
            o = e("web-audio-boilerplate"),
            s = e("./lib/core/Patch"),
            a = e("./lib/core/Abstraction"),
            c = e("./lib/core/PdObject"),
            u = e("./lib/core/mixins"),
            l = e("./lib/core/errors"),
            d = e("./lib/waa/portlets"),
            f = e("./lib/waa/interfaces"),
            h = e("./lib/global"),
            p = e("./lib/core/interfaces"),
            m = i.extend({}, u.UniqueIdsMixin);
        e("./lib/index").declareObjects(h.library);
        var v = t.exports = {
            start: function(e) { e = e || {}, h.isStarted || ("undefined" != typeof AudioContext ? (h.audio = e.audio || new f.Audio({ channelCount: h.settings.channelCount, audioContext: e.audioContext }), h.clock = e.clock || new f.Clock({ audioContext: h.audio.context, waaClock: e.waaClock }), h.midi = e.midi || new f.Midi) : (h.audio = e.audio || p.Audio, h.clock = e.clock || p.Clock, h.midi = e.midi || p.Midi), h.storage = e.storage ? e.storage : "undefined" != typeof window ? new f.Storage : p.Storage, h.midi.onMessage(function(e) { h.emitter.emit("midiMessage", e) }), h.audio.start(), i.values(h.patches).forEach(function(e) { e.start() }), h.isStarted = !0) },
            stop: function() { h.isStarted && (h.isStarted = !1, i.values(h.patches).forEach(function(e) { e.stop() }), h.audio.stop()) },
            isStarted: function() { return h.isStarted },
            getAudio: function() { return h.audio },
            getMidi: function() { return h.midi },
            send: function(e, t) { h.emitter.emit("msg:" + e, t) },
            receive: function(e, t) { h.emitter.on("msg:" + e, t) },
            registerAbstraction: function(e, t) {
                i.isString(t) && (t = r.parse(t));
                var n = function(e, n, i) { var e = new a(e, n, i); return e.patchId = m._generateId(), v._preparePatch(e, t), e };
                n.prototype = a.prototype, this.registerExternal(e, n)
            },
            registerExternal: function(e, t) { h.library[e] = t },
            createPatch: function() { var e = this._createPatch(); return h.isStarted && e.start(), e },
            destroyPatch: function(e) { e.stop(), e.destroy(), delete h.patches[e.patchId] },
            loadPatch: function(e) { var t = this._createPatch(); return i.isString(e) && (e = this.parsePatch(e)), this._preparePatch(t, e), h.isStarted && t.start(), t },
            parsePatch: function(e) { return i.isString(e) && (e = r.parse(e)), e },
            getSupportedFormats: function(e) {
                var t = new AudioContext;
                o.getSupportedFormats(t, e)
            },
            startOnClick: function(e, t, n) { o.getAudioContextOnClick(e, function(e, i) { return e ? console.error(e) : (n = n || {}, n.audioContext = i, v.start(n), void(t && t())) }) },
            _createPatch: function() { var e = new s; return e.patchId = m._generateId(), h.patches[e.patchId] = e, e },
            _preparePatch: function(e, t) {
                var n = {},
                    i = [];
                if (t.nodes.forEach(function(t) { var r, o = t.proto; try { r = e._createObject(o, t.args || []) } catch (s) { if (s instanceof l.UnknownObjectError) return i.push([s.message, s]); throw s } "array" == r.type && t.data && r.setData(new Float32Array(t.data), !0), ("pd" === o || "graph" === o) && v._preparePatch(r, t.subpatch), n[t.id] = r }), t.connections.forEach(function(e) {
                        var t = n[e.source.id],
                            r = n[e.sink.id];
                        if (!t || !r) { var o = "invalid connection " + e.source.id + ".* -> " + e.sink.id + ".*"; return i.push([o, new Error("unknown portlet")]) }
                        try { t.o(e.source.port).connect(r.i(e.sink.port)) } catch (s) { if (s instanceof l.InvalidPortletError) { var o = "invalid connection " + e.source.id + "." + e.source.port + " -> " + e.sink.id + "." + e.sink.port; return i.push([o, s]) } }
                    }), e.patchData = t, i.length) throw new l.PatchLoadError(i)
            },
            core: { PdObject: c, portlets: d, errors: l },
            _glob: h
        };
        "undefined" != typeof window && (window.Pd = v)
    }, { "./lib/core/Abstraction": 3, "./lib/core/Patch": 5, "./lib/core/PdObject": 6, "./lib/core/errors": 7, "./lib/core/interfaces": 8, "./lib/core/mixins": 9, "./lib/global": 12, "./lib/index": 14, "./lib/waa/interfaces": 17, "./lib/waa/portlets": 18, "pd-fileutils.parser": 21, underscore: 25, "web-audio-boilerplate": 39 }],
    2: [function(e, t, n) {
        var i = (e("events").EventEmitter, e("underscore")),
            r = e("./core/utils"),
            o = e("./core/mixins"),
            s = e("./core/PdObject"),
            a = (e("./core/Patch"), e("./global")),
            c = e("./waa/portlets");
        n.declareObjects = function(e) {
            var t = s.extend({
                inletDefs: [c.Inlet.extend({ message: function(e) { this.obj._onMessageReceived(e) } })],
                outletDefs: [c.Outlet],
                init: function(e, t, n, i, r) {
                    if (this._eventReceiver = new o.EventReceiver, this.value = n ? r : i, e && "-" !== e && "empty" !== e && (this.receiveName = e, this._onMessageReceived && (this._onMessageReceived = this._onMessageReceived.bind(this), this._eventReceiver.on(a.emitter, "msg:" + this.receiveName, this._onMessageReceived))), t && "-" !== t && "empty" !== t && (this.sendName = t), n && this.patch) {
                        var s = this;
                        this._onPatchStarted = function() { s._sendMessage([s.value]) }, this._eventReceiver.on(this.patch, "started", this._onPatchStarted)
                    }
                },
                destroy: function() { this._eventReceiver.destroy() },
                _sendMessage: function(e) { this.o(0).message(e), this.sendName && a.emitter.emit("msg:" + this.sendName, e) }
            });
            e.symbolatom = t.extend({
                type: "symbolatom",
                init: function(e) {
                    var n = (e[0] || void 0, e[1] || void 0, e[2]),
                        i = e[3];
                    t.prototype.init.apply(this, [n, i, 0, "symbol", 0])
                },
                _onMessageReceived: function(e) { var t = e[0]; return "bang" === t || i.isNumber(t) || "symbol" === t ? (i.isNumber(t) ? this.value = "float" : "symbol" === t && (this.value = e[1]), void this._sendMessage(r.timeTag(["symbol", this.value], e))) : console.error("invalid " + t) }
            });
            var n = t.extend({ init: function(e, n, r, o, s, a) { this._limitInput = function(e) { return i.isNumber(s) && (e = Math.min(e, s)), i.isNumber(o) && (e = Math.max(e, o)), e }, t.prototype.init.apply(this, [n, r, e, 0, a]) }, _onMessageReceived: function(e) { var t = e[0]; return "bang" === t || i.isNumber(t) ? (i.isNumber(t) && (this.value = t), void this._sendMessage(r.timeTag([this._limitInput(this.value)], e))) : console.error("invalid " + t) } });
            e.floatatom = n.extend({
                type: "floatatom",
                init: function(e) {
                    var t = e[0] || void 0,
                        i = e[1] || void 0,
                        r = e[2],
                        o = e[3];
                    n.prototype.init.apply(this, [0, r, o, t, i, 0])
                }
            }), e.nbx = n.extend({
                type: "nbx",
                init: function(e) {
                    var t = e[0] || void 0,
                        i = e[1] || void 0,
                        r = e[2] || 0,
                        o = e[3],
                        s = e[4],
                        a = e[5] || 0;
                    n.prototype.init.apply(this, [r, o, s, t, i, a])
                }
            }), e.bng = t.extend({
                type: "bng",
                init: function(e) {
                    var n = e[0] || 0,
                        i = e[1],
                        r = e[2];
                    t.prototype.init.apply(this, [i, r, n, "bang", "bang"])
                },
                _onMessageReceived: function(e) { this._sendMessage(r.timeTag(["bang"], e)) }
            }), e.tgl = t.extend({
                type: "tgl",
                init: function(e) {
                    var n = e[0] || 0,
                        r = e[1],
                        o = e[2],
                        s = e[3] || 0,
                        a = i.isNumber(e[4]) ? e[4] : 1;
                    t.prototype.init.apply(this, [r, o, n, 0, s]), this.nonZeroValue = a
                },
                _onMessageReceived: function(e) {
                    var t = e[0];
                    if ("bang" === t) this.value = 0 === this.value ? this.nonZeroValue : 0, this._sendMessage(r.timeTag([this.value], e));
                    else {
                        if (!i.isNumber(t)) return console.error("invalid message received " + e);
                        this.value = 0 === t ? 0 : this.nonZeroValue, this._sendMessage(r.timeTag([t], e))
                    }
                }
            });
            var u = n.extend({
                init: function(e) {
                    var t = e[0] || 0,
                        r = i.isNumber(e[1]) ? e[1] : 127,
                        o = e[2] || 0,
                        s = e[3],
                        a = e[4],
                        c = e[5] || 0;
                    n.prototype.init.apply(this, [o, s, a, t, r, c])
                }
            });
            e.hsl = u.extend({ type: "hsl" }), e.vsl = u.extend({ type: "vsl" });
            var l = t.extend({
                init: function(e) {
                    var n = (e[0], e[1]),
                        r = i.isNumber(e[2]) ? e[2] : 8,
                        o = e[3],
                        s = e[4],
                        a = e[5] || 0;
                    this._limitInput = function(e) { return Math.floor(Math.min(Math.max(e, 0), r - 1)) }, t.prototype.init.apply(this, [o, s, n, 0, a])
                },
                _onMessageReceived: function(e) { var t = e[0]; return "bang" === t || i.isNumber(t) ? (i.isNumber(t) && (this.value = t), void this._sendMessage(r.timeTag([this._limitInput(this.value)], e))) : console.error("invalid " + t) }
            });
            e.hradio = l.extend({ type: "hradio" }), e.vradio = l.extend({ type: "vradio" }), e.vu = t.extend({
                init: function(e) {
                    var n = e[0];
                    t.prototype.init.apply(this, [n, void 0, 0, 0, 0])
                },
                _onMessageReceived: function(e) { this._sendMessage(e) }
            })
        }
    }, { "./core/Patch": 5, "./core/PdObject": 6, "./core/mixins": 9, "./core/utils": 11, "./global": 12, "./waa/portlets": 18, events: 19, underscore: 25 }],
    3: [function(e, t, n) {
        var i = e("underscore"),
            r = e("./Patch"),
            o = t.exports = function(e, t, n) { r.apply(this, arguments) };
        i.extend(o.prototype, r.prototype, { getPatchRoot: function() { return this } })
    }, { "./Patch": 5, underscore: 25 }],
    4: [function(e, t, n) {
        var i = e("underscore"),
            r = (e("util").inherits, e("./errors")),
            o = (e("./portlets"), e("./utils"), t.exports = function(e, t, n) {
                n = n || [];
                var i = this;
                this.id = t, this.patch = e, this.inlets = this.inletDefs.map(function(e, t) { return new e(i, t) }), this.outlets = this.outletDefs.map(function(e, t) { return new e(i, t) }), this.init(n)
            });
        i.extend(o.prototype, { endPoint: !1, doResolveArgs: !1, outletDefs: [], inletDefs: [], init: function() {}, start: function() {}, stop: function() {}, destroy: function() {}, i: function(e) { if (e < this.inlets.length) return this.inlets[e]; throw new r.InvalidPortletError("inlet " + e + " doesn't exist") }, o: function(e) { if (e < this.outlets.length) return this.outlets[e]; throw new r.InvalidPortletError("outlet " + e + " doesn't exist") }, startPortlets: function() { this.outlets.forEach(function(e) { e.start() }), this.inlets.forEach(function(e) { e.start() }) }, stopPortlets: function() { this.outlets.forEach(function(e) { e.stop() }), this.inlets.forEach(function(e) { e.stop() }) } })
    }, { "./errors": 7, "./portlets": 10, "./utils": 11, underscore: 25, util: 28 }],
    5: [function(e, t, n) {
        var i = e("underscore"),
            r = e("events").EventEmitter,
            o = e("./mixins"),
            s = e("./utils"),
            a = e("./BaseNode"),
            c = e("./errors"),
            u = e("../global"),
            l = t.exports = function() { a.apply(this, arguments), this.objects = [], this.endPoints = [], this.patchId = null, this.patchData = null, this.blockSize = u.settings.blockSize };
        i.extend(l.prototype, a.prototype, o.UniqueIdsMixin, r.prototype, {
            type: "patch",
            init: function(e) { this.args = e },
            start: function() { this.startObjects(), this.startPortlets() },
            stop: function() { this.stopObjects(), this.stopPortlets() },
            destroy: function() { this.objects.forEach(function(e) { e.destroy() }) },
            startObjects: function() { this.objects.forEach(function(e) { e.startObjects ? e.startObjects() : e.start() }) },
            stopObjects: function() { this.objects.forEach(function(e) { e.stopObjects ? e.stopObjects() : e.stop() }) },
            startPortlets: function() { this.objects.forEach(function(e) { e.startPortlets() }), this.emit("started") },
            stopPortlets: function() { this.objects.forEach(function(e) { e.stopPortlets() }), this.emit("stopped") },
            createObject: function(e, t) { var n = this._createObject(e, t); return u.isStarted && (n.start(), n.startPortlets()), n },
            _createObject: function(e, t) { var n; if (t = t || [], !u.library.hasOwnProperty(e)) throw new c.UnknownObjectError(e); var i = u.library[e]; return i.prototype.doResolveArgs && (t = this.resolveArgs(t)), n = new i(this, this._generateId(), t), this.objects[n.id] = n, n.endPoint && this.endPoints.push(n), d(n) && this.inlets.push(n.inlets[0]), f(n) && this.outlets.push(n.outlets[0]), n },
            resolveArgs: function(e) {
                var t, n = e.slice(0),
                    i = this.getPatchRoot().patchId;
                return t = [i].concat(this.args), e.forEach(function(e, t) { "b" === e ? n[t] = "bang" : "f" === e ? n[t] = "float" : "s" === e ? n[t] = "symbol" : "a" === e ? n[t] = "anything" : "l" === e && (n[t] = "list") }), s.getDollarResolver(n)(t)
            },
            getPatchRoot: function() { return this.patch ? this.patch.getPatchRoot() : this }
        });
        var d = function(e) { return [u.library.inlet, u.library["inlet~"]].some(function(t) { return e instanceof t }) },
            f = function(e) { return [u.library.outlet, u.library["outlet~"]].some(function(t) { return e instanceof t }) }
    }, { "../global": 12, "./BaseNode": 4, "./errors": 7, "./mixins": 9, "./utils": 11, events: 19, underscore: 25 }],
    6: [function(e, t, n) {
        var i = e("underscore"),
            r = (e("util").inherits, e("./portlets"), e("./utils")),
            o = e("./BaseNode"),
            s = (e("./Patch"), e("../global"), t.exports = function() { o.apply(this, arguments) });
        s.extend = r.chainExtend, i.extend(s.prototype, o.prototype, { doResolveArgs: !0 })
    }, { "../global": 12, "./BaseNode": 4, "./Patch": 5, "./portlets": 10, "./utils": 11, underscore: 25, util: 28 }],
    7: [function(e, t, n) {
        var i = e("underscore"),
            r = n.PatchLoadError = function(e) { this.name = "PatchLoadError", this.errorList = e, this.message = i.map(e, function(e) { return e[0] + "\n	" + e[1].message }).join("\n"), this.stack = (new Error).stack };
        r.prototype = Object.create(Error.prototype), r.prototype.constructor = r;
        var o = n.UnknownObjectError = function(e) { this.name = "UnknownObjectError", this.message = "unknown object " + e, this.objectType = e, this.stack = (new Error).stack };
        o.prototype = Object.create(Error.prototype), o.prototype.constructor = o;
        var s = n.InvalidPortletError = function(e) { this.name = "InvalidPortletError", this.message = e, this.stack = (new Error).stack };
        s.prototype = Object.create(Error.prototype), s.prototype.constructor = s
    }, { underscore: 25 }],
    8: [function(e, t, n) { n.Clock = { time: 0, schedule: function(e, t, n) {}, unschedule: function(e) {} }, n.Audio = { sampleRate: 44100, start: function() {}, stop: function() {}, decode: function(e, t) { t(null, e) } }, n.Midi = { onMessage: function(e) {} }, n.Storage = { get: function(e, t) {} } }, {}],
    9: [function(e, t, n) {
        var i = e("events").EventEmitter,
            r = e("underscore"),
            o = e("../global");
        n.NamedMixin = {
            nameIsUnique: !1,
            setName: function(e) {
                if (!r.isString(e)) return console.error("expected [" + this.type + "] name to be a string, got " + e);
                var t = this.name;
                this.emit("changing:name", t, e), this.name = e, o.namedObjects.register(this, this.type, e, this.nameIsUnique, t), this.emit("changed:name", t, e)
            },
            destroy: function() { o.namedObjects.unregister(this, this.type, this.name) }
        };
        var s = n.EventEmitterMixin = r.extend({}, i.prototype, { destroy: function() { this.removeAllListeners() } }),
            a = n.Reference = function(e) { this.referencedType = e, this._onNewObject = null, this._onChangedName = null, this.resolved = null, this._eventName = "namedObjects:registered:" + this.referencedType, this._eventReceiver = new c };
        r.extend(a.prototype, s, {
            set: function(e) {
                var t = this,
                    n = o.namedObjects.get(this.referencedType, e)[0];
                this.name = e, this._stopListening(), n ? this._setResolved(n) : (this._setResolved(null), this._onNewObject = function(n) { n.name === e && (t._stopListening(), t._setResolved(n)) }, this._eventReceiver.on(o.emitter, this._eventName, this._onNewObject))
            },
            destroy: function() { this._eventReceiver.destroy(), s.destroy.apply(this) },
            _setResolved: function(e) {
                var t = this,
                    n = this.resolved;
                this.resolved = e, n && n.removeListener("changing:name", t._onChangedName), e && (this._onChangedName = function() { t._setResolved(null) }, this._eventReceiver.on(e, "changing:name", this._onChangedName)), this.emit("changed", e, n)
            },
            _stopListening: function() { this._onNewObject && (this._eventReceiver.removeListener(o.emitter, this._eventName, this._onNewObject), this._onNewObject = null) }
        }), n.UniqueIdsMixin = { _generateId: function() { return this._idCounter++, this._idCounter }, _idCounter: -1 };
        var c = n.EventReceiver = function() { this._handlers = [] };
        r.extend(c.prototype, {
            addListener: function(e, t, n) { this._handlers.push([e, t, n]), e.addListener(t, n) },
            once: function(e, t, n) {
                var i = [e, t, n];
                this._handlers.push(i), e.once(t, n)
            },
            removeListener: function(e, t, n) { this._handlers = r.reject(this._handlers, function(i) { var r = i[0] === e && i[1] === t && i[2] === n; return r && e.removeListener(t, n), r }) },
            destroy: function() { this._handlers.forEach(function(e) { e[0].removeListener(e[1], e[2]) }), this._handlers = [] }
        }), c.prototype.on = c.prototype.addListener
    }, { "../global": 12, events: 19, underscore: 25 }],
    10: [function(e, t, n) {
        var i = e("underscore"),
            r = e("./utils"),
            o = e("./errors"),
            s = n.Portlet = function(e, t) { this.obj = e, this.id = t, this.connections = [], this.init() };
        i.extend(s.prototype, { crossPatch: !1, init: function() {}, start: function() {}, stop: function() {}, message: function(e) {}, connection: function(e) {}, disconnection: function(e) {}, connect: function(e) { if (-1 !== this.connections.indexOf(e)) return !1; if (!this.crossPatch && !e.crossPatch && this.obj.patch !== e.obj.patch) throw new Error("cannot connect objects that belong to different patches"); return this.connections.push(e), e.connect(this), this.connection(e), !0 }, disconnect: function(e) { var t = this.connections.indexOf(e); return -1 === t ? !1 : (this.connections.splice(t, 1), e.disconnect(this), this.disconnection(e), !0) } }), s.extend = r.chainExtend;
        var a = (n.Inlet = s.extend({}), n.Outlet = s.extend({}), s.extend({ portletType: null, connect: function() { throw new o.InvalidPortletError(this.portletType + " " + this.id + " is not implemented in WebPd yet") }, disconnect: function() { throw new o.InvalidPortletError(this.portletType + " " + this.id + " is not implemented in WebPd yet") } }));
        n.UnimplementedInlet = a.extend({ portletType: "inlet" }), n.UnimplementedOutlet = a.extend({ portletType: "outlet" })
    }, { "./errors": 7, "./utils": 11, underscore: 25 }],
    11: [function(e, t, n) {
        var i = e("underscore"),
            r = e("../global"),
            o = /\$(\d+)/,
            s = /\$(\d+)/g;
        n.getDollarResolver = function(e) {
            e = e.slice(0);
            var t = function(e, t) { if (t >= e.length || 0 > t) throw new Error("$" + (t + 1) + ": argument number out of range"); return e[t] },
                n = e.map(function(e) { var n = o.exec(e); return n && n[0] === e ? function(e) { var i = parseInt(n[1], 10); return function(e) { return t(e, i) } }(e) : n ? function(e) { for (var n, i = []; n = s.exec(e);) i.push([n[0], parseInt(n[1], 10)]); return function(n) { var r = e.substr(0); return i.forEach(function(e) { r = r.replace(e[0], t(n, e[1])) }), r } }(e) : function(e) { return function() { return e } }(e) });
            return function(e) { return n.map(function(t, n) { return t(e) }) }
        }, n.chainExtend = function() {
            var e = Array.prototype.slice.call(arguments, 0),
                t = this,
                n = function() { t.apply(this, arguments) };
            return n.prototype = new t, i.extend.apply(this, [n.prototype, t.prototype].concat(e)), n.extend = this.extend, n
        }, n.timeTag = function(e, t) { return t ? (e.timeTag = i.isNumber(t) ? t : t.timeTag, e) : e }, n.getTimeTag = function(e) { return e && e.timeTag || r.clock && r.clock.time || 0 }
    }, { "../global": 12, underscore: 25 }],
    12: [function(e, t, n) {
        var i = e("underscore"),
            r = e("events").EventEmitter;
        n.settings = { blockSize: 16384, channelCount: 2 }, n.isStarted = !1;
        var o = n.emitter = new r;
        o.emit = function(e) {
            if (!i.contains(["midiMessage"], e) && 0 !== e.indexOf("msg:") && 0 !== e.indexOf("namedObjects:registered") && 0 !== e.indexOf("namedObjects:unregistered")) throw new Error("unknown event : " + e);
            r.prototype.emit.apply(this, arguments)
        }, n.library = {}, n.patches = {}, n.audio = null, n.midi = null, n.clock = null, n.storage = null, n.namedObjects = {
            register: function(e, t, i, r, o) {
                var s, a;
                if (this._store[t] = s = this._store[t] || {}, s[i] = a = s[i] || [], -1 === a.indexOf(e)) {
                    if (r && a.length > 0) throw new Error("there is already a " + t + ' with name "' + i + '"');
                    a.push(e)
                }
                o && (a = s[o], a.splice(a.indexOf(e), 1)), n.emitter.emit("namedObjects:registered:" + t, e)
            },
            unregister: function(e, t, i) {
                var r, o = this._store[t],
                    s = o ? o[i] : null;
                s && (r = s.indexOf(e), -1 !== r && (s.splice(r, 1), n.emitter.emit("namedObjects:unregistered:" + t, e)))
            },
            get: function(e, t) { return (this._store[e] || {})[t] || [] },
            reset: function() { this._store = {} },
            _store: {}
        }
    }, { events: 19, underscore: 25 }],
    13: [function(e, t, n) {
        var i = e("underscore"),
            r = e("./core/utils"),
            o = e("./core/mixins"),
            s = e("./core/PdObject"),
            a = e("./core/Patch"),
            c = e("./global"),
            u = e("./waa/portlets");
        n.declareObjects = function(e) {
            e.receive = e.r = s.extend(o.NamedMixin, o.EventEmitterMixin, {
                type: "receive",
                outletDefs: [u.Outlet],
                abbreviations: ["r"],
                init: function(e) {
                    var t = e[0],
                        n = this;
                    this._eventReceiver = new o.EventReceiver, this._onMessageReceived = this._onMessageReceived.bind(this), this._eventReceiver.on(this, "changed:name", function(e, t) { e && n._eventReceiver.removeListener(c.emitter, "msg:" + e, n._onMessageReceived), n._eventReceiver.on(c.emitter, "msg:" + t, n._onMessageReceived) }), this.setName(t)
                },
                destroy: function() { o.NamedMixin.destroy.apply(this, arguments), this._eventReceiver.destroy(), o.EventEmitterMixin.destroy.apply(this, arguments) },
                _onMessageReceived: function(e) { this.o(0).message(e) }
            }), e.send = e.s = s.extend(o.NamedMixin, o.EventEmitterMixin, { type: "send", inletDefs: [u.Inlet.extend({ message: function(e) { c.emitter.emit("msg:" + this.obj.name, e) } })], abbreviations: ["s"], init: function(e) { this.setName(e[0]) }, destroy: function() { o.NamedMixin.destroy.apply(this, arguments), o.EventEmitterMixin.destroy.apply(this, arguments) } }), e.msg = s.extend({
                type: "msg",
                doResolveArgs: !1,
                inletDefs: [u.Inlet.extend({
                    message: function(e) {
                        var t = e.timeTag;
                        e = e.slice(0), e.unshift(0);
                        for (var n = 0; n < this.obj.resolvers.length; n++) {
                            var i = this.obj.resolvers[n];
                            this.obj.outlets[0].message(r.timeTag(i(e), t))
                        }
                    }
                })],
                outletDefs: [u.Outlet],
                init: function(e) { this.createResolvers(e) },
                createResolvers: function(e) {
                    for (var t = [
                            []
                        ], n = 0; n < e.length; n++) { var i = e[n]; "," == i ? t.push([]) : t[t.length - 1].push(i) }
                    0 == t[t.length - 1].length && t.pop(), this.resolvers = [];
                    for (var n in t) {
                        var o = t[n];
                        this.resolvers.push(r.getDollarResolver(o))
                    }
                }
            }), e.print = s.extend({ type: "print", inletDefs: [u.Inlet.extend({ message: function(e) { console.log(this.obj.prefix ? [this.obj.prefix].concat(e) : e) } })], init: function(e) { this.prefix = e[0] || "print" } }), e.text = s.extend({ type: "text", init: function(e) { this.text = e[0] } }), e.loadbang = s.extend({
                type: "loadbang",
                outletDefs: [u.Outlet],
                init: function() {
                    var e = this;
                    this._eventReceiver = new o.EventReceiver, this._onPatchStarted = function() { e.o(0).message(["bang"]) }, this._eventReceiver.on(this.patch, "started", this._onPatchStarted)
                },
                destroy: function() { this._eventReceiver.destroy() }
            });
            var t = s.extend({
                inletDefs: [u.Inlet.extend({ message: function(e) { var t = e[0]; "bang" !== t && this.obj.setVal(t), this.obj.o(0).message(r.timeTag([this.obj.val], e)) } }), u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setVal(t)
                    }
                })],
                outletDefs: [u.Outlet],
                init: function(e) {
                    var t = e[0];
                    this.setVal(t || 0)
                },
                setVal: function(e) { this.val = e }
            });
            e["float"] = e.f = t.extend({ type: "float", setVal: function(e) { return i.isNumber(e) ? void(this.val = e) : console.error("invalid [float] value " + e) } }), e["int"] = e.i = t.extend({ type: "int", setVal: function(e) { return i.isNumber(e) ? void(this.val = Math.floor(e)) : console.error("invalid [int] value " + e) } });
            var n = s.extend({
                inletDefs: [u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        i.isNumber(t) ? this.obj.valLeft = t : "bang" !== t && console.error("invalid message : " + e), this.obj.o(0).message(r.timeTag([this.obj.compute()], e))
                    }
                }), u.Inlet.extend({ message: function(e) { var t = e[0]; return i.isNumber(t) ? void(this.obj.valRight = t) : console.error("invalid operand for [" + this.obj.type + "] " + t) } })],
                outletDefs: [u.Outlet],
                init: function(e) { this.valRight = e[0] || 0, this.valLeft = 0 },
                compute: function() {}
            });
            e["+"] = n.extend({ type: "+", compute: function() { return this.valLeft + this.valRight } }), e["-"] = n.extend({ type: "-", compute: function() { return this.valLeft - this.valRight } }), e["*"] = n.extend({ type: "*", compute: function() { return this.valLeft * this.valRight } }), e["/"] = n.extend({ type: "/", compute: function() { return 0 == this.valRight ? 0 : this.valLeft / this.valRight } }), e.min = n.extend({ type: "min", compute: function() { return Math.min(this.valLeft, this.valRight) } }), e.max = n.extend({ type: "max", compute: function() { return Math.max(this.valLeft, this.valRight) } }), e.mod = e["%"] = n.extend({ type: "mod", compute: function() { return this.valRight <= 0 ? 0 : this.valLeft < 0 ? this.valRight + this.valLeft % this.valRight : this.valLeft % this.valRight } }), e.pow = n.extend({ type: "pow", compute: function() { return Math.pow(this.valLeft, this.valRight) } });
            var l = s.extend({
                    inletDefs: [u.Inlet.extend({
                        message: function(e) {
                            var t = e[0];
                            this.obj.checkInput(t), this.obj.o(0).message(r.timeTag([this.obj.compute(t)], e))
                        }
                    })],
                    outletDefs: [u.Outlet],
                    checkInput: function(e) {},
                    compute: function() {}
                }),
                d = l.extend({ checkInput: function(e) { return i.isNumber(e) ? void 0 : console.error("invalid [" + this.type + "] value " + e) } });
            e.cos = d.extend({ type: "cos", compute: function(e) { return Math.cos(e) } }), e.sin = d.extend({ type: "sin", compute: function(e) { return Math.sin(e) } }), e.tan = d.extend({ type: "tan", compute: function(e) { return Math.tan(e) } }), e.atan2 = n.extend({ type: "atan2", compute: function() { return Math.atan2(this.valRight, this.valLeft) } }), e.atan = d.extend({ type: "atan", compute: function(e) { return Math.atan(e) } }), e.exp = d.extend({ type: "exp", compute: function(e) { return Math.exp(e) } }), e.log = d.extend({ type: "log", compute: function(e) { return Math.log(e) } }), e.abs = d.extend({ type: "abs", compute: function(e) { return Math.abs(e) } }), e.sqrt = d.extend({ type: "sqrt", compute: function(e) { return Math.sqrt(e) } }), e.wrap = d.extend({ type: "wrap", compute: function(e) { return e - Math.floor(e) } }), e.mtof = d.extend({ type: "mtof", maxMidiNote: 8.17579891564 * Math.exp(86.585635235), compute: function(e) { var t = 0; return i.isNumber(e) ? t = -1500 >= e ? 0 : e > 1499 ? this.maxMidiNote : 8.17579891564 * Math.exp(.057762265 * e) : console.error("invalid [mtof] value " + e) } }), e.ftom = d.extend({ type: "ftom", compute: function(e) { return i.isNumber(e) ? 0 >= e ? -1500 : 17.312340491 * Math.log(.122312206 * e) : console.error("invalid [ftom] value " + e) } }), e.rmstodb = d.extend({ type: "rmstodb", compute: function(e) { return 0 >= e ? 0 : 20 * Math.log(e) / Math.LN10 + 100 } }), e.dbtorms = d.extend({ type: "dbtorms", compute: function(e) { return 0 >= e ? 0 : Math.exp(Math.LN10 * (e - 100) / 20) } }), e.powtodb = d.extend({ type: "powtodb", compute: function(e) { return 0 >= e ? 0 : 10 * Math.log(e) / Math.LN10 + 100 } }), e.dbtopow = d.extend({ type: "dbtopow", compute: function(e) { return 0 >= e ? 0 : Math.exp(Math.LN10 * (e - 100) / 10) } }), e["samplerate~"] = l.extend({ type: "samplerate~", compute: function() { return c.audio.sampleRate } }), e.spigot = s.extend({
                type: "spigot",
                inletDefs: [u.Inlet.extend({ message: function(e) { this.obj.passing && this.obj.o(0).message(e) } }), u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setPassing(t)
                    }
                })],
                outletDefs: [u.Outlet],
                init: function(e) {
                    var t = e[0];
                    this.setPassing(t || 0)
                },
                setPassing: function(e) { return i.isNumber(e) ? void(this.passing = Boolean(e)) : console.error("invalid [spigot] value " + e) }
            }), e.trigger = e.t = s.extend({
                type: "trigger",
                inletDefs: [u.Inlet.extend({
                    message: function(e) {
                        var t, n, o;
                        for (t = this.obj.filters.length - 1; t >= 0; t--)
                            if (n = this.obj.filters[t], "bang" === n) this.obj.o(t).message(r.timeTag(["bang"], e));
                            else if ("list" === n || "anything" === n) this.obj.o(t).message(e);
                        else if ("float" === n || i.isNumber(n)) o = e[0], this.obj.o(t).message(i.isNumber(o) ? r.timeTag([o], e) : r.timeTag([0], e));
                        else if ("symbol" === n)
                            if (o = e[0], "bang" === o) this.obj.o(t).message(r.timeTag(["symbol"], e));
                            else if (i.isNumber(o)) this.obj.o(t).message(r.timeTag(["float"], e));
                        else {
                            if (!i.isString(o)) throw new Error("Got unexpected input " + e);
                            this.obj.o(t).message(r.timeTag([o], e))
                        } else this.obj.o(t).message(r.timeTag(["bang"], e))
                    }
                })],
                init: function(e) {
                    var t, n;
                    for (0 === e.length && (e = ["bang", "bang"]), t = 0, n = e.length; n > t; t++) this.outlets.push(new u.Outlet(this, t));
                    this.filters = e
                }
            });
            var f = u.Inlet.extend({ message: function(e) { var t = e[0]; "bang" !== t && (this.obj.memory[0] = t), this.obj.o(0).message(r.timeTag(this.obj.memory.slice(0), e)) } }),
                h = u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.memory[this.id] = t
                    }
                });
            e.pack = s.extend({ type: "pack", outletDefs: [u.Outlet], init: function(e) { var t, n = e.length; for (0 === n && (e = ["float", "float"]), n = e.length, this.filters = e, this.memory = new Array(n), t = 0; n > t; t++) this.inlets[t] = 0 === t ? new f(this, t) : new h(this, t), this.memory[t] = "float" === e[t] ? 0 : "symbol" === e[t] ? "symbol" : e[t] } }), e.select = e.sel = s.extend({
                type: "select",
                inletDefs: [u.Inlet.extend({ message: function(e) { var t, n = e[0]; - 1 !== (t = this.obj.filters.indexOf(n)) ? this.obj.o(t).message(r.timeTag(["bang"], e)) : this.obj.outlets.slice(-1)[0].message(r.timeTag([n], e)) } }), u.Inlet.extend({ message: function(e) { this.obj.filters.length <= 1 && (this.obj.filters = e) } })],
                init: function(e) {
                    var t, n;
                    for (0 === e.length && (e = [0]), e.length > 1 && this.inlets.pop(), t = 0, n = e.length; n > t; t++) this.outlets[t] = new u.Outlet(this, t);
                    this.outlets[t] = new u.Outlet(this, t), this.filters = e
                }
            }), e.moses = s.extend({
                type: "moses",
                inletDefs: [u.Inlet.extend({ message: function(e) { var t = e[0]; return i.isNumber(t) ? void(t < this.obj.val ? this.obj.o(0).message(r.timeTag([t], e)) : this.obj.o(1).message(r.timeTag([t], e))) : console.error("invalid [moses] value " + t) } }), u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setVal(t)
                    }
                })],
                outletDefs: [u.Outlet, u.Outlet],
                init: function(e) {
                    var t = e[0];
                    this.setVal(t || 0)
                },
                setVal: function(e) { return i.isNumber(e) ? void(this.val = e) : console.error("invalid [moses] value " + e) }
            }), e.clip = s.extend({
                type: "clip",
                inletDefs: [u.Inlet.extend({ message: function(e) { var t = e[0]; return i.isNumber(t) ? void this.obj.o(0).message(t < this.obj.min ? r.timeTag([this.obj.min], e) : t > this.obj.max ? r.timeTag([this.obj.max], e) : r.timeTag([t], e)) : console.error("invalid [clip] value " + t) } }), u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setMin(t)
                    }
                }), u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setMax(t)
                    }
                })],
                outletDefs: [u.Outlet],
                init: function(e) { this.setMin(e[0] || 0), this.setMax(e[1] || 0) },
                setMin: function(e) { return i.isNumber(e) ? void(this.min = e) : console.error("invalid [clip] min value " + e) },
                setMax: function(e) { return i.isNumber(e) ? void(this.max = e) : console.error("invalid [clip] max value " + e) }
            }), e.swap = s.extend({
                type: "swap",
                inletDefs: [u.Inlet.extend({ message: function(e) { var t = e[0]; return i.isNumber(t) ? (this.obj.o(1).message(r.timeTag([t], e)), void this.obj.o(0).message(r.timeTag([this.obj.val], e))) : console.error("invalid [swap] value " + t) } }), u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setVal(t)
                    }
                })],
                outletDefs: [u.Outlet, u.Outlet],
                init: function(e) {
                    var t = e[0];
                    this.setVal(t || 0)
                },
                setVal: function(e) { return i.isNumber(e) ? void(this.val = e) : console.error("invalid [swap] value " + e) }
            }), e.until = s.extend({
                type: "until",
                inletDefs: [u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        if ("bang" === t) this.obj._startLoop(e.timeTag);
                        else {
                            if (!i.isNumber(t)) return console.error("invalid [until] value " + t);
                            this.obj._startLoop(e.timeTag, t)
                        }
                    }
                }), u.Inlet.extend({ message: function(e) { var t = e[0]; return "bang" !== t ? console.error("invalid command for [until] " + t) : void this.obj._stopLoop() } })],
                outletDefs: [u.Outlet],
                init: function() { this._looping = !1 },
                _startLoop: function(e, t) {
                    this._looping = !0;
                    var n = this,
                        o = 0,
                        s = function() { n.o(0).message(r.timeTag(["bang"], e)) };
                    if (i.isNumber(t))
                        for (; this._looping && t > o;) s(), o++;
                    else
                        for (; this._looping;) s();
                    this._looping = !1
                },
                _stopLoop: function() { this._looping = !1 }
            }), e.random = s.extend({
                type: "random",
                inletDefs: [u.Inlet.extend({ message: function(e) { var t = e[0]; "bang" === t && this.obj.o(0).message(r.timeTag([Math.floor(Math.random() * this.obj.max)], e)) } }), u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setMax(t);

                    }
                })],
                outletDefs: [u.Outlet],
                init: function(e) {
                    var t = e[0];
                    this.setMax(t || 1)
                },
                setMax: function(e) { return i.isNumber(e) ? void(this.max = e) : console.error("invalid [random] value " + e) }
            }), e.metro = s.extend({
                type: "metro",
                inletDefs: [u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        if ("bang" === t) this.obj._restartMetroTick(r.getTimeTag(e));
                        else if ("stop" === t) this.obj._stopMetroTick();
                        else {
                            if (!i.isNumber(t)) return console.error("invalid [metro] value " + t);
                            0 === t ? this.obj._stopMetroTick() : this.obj._restartMetroTick(r.getTimeTag(e))
                        }
                    }
                }), u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setRate(t), this.obj._metroTick = this.obj._metroTickRateChange
                    }
                })],
                outletDefs: [u.Outlet],
                init: function(e) {
                    var t = e[0];
                    this.setRate(t || 0), this._metroHandle = null, this._metroTick = this._metroTickNormal
                },
                setRate: function(e) { return i.isNumber(e) ? void(this.rate = Math.max(e, 1)) : console.error("invalid [metro] rate " + e) },
                destroy: function() { this._stopMetroTick() },
                _startMetroTick: function(e) {
                    var t = this;
                    null === this._metroHandle && (this._metroHandle = c.clock.schedule(function(e) { t._metroTick(e.timeTag) }, e, this.rate))
                },
                _stopMetroTick: function() { null !== this._metroHandle && (c.clock.unschedule(this._metroHandle), this._metroHandle = null) },
                _restartMetroTick: function(e) { this._metroTick === this._metroTickRateChange && (this._metroTick = this._metroTickNormal), this._stopMetroTick(), this._startMetroTick(e) },
                _metroTickNormal: function(e) { this.outlets[0].message(r.timeTag(["bang"], e)) },
                _metroTickRateChange: function(e) { this._metroTick = this._metroTickNormal, this._restartMetroTick(e) }
            }), e.delay = e.del = s.extend({
                type: "delay",
                inletDefs: [u.Inlet.extend({ message: function(e) { var t = e[0]; "bang" === t ? (this.obj._stopDelay(), this.obj._startDelay(r.getTimeTag(e))) : "stop" === t ? this.obj._stopDelay() : (this.obj.setDelay(t), this.obj._stopDelay(), this.obj._startDelay(r.getTimeTag(e))) } }), u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setDelay(t)
                    }
                })],
                outletDefs: [u.Outlet],
                init: function(e) {
                    var t = e[0];
                    this.setDelay(t || 0), this._delayHandle = null
                },
                setDelay: function(e) { return i.isNumber(e) ? void(this.delay = e) : console.error("invalid [delay] length " + e) },
                destroy: function() { this._stopDelay() },
                _startDelay: function(e) {
                    var t = this;
                    null === this._delayHandle && (this._delayHandle = c.clock.schedule(function(e) { t.outlets[0].message(r.timeTag(["bang"], e.timeTag)) }, e + this.delay))
                },
                _stopDelay: function() { null !== this._delayHandle && (c.clock.unschedule(this._delayHandle), this._delayHandle = null) }
            }), e.timer = s.extend({ type: "timer", inletDefs: [u.Inlet.extend({ message: function(e) { var t = e[0]; return "bang" !== t ? console.error("invalid command for [timer] " + t) : void(this.obj.refTime = r.getTimeTag(e)) } }), u.Inlet.extend({ message: function(e) { var t = e[0]; return "bang" !== t ? console.error("invalid command for [timer] " + t) : void this.obj.outlets[0].message(r.timeTag([r.getTimeTag(e) - this.obj.refTime], e)) } })], outletDefs: [u.Outlet], init: function() { this.refTime = 0 } }), e.change = s.extend({
                type: "change",
                inletDefs: [u.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        t !== this.obj.last && (this.obj.last = t, this.obj.o(0).message(r.timeTag([t], e)))
                    }
                })],
                outletDefs: [u.Outlet],
                init: function() { this.last = null }
            }), e.array = e.table = s.extend(o.NamedMixin, o.EventEmitterMixin, {
                type: "array",
                nameIsUnique: !0,
                init: function(e) {
                    var t = e[0],
                        n = e[1] || 100;
                    t && this.setName(t), this.size = n, this.data = new Float32Array(n)
                },
                destroy: function() { o.NamedMixin.destroy.apply(this, arguments), o.EventEmitterMixin.destroy.apply(this, arguments) },
                setData: function(e, t) { t && (this.data = new Float32Array(e.length)), this.data.set(e.subarray(0, Math.min(this.data.length, e.length))), this.size = this.data.length, this.emit("changed:data") }
            }), e.soundfiler = s.extend({
                type: "soundfiler",
                inletDefs: [u.Inlet.extend({
                    message: function(e) {
                        var t, n, r, o = this,
                            s = e[0],
                            a = !1;
                        if (e = e.slice(1), "read" === s) {
                            for (; e.length && "-" === e[0][0];) {
                                if (t = e.shift(), "-resize" !== t) return console.error("-wave" === t && "-aiff" === t && "-nextstep" === t && "-raw" === t && "-bytes" === t && "-nframes" === t ? t + " not supported" : t + " not understood");
                                a = !0
                            }
                            n = e.shift(), r = e, c.storage.get(n, function(e, t) {
                                return e ? console.error("could not load file : " + e) : void c.audio.decode(t, function(e, t) {
                                    if (e) return console.error("Could not decode file : " + e);
                                    var n, s, u;
                                    s = r.map(function(e) { return n = c.namedObjects.get("array", e)[0], n ? n : (console.error('array "' + e + '" not found'), null) }), i.contains(s, null) || (1 !== i.uniq(i.pluck(s, "size")).length && (a = !0), s.forEach(function(e, n) { u = t[n], u && e.setData(u, a) }), o.obj.o(0).message([Math.min(s[0].size, t[0].length)]))
                                })
                            })
                        } else console.error('command "' + s + '" is not supported')
                    }
                })],
                outletDefs: [u.Outlet]
            }), e.pd = e.graph = a
        }
    }, { "./core/Patch": 5, "./core/PdObject": 6, "./core/mixins": 9, "./core/utils": 11, "./global": 12, "./waa/portlets": 18, underscore: 25 }],
    14: [function(e, t, n) {
        e("underscore");
        n.declareObjects = function(t) { e("./glue").declareObjects(t), e("./controls").declareObjects(t), e("./waa/dsp").declareObjects(t), e("./waa/portlets").declareObjects(t), e("./midi").declareObjects(t) }
    }, { "./controls": 2, "./glue": 13, "./midi": 15, "./waa/dsp": 16, "./waa/portlets": 18, underscore: 25 }],
    15: [function(e, t, n) {
        var i = e("underscore"),
            r = e("./core/utils"),
            o = e("./core/mixins"),
            s = e("./core/PdObject"),
            a = e("./global"),
            c = e("./waa/portlets");
        n.declareObjects = function(e) {
            e.notein = s.extend({
                type: "notein",
                inletDefs: [],
                outletDefs: [c.Outlet, c.Outlet, c.Outlet],
                init: function(e) { this._eventReceiver = new o.EventReceiver, this._eventReceiver.on(a.emitter, "midiMessage", this._onMidiMessage.bind(this)), this._channel = e[0] },
                _onMidiMessage: function(e) {
                    var t = e.data,
                        n = t[0] >> 4;
                    if (8 === n || 9 === n) {
                        var i = (15 & t[0]) + 1,
                            r = t[1],
                            o = t[2];
                        "number" == typeof this._channel ? i === this._channel && (this.o(1).message([o]), this.o(0).message([r])) : (this.o(2).message([i]), this.o(1).message([o]), this.o(0).message([r]))
                    }
                },
                destroy: function() { this._eventReceiver.destroy() }
            }), e.poly = s.extend({
                type: "poly",
                inletDefs: [c.Inlet.extend({
                    message: function(e) {
                        var t = e[0];
                        if ("stop" === t) return void this.obj._stop();
                        if ("clear" === t) return void this.obj._clear();
                        if (!i.isNumber(t)) return console.error("invalid [poly] value: " + t);
                        var n = e[1];
                        i.isNumber(n) && (this.obj._vel = n), this.obj._onFloat(e)
                    }
                }), c.Inlet.extend({ message: function(e) { var t = e[0]; return i.isNumber(t) ? void(this.obj._vel = t) : console.error("invalid [poly] value: " + t) } })],
                outletDefs: [c.Outlet, c.Outlet, c.Outlet],
                init: function(e) { this._n = e[0] >= 1 ? e[0] : 1, this._steal = 1 === e[1], this._vel = 0, this._resetMemory() },
                _onFloat: function(e) {
                    var t = e[0],
                        n = null,
                        i = null,
                        r = 0,
                        o = 0;
                    if (this._vel > 0) {
                        var s = Number.MAX_VALUE,
                            a = Number.MAX_VALUE;
                        this._vec.forEach(function(e, t) { e.used && e.serial < s ? (n = e, s = e.serial, r = t) : !e.used && e.serial < a && (i = e, a = e.serial, o = t) }), i ? (this._message(2, this._vel, e), this._message(1, t, e), this._message(0, o + 1, e), i.pitch = t, i.used = !0, i.serial = this._serial++) : n && this._steal && (this._message(2, 0, e), this._message(1, n.pitch, e), this._message(0, r + 1, e), this._message(2, this._vel, e), this._message(1, t, e), this._message(0, r + 1, e), n.pitch = t, n.serial = this._serial++)
                    } else {
                        var s = Number.MAX_VALUE;
                        this._vec.forEach(function(e, i) { e.used && e.pitch === t && e.serial < s && (n = e, s = e.serial, r = i) }), n && (n.used = 0, n.serial = this._serial++, this._message(2, 0, e), this._message(1, n.pitch, e), this._message(0, r + 1, e))
                    }
                },
                _stop: function(e) {
                    var t = this;
                    this._vec.forEach(function(n, i) { n.used && (t._message(2, 0, e), t._message(1, n.pitch, e), t._message(0, i + 1, e)) }), this._resetMemory()
                },
                _clear: function(e) { this._resetMemory() },
                _resetMemory: function() { this._vec = [], this._serial = 0; for (var e = 0; e < this._n; e++) this._vec.push({ pitch: 0, used: !1, serial: 0 }) },
                _message: function(e, t, n) { this.o(e).message(r.timeTag([t], n)) }
            })
        }
    }, { "./core/PdObject": 6, "./core/mixins": 9, "./core/utils": 11, "./global": 12, "./waa/portlets": 18, underscore: 25 }],
    16: [function(e, t, n) {
        var i = e("underscore"),
            r = e("waaoffsetnode"),
            o = e("waawhitenoisenode"),
            s = e("waatablenode"),
            a = e("../core/utils"),
            c = e("../core/mixins"),
            u = e("../core/PdObject"),
            l = e("./portlets"),
            d = e("../global");
        n.declareObjects = function(e) {
            var t = u.extend({
                inletDefs: [l.DspInlet.extend({
                    message: function(e) {
                        var t = e[0];
                        if (!this.hasDspSource()) {
                            if (!i.isNumber(t)) return console.error("invalid [" + this.obj.type + "] frequency " + t);
                            t === 1 / 0 && (t = 0), this.obj.frequency = t, this.obj._updateFrequency(a.getTimeTag(e))
                        }
                    }
                }), l.Inlet.extend({ message: function(e) { var t = e[0]; return i.isNumber(t) ? void this.obj._updatePhase(t, a.getTimeTag(e)) : console.error("invalid [" + this.obj.type + "] phase " + t) } })],
                outletDefs: [l.DspOutlet],
                init: function(e) { this.frequency = e[0] || 0 },
                start: function() { this._createOscillator(0, 0) },
                stop: function() { this._destroyOscillator() },
                _updateFrequency: function(e) { this._oscNode && this._oscNode.frequency.setValueAtTime(this.frequency, e / 1e3) },
                _updatePhase: function(e, t) { d.isStarted && this._createOscillator(e, t) }
            });
            e["osc~"] = t.extend({ type: "osc~", _createOscillator: function(e, t) { e = 2 * e * Math.PI, this._oscNode = d.audio.context.createOscillator(), this._oscNode.setPeriodicWave(d.audio.context.createPeriodicWave(new Float32Array([0, Math.cos(e)]), new Float32Array([0, Math.sin(-e)]))), this._oscNode.start(t / 1e3), this.o(0).setWaa(this._oscNode, 0), this.i(0).setWaa(this._oscNode.frequency, 0), this.i(0).message([this.frequency]) }, _destroyOscillator: function() { this._oscNode.stop(0), this._oscNode = null } }), e["phasor~"] = t.extend({ type: "phasor~", _createOscillator: function(e, t) { this._gainNode = d.audio.context.createGain(), this._gainNode.gain.value = .5, this._oscNode = d.audio.context.createOscillator(), this._oscNode.type = "sawtooth", this._oscNode.start(t / 1e3), this._oscNode.connect(this._gainNode), this._offsetNode = new r(d.audio.context), this._offsetNode.offset.value = 1, this._offsetNode.connect(this._gainNode), this.o(0).setWaa(this._gainNode, 0), this.i(0).setWaa(this._oscNode.frequency, 0), this.i(0).message([this.frequency]) }, _destroyOscillator: function() { this._oscNode.stop(0), this._oscNode = null, this._gainNode = null, this._offsetNode = null } }), e["triangle~"] = t.extend({ type: "triangle~", _createOscillator: function(e, t) { this._oscNode = d.audio.context.createOscillator(), this._oscNode.type = "triangle", this._oscNode.start(t / 1e3), this.o(0).setWaa(this._oscNode, 0), this.i(0).setWaa(this._oscNode.frequency, 0), this.i(0).message([this.frequency]) }, _destroyOscillator: function() { this._oscNode.stop(0), this._oscNode = null } }), e["square~"] = t.extend({ type: "square~", _createOscillator: function(e, t) { this._oscNode = d.audio.context.createOscillator(), this._oscNode.type = "square", this._oscNode.start(t / 1e3), this.o(0).setWaa(this._oscNode, 0), this.i(0).setWaa(this._oscNode.frequency, 0), this.i(0).message([this.frequency]) }, _destroyOscillator: function() { this._oscNode.stop(0), this._oscNode = null } }), e["noise~"] = u.extend({ type: "noise~", outletDefs: [l.DspOutlet], start: function() { this._noiseNode = new o(d.audio.context), this._noiseNode.start(0), this.o(0).setWaa(this._noiseNode, 0) }, stop: function() { this._noiseNode.stop(0), this._noiseNode.disconnect(), this._noiseNode = null } }), e["line~"] = u.extend({
                type: "line~",
                inletDefs: [l.Inlet.extend({
                    init: function() { this._queue = [], this._lastValue = 0 },
                    message: function(e) {
                        var t = this;
                        if (this.obj._offsetNode) {
                            var n = e[0],
                                r = a.getTimeTag(e),
                                o = e[1] || 0;
                            if (!i.isNumber(n)) return console.error("invalid [line~] value " + n);
                            if (o && !i.isNumber(o)) return console.error("invalid [line~] duration " + o);
                            this._refreshQueue(d.audio.time);
                            var s = this._pushToQueue(r, n, o);
                            this.obj._offsetNode.offset.cancelScheduledValues(s[0].t1 / 1e3 + 1e-6), s.forEach(function(e) { e.t1 !== e.t2 ? t.obj._offsetNode.offset.linearRampToValueAtTime(e.v2, e.t2 / 1e3) : t.obj._offsetNode.offset.setValueAtTime(e.v2, e.t2 / 1e3) })
                        }
                    },
                    _interpolate: function(e, t) { return (t - e.t1) * (e.v2 - e.v1) / (e.t2 - e.t1) + e.v1 },
                    _refreshQueue: function(e) {
                        if (0 !== this._queue.length) {
                            for (var t, n, i = 0;
                                (t = this._queue[i++]) && e >= t.t2;);
                            n = this._queue.slice(0, i - 1), this._queue = this._queue.slice(i - 1), 0 === this._queue.length && (this._lastValue = n[n.length - 1].v2)
                        }
                    },
                    _pushToQueue: function(e, t, n) {
                        for (var i, r = 0, o = [];
                            (i = this._queue[r++]) && e >= i.t2;);
                        if (this._queue = this._queue.slice(0), this._queue.length) {
                            var s = this._queue[this._queue.length - 1];
                            e < s.t2 ? (this._queue = this._queue.slice(0, -1), i = { t1: s.t1, v1: s.v1, t2: e, v2: this._interpolate(s, e) }, o.push(i), this._queue.push(i)) : e > s.t2 && (i = { t1: s.t2, v1: s.v2, t2: e, v2: s.v2 }, o.push(i), this._queue.push(i))
                        } else i = { t1: 0, v1: this._lastValue, t2: e, v2: this._lastValue }, o.push(i), this._queue.push(i);
                        return i = { t1: e, v1: this._queue[this._queue.length - 1].v2, t2: e + n, v2: t }, o.push(i), this._queue.push(i), o
                    }
                })],
                outletDefs: [l.DspOutlet],
                start: function() { this._offsetNode = new r(d.audio.context), this._offsetNode.offset.setValueAtTime(0, 0), this.o(0).setWaa(this._offsetNode, 0) },
                stop: function() { this._offsetNode = null }
            }), e["sig~"] = u.extend({ type: "sig~", inletDefs: [l.Inlet.extend({ message: function(e) { var t = e[0]; return i.isNumber(t) ? (this.obj.value = t, void(this.obj._offsetNode && this.obj._offsetNode.offset.setValueAtTime(t, a.getTimeTag(e) / 1e3))) : console.error("invalid [sig~] value " + t) } })], outletDefs: [l.DspOutlet], init: function(e) { this.value = e[0] || 0 }, start: function() { this._offsetNode = new r(d.audio.context), this._offsetNode.offset.setValueAtTime(0, 0), this.o(0).setWaa(this._offsetNode, 0), this.i(0).message([this.value]) }, stop: function() { this._offsetNode = null } });
            var n = { message: function(e) { var t = e[0]; return i.isNumber(t) ? (this.obj.frequency = t, void(this.obj._filterNode && this.obj._filterNode.frequency.setValueAtTime(t, a.getTimeTag(e) / 1e3))) : console.error("invalid [" + this.obj.type + "] frequency " + t) } },
                f = { message: function(e) { var t = e[0]; return i.isNumber(t) ? (this.obj.Q = t, void(this.obj._filterNode && this.obj._filterNode.Q.setValueAtTime(t, a.getTimeTag(e) / 1e3))) : console.error("invalid [" + this.obj.type + "] Q " + t) } },
                h = u.extend({ inletDefs: [l.DspInlet, l.Inlet.extend(n)], outletDefs: [l.DspOutlet], init: function(e) { this.frequency = e[0] || 0 }, start: function() { this._filterNode = d.audio.context.createBiquadFilter(), this._filterNode.frequency.setValueAtTime(this.frequency, 0), this._filterNode.type = this.waaFilterType, this.i(0).setWaa(this._filterNode, 0), this.o(0).setWaa(this._filterNode, 0), this.i(1).message([this.frequency]) }, stop: function() { this._filterNode = null } }),
                p = h.extend({ waaFilterType: "bandpass", init: function(e) { h.prototype.init.call(this, e), this.Q = e[1] || 1 }, start: function(e) { h.prototype.start.call(this, e), this._filterNode.Q.setValueAtTime(this.Q, 0), this.i(2).message([this.Q]) } });
            e["lop~"] = h.extend({ type: "lop~", waaFilterType: "lowpass" }), e["hip~"] = h.extend({ type: "hip~", waaFilterType: "highpass" }), e["bp~"] = p.extend({ type: "bp~", inletDefs: [l.DspInlet, l.Inlet.extend(n), l.Inlet.extend(f)] }), e["vcf~"] = p.extend({ type: "vcf~", inletDefs: [l.DspInlet, l.DspInlet.extend(n), l.Inlet.extend(f)], outletDefs: [l.DspOutlet, l.UnimplementedOutlet], start: function(e) { p.prototype.start.call(this, e), this.i(1).setWaa(this._filterNode.frequency, 0) } });
            var m = u.extend({
                    outletDefs: [l.DspOutlet],
                    init: function(e) {
                        var t = e[0];
                        this.setVal(t || 0)
                    },
                    setVal: function(e) { return i.isNumber(e) ? void(this.val = e) : console.error("invalid [" + this.obj.type + "] value " + e) }
                }),
                v = {
                    message: function(e) {
                        var t = e[0];
                        this.obj.setVal(t), this.hasDspSource() || this._setValNoDsp(t, a.getTimeTag(e))
                    },
                    disconnection: function(e) { l.DspInlet.prototype.disconnection.apply(this, arguments), e instanceof l.DspOutlet && !this.hasDspSource() && this._setValNoDsp(this.obj.val, 0) }
                };
            e["*~"] = m.extend({ type: "*~", inletDefs: [l.DspInlet, l.DspInlet.extend(v, { _setValNoDsp: function(e, t) { this.obj._gainNode && this.obj._gainNode.gain.setValueAtTime(e, t / 1e3) } })], start: function() { this._gainNode = d.audio.context.createGain(), this.i(0).setWaa(this._gainNode, 0), this.i(1).setWaa(this._gainNode.gain, 0), this.o(0).setWaa(this._gainNode, 0), this.i(1).hasDspSource() || this.i(1)._setValNoDsp(this.val, 0) }, stop: function() { this._gainNode = null } }), e["+~"] = m.extend({ type: "+~", inletDefs: [l.DspInlet, l.DspInlet.extend(v, { _setValNoDsp: function(e, t) { this.obj._offsetNode && this.obj._offsetNode.offset.setValueAtTime(e, t / 1e3) } })], start: function() { this._offsetNode = new r(d.audio.context), this._gainNode = d.audio.context.createGain(), this._gainNode.gain.value = 1, this._offsetNode.offset.value = 0, this._offsetNode.connect(this._gainNode, 0, 0), this.i(0).setWaa(this._gainNode, 0), this.i(1).setWaa(this._offsetNode.offset, 0), this.o(0).setWaa(this._gainNode, 0), this.i(1).hasDspSource() || this.i(1)._setValNoDsp(this.val, 0) }, stop: function() { this._offsetNode.disconnect(), this._gainNode = null, this._offsetNode = null } }), e["-~"] = m.extend({ type: "-~", inletDefs: [l.DspInlet, l.DspInlet.extend(v, { _setValNoDsp: function(e, t) { this.obj._offsetNode && this.obj._offsetNode.offset.setValueAtTime(e, t / 1e3) } })], start: function() { this._offsetNode = new r(d.audio.context), this._gainNode = d.audio.context.createGain(), this._negateGainNode = d.audio.context.createGain(), this._gainNode.gain.value = 1, this._negateGainNode.gain.value = -1, this._offsetNode.offset.value = 0, this._offsetNode.connect(this._negateGainNode, 0, 0), this._negateGainNode.connect(this._gainNode, 0, 0), this.i(0).setWaa(this._gainNode, 0), this.i(1).setWaa(this._offsetNode.offset, 0), this.o(0).setWaa(this._gainNode, 0), this.i(1).hasDspSource() || this.i(1)._setValNoDsp(this.val, 0) }, stop: function() { this._negateGainNode.disconnect(), this._offsetNode.disconnect(), this._gainNode = null, this._negateGainNode = null, this._offsetNode = null } });
            var g = u.extend({
                init: function(e) {
                    var t = this;
                    this.array = new c.Reference("array"), this._onDataChangedHandler = null, this._eventReceiver = new c.EventReceiver, this._eventReceiver.on(this.array, "changed", function(e, n) { n && n.removeListener("changed:data", t._onDataChangedHandler), e && (t._onDataChangedHandler = function() { t.dataChanged() }, t._eventReceiver.on(e, "changed:data", t._onDataChangedHandler)) })
                },
                dataChanged: function() {},
                destroy: function() { this._eventReceiver.destroy(), this.array.destroy() }
            });
            e["tabread~"] = e["tabread4~"] = g.extend({
                type: "tabread~",
                inletDefs: [l.DspInlet.extend({ message: function(e) { var t = e[0]; "set" === t ? this.obj.array.set(e[1]) : console.error("unknown method " + t) }, connection: function() { l.DspInlet.prototype.connection.apply(this, arguments), this.obj._updateDsp() }, disconnection: function() { l.DspInlet.prototype.disconnection.apply(this, arguments), this.obj._updateDsp() } })],
                outletDefs: [l.DspOutlet],
                init: function(e) {
                    var t = this,
                        n = e[0];
                    g.prototype.init.apply(this, arguments), this._eventReceiver.on(this.array, "changed", function() { t._updateDsp() }), n && this.array.set(n)
                },
                start: function() { this._tableNode = new s(d.audio.context), this._gainNode = d.audio.context.createGain(), this.i(0).setWaa(this._tableNode.position, 0), this.o(0).setWaa(this._gainNode, 0), this._updateDsp() },
                stop: function() { this._tableNode = null, this._gainNode = null },
                dataChanged: function() { this._tableNode && (this._tableNode.table = this.array.resolved.data) },
                _updateDsp: function() { this._tableNode && this.array.resolved && this.i(0).hasDspSource() ? (this._tableNode.table = this.array.resolved.data, this._tableNode.connect(this._gainNode)) : this._tableNode && this._tableNode.disconnect() }
            }), e["delwrite~"] = u.extend(c.NamedMixin, c.EventEmitterMixin, {
                type: "delwrite~",
                inletDefs: [l.DspInlet],
                init: function(e) {
                    var t = e[0],
                        n = e[1];
                    this.maxDelayTime = n || 1e3, t && this.setName(t)
                },
                start: function() { this._pipeNode = d.audio.context.createGain(), this.i(0).setWaa(this._pipeNode, 0), this.emit("started") },
                stop: function() { this._pipeNode.disconnect(), this._pipeNode = null },
                destroy: function() { c.NamedMixin.destroy.apply(this, arguments), c.EventEmitterMixin.destroy.apply(this, arguments) }
            }), e["delread~"] = e["vd~"] = u.extend({
                type: "delread~",
                inletDefs: [l.DspInlet.extend({
                    message: function(e) {
                        var t = e[0];
                        this.obj.setDelayTime(t, a.getTimeTag(e))
                    }
                })],
                outletDefs: [l.DspOutlet],
                init: function(e) {
                    var t = e[0],
                        n = e[1];
                    this._eventReceiver = new c.EventReceiver, this._delayTime = n || 0, this._delWrite = new c.Reference("delwrite~"), this._onDelWriteStarted = null, t && this._delWrite.set(t)
                },
                start: function() { this._createDelay(), this._onDelWriteChanged = function(e, t) { d.isStarted && e && self._createDelay() }, this._eventReceiver.on(this._delWrite, "changed", this._onDelWriteChanged) },
                stop: function() { this._toSecondsGain = null, this._delayNode.disconnect(), this._delayNode = null, this._delWrite.removeListener("changed", this._onDelWriteChanged), this._onDelWriteChanged = null },
                destroy: function() { this._delWrite.destroy(), this._eventReceiver.destroy() },
                setDelayTime: function(e, t) { return i.isNumber(e) ? (this._delayTime = e, void(this._delayNode && !this.i(0).hasDspSource() && this._delayNode.delayTime.setValueAtTime(this._delayTime / 1e3, t / 1e3 || 0))) : console.error("invalid [delread~] length " + e) },
                _createDelay: function() {
                    this._delayNode && this._delayNode.disconnect();
                    var e = this._delWrite.resolved ? this._delWrite.resolved.maxDelayTime / 1e3 : 1,
                        t = this;
                    if (this._delayNode = d.audio.context.createDelay(e), this._toSecondsGain || (this._toSecondsGain = d.audio.context.createGain(), this._toSecondsGain.gain.value = .001, this.i(0).setWaa(this._toSecondsGain, 0)), this._toSecondsGain.connect(this._delayNode.delayTime), this.o(0).setWaa(this._delayNode, 0), this.setDelayTime(this._delayTime), this._delWrite.resolved) {
                        var n = function() { t._delWrite.resolved._pipeNode.connect(t._delayNode) };
                        this._delWrite.resolved._pipeNode ? n() : (this._onDelWriteStarted = n, this._eventReceiver.once(this._delWrite.resolved, "started", this._onDelWriteStarted))
                    }
                }
            }), e["clip~"] = u.extend({
                type: "clip~",
                inletDefs: [l.DspInlet, l.Inlet.extend({ message: function(e) { var t = e[0]; return i.isNumber(t) ? (this.obj.minValue = t, void this.obj._updateGains()) : console.error("invalid [clip~] min " + t) } }), l.Inlet.extend({ message: function(e) { var t = e[0]; return i.isNumber(t) ? (this.obj.maxValue = t, void this.obj._updateGains()) : console.error("invalid [clip~] max " + t) } })],
                outletDefs: [l.DspOutlet],
                init: function(e) { this.minValue = e[0] || 0, this.maxValue = e[1] || 0 },
                start: function() { this._gainInNode = d.audio.context.createGain(), this._gainOutNode = d.audio.context.createGain(), this._waveShaperNode = d.audio.context.createWaveShaper(), this._gainInNode.connect(this._waveShaperNode), this.i(0).setWaa(this._gainInNode, 0), this.o(0).setWaa(this._waveShaperNode, 0), this._updateGains() },
                stop: function() { this._gainInNode = null, this._waveShaperNode = null, this._gainOutNode.disconnect(), this._gainOutNode = null },
                _updateGains: function() {
                    if (this._waveShaperNode) {
                        var e, t = Math.max(Math.abs(this.minValue), Math.abs(this.maxValue)),
                            n = d.audio.sampleRate,
                            i = new Float32Array(n),
                            r = -t,
                            o = 2 * t / n;
                        for (e = 0; n > e; e++) i[e] = r >= this.minValue && r <= this.maxValue ? r : r > this.maxValue ? this.maxValue : this.minValue, r += o;
                        this._waveShaperNode.curve = i, this._gainInNode.gain.setValueAtTime(0 !== t ? 1 / t : 0, 0)
                    }
                }
            }), e["dac~"] = u.extend({ type: "dac~", endPoint: !0, inletDefs: [l.DspInlet, l.DspInlet], start: function() { this.i(0).setWaa(d.audio.channels[0], 0), this.i(1).setWaa(d.audio.channels[1], 0) } }), e["adc~"] = u.extend({
                type: "adc~",
                outletDefs: [l.DspOutlet, l.DspOutlet],
                init: function() { this.stream = null },
                start: function() {
                    var e = this;
                    this.stream ? this._updateSource() : (this.o(0).setWaa(d.audio.context.createGain(), 0), this.o(1).setWaa(d.audio.context.createGain(), 0), d.audio.getUserMedia(function(t, n) { return t ? console.error("error obtaining mic input : " + t) : (e.stream = n, void(d.isStarted && e._updateSource())) }))
                },
                stop: function() { this._sourceNode.disconnect(), this._sourceNode = null, this._splitterNode = null },
                _updateSource: function() { this.stream && (this._sourceNode = d.audio.context.createMediaStreamSource(this.stream), this._splitterNode = d.audio.context.createChannelSplitter(2), this._sourceNode.connect(this._splitterNode), this.o(0).setWaa(this._splitterNode, 0), this.o(1).setWaa(this._splitterNode, 1)) }
            })
        }
    }, { "../core/PdObject": 6, "../core/mixins": 9, "../core/utils": 11, "../global": 12, "./portlets": 18, underscore: 25, waaoffsetnode: 31, waatablenode: 33, waawhitenoisenode: 35 }],
    17: [function(e, t, n) {
        var i = e("underscore"),
            r = e("getusermedia"),
            o = e("waaclock"),
            s = (e("../global"), n.Audio = function(e) { return "undefined" == typeof AudioContext ? console.error("this environment doesn't support Web Audio API") : (this.channelCount = e.channelCount, this.setContext(e.audioContext || new AudioContext), this.sampleRate = this.context.sampleRate, this.stream = null, void Object.defineProperty(this, "time", { get: function() { return 1e3 * this.context.currentTime } })) });
        s.prototype.start = function() {}, s.prototype.stop = function() {}, s.prototype.decode = function(e, t) {
            this.context.decodeAudioData(e, function(e) {
                var n, i = [];
                for (n = 0; n < e.numberOfChannels; n++) i.push(e.getChannelData(n));
                t(null, i)
            }, function(e) { t(new Error("error decoding " + e)) })
        }, s.prototype.getUserMedia = function(e) {
            var t = this;
            this.stream ? e(null, this.stream) : r({ audio: { mandatory: { googEchoCancellation: !1, googAutoGainControl: !1, googNoiseSuppression: !1, googTypingNoiseDetection: !1 } } }, function(n, i) { t.stream = i, e(n, i) })
        }, s.prototype.setContext = function(e) { var t; for (this.context = e, this._channelMerger = this.context.createChannelMerger(this.channelCount), this._channelMerger.connect(this.context.destination), this.channels = [], t = 0; t < this.channelCount; t++) this.channels.push(this.context.createGain()), this.channels[t].connect(this._channelMerger, 0, t) };
        var a = n.Midi = function() { this._midiInput = null, this._callback = function() {} };
        a.prototype.onMessage = function(e) { this._callback = e }, a.prototype.getMidiInput = function() { return this._midiInput }, a.prototype.setMidiInput = function(e) { e !== this._midiInput && (this._midiInput && this._midiInput.removeEventListener("midimessage", this._callback), this._midiInput = e, this._midiInput && this._midiInput.addEventListener("midimessage", this._callback)) };
        var c = n.Clock = function(e) {
            var t = this;
            this._audioContext = e.audioContext, this._waaClock = e.waaClock || new o(e.audioContext), this._waaClock.start(), Object.defineProperty(this, "time", { get: function() { return 1e3 * t._audioContext.currentTime } })
        };
        c.prototype.schedule = function(e, t, n) {
            var r = function(t) { void 0 == t.timeTag && (t.timeTag = 1e3 * t.deadline), e(t) },
                o = this._waaClock.callbackAtTime(r, t / 1e3);
            return Object.defineProperty(o, "timeTag", { get: function() { return 1e3 * this.deadline } }), i.isNumber(n) && o.repeat(n / 1e3), o
        }, c.prototype.unschedule = function(e) { e.clear() };
        var u = n.Storage = function() {};
        u.prototype.get = function(e, t) {
            var n = new XMLHttpRequest;
            n.onload = function(e) { 200 === this.status ? t(null, this.response) : t(new Error("HTTP " + this.status + ": " + this.statusText)) }, n.onerror = function(e) { t(e) }, n.open("GET", e, !0), n.responseType = "arraybuffer", n.send()
        }
    }, { "../global": 12, getusermedia: 20, underscore: 25, waaclock: 29 }],
    18: [function(e, t, n) {
        var i = e("underscore"),
            r = e("waawire"),
            o = e("../core/utils"),
            s = e("../core/PdObject"),
            a = e("../core/portlets"),
            c = e("../global"),
            u = "undefined" != typeof window ? window.AudioParam : function() {},
            l = { future: function(e, t) { this.message(o.timeTag(t, e)) } },
            d = n.Inlet = a.Inlet.extend(l),
            f = n.Outlet = a.Outlet.extend({ message: function(e) { this.connections.forEach(function(t) { t.message(e) }) } });
        n.UnimplementedInlet = a.UnimplementedPortlet, n.UnimplementedOutlet = a.UnimplementedOutlet;
        var h = n.DspInlet = a.Inlet.extend(l, {
                hasDspSource: function() { return i.filter(this.connections, function(e) { return e instanceof p }).length > 0 },
                init: function() { this._started = !1 },
                start: function() { this._started = !0 },
                stop: function() { this._waa = null, this._started = !1 },
                setWaa: function(e, t) {
                    var n = this;
                    this._waa = { node: e, input: t }, e instanceof u && e.setValueAtTime(0, 0), this._started && i.chain(this.connections).filter(function(e) { return e instanceof p }).forEach(function(e) { e._waaUpdate(n) }).value()
                }
            }),
            p = n.DspOutlet = a.Outlet.extend({
                init: function() { this._waaConnections = {}, this._started = !1 },
                start: function() { this._started = !0, this.connections.forEach(this._waaConnect.bind(this)) },
                stop: function() { this._started = !1, this.connections.forEach(this._waaDisconnect.bind(this)), this._waaConnections = {} },
                connection: function(e) {
                    if (!(e instanceof h)) throw new Error("can only connect to DSP inlet");
                    this._started && this._waaConnect(e)
                },
                disconnection: function(e) { this._started && this._waaDisconnect(e) },
                message: function() { throw new Error("dsp outlet received a message") },
                setWaa: function(e, t) { this._waa = { node: e, output: t }, this._started && i.values(this._waaConnections).forEach(function(n) { n.swapSource(e, t) }) },
                _waaConnect: function(e) {
                    var t = new r(c.audio.context);
                    this._waaConnections[this._getConnectionId(e)] = t, t.connect(this._waa.node, e._waa.node, this._waa.output, e._waa.input)
                },
                _waaDisconnect: function(e) {
                    var t = this._waaConnections[this._getConnectionId(e)];
                    delete this._waaConnections[this._getConnectionId(e)], t.close()
                },
                _waaUpdate: function(e) { this._waaConnections[this._getConnectionId(e)].swapDestination(e._waa.node, e._waa.input) },
                _getConnectionId: function(e) { return e.obj.id + ":" + e.id }
            });
        n.declareObjects = function(e) {
            var t = d.extend({ message: function(e) { this.obj.outlets[0].message(e) } }),
                n = h.extend({ message: function(e) { this.obj.outlets[0].message(e) } }),
                i = p.extend({ stop: function() { p.prototype.stop.apply(this, arguments), this._outNodeConnector && this._outNodeConnector.close(), this._outNodeConnector = null, this._outNode && this._outNode.disconnect(), this._outNode = null }, setWaa: function(e, t) { this._outNodeConnector && this._outNodeConnector.close(), this._outNode || (this._outNode = c.audio.context.createGain()), p.prototype.setWaa.apply(this, arguments), this._outNodeConnector = new r(c.audio.context), this._outNodeConnector.connect(this._waa.node, this._outNode, this._waa.output, 0) }, getOutNode: function() { return this._outNode }, message: function(e) { this.sinks.forEach(function(t) { t.message(e) }) } }),
                o = { start: function() { this._gainNode = c.audio.context.createGain(), this._gainNode.gain.value = 1, this.i(0).setWaa(this._gainNode, 0), this.o(0).setWaa(this._gainNode, 0) }, stop: function() { this._gainNode = null } };
            e.outlet = s.extend({ type: "outlet", inletDefs: [t], outletDefs: [f.extend({ crossPatch: !0 })] }), e.inlet = s.extend({ type: "inlet", inletDefs: [t.extend({ crossPatch: !0 })], outletDefs: [f] }), e["outlet~"] = s.extend(o, { type: "outlet~", inletDefs: [n], outletDefs: [i.extend({ crossPatch: !0 })] }), e["inlet~"] = s.extend(o, { type: "inlet~", inletDefs: [n.extend({ crossPatch: !0 })], outletDefs: [i] })
        }
    }, { "../core/PdObject": 6, "../core/portlets": 10, "../core/utils": 11, "../global": 12, underscore: 25, waawire: 37 }],
    19: [function(e, t, n) {
        function i() { this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0 }

        function r(e) { return "function" == typeof e }

        function o(e) { return "number" == typeof e }

        function s(e) { return "object" == typeof e && null !== e }

        function a(e) { return void 0 === e }
        t.exports = i, i.EventEmitter = i, i.prototype._events = void 0, i.prototype._maxListeners = void 0, i.defaultMaxListeners = 10, i.prototype.setMaxListeners = function(e) { if (!o(e) || 0 > e || isNaN(e)) throw TypeError("n must be a positive number"); return this._maxListeners = e, this }, i.prototype.emit = function(e) {
            var t, n, i, o, c, u;
            if (this._events || (this._events = {}), "error" === e && (!this._events.error || s(this._events.error) && !this._events.error.length)) { if (t = arguments[1], t instanceof Error) throw t; throw TypeError('Uncaught, unspecified "error" event.') }
            if (n = this._events[e], a(n)) return !1;
            if (r(n)) switch (arguments.length) {
                    case 1:
                        n.call(this);
                        break;
                    case 2:
                        n.call(this, arguments[1]);
                        break;
                    case 3:
                        n.call(this, arguments[1], arguments[2]);
                        break;
                    default:
                        for (i = arguments.length, o = new Array(i - 1), c = 1; i > c; c++) o[c - 1] = arguments[c];
                        n.apply(this, o)
                } else if (s(n)) { for (i = arguments.length, o = new Array(i - 1), c = 1; i > c; c++) o[c - 1] = arguments[c]; for (u = n.slice(), i = u.length, c = 0; i > c; c++) u[c].apply(this, o) }
            return !0
        }, i.prototype.addListener = function(e, t) {
            var n;
            if (!r(t)) throw TypeError("listener must be a function");
            if (this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, r(t.listener) ? t.listener : t), this._events[e] ? s(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, s(this._events[e]) && !this._events[e].warned) {
                var n;
                n = a(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners, n && n > 0 && this._events[e].length > n && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace())
            }
            return this
        }, i.prototype.on = i.prototype.addListener, i.prototype.once = function(e, t) {
            function n() { this.removeListener(e, n), i || (i = !0, t.apply(this, arguments)) }
            if (!r(t)) throw TypeError("listener must be a function");
            var i = !1;
            return n.listener = t, this.on(e, n), this
        }, i.prototype.removeListener = function(e, t) {
            var n, i, o, a;
            if (!r(t)) throw TypeError("listener must be a function");
            if (!this._events || !this._events[e]) return this;
            if (n = this._events[e], o = n.length, i = -1, n === t || r(n.listener) && n.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);
            else if (s(n)) {
                for (a = o; a-- > 0;)
                    if (n[a] === t || n[a].listener && n[a].listener === t) {
                        i = a;
                        break
                    }
                if (0 > i) return this;
                1 === n.length ? (n.length = 0, delete this._events[e]) : n.splice(i, 1), this._events.removeListener && this.emit("removeListener", e, t)
            }
            return this
        }, i.prototype.removeAllListeners = function(e) {
            var t, n;
            if (!this._events) return this;
            if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
            if (0 === arguments.length) { for (t in this._events) "removeListener" !== t && this.removeAllListeners(t); return this.removeAllListeners("removeListener"), this._events = {}, this }
            if (n = this._events[e], r(n)) this.removeListener(e, n);
            else
                for (; n.length;) this.removeListener(e, n[n.length - 1]);
            return delete this._events[e], this
        }, i.prototype.listeners = function(e) { var t; return t = this._events && this._events[e] ? r(this._events[e]) ? [this._events[e]] : this._events[e].slice() : [] }, i.listenerCount = function(e, t) { var n; return n = e._events && e._events[t] ? r(e._events[t]) ? 1 : e._events[t].length : 0 }
    }, {}],
    20: [function(e, t, n) {
        e("webrtc-adapter");
        t.exports = function(e, t) {
            var n, i = 2 === arguments.length,
                r = { video: !0, audio: !0 },
                o = "PermissionDeniedError",
                s = "PERMISSION_DENIED",
                a = "ConstraintNotSatisfiedError";
            return i || (t = e, e = r), "undefined" != typeof navigator && navigator.getUserMedia ? e.audio || e.video ? (localStorage && "true" === localStorage.useFirefoxFakeDevice && (e.fake = !0), void navigator.mediaDevices.getUserMedia(e).then(function(e) { t(null, e) })["catch"](function(e) { var n; "string" == typeof e ? (n = new Error("MediaStreamError"), n.name = e === o || e === s ? o : a) : (n = e, n.name || (e.name = n[o] ? o : a)), t(n) })) : (n = new Error("MediaStreamError"), n.name = "NoMediaRequestedError", setTimeout(function() { t(n) }, 0)) : (n = new Error("MediaStreamError"), n.name = "NotSupportedError", setTimeout(function() { t(n) }, 0))
        }
    }, { "webrtc-adapter": 40 }],
    21: [function(e, t, n) {
        var i = e("underscore"),
            r = ["obj", "floatatom", "symbolatom", "msg", "text"],
            o = / |\r\n?|\n/,
            s = /,(?!\\)/,
            a = /\\(\$\d+)/g,
            c = /\\\,/g,
            u = /\\\;/g,
            l = /(#((.|\r|\n)*?)[^\\\\])\r{0,1}\n{0,1};\r{0,1}(\n|$)/i,
            d = function(e) { return e.split("").reverse().join("") },
            f = n.parseArg = function(e) { var t = h(e); if (i.isNumber(t) && !isNaN(t)) return t; if (i.isString(e)) { var n, e = e.substr(0); for (e = e.replace(c, ","), e = e.replace(u, ";"); n = a.exec(e);) e = e.replace(n[0], n[1]); return e } throw new Error("couldn't parse arg " + e) },
            h = n.parseFloat = function(e) { return i.isNumber(e) && !isNaN(e) ? e : i.isString(e) ? parseFloat(e) : 0 / 0 },
            p = n.parseArgs = function(e) {
                if (i.isNumber(e) && !isNaN(e)) return [e];
                var t, n, r, s = i.isString(e) ? e.split(o) : e,
                    a = [];
                for (n = 0, r = s.length; r > n; n++) "" !== (t = s[n]) && a.push(f(t));
                return a
            };
        n.parse = function(e) { return m(e)[0] };
        var m = function(e) {
                var t, n = null,
                    a = -1,
                    c = function() { return a++, a },
                    u = { nodes: [], connections: [], layout: void 0, args: [] },
                    f = !0,
                    h = function() { e = e.slice(t.index + t[0].length) };
                for (l.lastIndex = 0; t = e.match(l);) {
                    var g = d(t[1]).split(s).reverse().map(d),
                        y = g[1],
                        _ = g[0].split(o),
                        b = _[0];
                    if ("#N" === b) {
                        var w = _[1];
                        if ("canvas" !== w) throw new Error("invalid element type for chunk #N : " + w);
                        if (f) u.layout = { x: parseInt(_[2], 10), y: parseInt(_[3], 10), width: parseInt(_[4], 10), height: parseInt(_[5], 10), openOnLoad: _[7] }, u.args = [_[6]], h();
                        else {
                            var x = m(e),
                                C = x[0],
                                T = x[2];
                            u.nodes.push(i.extend({ id: c(), subpatch: C }, T)), e = x[1]
                        }
                    } else if ("#X" === b) {
                        var w = _[1];
                        if ("restore" === w) {
                            var N = { x: parseInt(_[2], 10), y: parseInt(_[3], 10) },
                                E = _[4],
                                j = [];
                            if ("pd" === E && j.push(_[5]), n) {
                                for (var O = n.args[1]; n.data.length < O;) n.data.push(0);
                                n = null
                            }
                            return h(), [u, e, { proto: E, args: j, layout: N }]
                        }
                        if (i.contains(r, w)) {
                            var D, j, x, N = { x: parseInt(_[2], 10), y: parseInt(_[3], 10) };
                            if ("obj" === w ? (D = _[4], j = _.slice(5)) : (D = w, j = _.slice(4)), "text" === w && (j = [_.slice(4).join(" ")]), x = v(D, j, N), j = x[0], N = x[1], y)
                                for (var S = y.split(o); S.length;) { var P = S.shift(); "f" === P && (N.width = S.shift()) }
                            u.nodes.push({ id: c(), proto: D, layout: N, args: p(j) })
                        } else if ("array" === w) {
                            var k = _[2],
                                R = parseFloat(_[3]),
                                M = { id: c(), proto: "table", args: [k, R], data: [] };
                            u.nodes.push(M), n = M
                        } else if ("connect" === w) {
                            var A = parseInt(_[2], 10),
                                I = parseInt(_[4], 10),
                                L = parseInt(_[3], 10),
                                F = parseInt(_[5], 10);
                            u.connections.push({ source: { id: A, port: L }, sink: { id: I, port: F } })
                        } else if ("coords" !== w) throw new Error("invalid element type for chunk #X : " + w);
                        h()
                    } else {
                        if ("#A" !== b) throw new Error("invalid chunk : " + b);
                        var U, G, W, V = parseFloat(_[1]);
                        if (n)
                            for (U = 2, G = _.length; G > U; U++, V++) W = parseFloat(_[U]), i.isNumber(W) && !isNaN(W) && (n.data[V] = W);
                        else console.error("got table data outside of a table.");
                        h()
                    }
                    f = !1
                }
                return [u, ""]
            },
            v = function(e, t, n) { return "floatatom" === e ? (n.width = t[0], n.labelPos = t[3], n.label = t[4], t = [t[1], t[2], t[5], t[6]]) : "symbolatom" === e ? (n.width = t[0], n.labelPos = t[3], n.label = t[4], t = [t[1], t[2], t[5], t[6]]) : "bng" === e ? (n.size = t[0], n.hold = t[1], n.interrupt = t[2], n.label = t[6], n.labelX = t[7], n.labelY = t[8], n.labelFont = t[9], n.labelFontSize = t[10], n.bgColor = t[11], n.fgColor = t[12], n.labelColor = t[13], t = [t[3], t[4], t[5]]) : "tgl" === e ? (n.size = t[0], n.label = t[4], n.labelX = t[5], n.labelY = t[6], n.labelFont = t[7], n.labelFontSize = t[8], n.bgColor = t[9], n.fgColor = t[10], n.labelColor = t[11], t = [t[1], t[2], t[3], t[12], t[13]]) : "nbx" === e ? (n.size = t[0], n.height = t[1], n.log = t[4], n.label = t[8], n.labelX = t[9], n.labelY = t[10], n.labelFont = t[11], n.labelFontSize = t[12], n.bgColor = t[13], n.fgColor = t[14], n.labelColor = t[15], n.logHeight = t[17], t = [t[2], t[3], t[5], t[6], t[7], t[16]]) : "vsl" === e ? (n.width = t[0], n.height = t[1], n.log = t[4], n.label = t[8], n.labelX = t[9], n.labelY = t[10], n.labelFont = t[11], n.labelFontSize = t[12], n.bgColor = t[13], n.fgColor = t[14], n.labelColor = t[15], n.steadyOnClick = t[17], t = [t[2], t[3], t[5], t[6], t[7], t[2] + (t[3] - t[2]) * t[16] / 12700]) : "hsl" === e ? (n.width = t[0], n.height = t[1], n.log = t[4], n.label = t[8], n.labelX = t[9], n.labelY = t[10], n.labelFont = t[11], n.labelFontSize = t[12], n.bgColor = t[13], n.fgColor = t[14], n.labelColor = t[15], n.steadyOnClick = t[17], t = [t[2], t[3], t[5], t[6], t[7], t[2] + (t[3] - t[2]) * t[16] / 12700]) : "vradio" === e ? (n.size = t[0], n.label = t[6], n.labelX = t[7], n.labelY = t[8], n.labelFont = t[9], n.labelFontSize = t[10], n.bgColor = t[11], n.fgColor = t[12], n.labelColor = t[13], t = [t[1], t[2], t[3], t[4], t[5], t[14]]) : "hradio" === e ? (n.size = t[0], n.label = t[6], n.labelX = t[7], n.labelY = t[8], n.labelFont = t[9], n.labelFontSize = t[10], n.bgColor = t[11], n.fgColor = t[12], n.labelColor = t[13], t = [t[1], t[2], t[3], t[4], t[5], t[14]]) : "vu" === e ? (n.width = t[0], n.height = t[1], n.label = t[3], n.labelX = t[4], n.labelY = t[5], n.labelFont = t[6], n.labelFontSize = t[7], n.bgColor = t[8], n.labelColor = t[9], n.log = t[10], t = [t[2], t[11]]) : "cnv" === e && (n.size = t[0], n.width = t[1], n.height = t[2], n.label = t[5], n.labelX = t[6], n.labelY = t[7], n.labelFont = t[8], n.labelFontSize = t[9], n.bgColor = t[10], n.labelColor = t[11], t = [t[3], t[4], t[12]]), [t, n] }
    }, { underscore: 22 }],
    22: [function(e, t, n) {
        (function() {
            var e = this,
                i = e._,
                r = {},
                o = Array.prototype,
                s = Object.prototype,
                a = Function.prototype,
                c = o.push,
                u = o.slice,
                l = o.concat,
                d = s.toString,
                f = s.hasOwnProperty,
                h = o.forEach,
                p = o.map,
                m = o.reduce,
                v = o.reduceRight,
                g = o.filter,
                y = o.every,
                _ = o.some,
                b = o.indexOf,
                w = o.lastIndexOf,
                x = Array.isArray,
                C = Object.keys,
                T = a.bind,
                N = function(e) { return e instanceof N ? e : this instanceof N ? void(this._wrapped = e) : new N(e) };
            "undefined" != typeof n ? ("undefined" != typeof t && t.exports && (n = t.exports = N), n._ = N) : e._ = N, N.VERSION = "1.4.4";
            var E = N.each = N.forEach = function(e, t, n) {
                if (null != e)
                    if (h && e.forEach === h) e.forEach(t, n);
                    else if (e.length === +e.length) {
                    for (var i = 0, o = e.length; o > i; i++)
                        if (t.call(n, e[i], i, e) === r) return
                } else
                    for (var s in e)
                        if (N.has(e, s) && t.call(n, e[s], s, e) === r) return
            };
            N.map = N.collect = function(e, t, n) { var i = []; return null == e ? i : p && e.map === p ? e.map(t, n) : (E(e, function(e, r, o) { i[i.length] = t.call(n, e, r, o) }), i) };
            var j = "Reduce of empty array with no initial value";
            N.reduce = N.foldl = N.inject = function(e, t, n, i) { var r = arguments.length > 2; if (null == e && (e = []), m && e.reduce === m) return i && (t = N.bind(t, i)), r ? e.reduce(t, n) : e.reduce(t); if (E(e, function(e, o, s) { r ? n = t.call(i, n, e, o, s) : (n = e, r = !0) }), !r) throw new TypeError(j); return n }, N.reduceRight = N.foldr = function(e, t, n, i) {
                var r = arguments.length > 2;
                if (null == e && (e = []), v && e.reduceRight === v) return i && (t = N.bind(t, i)), r ? e.reduceRight(t, n) : e.reduceRight(t);
                var o = e.length;
                if (o !== +o) {
                    var s = N.keys(e);
                    o = s.length
                }
                if (E(e, function(a, c, u) { c = s ? s[--o] : --o, r ? n = t.call(i, n, e[c], c, u) : (n = e[c], r = !0) }), !r) throw new TypeError(j);
                return n
            }, N.find = N.detect = function(e, t, n) { var i; return O(e, function(e, r, o) { return t.call(n, e, r, o) ? (i = e, !0) : void 0 }), i }, N.filter = N.select = function(e, t, n) { var i = []; return null == e ? i : g && e.filter === g ? e.filter(t, n) : (E(e, function(e, r, o) { t.call(n, e, r, o) && (i[i.length] = e) }), i) }, N.reject = function(e, t, n) { return N.filter(e, function(e, i, r) { return !t.call(n, e, i, r) }, n) }, N.every = N.all = function(e, t, n) { t || (t = N.identity); var i = !0; return null == e ? i : y && e.every === y ? e.every(t, n) : (E(e, function(e, o, s) { return (i = i && t.call(n, e, o, s)) ? void 0 : r }), !!i) };
            var O = N.some = N.any = function(e, t, n) { t || (t = N.identity); var i = !1; return null == e ? i : _ && e.some === _ ? e.some(t, n) : (E(e, function(e, o, s) { return i || (i = t.call(n, e, o, s)) ? r : void 0 }), !!i) };
            N.contains = N.include = function(e, t) { return null == e ? !1 : b && e.indexOf === b ? -1 != e.indexOf(t) : O(e, function(e) { return e === t }) }, N.invoke = function(e, t) {
                var n = u.call(arguments, 2),
                    i = N.isFunction(t);
                return N.map(e, function(e) { return (i ? t : e[t]).apply(e, n) })
            }, N.pluck = function(e, t) { return N.map(e, function(e) { return e[t] }) }, N.where = function(e, t, n) {
                return N.isEmpty(t) ? n ? null : [] : N[n ? "find" : "filter"](e, function(e) {
                    for (var n in t)
                        if (t[n] !== e[n]) return !1;
                    return !0
                })
            }, N.findWhere = function(e, t) { return N.where(e, t, !0) }, N.max = function(e, t, n) {
                if (!t && N.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.max.apply(Math, e);
                if (!t && N.isEmpty(e)) return -(1 / 0);
                var i = { computed: -(1 / 0), value: -(1 / 0) };
                return E(e, function(e, r, o) {
                    var s = t ? t.call(n, e, r, o) : e;
                    s >= i.computed && (i = { value: e, computed: s })
                }), i.value
            }, N.min = function(e, t, n) {
                if (!t && N.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.min.apply(Math, e);
                if (!t && N.isEmpty(e)) return 1 / 0;
                var i = { computed: 1 / 0, value: 1 / 0 };
                return E(e, function(e, r, o) {
                    var s = t ? t.call(n, e, r, o) : e;
                    s < i.computed && (i = { value: e, computed: s })
                }), i.value
            }, N.shuffle = function(e) {
                var t, n = 0,
                    i = [];
                return E(e, function(e) { t = N.random(n++), i[n - 1] = i[t], i[t] = e }), i
            };
            var D = function(e) { return N.isFunction(e) ? e : function(t) { return t[e] } };
            N.sortBy = function(e, t, n) {
                var i = D(t);
                return N.pluck(N.map(e, function(e, t, r) { return { value: e, index: t, criteria: i.call(n, e, t, r) } }).sort(function(e, t) {
                    var n = e.criteria,
                        i = t.criteria;
                    if (n !== i) { if (n > i || void 0 === n) return 1; if (i > n || void 0 === i) return -1 }
                    return e.index < t.index ? -1 : 1
                }), "value")
            };
            var S = function(e, t, n, i) {
                var r = {},
                    o = D(t || N.identity);
                return E(e, function(t, s) {
                    var a = o.call(n, t, s, e);
                    i(r, a, t)
                }), r
            };
            N.groupBy = function(e, t, n) {
                return S(e, t, n, function(e, t, n) {
                    (N.has(e, t) ? e[t] : e[t] = []).push(n)
                })
            }, N.countBy = function(e, t, n) { return S(e, t, n, function(e, t) { N.has(e, t) || (e[t] = 0), e[t]++ }) }, N.sortedIndex = function(e, t, n, i) {
                n = null == n ? N.identity : D(n);
                for (var r = n.call(i, t), o = 0, s = e.length; s > o;) {
                    var a = o + s >>> 1;
                    n.call(i, e[a]) < r ? o = a + 1 : s = a
                }
                return o
            }, N.toArray = function(e) { return e ? N.isArray(e) ? u.call(e) : e.length === +e.length ? N.map(e, N.identity) : N.values(e) : [] }, N.size = function(e) { return null == e ? 0 : e.length === +e.length ? e.length : N.keys(e).length }, N.first = N.head = N.take = function(e, t, n) { return null == e ? void 0 : null == t || n ? e[0] : u.call(e, 0, t) }, N.initial = function(e, t, n) { return u.call(e, 0, e.length - (null == t || n ? 1 : t)) }, N.last = function(e, t, n) { return null == e ? void 0 : null == t || n ? e[e.length - 1] : u.call(e, Math.max(e.length - t, 0)) }, N.rest = N.tail = N.drop = function(e, t, n) { return u.call(e, null == t || n ? 1 : t) }, N.compact = function(e) { return N.filter(e, N.identity) };
            var P = function(e, t, n) { return E(e, function(e) { N.isArray(e) ? t ? c.apply(n, e) : P(e, t, n) : n.push(e) }), n };
            N.flatten = function(e, t) { return P(e, t, []) }, N.without = function(e) { return N.difference(e, u.call(arguments, 1)) }, N.uniq = N.unique = function(e, t, n, i) {
                N.isFunction(t) && (i = n, n = t, t = !1);
                var r = n ? N.map(e, n, i) : e,
                    o = [],
                    s = [];
                return E(r, function(n, i) {
                    (t ? i && s[s.length - 1] === n : N.contains(s, n)) || (s.push(n), o.push(e[i]))
                }), o
            }, N.union = function() { return N.uniq(l.apply(o, arguments)) }, N.intersection = function(e) { var t = u.call(arguments, 1); return N.filter(N.uniq(e), function(e) { return N.every(t, function(t) { return N.indexOf(t, e) >= 0 }) }) }, N.difference = function(e) { var t = l.apply(o, u.call(arguments, 1)); return N.filter(e, function(e) { return !N.contains(t, e) }) }, N.zip = function() { for (var e = u.call(arguments), t = N.max(N.pluck(e, "length")), n = new Array(t), i = 0; t > i; i++) n[i] = N.pluck(e, "" + i); return n }, N.object = function(e, t) { if (null == e) return {}; for (var n = {}, i = 0, r = e.length; r > i; i++) t ? n[e[i]] = t[i] : n[e[i][0]] = e[i][1]; return n }, N.indexOf = function(e, t, n) {
                if (null == e) return -1;
                var i = 0,
                    r = e.length;
                if (n) {
                    if ("number" != typeof n) return i = N.sortedIndex(e, t), e[i] === t ? i : -1;
                    i = 0 > n ? Math.max(0, r + n) : n
                }
                if (b && e.indexOf === b) return e.indexOf(t, n);
                for (; r > i; i++)
                    if (e[i] === t) return i;
                return -1
            }, N.lastIndexOf = function(e, t, n) {
                if (null == e) return -1;
                var i = null != n;
                if (w && e.lastIndexOf === w) return i ? e.lastIndexOf(t, n) : e.lastIndexOf(t);
                for (var r = i ? n : e.length; r--;)
                    if (e[r] === t) return r;
                return -1
            }, N.range = function(e, t, n) { arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1; for (var i = Math.max(Math.ceil((t - e) / n), 0), r = 0, o = new Array(i); i > r;) o[r++] = e, e += n; return o }, N.bind = function(e, t) { if (e.bind === T && T) return T.apply(e, u.call(arguments, 1)); var n = u.call(arguments, 2); return function() { return e.apply(t, n.concat(u.call(arguments))) } }, N.partial = function(e) { var t = u.call(arguments, 1); return function() { return e.apply(this, t.concat(u.call(arguments))) } }, N.bindAll = function(e) { var t = u.call(arguments, 1); return 0 === t.length && (t = N.functions(e)), E(t, function(t) { e[t] = N.bind(e[t], e) }), e }, N.memoize = function(e, t) {
                var n = {};
                return t || (t = N.identity),
                    function() { var i = t.apply(this, arguments); return N.has(n, i) ? n[i] : n[i] = e.apply(this, arguments) }
            }, N.delay = function(e, t) { var n = u.call(arguments, 2); return setTimeout(function() { return e.apply(null, n) }, t) }, N.defer = function(e) { return N.delay.apply(N, [e, 1].concat(u.call(arguments, 1))) }, N.throttle = function(e, t) {
                var n, i, r, o, s = 0,
                    a = function() { s = new Date, r = null, o = e.apply(n, i) };
                return function() {
                    var c = new Date,
                        u = t - (c - s);
                    return n = this, i = arguments, 0 >= u ? (clearTimeout(r), r = null, s = c, o = e.apply(n, i)) : r || (r = setTimeout(a, u)), o
                }
            }, N.debounce = function(e, t, n) {
                var i, r;
                return function() {
                    var o = this,
                        s = arguments,
                        a = function() { i = null, n || (r = e.apply(o, s)) },
                        c = n && !i;
                    return clearTimeout(i), i = setTimeout(a, t), c && (r = e.apply(o, s)), r
                }
            }, N.once = function(e) { var t, n = !1; return function() { return n ? t : (n = !0, t = e.apply(this, arguments), e = null, t) } }, N.wrap = function(e, t) { return function() { var n = [e]; return c.apply(n, arguments), t.apply(this, n) } }, N.compose = function() { var e = arguments; return function() { for (var t = arguments, n = e.length - 1; n >= 0; n--) t = [e[n].apply(this, t)]; return t[0] } }, N.after = function(e, t) { return 0 >= e ? t() : function() { return --e < 1 ? t.apply(this, arguments) : void 0 } }, N.keys = C || function(e) { if (e !== Object(e)) throw new TypeError("Invalid object"); var t = []; for (var n in e) N.has(e, n) && (t[t.length] = n); return t }, N.values = function(e) { var t = []; for (var n in e) N.has(e, n) && t.push(e[n]); return t }, N.pairs = function(e) { var t = []; for (var n in e) N.has(e, n) && t.push([n, e[n]]); return t }, N.invert = function(e) { var t = {}; for (var n in e) N.has(e, n) && (t[e[n]] = n); return t }, N.functions = N.methods = function(e) { var t = []; for (var n in e) N.isFunction(e[n]) && t.push(n); return t.sort() }, N.extend = function(e) {
                return E(u.call(arguments, 1), function(t) {
                    if (t)
                        for (var n in t) e[n] = t[n]
                }), e
            }, N.pick = function(e) {
                var t = {},
                    n = l.apply(o, u.call(arguments, 1));
                return E(n, function(n) { n in e && (t[n] = e[n]) }), t
            }, N.omit = function(e) {
                var t = {},
                    n = l.apply(o, u.call(arguments, 1));
                for (var i in e) N.contains(n, i) || (t[i] = e[i]);
                return t
            }, N.defaults = function(e) {
                return E(u.call(arguments, 1), function(t) {
                    if (t)
                        for (var n in t) null == e[n] && (e[n] = t[n])
                }), e
            }, N.clone = function(e) { return N.isObject(e) ? N.isArray(e) ? e.slice() : N.extend({}, e) : e }, N.tap = function(e, t) { return t(e), e };
            var k = function(e, t, n, i) {
                if (e === t) return 0 !== e || 1 / e == 1 / t;
                if (null == e || null == t) return e === t;
                e instanceof N && (e = e._wrapped), t instanceof N && (t = t._wrapped);
                var r = d.call(e);
                if (r != d.call(t)) return !1;
                switch (r) {
                    case "[object String]":
                        return e == String(t);
                    case "[object Number]":
                        return e != +e ? t != +t : 0 == e ? 1 / e == 1 / t : e == +t;
                    case "[object Date]":
                    case "[object Boolean]":
                        return +e == +t;
                    case "[object RegExp]":
                        return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
                }
                if ("object" != typeof e || "object" != typeof t) return !1;
                for (var o = n.length; o--;)
                    if (n[o] == e) return i[o] == t;
                n.push(e), i.push(t);
                var s = 0,
                    a = !0;
                if ("[object Array]" == r) {
                    if (s = e.length, a = s == t.length)
                        for (; s-- && (a = k(e[s], t[s], n, i)););
                } else {
                    var c = e.constructor,
                        u = t.constructor;
                    if (c !== u && !(N.isFunction(c) && c instanceof c && N.isFunction(u) && u instanceof u)) return !1;
                    for (var l in e)
                        if (N.has(e, l) && (s++, !(a = N.has(t, l) && k(e[l], t[l], n, i)))) break;
                    if (a) {
                        for (l in t)
                            if (N.has(t, l) && !s--) break;
                        a = !s
                    }
                }
                return n.pop(), i.pop(), a
            };
            N.isEqual = function(e, t) { return k(e, t, [], []) }, N.isEmpty = function(e) {
                if (null == e) return !0;
                if (N.isArray(e) || N.isString(e)) return 0 === e.length;
                for (var t in e)
                    if (N.has(e, t)) return !1;
                return !0
            }, N.isElement = function(e) { return !(!e || 1 !== e.nodeType) }, N.isArray = x || function(e) { return "[object Array]" == d.call(e) }, N.isObject = function(e) { return e === Object(e) }, E(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(e) { N["is" + e] = function(t) { return d.call(t) == "[object " + e + "]" } }), N.isArguments(arguments) || (N.isArguments = function(e) { return !(!e || !N.has(e, "callee")) }), "function" != typeof /./ && (N.isFunction = function(e) { return "function" == typeof e }), N.isFinite = function(e) { return isFinite(e) && !isNaN(parseFloat(e)) }, N.isNaN = function(e) { return N.isNumber(e) && e != +e }, N.isBoolean = function(e) { return e === !0 || e === !1 || "[object Boolean]" == d.call(e) }, N.isNull = function(e) { return null === e }, N.isUndefined = function(e) { return void 0 === e }, N.has = function(e, t) { return f.call(e, t) }, N.noConflict = function() { return e._ = i, this }, N.identity = function(e) { return e }, N.times = function(e, t, n) { for (var i = Array(e), r = 0; e > r; r++) i[r] = t.call(n, r); return i }, N.random = function(e, t) { return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1)) };
            var R = { escape: { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "/": "&#x2F;" } };
            R.unescape = N.invert(R.escape);
            var M = { escape: new RegExp("[" + N.keys(R.escape).join("") + "]", "g"), unescape: new RegExp("(" + N.keys(R.unescape).join("|") + ")", "g") };
            N.each(["escape", "unescape"], function(e) { N[e] = function(t) { return null == t ? "" : ("" + t).replace(M[e], function(t) { return R[e][t] }) } }), N.result = function(e, t) { if (null == e) return null; var n = e[t]; return N.isFunction(n) ? n.call(e) : n }, N.mixin = function(e) {
                E(N.functions(e), function(t) {
                    var n = N[t] = e[t];
                    N.prototype[t] = function() { var e = [this._wrapped]; return c.apply(e, arguments), U.call(this, n.apply(N, e)) }
                })
            };
            var A = 0;
            N.uniqueId = function(e) { var t = ++A + ""; return e ? e + t : t }, N.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g };
            var I = /(.)^/,
                L = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "	": "t", "\u2028": "u2028", "\u2029": "u2029" },
                F = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            N.template = function(e, t, n) {
                var i;
                n = N.defaults({}, n, N.templateSettings);
                var r = new RegExp([(n.escape || I).source, (n.interpolate || I).source, (n.evaluate || I).source].join("|") + "|$", "g"),
                    o = 0,
                    s = "__p+='";
                e.replace(r, function(t, n, i, r, a) { return s += e.slice(o, a).replace(F, function(e) { return "\\" + L[e] }), n && (s += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'"), i && (s += "'+\n((__t=(" + i + "))==null?'':__t)+\n'"), r && (s += "';\n" + r + "\n__p+='"), o = a + t.length, t }), s += "';\n", n.variable || (s = "with(obj||{}){\n" + s + "}\n"), s = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + s + "return __p;\n";
                try { i = new Function(n.variable || "obj", "_", s) } catch (a) { throw a.source = s, a }
                if (t) return i(t, N);
                var c = function(e) { return i.call(this, e, N) };
                return c.source = "function(" + (n.variable || "obj") + "){\n" + s + "}", c
            }, N.chain = function(e) { return N(e).chain() };
            var U = function(e) { return this._chain ? N(e).chain() : e };
            N.mixin(N), E(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(e) {
                var t = o[e];
                N.prototype[e] = function() { var n = this._wrapped; return t.apply(n, arguments), "shift" != e && "splice" != e || 0 !== n.length || delete n[0], U.call(this, n) }
            }), E(["concat", "join", "slice"], function(e) {
                var t = o[e];
                N.prototype[e] = function() { return U.call(this, t.apply(this._wrapped, arguments)) }
            }), N.extend(N.prototype, { chain: function() { return this._chain = !0, this }, value: function() { return this._wrapped } })
        }).call(this)
    }, {}],
    23: [function(e, t, n) {
        function i() {}
        var r = t.exports = {};
        r.nextTick = function() {
            var e = "undefined" != typeof window && window.setImmediate,
                t = "undefined" != typeof window && window.MutationObserver,
                n = "undefined" != typeof window && window.postMessage && window.addEventListener;
            if (e) return function(e) { return window.setImmediate(e) };
            var i = [];
            if (t) {
                var r = document.createElement("div"),
                    o = new MutationObserver(function() {
                        var e = i.slice();
                        i.length = 0, e.forEach(function(e) { e() })
                    });
                return o.observe(r, { attributes: !0 }),
                    function(e) { i.length || r.setAttribute("yes", "no"), i.push(e) }
            }
            return n ? (window.addEventListener("message", function(e) {
                var t = e.source;
                if ((t === window || null === t) && "process-tick" === e.data && (e.stopPropagation(), i.length > 0)) {
                    var n = i.shift();
                    n()
                }
            }, !0), function(e) { i.push(e), window.postMessage("process-tick", "*") }) : function(e) { setTimeout(e, 0) }
        }(), r.title = "browser", r.browser = !0, r.env = {}, r.argv = [], r.on = i, r.addListener = i, r.once = i, r.off = i, r.removeListener = i, r.removeAllListeners = i, r.emit = i, r.binding = function(e) { throw new Error("process.binding is not supported") }, r.cwd = function() { return "/" }, r.chdir = function(e) { throw new Error("process.chdir is not supported") }
    }, {}],
    24: [function(e, t, n) {
        "use strict";
        var i = {};
        i.generateIdentifier = function() { return Math.random().toString(36).substr(2, 10) }, i.localCName = i.generateIdentifier(), i.splitLines = function(e) { return e.trim().split("\n").map(function(e) { return e.trim() }) }, i.splitSections = function(e) { var t = e.split("\nm="); return t.map(function(e, t) { return (t > 0 ? "m=" + e : e).trim() + "\r\n" }) }, i.matchPrefix = function(e, t) { return i.splitLines(e).filter(function(e) { return 0 === e.indexOf(t) }) }, i.parseCandidate = function(e) {
            var t;
            t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" ");
            for (var n = { foundation: t[0], component: parseInt(t[1], 10), protocol: t[2].toLowerCase(), priority: parseInt(t[3], 10), ip: t[4], port: parseInt(t[5], 10), type: t[7] }, i = 8; i < t.length; i += 2) switch (t[i]) {
                case "raddr":
                    n.relatedAddress = t[i + 1];
                    break;
                case "rport":
                    n.relatedPort = parseInt(t[i + 1], 10);
                    break;
                case "tcptype":
                    n.tcpType = t[i + 1];
                    break;
                default:
                    n[t[i]] = t[i + 1]
            }
            return n
        }, i.writeCandidate = function(e) {
            var t = [];
            t.push(e.foundation), t.push(e.component), t.push(e.protocol.toUpperCase()), t.push(e.priority), t.push(e.ip), t.push(e.port);
            var n = e.type;
            return t.push("typ"), t.push(n), "host" !== n && e.relatedAddress && e.relatedPort && (t.push("raddr"), t.push(e.relatedAddress), t.push("rport"), t.push(e.relatedPort)), e.tcpType && "tcp" === e.protocol.toLowerCase() && (t.push("tcptype"), t.push(e.tcpType)), "candidate:" + t.join(" ")
        }, i.parseIceOptions = function(e) { return e.substr(14).split(" ") }, i.parseRtpMap = function(e) {
            var t = e.substr(9).split(" "),
                n = { payloadType: parseInt(t.shift(), 10) };
            return t = t[0].split("/"), n.name = t[0], n.clockRate = parseInt(t[1], 10), n.numChannels = 3 === t.length ? parseInt(t[2], 10) : 1, n
        }, i.writeRtpMap = function(e) { var t = e.payloadType; return void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType), "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (1 !== e.numChannels ? "/" + e.numChannels : "") + "\r\n" }, i.parseExtmap = function(e) { var t = e.substr(9).split(" "); return { id: parseInt(t[0], 10), direction: t[0].indexOf("/") > 0 ? t[0].split("/")[1] : "sendrecv", uri: t[1] } }, i.writeExtmap = function(e) { return "a=extmap:" + (e.id || e.preferredId) + (e.direction && "sendrecv" !== e.direction ? "/" + e.direction : "") + " " + e.uri + "\r\n" }, i.parseFmtp = function(e) { for (var t, n = {}, i = e.substr(e.indexOf(" ") + 1).split(";"), r = 0; r < i.length; r++) t = i[r].trim().split("="), n[t[0].trim()] = t[1]; return n }, i.writeFmtp = function(e) {
            var t = "",
                n = e.payloadType;
            if (void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType), e.parameters && Object.keys(e.parameters).length) {
                var i = [];
                Object.keys(e.parameters).forEach(function(t) { i.push(t + "=" + e.parameters[t]) }), t += "a=fmtp:" + n + " " + i.join(";") + "\r\n"
            }
            return t
        }, i.parseRtcpFb = function(e) { var t = e.substr(e.indexOf(" ") + 1).split(" "); return { type: t.shift(), parameter: t.join(" ") } }, i.writeRtcpFb = function(e) {
            var t = "",
                n = e.payloadType;
            return void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType), e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach(function(e) { t += "a=rtcp-fb:" + n + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n" }), t
        }, i.parseSsrcMedia = function(e) {
            var t = e.indexOf(" "),
                n = { ssrc: parseInt(e.substr(7, t - 7), 10) },
                i = e.indexOf(":", t);
            return i > -1 ? (n.attribute = e.substr(t + 1, i - t - 1), n.value = e.substr(i + 1)) : n.attribute = e.substr(t + 1), n
        }, i.getMid = function(e) { var t = i.matchPrefix(e, "a=mid:")[0]; return t ? t.substr(6) : void 0 }, i.parseFingerprint = function(e) { var t = e.substr(14).split(" "); return { algorithm: t[0].toLowerCase(), value: t[1] } }, i.getDtlsParameters = function(e, t) { var n = i.matchPrefix(e + t, "a=fingerprint:"); return { role: "auto", fingerprints: n.map(i.parseFingerprint) } }, i.writeDtlsParameters = function(e, t) { var n = "a=setup:" + t + "\r\n"; return e.fingerprints.forEach(function(e) { n += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n" }), n }, i.getIceParameters = function(e, t) {
            var n = i.splitLines(e);
            n = n.concat(i.splitLines(t));
            var r = { usernameFragment: n.filter(function(e) { return 0 === e.indexOf("a=ice-ufrag:") })[0].substr(12), password: n.filter(function(e) { return 0 === e.indexOf("a=ice-pwd:") })[0].substr(10) };
            return r
        }, i.writeIceParameters = function(e) { return "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n" }, i.parseRtpParameters = function(e) {
            for (var t = { codecs: [], headerExtensions: [], fecMechanisms: [], rtcp: [] }, n = i.splitLines(e), r = n[0].split(" "), o = 3; o < r.length; o++) {
                var s = r[o],
                    a = i.matchPrefix(e, "a=rtpmap:" + s + " ")[0];
                if (a) {
                    var c = i.parseRtpMap(a),
                        u = i.matchPrefix(e, "a=fmtp:" + s + " ");
                    switch (c.parameters = u.length ? i.parseFmtp(u[0]) : {}, c.rtcpFeedback = i.matchPrefix(e, "a=rtcp-fb:" + s + " ").map(i.parseRtcpFb), t.codecs.push(c), c.name.toUpperCase()) {
                        case "RED":
                        case "ULPFEC":
                            t.fecMechanisms.push(c.name.toUpperCase())
                    }
                }
            }
            return i.matchPrefix(e, "a=extmap:").forEach(function(e) { t.headerExtensions.push(i.parseExtmap(e)) }), t
        }, i.writeRtpDescription = function(e, t) {
            var n = "";
            n += "m=" + e + " ", n += t.codecs.length > 0 ? "9" : "0", n += " UDP/TLS/RTP/SAVPF ", n += t.codecs.map(function(e) { return void 0 !== e.preferredPayloadType ? e.preferredPayloadType : e.payloadType }).join(" ") + "\r\n", n += "c=IN IP4 0.0.0.0\r\n", n += "a=rtcp:9 IN IP4 0.0.0.0\r\n", t.codecs.forEach(function(e) { n += i.writeRtpMap(e), n += i.writeFmtp(e), n += i.writeRtcpFb(e) });
            var r = 0;
            return t.codecs.forEach(function(e) { e.maxptime > r && (r = e.maxptime) }), r > 0 && (n += "a=maxptime:" + r + "\r\n"), n += "a=rtcp-mux\r\n", t.headerExtensions.forEach(function(e) { n += i.writeExtmap(e) }), n
        }, i.parseRtpEncodingParameters = function(e) {
            var t, n = [],
                r = i.parseRtpParameters(e),
                o = -1 !== r.fecMechanisms.indexOf("RED"),
                s = -1 !== r.fecMechanisms.indexOf("ULPFEC"),
                a = i.matchPrefix(e, "a=ssrc:").map(function(e) { return i.parseSsrcMedia(e) }).filter(function(e) { return "cname" === e.attribute }),
                c = a.length > 0 && a[0].ssrc,
                u = i.matchPrefix(e, "a=ssrc-group:FID").map(function(e) { var t = e.split(" "); return t.shift(), t.map(function(e) { return parseInt(e, 10) }) });
            u.length > 0 && u[0].length > 1 && u[0][0] === c && (t = u[0][1]), r.codecs.forEach(function(e) {
                if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
                    var i = { ssrc: c, codecPayloadType: parseInt(e.parameters.apt, 10), rtx: { ssrc: t } };
                    n.push(i), o && (i = JSON.parse(JSON.stringify(i)), i.fec = { ssrc: t, mechanism: s ? "red+ulpfec" : "red" }, n.push(i))
                }
            }), 0 === n.length && c && n.push({ ssrc: c });
            var l = i.matchPrefix(e, "b=");
            return l.length && (0 === l[0].indexOf("b=TIAS:") ? l = parseInt(l[0].substr(7), 10) : 0 === l[0].indexOf("b=AS:") && (l = parseInt(l[0].substr(5), 10)), n.forEach(function(e) { e.maxBitrate = l })), n
        }, i.parseRtcpParameters = function(e) {
            var t = {},
                n = i.matchPrefix(e, "a=ssrc:").map(function(e) { return i.parseSsrcMedia(e) }).filter(function(e) { return "cname" === e.attribute })[0];
            n && (t.cname = n.value, t.ssrc = n.ssrc);
            var r = i.matchPrefix(e, "a=rtcp-rsize");
            t.reducedSize = r.length > 0, t.compound = 0 === r.length;
            var o = i.matchPrefix(e, "a=rtcp-mux");
            return t.mux = o.length > 0, t
        }, i.parseMsid = function(e) { var t, n = i.matchPrefix(e, "a=msid:"); if (1 === n.length) return t = n[0].substr(7).split(" "), { stream: t[0], track: t[1] }; var r = i.matchPrefix(e, "a=ssrc:").map(function(e) { return i.parseSsrcMedia(e) }).filter(function(e) { return "msid" === e.attribute }); return r.length > 0 ? (t = r[0].value.split(" "), { stream: t[0], track: t[1] }) : void 0 }, i.writeSessionBoilerplate = function() { return "v=0\r\no=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n" }, i.writeMediaSection = function(e, t, n, r) {
            var o = i.writeRtpDescription(e.kind, t);
            if (o += i.writeIceParameters(e.iceGatherer.getLocalParameters()), o += i.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === n ? "actpass" : "active"), o += "a=mid:" + e.mid + "\r\n", o += e.direction ? "a=" + e.direction + "\r\n" : e.rtpSender && e.rtpReceiver ? "a=sendrecv\r\n" : e.rtpSender ? "a=sendonly\r\n" : e.rtpReceiver ? "a=recvonly\r\n" : "a=inactive\r\n", e.rtpSender) {
                var s = "msid:" + r.id + " " + e.rtpSender.track.id + "\r\n";
                o += "a=" + s, o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + s, e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + s, o += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
            }
            return o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + i.localCName + "\r\n", e.rtpSender && e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + i.localCName + "\r\n"), o
        }, i.getDirection = function(e, t) {
            for (var n = i.splitLines(e), r = 0; r < n.length; r++) switch (n[r]) {
                case "a=sendrecv":
                case "a=sendonly":
                case "a=recvonly":
                case "a=inactive":
                    return n[r].substr(2)
            }
            return t ? i.getDirection(t) : "sendrecv"
        }, i.getKind = function(e) {
            var t = i.splitLines(e),
                n = t[0].split(" ");
            return n[0].substr(2)
        }, i.isRejected = function(e) { return "0" === e.split(" ", 2)[1] }, t.exports = i
    }, {}],
    25: [function(e, t, n) {
        (function() {
            function e(e) {
                function t(t, n, i, r, o, s) {
                    for (; o >= 0 && s > o; o += e) {
                        var a = r ? r[o] : o;
                        i = n(i, t[a], a, t)
                    }
                    return i
                }
                return function(n, i, r, o) {
                    i = w(i, o, 4);
                    var s = !O(n) && b.keys(n),
                        a = (s || n).length,
                        c = e > 0 ? 0 : a - 1;
                    return arguments.length < 3 && (r = n[s ? s[c] : c], c += e), t(n, i, r, s, c, a)
                }
            }

            function i(e) {
                return function(t, n, i) {
                    n = x(n, i);
                    for (var r = j(t), o = e > 0 ? 0 : r - 1; o >= 0 && r > o; o += e)
                        if (n(t[o], o, t)) return o;
                    return -1
                }
            }

            function r(e, t, n) {
                return function(i, r, o) {
                    var s = 0,
                        a = j(i);
                    if ("number" == typeof o) e > 0 ? s = o >= 0 ? o : Math.max(o + a, s) : a = o >= 0 ? Math.min(o + 1, a) : o + a + 1;
                    else if (n && o && a) return o = n(i, r), i[o] === r ? o : -1;
                    if (r !== r) return o = t(f.call(i, s, a), b.isNaN), o >= 0 ? o + s : -1;
                    for (o = e > 0 ? s : a - 1; o >= 0 && a > o; o += e)
                        if (i[o] === r) return o;
                    return -1
                }
            }

            function o(e, t) {
                var n = R.length,
                    i = e.constructor,
                    r = b.isFunction(i) && i.prototype || u,
                    o = "constructor";
                for (b.has(e, o) && !b.contains(t, o) && t.push(o); n--;) o = R[n], o in e && e[o] !== r[o] && !b.contains(t, o) && t.push(o)
            }
            var s = this,
                a = s._,
                c = Array.prototype,
                u = Object.prototype,
                l = Function.prototype,
                d = c.push,
                f = c.slice,
                h = u.toString,
                p = u.hasOwnProperty,
                m = Array.isArray,
                v = Object.keys,
                g = l.bind,
                y = Object.create,
                _ = function() {},
                b = function(e) { return e instanceof b ? e : this instanceof b ? void(this._wrapped = e) : new b(e) };
            "undefined" != typeof n ? ("undefined" != typeof t && t.exports && (n = t.exports = b), n._ = b) : s._ = b, b.VERSION = "1.8.3";
            var w = function(e, t, n) {
                    if (void 0 === t) return e;
                    switch (null == n ? 3 : n) {
                        case 1:
                            return function(n) { return e.call(t, n) };
                        case 2:
                            return function(n, i) { return e.call(t, n, i) };
                        case 3:
                            return function(n, i, r) { return e.call(t, n, i, r) };
                        case 4:
                            return function(n, i, r, o) { return e.call(t, n, i, r, o) }
                    }
                    return function() { return e.apply(t, arguments) }
                },
                x = function(e, t, n) { return null == e ? b.identity : b.isFunction(e) ? w(e, t, n) : b.isObject(e) ? b.matcher(e) : b.property(e) };
            b.iteratee = function(e, t) { return x(e, t, 1 / 0) };
            var C = function(e, t) {
                    return function(n) {
                        var i = arguments.length;
                        if (2 > i || null == n) return n;
                        for (var r = 1; i > r; r++)
                            for (var o = arguments[r], s = e(o), a = s.length, c = 0; a > c; c++) {
                                var u = s[c];
                                t && void 0 !== n[u] || (n[u] = o[u])
                            }
                        return n
                    }
                },
                T = function(e) {
                    if (!b.isObject(e)) return {};
                    if (y) return y(e);
                    _.prototype = e;
                    var t = new _;
                    return _.prototype = null, t
                },
                N = function(e) { return function(t) { return null == t ? void 0 : t[e] } },
                E = Math.pow(2, 53) - 1,
                j = N("length"),
                O = function(e) { var t = j(e); return "number" == typeof t && t >= 0 && E >= t };
            b.each = b.forEach = function(e, t, n) {
                    t = w(t, n);
                    var i, r;
                    if (O(e))
                        for (i = 0, r = e.length; r > i; i++) t(e[i], i, e);
                    else { var o = b.keys(e); for (i = 0, r = o.length; r > i; i++) t(e[o[i]], o[i], e) }
                    return e
                }, b.map = b.collect = function(e, t, n) {
                    t = x(t, n);
                    for (var i = !O(e) && b.keys(e), r = (i || e).length, o = Array(r), s = 0; r > s; s++) {
                        var a = i ? i[s] : s;
                        o[s] = t(e[a], a, e)
                    }
                    return o
                }, b.reduce = b.foldl = b.inject = e(1),
                b.reduceRight = b.foldr = e(-1), b.find = b.detect = function(e, t, n) { var i; return i = O(e) ? b.findIndex(e, t, n) : b.findKey(e, t, n), void 0 !== i && -1 !== i ? e[i] : void 0 }, b.filter = b.select = function(e, t, n) { var i = []; return t = x(t, n), b.each(e, function(e, n, r) { t(e, n, r) && i.push(e) }), i }, b.reject = function(e, t, n) { return b.filter(e, b.negate(x(t)), n) }, b.every = b.all = function(e, t, n) { t = x(t, n); for (var i = !O(e) && b.keys(e), r = (i || e).length, o = 0; r > o; o++) { var s = i ? i[o] : o; if (!t(e[s], s, e)) return !1 } return !0 }, b.some = b.any = function(e, t, n) { t = x(t, n); for (var i = !O(e) && b.keys(e), r = (i || e).length, o = 0; r > o; o++) { var s = i ? i[o] : o; if (t(e[s], s, e)) return !0 } return !1 }, b.contains = b.includes = b.include = function(e, t, n, i) { return O(e) || (e = b.values(e)), ("number" != typeof n || i) && (n = 0), b.indexOf(e, t, n) >= 0 }, b.invoke = function(e, t) {
                    var n = f.call(arguments, 2),
                        i = b.isFunction(t);
                    return b.map(e, function(e) { var r = i ? t : e[t]; return null == r ? r : r.apply(e, n) })
                }, b.pluck = function(e, t) { return b.map(e, b.property(t)) }, b.where = function(e, t) { return b.filter(e, b.matcher(t)) }, b.findWhere = function(e, t) { return b.find(e, b.matcher(t)) }, b.max = function(e, t, n) {
                    var i, r, o = -(1 / 0),
                        s = -(1 / 0);
                    if (null == t && null != e) { e = O(e) ? e : b.values(e); for (var a = 0, c = e.length; c > a; a++) i = e[a], i > o && (o = i) } else t = x(t, n), b.each(e, function(e, n, i) { r = t(e, n, i), (r > s || r === -(1 / 0) && o === -(1 / 0)) && (o = e, s = r) });
                    return o
                }, b.min = function(e, t, n) {
                    var i, r, o = 1 / 0,
                        s = 1 / 0;
                    if (null == t && null != e) { e = O(e) ? e : b.values(e); for (var a = 0, c = e.length; c > a; a++) i = e[a], o > i && (o = i) } else t = x(t, n), b.each(e, function(e, n, i) { r = t(e, n, i), (s > r || r === 1 / 0 && o === 1 / 0) && (o = e, s = r) });
                    return o
                }, b.shuffle = function(e) { for (var t, n = O(e) ? e : b.values(e), i = n.length, r = Array(i), o = 0; i > o; o++) t = b.random(0, o), t !== o && (r[o] = r[t]), r[t] = n[o]; return r }, b.sample = function(e, t, n) { return null == t || n ? (O(e) || (e = b.values(e)), e[b.random(e.length - 1)]) : b.shuffle(e).slice(0, Math.max(0, t)) }, b.sortBy = function(e, t, n) {
                    return t = x(t, n), b.pluck(b.map(e, function(e, n, i) { return { value: e, index: n, criteria: t(e, n, i) } }).sort(function(e, t) {
                        var n = e.criteria,
                            i = t.criteria;
                        if (n !== i) { if (n > i || void 0 === n) return 1; if (i > n || void 0 === i) return -1 }
                        return e.index - t.index
                    }), "value")
                };
            var D = function(e) {
                return function(t, n, i) {
                    var r = {};
                    return n = x(n, i), b.each(t, function(i, o) {
                        var s = n(i, o, t);
                        e(r, i, s)
                    }), r
                }
            };
            b.groupBy = D(function(e, t, n) { b.has(e, n) ? e[n].push(t) : e[n] = [t] }), b.indexBy = D(function(e, t, n) { e[n] = t }), b.countBy = D(function(e, t, n) { b.has(e, n) ? e[n]++ : e[n] = 1 }), b.toArray = function(e) { return e ? b.isArray(e) ? f.call(e) : O(e) ? b.map(e, b.identity) : b.values(e) : [] }, b.size = function(e) { return null == e ? 0 : O(e) ? e.length : b.keys(e).length }, b.partition = function(e, t, n) {
                t = x(t, n);
                var i = [],
                    r = [];
                return b.each(e, function(e, n, o) {
                    (t(e, n, o) ? i : r).push(e)
                }), [i, r]
            }, b.first = b.head = b.take = function(e, t, n) { return null == e ? void 0 : null == t || n ? e[0] : b.initial(e, e.length - t) }, b.initial = function(e, t, n) { return f.call(e, 0, Math.max(0, e.length - (null == t || n ? 1 : t))) }, b.last = function(e, t, n) { return null == e ? void 0 : null == t || n ? e[e.length - 1] : b.rest(e, Math.max(0, e.length - t)) }, b.rest = b.tail = b.drop = function(e, t, n) { return f.call(e, null == t || n ? 1 : t) }, b.compact = function(e) { return b.filter(e, b.identity) };
            var S = function(e, t, n, i) {
                for (var r = [], o = 0, s = i || 0, a = j(e); a > s; s++) {
                    var c = e[s];
                    if (O(c) && (b.isArray(c) || b.isArguments(c))) {
                        t || (c = S(c, t, n));
                        var u = 0,
                            l = c.length;
                        for (r.length += l; l > u;) r[o++] = c[u++]
                    } else n || (r[o++] = c)
                }
                return r
            };
            b.flatten = function(e, t) { return S(e, t, !1) }, b.without = function(e) { return b.difference(e, f.call(arguments, 1)) }, b.uniq = b.unique = function(e, t, n, i) {
                b.isBoolean(t) || (i = n, n = t, t = !1), null != n && (n = x(n, i));
                for (var r = [], o = [], s = 0, a = j(e); a > s; s++) {
                    var c = e[s],
                        u = n ? n(c, s, e) : c;
                    t ? (s && o === u || r.push(c), o = u) : n ? b.contains(o, u) || (o.push(u), r.push(c)) : b.contains(r, c) || r.push(c)
                }
                return r
            }, b.union = function() { return b.uniq(S(arguments, !0, !0)) }, b.intersection = function(e) {
                for (var t = [], n = arguments.length, i = 0, r = j(e); r > i; i++) {
                    var o = e[i];
                    if (!b.contains(t, o)) {
                        for (var s = 1; n > s && b.contains(arguments[s], o); s++);
                        s === n && t.push(o)
                    }
                }
                return t
            }, b.difference = function(e) { var t = S(arguments, !0, !0, 1); return b.filter(e, function(e) { return !b.contains(t, e) }) }, b.zip = function() { return b.unzip(arguments) }, b.unzip = function(e) { for (var t = e && b.max(e, j).length || 0, n = Array(t), i = 0; t > i; i++) n[i] = b.pluck(e, i); return n }, b.object = function(e, t) { for (var n = {}, i = 0, r = j(e); r > i; i++) t ? n[e[i]] = t[i] : n[e[i][0]] = e[i][1]; return n }, b.findIndex = i(1), b.findLastIndex = i(-1), b.sortedIndex = function(e, t, n, i) {
                n = x(n, i, 1);
                for (var r = n(t), o = 0, s = j(e); s > o;) {
                    var a = Math.floor((o + s) / 2);
                    n(e[a]) < r ? o = a + 1 : s = a
                }
                return o
            }, b.indexOf = r(1, b.findIndex, b.sortedIndex), b.lastIndexOf = r(-1, b.findLastIndex), b.range = function(e, t, n) { null == t && (t = e || 0, e = 0), n = n || 1; for (var i = Math.max(Math.ceil((t - e) / n), 0), r = Array(i), o = 0; i > o; o++, e += n) r[o] = e; return r };
            var P = function(e, t, n, i, r) {
                if (!(i instanceof t)) return e.apply(n, r);
                var o = T(e.prototype),
                    s = e.apply(o, r);
                return b.isObject(s) ? s : o
            };
            b.bind = function(e, t) {
                if (g && e.bind === g) return g.apply(e, f.call(arguments, 1));
                if (!b.isFunction(e)) throw new TypeError("Bind must be called on a function");
                var n = f.call(arguments, 2),
                    i = function() { return P(e, i, t, this, n.concat(f.call(arguments))) };
                return i
            }, b.partial = function(e) {
                var t = f.call(arguments, 1),
                    n = function() { for (var i = 0, r = t.length, o = Array(r), s = 0; r > s; s++) o[s] = t[s] === b ? arguments[i++] : t[s]; for (; i < arguments.length;) o.push(arguments[i++]); return P(e, n, this, this, o) };
                return n
            }, b.bindAll = function(e) { var t, n, i = arguments.length; if (1 >= i) throw new Error("bindAll must be passed function names"); for (t = 1; i > t; t++) n = arguments[t], e[n] = b.bind(e[n], e); return e }, b.memoize = function(e, t) {
                var n = function(i) {
                    var r = n.cache,
                        o = "" + (t ? t.apply(this, arguments) : i);
                    return b.has(r, o) || (r[o] = e.apply(this, arguments)), r[o]
                };
                return n.cache = {}, n
            }, b.delay = function(e, t) { var n = f.call(arguments, 2); return setTimeout(function() { return e.apply(null, n) }, t) }, b.defer = b.partial(b.delay, b, 1), b.throttle = function(e, t, n) {
                var i, r, o, s = null,
                    a = 0;
                n || (n = {});
                var c = function() { a = n.leading === !1 ? 0 : b.now(), s = null, o = e.apply(i, r), s || (i = r = null) };
                return function() {
                    var u = b.now();
                    a || n.leading !== !1 || (a = u);
                    var l = t - (u - a);
                    return i = this, r = arguments, 0 >= l || l > t ? (s && (clearTimeout(s), s = null), a = u, o = e.apply(i, r), s || (i = r = null)) : s || n.trailing === !1 || (s = setTimeout(c, l)), o
                }
            }, b.debounce = function(e, t, n) {
                var i, r, o, s, a, c = function() {
                    var u = b.now() - s;
                    t > u && u >= 0 ? i = setTimeout(c, t - u) : (i = null, n || (a = e.apply(o, r), i || (o = r = null)))
                };
                return function() { o = this, r = arguments, s = b.now(); var u = n && !i; return i || (i = setTimeout(c, t)), u && (a = e.apply(o, r), o = r = null), a }
            }, b.wrap = function(e, t) { return b.partial(t, e) }, b.negate = function(e) { return function() { return !e.apply(this, arguments) } }, b.compose = function() {
                var e = arguments,
                    t = e.length - 1;
                return function() { for (var n = t, i = e[t].apply(this, arguments); n--;) i = e[n].call(this, i); return i }
            }, b.after = function(e, t) { return function() { return --e < 1 ? t.apply(this, arguments) : void 0 } }, b.before = function(e, t) { var n; return function() { return --e > 0 && (n = t.apply(this, arguments)), 1 >= e && (t = null), n } }, b.once = b.partial(b.before, 2);
            var k = !{ toString: null }.propertyIsEnumerable("toString"),
                R = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
            b.keys = function(e) { if (!b.isObject(e)) return []; if (v) return v(e); var t = []; for (var n in e) b.has(e, n) && t.push(n); return k && o(e, t), t }, b.allKeys = function(e) { if (!b.isObject(e)) return []; var t = []; for (var n in e) t.push(n); return k && o(e, t), t }, b.values = function(e) { for (var t = b.keys(e), n = t.length, i = Array(n), r = 0; n > r; r++) i[r] = e[t[r]]; return i }, b.mapObject = function(e, t, n) { t = x(t, n); for (var i, r = b.keys(e), o = r.length, s = {}, a = 0; o > a; a++) i = r[a], s[i] = t(e[i], i, e); return s }, b.pairs = function(e) { for (var t = b.keys(e), n = t.length, i = Array(n), r = 0; n > r; r++) i[r] = [t[r], e[t[r]]]; return i }, b.invert = function(e) { for (var t = {}, n = b.keys(e), i = 0, r = n.length; r > i; i++) t[e[n[i]]] = n[i]; return t }, b.functions = b.methods = function(e) { var t = []; for (var n in e) b.isFunction(e[n]) && t.push(n); return t.sort() }, b.extend = C(b.allKeys), b.extendOwn = b.assign = C(b.keys), b.findKey = function(e, t, n) {
                t = x(t, n);
                for (var i, r = b.keys(e), o = 0, s = r.length; s > o; o++)
                    if (i = r[o], t(e[i], i, e)) return i
            }, b.pick = function(e, t, n) {
                var i, r, o = {},
                    s = e;
                if (null == s) return o;
                b.isFunction(t) ? (r = b.allKeys(s), i = w(t, n)) : (r = S(arguments, !1, !1, 1), i = function(e, t, n) { return t in n }, s = Object(s));
                for (var a = 0, c = r.length; c > a; a++) {
                    var u = r[a],
                        l = s[u];
                    i(l, u, s) && (o[u] = l)
                }
                return o
            }, b.omit = function(e, t, n) {
                if (b.isFunction(t)) t = b.negate(t);
                else {
                    var i = b.map(S(arguments, !1, !1, 1), String);
                    t = function(e, t) { return !b.contains(i, t) }
                }
                return b.pick(e, t, n)
            }, b.defaults = C(b.allKeys, !0), b.create = function(e, t) { var n = T(e); return t && b.extendOwn(n, t), n }, b.clone = function(e) { return b.isObject(e) ? b.isArray(e) ? e.slice() : b.extend({}, e) : e }, b.tap = function(e, t) { return t(e), e }, b.isMatch = function(e, t) {
                var n = b.keys(t),
                    i = n.length;
                if (null == e) return !i;
                for (var r = Object(e), o = 0; i > o; o++) { var s = n[o]; if (t[s] !== r[s] || !(s in r)) return !1 }
                return !0
            };
            var M = function(e, t, n, i) {
                if (e === t) return 0 !== e || 1 / e === 1 / t;
                if (null == e || null == t) return e === t;
                e instanceof b && (e = e._wrapped), t instanceof b && (t = t._wrapped);
                var r = h.call(e);
                if (r !== h.call(t)) return !1;
                switch (r) {
                    case "[object RegExp]":
                    case "[object String]":
                        return "" + e == "" + t;
                    case "[object Number]":
                        return +e !== +e ? +t !== +t : 0 === +e ? 1 / +e === 1 / t : +e === +t;
                    case "[object Date]":
                    case "[object Boolean]":
                        return +e === +t
                }
                var o = "[object Array]" === r;
                if (!o) {
                    if ("object" != typeof e || "object" != typeof t) return !1;
                    var s = e.constructor,
                        a = t.constructor;
                    if (s !== a && !(b.isFunction(s) && s instanceof s && b.isFunction(a) && a instanceof a) && "constructor" in e && "constructor" in t) return !1
                }
                n = n || [], i = i || [];
                for (var c = n.length; c--;)
                    if (n[c] === e) return i[c] === t;
                if (n.push(e), i.push(t), o) {
                    if (c = e.length, c !== t.length) return !1;
                    for (; c--;)
                        if (!M(e[c], t[c], n, i)) return !1
                } else {
                    var u, l = b.keys(e);
                    if (c = l.length, b.keys(t).length !== c) return !1;
                    for (; c--;)
                        if (u = l[c], !b.has(t, u) || !M(e[u], t[u], n, i)) return !1
                }
                return n.pop(), i.pop(), !0
            };
            b.isEqual = function(e, t) { return M(e, t) }, b.isEmpty = function(e) { return null == e ? !0 : O(e) && (b.isArray(e) || b.isString(e) || b.isArguments(e)) ? 0 === e.length : 0 === b.keys(e).length }, b.isElement = function(e) { return !(!e || 1 !== e.nodeType) }, b.isArray = m || function(e) { return "[object Array]" === h.call(e) }, b.isObject = function(e) { var t = typeof e; return "function" === t || "object" === t && !!e }, b.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function(e) { b["is" + e] = function(t) { return h.call(t) === "[object " + e + "]" } }), b.isArguments(arguments) || (b.isArguments = function(e) { return b.has(e, "callee") }), "function" != typeof /./ && "object" != typeof Int8Array && (b.isFunction = function(e) { return "function" == typeof e || !1 }), b.isFinite = function(e) { return isFinite(e) && !isNaN(parseFloat(e)) }, b.isNaN = function(e) { return b.isNumber(e) && e !== +e }, b.isBoolean = function(e) { return e === !0 || e === !1 || "[object Boolean]" === h.call(e) }, b.isNull = function(e) { return null === e }, b.isUndefined = function(e) { return void 0 === e }, b.has = function(e, t) { return null != e && p.call(e, t) }, b.noConflict = function() { return s._ = a, this }, b.identity = function(e) { return e }, b.constant = function(e) { return function() { return e } }, b.noop = function() {}, b.property = N, b.propertyOf = function(e) { return null == e ? function() {} : function(t) { return e[t] } }, b.matcher = b.matches = function(e) {
                return e = b.extendOwn({}, e),
                    function(t) { return b.isMatch(t, e) }
            }, b.times = function(e, t, n) {
                var i = Array(Math.max(0, e));
                t = w(t, n, 1);
                for (var r = 0; e > r; r++) i[r] = t(r);
                return i
            }, b.random = function(e, t) { return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1)) }, b.now = Date.now || function() { return (new Date).getTime() };
            var A = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" },
                I = b.invert(A),
                L = function(e) {
                    var t = function(t) { return e[t] },
                        n = "(?:" + b.keys(e).join("|") + ")",
                        i = RegExp(n),
                        r = RegExp(n, "g");
                    return function(e) { return e = null == e ? "" : "" + e, i.test(e) ? e.replace(r, t) : e }
                };
            b.escape = L(A), b.unescape = L(I), b.result = function(e, t, n) { var i = null == e ? void 0 : e[t]; return void 0 === i && (i = n), b.isFunction(i) ? i.call(e) : i };
            var F = 0;
            b.uniqueId = function(e) { var t = ++F + ""; return e ? e + t : t }, b.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g };
            var U = /(.)^/,
                G = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "\u2028": "u2028", "\u2029": "u2029" },
                W = /\\|'|\r|\n|\u2028|\u2029/g,
                V = function(e) { return "\\" + G[e] };
            b.template = function(e, t, n) {
                !t && n && (t = n), t = b.defaults({}, t, b.templateSettings);
                var i = RegExp([(t.escape || U).source, (t.interpolate || U).source, (t.evaluate || U).source].join("|") + "|$", "g"),
                    r = 0,
                    o = "__p+='";
                e.replace(i, function(t, n, i, s, a) { return o += e.slice(r, a).replace(W, V), r = a + t.length, n ? o += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : i ? o += "'+\n((__t=(" + i + "))==null?'':__t)+\n'" : s && (o += "';\n" + s + "\n__p+='"), t }), o += "';\n", t.variable || (o = "with(obj||{}){\n" + o + "}\n"), o = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + o + "return __p;\n";
                try { var s = new Function(t.variable || "obj", "_", o) } catch (a) { throw a.source = o, a }
                var c = function(e) { return s.call(this, e, b) },
                    u = t.variable || "obj";
                return c.source = "function(" + u + "){\n" + o + "}", c
            }, b.chain = function(e) { var t = b(e); return t._chain = !0, t };
            var q = function(e, t) { return e._chain ? b(t).chain() : t };
            b.mixin = function(e) {
                b.each(b.functions(e), function(t) {
                    var n = b[t] = e[t];
                    b.prototype[t] = function() { var e = [this._wrapped]; return d.apply(e, arguments), q(this, n.apply(b, e)) }
                })
            }, b.mixin(b), b.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(e) {
                var t = c[e];
                b.prototype[e] = function() { var n = this._wrapped; return t.apply(n, arguments), "shift" !== e && "splice" !== e || 0 !== n.length || delete n[0], q(this, n) }
            }), b.each(["concat", "join", "slice"], function(e) {
                var t = c[e];
                b.prototype[e] = function() { return q(this, t.apply(this._wrapped, arguments)) }
            }), b.prototype.value = function() { return this._wrapped }, b.prototype.valueOf = b.prototype.toJSON = b.prototype.value, b.prototype.toString = function() { return "" + this._wrapped }, "function" == typeof define && define.amd && define("underscore", [], function() { return b })
        }).call(this)
    }, {}],
    26: [function(e, t, n) {
        t.exports = "function" == typeof Object.create ? function(e, t) { e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }) } : function(e, t) {
            e.super_ = t;
            var n = function() {};
            n.prototype = t.prototype, e.prototype = new n, e.prototype.constructor = e
        }
    }, {}],
    27: [function(e, t, n) { t.exports = function(e) { return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8 } }, {}],
    28: [function(e, t, n) {
        (function(t, i) {
            function r(e, t) { var i = { seen: [], stylize: s }; return arguments.length >= 3 && (i.depth = arguments[2]), arguments.length >= 4 && (i.colors = arguments[3]), m(t) ? i.showHidden = t : t && n._extend(i, t), w(i.showHidden) && (i.showHidden = !1), w(i.depth) && (i.depth = 2), w(i.colors) && (i.colors = !1), w(i.customInspect) && (i.customInspect = !0), i.colors && (i.stylize = o), c(i, e, i.depth) }

            function o(e, t) { var n = r.styles[t]; return n ? "[" + r.colors[n][0] + "m" + e + "[" + r.colors[n][1] + "m" : e }

            function s(e, t) { return e }

            function a(e) { var t = {}; return e.forEach(function(e, n) { t[e] = !0 }), t }

            function c(e, t, i) {
                if (e.customInspect && t && E(t.inspect) && t.inspect !== n.inspect && (!t.constructor || t.constructor.prototype !== t)) { var r = t.inspect(i, e); return _(r) || (r = c(e, r, i)), r }
                var o = u(e, t);
                if (o) return o;
                var s = Object.keys(t),
                    m = a(s);
                if (e.showHidden && (s = Object.getOwnPropertyNames(t)), N(t) && (s.indexOf("message") >= 0 || s.indexOf("description") >= 0)) return l(t);
                if (0 === s.length) { if (E(t)) { var v = t.name ? ": " + t.name : ""; return e.stylize("[Function" + v + "]", "special") } if (x(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp"); if (T(t)) return e.stylize(Date.prototype.toString.call(t), "date"); if (N(t)) return l(t) }
                var g = "",
                    y = !1,
                    b = ["{", "}"];
                if (p(t) && (y = !0, b = ["[", "]"]), E(t)) {
                    var w = t.name ? ": " + t.name : "";
                    g = " [Function" + w + "]"
                }
                if (x(t) && (g = " " + RegExp.prototype.toString.call(t)), T(t) && (g = " " + Date.prototype.toUTCString.call(t)), N(t) && (g = " " + l(t)), 0 === s.length && (!y || 0 == t.length)) return b[0] + g + b[1];
                if (0 > i) return x(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special");
                e.seen.push(t);
                var C;
                return C = y ? d(e, t, i, m, s) : s.map(function(n) { return f(e, t, i, m, n, y) }), e.seen.pop(), h(C, g, b)
            }

            function u(e, t) { if (w(t)) return e.stylize("undefined", "undefined"); if (_(t)) { var n = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'"; return e.stylize(n, "string") } return y(t) ? e.stylize("" + t, "number") : m(t) ? e.stylize("" + t, "boolean") : v(t) ? e.stylize("null", "null") : void 0 }

            function l(e) { return "[" + Error.prototype.toString.call(e) + "]" }

            function d(e, t, n, i, r) { for (var o = [], s = 0, a = t.length; a > s; ++s) o.push(P(t, String(s)) ? f(e, t, n, i, String(s), !0) : ""); return r.forEach(function(r) { r.match(/^\d+$/) || o.push(f(e, t, n, i, r, !0)) }), o }

            function f(e, t, n, i, r, o) {
                var s, a, u;
                if (u = Object.getOwnPropertyDescriptor(t, r) || { value: t[r] }, u.get ? a = u.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : u.set && (a = e.stylize("[Setter]", "special")), P(i, r) || (s = "[" + r + "]"), a || (e.seen.indexOf(u.value) < 0 ? (a = v(n) ? c(e, u.value, null) : c(e, u.value, n - 1), a.indexOf("\n") > -1 && (a = o ? a.split("\n").map(function(e) { return "  " + e }).join("\n").substr(2) : "\n" + a.split("\n").map(function(e) { return "   " + e }).join("\n"))) : a = e.stylize("[Circular]", "special")), w(s)) {
                    if (o && r.match(/^\d+$/)) return a;
                    s = JSON.stringify("" + r), s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), s = e.stylize(s, "string"))
                }
                return s + ": " + a
            }

            function h(e, t, n) {
                var i = 0,
                    r = e.reduce(function(e, t) { return i++, t.indexOf("\n") >= 0 && i++, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1 }, 0);
                return r > 60 ? n[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + n[1] : n[0] + t + " " + e.join(", ") + " " + n[1]
            }

            function p(e) { return Array.isArray(e) }

            function m(e) { return "boolean" == typeof e }

            function v(e) { return null === e }

            function g(e) { return null == e }

            function y(e) { return "number" == typeof e }

            function _(e) { return "string" == typeof e }

            function b(e) { return "symbol" == typeof e }

            function w(e) { return void 0 === e }

            function x(e) { return C(e) && "[object RegExp]" === O(e) }

            function C(e) { return "object" == typeof e && null !== e }

            function T(e) { return C(e) && "[object Date]" === O(e) }

            function N(e) { return C(e) && ("[object Error]" === O(e) || e instanceof Error) }

            function E(e) { return "function" == typeof e }

            function j(e) { return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e }

            function O(e) { return Object.prototype.toString.call(e) }

            function D(e) { return 10 > e ? "0" + e.toString(10) : e.toString(10) }

            function S() {
                var e = new Date,
                    t = [D(e.getHours()), D(e.getMinutes()), D(e.getSeconds())].join(":");
                return [e.getDate(), A[e.getMonth()], t].join(" ")
            }

            function P(e, t) { return Object.prototype.hasOwnProperty.call(e, t) }
            var k = /%[sdj%]/g;
            n.format = function(e) {
                if (!_(e)) { for (var t = [], n = 0; n < arguments.length; n++) t.push(r(arguments[n])); return t.join(" ") }
                for (var n = 1, i = arguments, o = i.length, s = String(e).replace(k, function(e) {
                        if ("%%" === e) return "%";
                        if (n >= o) return e;
                        switch (e) {
                            case "%s":
                                return String(i[n++]);
                            case "%d":
                                return Number(i[n++]);
                            case "%j":
                                try { return JSON.stringify(i[n++]) } catch (t) { return "[Circular]" }
                            default:
                                return e
                        }
                    }), a = i[n]; o > n; a = i[++n]) s += v(a) || !C(a) ? " " + a : " " + r(a);
                return s
            }, n.deprecate = function(e, r) {
                function o() {
                    if (!s) {
                        if (t.throwDeprecation) throw new Error(r);
                        t.traceDeprecation ? console.trace(r) : console.error(r), s = !0
                    }
                    return e.apply(this, arguments)
                }
                if (w(i.process)) return function() { return n.deprecate(e, r).apply(this, arguments) };
                if (t.noDeprecation === !0) return e;
                var s = !1;
                return o
            };
            var R, M = {};
            n.debuglog = function(e) {
                if (w(R) && (R = t.env.NODE_DEBUG || ""), e = e.toUpperCase(), !M[e])
                    if (new RegExp("\\b" + e + "\\b", "i").test(R)) {
                        var i = t.pid;
                        M[e] = function() {
                            var t = n.format.apply(n, arguments);
                            console.error("%s %d: %s", e, i, t)
                        }
                    } else M[e] = function() {};
                return M[e]
            }, n.inspect = r, r.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, r.styles = { special: "cyan", number: "yellow", "boolean": "yellow", undefined: "grey", "null": "bold", string: "green", date: "magenta", regexp: "red" }, n.isArray = p, n.isBoolean = m, n.isNull = v, n.isNullOrUndefined = g, n.isNumber = y, n.isString = _, n.isSymbol = b, n.isUndefined = w, n.isRegExp = x, n.isObject = C, n.isDate = T, n.isError = N, n.isFunction = E, n.isPrimitive = j, n.isBuffer = e("./support/isBuffer");
            var A = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            n.log = function() { console.log("%s - %s", S(), n.format.apply(n, arguments)) }, n.inherits = e("inherits"), n._extend = function(e, t) { if (!t || !C(t)) return e; for (var n = Object.keys(t), i = n.length; i--;) e[n[i]] = t[n[i]]; return e }
        }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, { "./support/isBuffer": 27, _process: 23, inherits: 26 }],
    29: [function(e, t, n) {
        var i = e("./lib/WAAClock");
        t.exports = i, "undefined" != typeof window && (window.WAAClock = i)
    }, { "./lib/WAAClock": 30 }],
    30: [function(e, t, n) {
        (function(e) {
            var n = ("undefined" != typeof window, { toleranceLate: .1, toleranceEarly: .001 }),
                i = function(e, t, n) { this.clock = e, this.func = n, this._cleared = !1, this.toleranceLate = e.toleranceLate, this.toleranceEarly = e.toleranceEarly, this._latestTime = null, this._earliestTime = null, this.deadline = null, this.repeatTime = null, this.schedule(t) };
            i.prototype.clear = function() { return this.clock._removeEvent(this), this._cleared = !0, this }, i.prototype.repeat = function(e) { if (0 === e) throw new Error("delay cannot be 0"); return this.repeatTime = e, this.clock._hasEvent(this) || this.schedule(this.deadline + this.repeatTime), this }, i.prototype.tolerance = function(e) { return "number" == typeof e.late && (this.toleranceLate = e.late), "number" == typeof e.early && (this.toleranceEarly = e.early), this._refreshEarlyLateDates(), this.clock._hasEvent(this) && (this.clock._removeEvent(this), this.clock._insertEvent(this)), this }, i.prototype.isRepeated = function() { return null !== this.repeatTime }, i.prototype.schedule = function(e) { this._cleared = !1, this.deadline = e, this._refreshEarlyLateDates(), this.clock.context.currentTime >= this._earliestTime ? this._execute() : this.clock._hasEvent(this) ? (this.clock._removeEvent(this), this.clock._insertEvent(this)) : this.clock._insertEvent(this) }, i.prototype.timeStretch = function(e, t) {
                this.isRepeated() && (this.repeatTime = this.repeatTime * t);
                var n = e + t * (this.deadline - e);
                if (this.isRepeated())
                    for (; this.clock.context.currentTime >= n - this.toleranceEarly;) n += this.repeatTime;
                this.schedule(n)
            }, i.prototype._execute = function() { this.clock._started !== !1 && (this.clock._removeEvent(this), this.clock.context.currentTime < this._latestTime ? this.func(this) : (this.onexpired && this.onexpired(this), console.warn("event expired")), this.clock._hasEvent(this) || !this.isRepeated() || this._cleared || this.schedule(this.deadline + this.repeatTime)) }, i.prototype._refreshEarlyLateDates = function() { this._latestTime = this.deadline + this.toleranceLate, this._earliestTime = this.deadline - this.toleranceEarly };
            var r = t.exports = function(e, t) { t = t || {}, this.tickMethod = t.tickMethod || "ScriptProcessorNode", this.toleranceEarly = t.toleranceEarly || n.toleranceEarly, this.toleranceLate = t.toleranceLate || n.toleranceLate, this.context = e, this._events = [], this._started = !1 };
            r.prototype.setTimeout = function(e, t) { return this._createEvent(e, this._absTime(t)) }, r.prototype.callbackAtTime = function(e, t) { return this._createEvent(e, t) }, r.prototype.timeStretch = function(e, t, n) { return t.forEach(function(t) { t.timeStretch(e, n) }), t }, r.prototype.start = function() {
                if (this._started === !1) {
                    var t = this;
                    if (this._started = !0, this._events = [], "ScriptProcessorNode" === this.tickMethod) {
                        var n = 256;
                        this._clockNode = this.context.createScriptProcessor(n, 1, 1), this._clockNode.connect(this.context.destination), this._clockNode.onaudioprocess = function() { e.nextTick(function() { t._tick() }) }
                    } else if ("manual" !== this.tickMethod) throw new Error("invalid tickMethod " + this.tickMethod)
                }
            }, r.prototype.stop = function() { this._started === !0 && (this._started = !1, this._clockNode.disconnect()) }, r.prototype._tick = function() {
                for (var e = this._events.shift(); e && e._earliestTime <= this.context.currentTime;) e._execute(), e = this._events.shift();
                e && this._events.unshift(e)
            }, r.prototype._createEvent = function(e, t) { return new i(this, t, e) }, r.prototype._insertEvent = function(e) { this._events.splice(this._indexByTime(e._earliestTime), 0, e) }, r.prototype._removeEvent = function(e) { var t = this._events.indexOf(e); - 1 !== t && this._events.splice(t, 1) }, r.prototype._hasEvent = function(e) { return -1 !== this._events.indexOf(e) }, r.prototype._indexByTime = function(e) { for (var t, n = 0, i = this._events.length; i > n;) t = Math.floor((n + i) / 2), this._events[t]._earliestTime < e ? n = t + 1 : i = t; return n }, r.prototype._absTime = function(e) { return e + this.context.currentTime }, r.prototype._relTime = function(e) { return e - this.context.currentTime }
        }).call(this, e("_process"))
    }, { _process: 23 }],
    31: [function(e, t, n) {
        var i = e("./lib/WAAOffsetNode");
        t.exports = i, "undefined" != typeof window && (window.WAAOffsetNode = i)
    }, { "./lib/WAAOffsetNode": 32 }],
    32: [function(e, t, n) {
        var i = t.exports = function(e) {
            if (this.context = e, this._ones = i._ones.filter(function(t) { return t.context === e })[0], this._ones) this._ones = this._ones.ones;
            else {
                var t, n = e.createBuffer(1, 1024, e.sampleRate),
                    r = n.getChannelData(0);
                for (t = 0; t < n.length; t++) r[t] = 1;
                this._ones = e.createBufferSource(), this._ones.buffer = n, this._ones.loop = !0, this._ones.start(0), i._ones.push({ context: e, ones: this._ones })
            }
            this._output = e.createGain(), this._ones.connect(this._output), this.offset = this._output.gain, this.offset.value = 0
        };
        i.prototype.connect = function() { this._output.connect.apply(this._output, arguments) }, i.prototype.disconnect = function() { this._output.disconnect.apply(this._output, arguments) }, i._ones = []
    }, {}],
    33: [function(e, t, n) {
        var i = e("./lib/WAATableNode");
        t.exports = i, "undefined" != typeof window && (window.WAATableNode = i)
    }, { "./lib/WAATableNode": 34 }],
    34: [function(e, t, n) {
        var i = e("waaoffsetnode"),
            r = t.exports = function(e) { this.context = e, this._output = e.createWaveShaper(), this._positionNode = new i(e), this._positionNode.connect(this._output), this._positionNode.offset.value = -1, this.position = e.createGain(), this.position.connect(this._positionNode.offset), this.position.gain.value = 0, this._table = null, Object.defineProperty(this, "table", { get: function() { return this._table }, set: function(e) { this._setTable(e) } }) };
        r.prototype.connect = function() { this._output.connect.apply(this._output, arguments) }, r.prototype.disconnect = function() { this._output.disconnect.apply(this._output, arguments) }, r.prototype._setTable = function(e) { e instanceof AudioBuffer && (e = e.getChannelData(0)), this._table = e, null !== e && (this._output.curve = e, this.position.gain.setValueAtTime(2 / (e.length - 1), 0)) }
    }, { waaoffsetnode: 31 }],
    35: [function(e, t, n) {
        var i = e("./lib/WAAWhiteNoiseNode");
        t.exports = i, "undefined" != typeof window && (window.WAAWhiteNoiseNode = i)
    }, { "./lib/WAAWhiteNoiseNode": 36 }],
    36: [function(e, t, n) {
        var i = t.exports = function(e) {
            this.context = e, this._buffer = e.createBuffer(1, 131072, e.sampleRate);
            var t, n = this._buffer.getChannelData(0);
            for (t = 0; 131072 > t; t++) n[t] = 2 * Math.random() - 1;
            this._prepareOutput()
        };
        i.prototype.connect = function() { this._output.connect.apply(this._output, arguments) }, i.prototype.disconnect = function() { this._output.disconnect.apply(this._output, arguments) }, i.prototype.start = function() { this._output.start.apply(this._output, arguments) }, i.prototype.stop = function() { this._output.stop.apply(this._output, arguments), this._prepareOutput() }, i.prototype._prepareOutput = function() { this._output = this.context.createBufferSource(), this._output.buffer = this._buffer, this._output.loop = !0 }
    }, {}],
    37: [function(e, t, n) {
        var i = e("./lib/WAAWire");
        t.exports = i, "undefined" != typeof window && (window.WAAWire = i)
    }, { "./lib/WAAWire": 38 }],
    38: [function(e, t, n) {
        var i = t.exports = function(e) { this.context = e, this._source = null, this._output = null, this._destination = null, this._input = null, this._gainNode = null, this._discardedGainNode = null, this._atTime = 0, this._closed = !1 },
            r = function(e) { return function() { return this._clean(), this[e].apply(this, [this._atTime].concat([].slice.call(arguments, 0))), this._atTime = 0, this } };
        i.prototype.connect = r("_connect"), i.prototype.swapSource = r("_swapSource"), i.prototype.swapDestination = r("_swapDestination"), i.prototype.close = r("_close"), i.prototype.atTime = function(e) { return this._atTime = e, this }, i.prototype._connect = function(e, t, n, i, r) {
            if (this._gainNode) throw new Error("Wire already connected");
            this._source = t, this._destination = n, this._output = i || 0, this._input = r || 0, this._doConnections(e)
        }, i.prototype._swapSource = function(e, t, n) { this._discardedGainNode = this._gainNode, this._discardedGainNode.gain.setValueAtTime(0, e), this._source = t, this._output = n || 0, this._doConnections(e) }, i.prototype._swapDestination = function(e, t, n) { this._discardedGainNode = this._gainNode, this._discardedGainNode.gain.setValueAtTime(0, e), this._destination = t, this._input = n || 0, this._doConnections(e) }, i.prototype._close = function(e) {
            if (this._closed === !0) throw new Error("Wire already closed");
            this._discardedGainNode = this._gainNode, this._gainNode.gain.setValueAtTime(0, e), this._gainNode = null, this._closed = !0
        }, i.prototype._doConnections = function(e) {
            var t = this.context.createGain();
            t.gain.setValueAtTime(0, 0), t.gain.setValueAtTime(1, e), this._gainNode = t, this._source.connect(t, this._output), this._destination instanceof AudioParam ? t.connect(this._destination, 0) : t.connect(this._destination, 0, this._input)
        }, i.prototype._clean = function() { this._discardedGainNode && 0 === this._discardedGainNode.gain.value && (this._discardedGainNode.disconnect(), this._discardedGainNode = null) };
        var o = function() {
                if ("undefined" != typeof window && window.OfflineAudioContext) {
                    var e = new OfflineAudioContext(1, 1, 44100),
                        t = e.createBufferSource(),
                        n = e.createGain(),
                        i = e.createBuffer(1, 1, 44100);
                    i.getChannelData(0)[0] = 1, t.buffer = i, t.connect(n), t.connect(e.destination), t.start(0), n.connect(e.destination), t.disconnect(n), e.oncomplete = function(e) { s = !!e.renderedBuffer.getChannelData(0)[0] }, e.startRendering()
                }
            },
            s = null;
        o()
    }, {}],
    39: [function(e, t, n) {
        n.getSupportedFormats = function(e, t) {
            var n, i = {},
                r = [
                    ["aac", new Uint8Array([0, 0, 0, 24, 102, 116, 121, 112, 77, 52, 65, 32, 0, 0, 2, 0, 105, 115, 111, 109, 105, 115, 111, 50, 0, 0, 0, 8, 102, 114, 101, 101, 0, 0, 3, 93, 109, 100, 97, 116, 1, 64, 34, 128, 163, 127, 248, 133, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 46, 113, 10, 90, 90, 90, 90, 90, 94, 0, 236, 54, 3, 231, 18, 80, 133, 232, 214, 84, 106, 106, 112, 144, 0, 160, 86, 186, 248, 8, 77, 40, 148, 132, 190, 44, 194, 179, 249, 112, 251, 198, 129, 155, 252, 134, 158, 189, 223, 0, 121, 254, 124, 149, 129, 175, 15, 224, 43, 184, 108, 98, 143, 111, 215, 183, 140, 62, 191, 144, 169, 248, 142, 74, 40, 162, 138, 45, 248, 226, 20, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 188, 0, 232, 54, 3, 235, 65, 13, 101, 34, 170, 23, 127, 143, 160, 81, 83, 243, 208, 130, 146, 255, 149, 243, 210, 96, 175, 252, 214, 219, 142, 149, 36, 183, 125, 253, 98, 20, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 180, 188, 0, 0, 2, 200, 109, 111, 111, 118, 0, 0, 0, 108, 109, 118, 104, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 232, 0, 0, 0, 57, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 24, 105, 111, 100, 115, 0, 0, 0, 0, 16, 128, 128, 128, 7, 0, 79, 255, 255, 254, 255, 255, 0, 0, 1, 220, 116, 114, 97, 107, 0, 0, 0, 92, 116, 107, 104, 100, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 120, 109, 100, 105, 97, 0, 0, 0, 32, 109, 100, 104, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 172, 68, 0, 0, 9, 185, 85, 196, 0, 0, 0, 0, 0, 45, 104, 100, 108, 114, 0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 111, 117, 110, 100, 72, 97, 110, 100, 108, 101, 114, 0, 0, 0, 1, 35, 109, 105, 110, 102, 0, 0, 0, 16, 115, 109, 104, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 100, 105, 110, 102, 0, 0, 0, 28, 100, 114, 101, 102, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12, 117, 114, 108, 32, 0, 0, 0, 1, 0, 0, 0, 231, 115, 116, 98, 108, 0, 0, 0, 103, 115, 116, 115, 100, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 87, 109, 112, 52, 97, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 16, 0, 0, 0, 0, 172, 68, 0, 0, 0, 0, 0, 51, 101, 115, 100, 115, 0, 0, 0, 0, 3, 128, 128, 128, 34, 0, 1, 0, 4, 128, 128, 128, 20, 64, 21, 0, 0, 0, 0, 1, 126, 208, 0, 0, 0, 0, 5, 128, 128, 128, 2, 18, 8, 6, 128, 128, 128, 1, 2, 0, 0, 0, 32, 115, 116, 116, 115, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 1, 185, 0, 0, 0, 28, 115, 116, 115, 99, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 32, 115, 116, 115, 122, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 28, 0, 0, 1, 28, 0, 0, 1, 29, 0, 0, 0, 28, 115, 116, 99, 111, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 40, 0, 0, 1, 68, 0, 0, 2, 96, 0, 0, 0, 96, 117, 100, 116, 97, 0, 0, 0, 88, 109, 101, 116, 97, 0, 0, 0, 0, 0, 0, 0, 33, 104, 100, 108, 114, 0, 0, 0, 0, 0, 0, 0, 0, 109, 100, 105, 114, 97, 112, 112, 108, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 43, 105, 108, 115, 116, 0, 0, 0, 35, 169, 116, 111, 111, 0, 0, 0, 27, 100, 97, 116, 97, 0, 0, 0, 1, 0, 0, 0, 0, 76, 97, 118, 102, 53, 52, 46, 50, 48, 46, 52])],
                    ["flac", new Uint8Array([102, 76, 97, 67, 0, 0, 0, 34, 16, 0, 16, 0, 0, 0, 171, 0, 0, 171, 10, 196, 64, 240, 0, 0, 1, 185, 27, 166, 171, 233, 194, 158, 49, 164, 33, 152, 91, 74, 182, 36, 144, 11, 132, 0, 0, 40, 32, 0, 0, 0, 114, 101, 102, 101, 114, 101, 110, 99, 101, 32, 108, 105, 98, 70, 76, 65, 67, 32, 49, 46, 51, 46, 48, 32, 50, 48, 49, 51, 48, 53, 50, 54, 0, 0, 0, 0, 255, 248, 121, 8, 0, 1, 184, 85, 64, 255, 255, 181, 198, 216, 2, 90, 82, 105, 37, 226, 162, 49, 114, 146, 210, 81, 81, 48, 140, 150, 46, 38, 36, 203, 74, 98, 178, 98, 213, 21, 138, 139, 41, 36, 197, 75, 69, 212, 90, 85, 84, 178, 212, 165, 84, 89, 76, 41, 38, 74, 92, 90, 168, 173, 104, 154, 148, 170, 37, 147, 34, 215, 19, 41, 41, 45, 44, 94, 35, 37, 139, 202, 147, 34, 203, 73, 84, 132, 211, 34, 210, 85, 41, 105, 42, 209, 75, 146, 136, 209, 37, 210, 150, 148, 180, 169, 82, 202, 164, 178, 85, 88, 140, 68, 101, 197, 73, 146, 84, 149, 44, 148, 77, 37, 40, 185, 37, 137, 149, 21, 22, 82, 165, 43, 42, 38, 86, 138, 169, 38, 46, 38, 19, 42, 73, 74, 138, 85, 34, 228, 197, 74, 138, 150, 89, 82, 149, 146, 171, 21, 172, 87, 37, 85, 82, 164, 166, 88, 172, 90, 203])],
                    ["mp3", new Uint8Array([255, 251, 144, 196, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 105, 110, 103, 0, 0, 0, 15, 0, 0, 0, 2, 0, 0, 4, 123, 0, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 219, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 100, 76, 65, 77, 69, 51, 46, 57, 57, 114, 4, 221, 0, 0, 0, 0, 0, 0, 0, 0, 53, 32, 36, 5, 7, 65, 0, 1, 244, 0, 0, 4, 123, 43, 126, 142, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 251, 176, 196, 0, 3, 7, 114, 55, 16, 64, 0, 81, 201, 111, 72, 35, 140, 1, 15, 172, 0, 14, 15, 232, 222, 141, 253, 8, 223, 243, 255, 255, 255, 255, 255, 255, 255, 250, 50, 228, 33, 62, 254, 191, 158, 69, 59, 231, 122, 19, 32, 24, 183, 66, 100, 38, 167, 66, 16, 144, 128, 4, 32, 66, 43, 206, 119, 66, 0, 19, 228, 33, 25, 78, 0, 0, 0, 32, 120, 128, 0, 205, 34, 12, 161, 89, 10, 86, 161, 149, 218, 180, 219, 43, 178, 219, 68, 50, 145, 65, 62, 109, 202, 71, 179, 33, 145, 216, 174, 85, 33, 217, 202, 65, 234, 149, 234, 99, 127, 186, 127, 254, 139, 255, 236, 254, 135, 204, 86, 118, 161, 84, 138, 229, 229, 97, 249, 153, 17, 225, 99, 235, 205, 186, 209, 14, 53, 134, 214, 93, 7, 35, 32, 226, 157, 43, 9, 176, 139, 102, 143, 74, 254, 104, 12, 150, 157, 194, 140, 100, 226, 21, 76, 65, 77, 69, 51, 46, 57, 57, 46, 53, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 76, 65, 77, 69, 51, 46, 57, 57, 46, 53, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 255, 251, 16, 196, 214, 3, 192, 0, 1, 254, 0, 0, 0, 32, 0, 0, 52, 128, 0, 0, 4, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85])],
                    ["ogg", new Uint8Array([79, 103, 103, 83, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 97, 78, 37, 84, 0, 0, 0, 0, 250, 96, 23, 155, 1, 30, 1, 118, 111, 114, 98, 105, 115, 0, 0, 0, 0, 1, 68, 172, 0, 0, 0, 0, 0, 0, 128, 56, 1, 0, 0, 0, 0, 0, 184, 1, 79, 103, 103, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 78, 37, 84, 1, 0, 0, 0, 252, 115, 240, 255, 14, 64, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 129, 3, 118, 111, 114, 98, 105, 115, 13, 0, 0, 0, 76, 97, 118, 102, 53, 55, 46, 54, 51, 46, 49, 48, 48, 1, 0, 0, 0, 31, 0, 0, 0, 101, 110, 99, 111, 100, 101, 114, 61, 76, 97, 118, 99, 53, 55, 46, 55, 53, 46, 49, 48, 48, 32, 108, 105, 98, 118, 111, 114, 98, 105, 115, 1, 5, 118, 111, 114, 98, 105, 115, 34, 66, 67, 86, 1, 0, 64, 0, 0, 36, 115, 24, 42, 70, 165, 115, 22, 132, 16, 26, 66, 80, 25, 227, 28, 66, 206, 107, 236, 25, 66, 76, 17, 130, 28, 50, 76, 91, 203, 37, 115, 144, 33, 164, 160, 66, 136, 91, 40, 129, 208, 144, 85, 0, 0, 64, 0, 0, 135, 65, 120, 20, 132, 138, 65, 8, 33, 132, 37, 61, 88, 146, 131, 39, 61, 8, 33, 132, 136, 57, 120, 20, 132, 105, 65, 8, 33, 132, 16, 66, 8, 33, 132, 16, 66, 8, 33, 132, 69, 57, 104, 146, 131, 39, 65, 8, 29, 132, 227, 48, 56, 12, 131, 229, 56, 248, 28, 132, 69, 57, 88, 16, 131, 39, 65, 232, 32, 132, 15, 66, 184, 154, 131, 172, 57, 8, 33, 132, 36, 53, 72, 80, 131, 6, 57, 232, 28, 132, 194, 44, 40, 138, 130, 196, 48, 184, 22, 132, 4, 53, 40, 140, 130, 228, 48, 200, 212, 131, 11, 66, 136, 154, 131, 73, 53, 248, 26, 132, 103, 65, 120, 22, 132, 105, 65, 8, 33, 132, 36, 65, 72, 144, 131, 6, 65, 200, 24, 132, 70, 65, 88, 146, 131, 6, 57, 184, 20, 132, 203, 65, 168, 26, 132, 42, 57, 8, 31, 132, 32, 52, 100, 21, 0, 144, 0, 0, 160, 162, 40, 138, 162, 40, 10, 16, 26, 178, 10, 0, 200, 0, 0, 16, 64, 81, 20, 199, 113, 28, 201, 145, 28, 201, 177, 28, 11, 8, 13, 89, 5, 0, 0, 1, 0, 8, 0, 0, 160, 72, 138, 164, 72, 142, 228, 72, 146, 36, 89, 146, 37, 89, 146, 37, 89, 146, 230, 137, 170, 44, 203, 178, 44, 203, 178, 44, 203, 50, 16, 26, 178, 10, 0, 72, 0, 0, 80, 81, 12, 69, 113, 20, 7, 8, 13, 89, 5, 0, 100, 0, 0, 8, 160, 56, 138, 165, 88, 138, 165, 104, 138, 231, 136, 142, 8, 132, 134, 172, 2, 0, 128, 0, 0, 4, 0, 0, 16, 52, 67, 83, 60, 71, 148, 68, 207, 84, 85, 215, 182, 109, 219, 182, 109, 219, 182, 109, 219, 182, 109, 219, 182, 109, 91, 150, 101, 25, 8, 13, 89, 5, 0, 64, 0, 0, 16, 210, 105, 102, 169, 6, 136, 48, 3, 25, 6, 66, 67, 86, 1, 0, 8, 0, 0, 128, 17, 138, 48, 196, 128, 208, 144, 85, 0, 0, 64, 0, 0, 128, 24, 74, 14, 162, 9, 173, 57, 223, 156, 227, 160, 89, 14, 154, 74, 177, 57, 29, 156, 72, 181, 121, 146, 155, 138, 185, 57, 231, 156, 115, 206, 201, 230, 156, 49, 206, 57, 231, 156, 162, 156, 89, 12, 154, 9, 173, 57, 231, 156, 196, 160, 89, 10, 154, 9, 173, 57, 231, 156, 39, 177, 121, 208, 154, 42, 173, 57, 231, 156, 113, 206, 233, 96, 156, 17, 198, 57, 231, 156, 38, 173, 121, 144, 154, 141, 181, 57, 231, 156, 5, 173, 105, 142, 154, 75, 177, 57, 231, 156, 72, 185, 121, 82, 155, 75, 181, 57, 231, 156, 115, 206, 57, 231, 156, 115, 206, 57, 231, 156, 234, 197, 233, 28, 156, 19, 206, 57, 231, 156, 168, 189, 185, 150, 155, 208, 197, 57, 231, 156, 79, 198, 233, 222, 156, 16, 206, 57, 231, 156, 115, 206, 57, 231, 156, 115, 206, 57, 231, 156, 32, 52, 100, 21, 0, 0, 4, 0, 64, 16, 134, 141, 97, 220, 41, 8, 210, 231, 104, 32, 70, 17, 98, 26, 50, 233, 65, 247, 232, 48, 9, 26, 131, 156, 66, 234, 209, 232, 104, 164, 148, 58, 8, 37, 149, 113, 82, 74, 39, 8, 13, 89, 5, 0, 0, 2, 0, 64, 8, 33, 133, 20, 82, 72, 33, 133, 20, 82, 72, 33, 133, 20, 98, 136, 33, 134, 24, 114, 202, 41, 167, 160, 130, 74, 42, 169, 168, 162, 140, 50, 203, 44, 179, 204, 50, 203, 44, 179, 204, 58, 236, 172, 179, 14, 59, 12, 49, 196, 16, 67, 43, 173, 196, 82, 83, 109, 53, 214, 88, 107, 238, 57, 231, 154, 131, 180, 86, 90, 107, 173, 181, 82, 74, 41, 165, 148, 82, 10, 66, 67, 86, 1, 0, 32, 0, 0, 4, 66, 6, 25, 100, 144, 81, 72, 33, 133, 20, 98, 136, 41, 167, 156, 114, 10, 42, 168, 128, 208, 144, 85, 0, 0, 32, 0, 128, 0, 0, 0, 0, 79, 242, 28, 209, 17, 29, 209, 17, 29, 209, 17, 29, 209, 17, 29, 209, 241, 28, 207, 17, 37, 81, 18, 37, 81, 18, 45, 211, 50, 53, 211, 83, 69, 85, 117, 101, 215, 150, 117, 89, 183, 125, 91, 216, 133, 93, 247, 125, 221, 247, 125, 221, 248, 117, 97, 88, 150, 101, 89, 150, 101, 89, 150, 101, 89, 150, 101, 89, 150, 101, 89, 150, 32, 52, 100, 21, 0, 0, 2, 0, 0, 32, 132, 16, 66, 72, 33, 133, 20, 82, 72, 41, 198, 24, 115, 204, 57, 232, 36, 148, 16, 8, 13, 89, 5, 0, 0, 2, 0, 8, 0, 0, 0, 112, 20, 71, 113, 28, 201, 145, 28, 73, 178, 36, 75, 210, 36, 205, 210, 44, 79, 243, 52, 79, 19, 61, 81, 20, 69, 211, 52, 85, 209, 21, 93, 81, 55, 109, 81, 54, 101, 211, 53, 93, 83, 54, 93, 85, 86, 109, 87, 150, 109, 91, 182, 117, 219, 151, 101, 219, 247, 125, 223, 247, 125, 223, 247, 125, 223, 247, 125, 223, 247, 125, 93, 7, 66, 67, 86, 1, 0, 18, 0, 0, 58, 146, 35, 41, 146, 34, 41, 146, 227, 56, 142, 36, 73, 64, 104, 200, 42, 0, 64, 6, 0, 64, 0, 0, 138, 226, 40, 142, 227, 56, 146, 36, 73, 146, 37, 105, 146, 103, 121, 150, 168, 153, 154, 233, 153, 158, 42, 170, 64, 104, 200, 42, 0, 0, 16, 0, 64, 0, 0, 0, 0, 0, 0, 138, 166, 120, 138, 169, 120, 138, 168, 120, 142, 232, 136, 146, 104, 153, 150, 168, 169, 154, 43, 202, 166, 236, 186, 174, 235, 186, 174, 235, 186, 174, 235, 186, 174, 235, 186, 174, 235, 186, 174, 235, 186, 174, 235, 186, 174, 235, 186, 174, 235, 186, 174, 235, 186, 174, 235, 186, 174, 11, 132, 134, 172, 2, 0, 36, 0, 0, 116, 36, 71, 114, 36, 71, 82, 36, 69, 82, 36, 71, 114, 128, 208, 144, 85, 0, 128, 12, 0, 128, 0, 0, 28, 195, 49, 36, 69, 114, 44, 203, 210, 52, 79, 243, 52, 79, 19, 61, 209, 19, 61, 211, 83, 69, 87, 116, 129, 208, 144, 85, 0, 0, 32, 0, 128, 0, 0, 0, 0, 0, 0, 12, 201, 176, 20, 203, 209, 28, 77, 18, 37, 213, 82, 45, 85, 83, 45, 213, 82, 69, 213, 83, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 77, 211, 52, 77, 19, 8, 13, 89, 9, 0, 0, 1, 0, 208, 90, 115, 204, 173, 151, 142, 65, 232, 172, 151, 200, 40, 164, 160, 215, 78, 57, 230, 164, 215, 204, 40, 130, 156, 231, 16, 49, 99, 152, 199, 82, 49, 67, 12, 198, 150, 65, 132, 148, 5, 66, 67, 86, 4, 0, 81, 0, 0, 128, 49, 200, 49, 196, 28, 114, 206, 73, 234, 36, 69, 206, 57, 42, 29, 165, 198, 57, 71, 169, 163, 212, 81, 74, 177, 166, 90, 59, 74, 165, 182, 84, 107, 227, 156, 163, 212, 81, 202, 40, 165, 90, 75, 171, 29, 165, 84, 107, 170, 177, 0, 0, 128, 0, 7, 0, 128, 0, 11, 161, 208, 144, 21, 1, 64, 20, 0, 0, 129, 12, 82, 10, 41, 133, 148, 98, 206, 41, 231, 144, 82, 202, 57, 230, 28, 98, 138, 57, 167, 156, 99, 206, 57, 40, 157, 148, 202, 57, 39, 157, 147, 18, 41, 165, 156, 99, 206, 41, 231, 156, 148, 206, 73, 230, 156, 147, 210, 73, 40, 0, 0, 32, 192, 1, 0, 32, 192, 66, 40, 52, 100, 69, 0, 16, 39, 0, 224, 112, 28, 77, 147, 52, 77, 20, 37, 77, 19, 69, 79, 20, 93, 215, 19, 69, 213, 149, 52, 205, 52, 53, 81, 84, 85, 77, 20, 77, 213, 84, 85, 89, 22, 77, 85, 150, 37, 77, 51, 77, 77, 20, 85, 83, 19, 69, 85, 21, 85, 83, 150, 77, 85, 181, 101, 207, 52, 109, 217, 84, 85, 221, 22, 85, 213, 182, 101, 91, 246, 125, 87, 150, 117, 221, 51, 77, 217, 22, 85, 213, 182, 77, 85, 181, 117, 87, 150, 117, 93, 182, 109, 221, 151, 52, 205, 52, 53, 81, 84, 85, 77, 20, 85, 215, 84, 85, 219, 54, 85, 213, 182, 53, 81, 116, 93, 81, 85, 101, 89, 84, 85, 89, 118, 93, 89, 215, 85, 87, 214, 125, 77, 20, 85, 213, 83, 77, 217, 21, 85, 85, 150, 85, 217, 213, 101, 85, 150, 117, 95, 116, 85, 221, 86, 93, 217, 215, 85, 89, 214, 125, 219, 214, 133, 95, 214, 125, 194, 168, 170, 186, 110, 202, 174, 174, 171, 178, 172, 251, 178, 46, 251, 186, 237, 235, 148, 73, 211, 76, 83, 19, 69, 85, 213, 68, 81, 85, 77, 87, 181, 109, 83, 117, 109, 91, 19, 69, 215, 21, 85, 213, 150, 69, 83, 117, 101, 85, 150, 125, 95, 117, 101, 217, 215, 68, 209, 117, 69, 85, 149, 101, 81, 85, 101, 89, 149, 101, 93, 119, 101, 87, 183, 69, 85, 213, 109, 85, 118, 125, 223, 116, 93, 93, 151, 117, 93, 88, 102, 91, 247, 133, 211, 117, 117, 93, 149, 101, 223, 87, 101, 89, 247, 101, 93, 199, 214, 117, 223, 247, 76, 211, 182, 77, 215, 213, 117, 211, 85, 117, 223, 214, 117, 229, 153, 109, 219, 248, 69, 85, 213, 117, 85, 150, 133, 95, 149, 101, 223, 215, 133, 225, 121, 110, 221, 23, 158, 81, 85, 117, 221, 148, 93, 95, 87, 101, 89, 23, 110, 95, 55, 218, 190, 110, 60, 175, 109, 99, 219, 62, 178, 175, 35, 12, 71, 190, 176, 44, 93, 219, 54, 186, 190, 77, 152, 117, 221, 232, 27, 67, 225, 55, 134, 52, 211, 180, 109, 211, 85, 117, 221, 116, 93, 95, 151, 117, 221, 104, 235, 186, 80, 84, 85, 93, 87, 101, 217, 247, 85, 87, 246, 125, 91, 247, 133, 225, 246, 125, 223, 24, 85, 215, 247, 85, 89, 22, 134, 213, 150, 157, 97, 247, 125, 165, 238, 11, 149, 85, 182, 133, 223, 214, 117, 231, 152, 109, 93, 88, 126, 227, 232, 252, 190, 50, 116, 117, 91, 104, 235, 186, 177, 204, 190, 174, 60, 187, 113, 116, 134, 62, 2, 0, 0, 6, 28, 0, 0, 2, 76, 40, 3, 133, 134, 172, 8, 0, 226, 4, 0, 24, 132, 156, 67, 76, 65, 136, 20, 131, 16, 66, 72, 41, 132, 144, 82, 196, 24, 132, 204, 57, 41, 25, 115, 82, 66, 41, 169, 133, 82, 82, 139, 24, 131, 144, 57, 38, 37, 115, 78, 74, 40, 161, 165, 80, 74, 75, 161, 132, 214, 66, 41, 177, 133, 82, 90, 108, 173, 213, 154, 90, 139, 53, 132, 210, 90, 40, 165, 181, 80, 74, 139, 169, 165, 26, 91, 107, 53, 70, 140, 65, 200, 156, 147, 146, 57, 39, 165, 148, 210, 90, 40, 165, 181, 204, 57, 42, 157, 131, 148, 58, 8, 41, 165, 148, 90, 44, 41, 197, 88, 57, 39, 37, 131, 142, 74, 7, 33, 165, 146, 74, 76, 37, 165, 24, 67, 42, 177, 149, 148, 98, 44, 41, 197, 216, 90, 108, 185, 197, 152, 115, 40, 165, 197, 146, 74, 108, 37, 165, 88, 91, 76, 57, 182, 24, 115, 142, 24, 131, 144, 57, 39, 37, 115, 78, 74, 40, 165, 181, 82, 82, 107, 149, 115, 82, 58, 8, 41, 101, 14, 74, 42, 41, 197, 88, 74, 74, 49, 115, 78, 74, 7, 33, 165, 14, 66, 74, 37, 165, 24, 83, 74, 177, 133, 82, 98, 43, 41, 213, 88, 74, 106, 177, 197, 152, 115, 75, 49, 214, 80, 82, 139, 37, 165, 24, 75, 74, 49, 182, 24, 115, 110, 177, 229, 214, 65, 104, 45, 164, 18, 99, 40, 37, 198, 22, 99, 174, 173, 181, 26, 67, 41, 177, 149, 148, 98, 44, 41, 213, 22, 99, 173, 189, 197, 152, 115, 40, 37, 198, 146, 74, 141, 37, 165, 88, 91, 141, 185, 198, 24, 115, 78, 177, 229, 154, 90, 172, 185, 197, 216, 107, 109, 185, 245, 154, 115, 208, 169, 181, 90, 83, 76, 185, 182, 24, 115, 142, 185, 5, 89, 115, 238, 189, 131, 208, 90, 40, 165, 197, 80, 74, 140, 173, 181, 90, 91, 140, 57, 135, 82, 98, 43, 41, 213, 88, 74, 138, 181, 197, 152, 115, 107, 177, 246, 80, 74, 140, 37, 165, 88, 75, 74, 53, 182, 24, 107, 142, 53, 246, 154, 90, 171, 181, 197, 152, 107, 106, 177, 230, 154, 115, 239, 49, 230, 216, 83, 107, 53, 183, 24, 107, 78, 177, 229, 90, 115, 238, 189, 230, 214, 99, 1, 0, 0, 3, 14, 0, 0, 1, 38, 148, 129, 66, 67, 86, 2, 0, 81, 0, 0, 4, 33, 74, 49, 6, 161, 65, 136, 49, 231, 164, 52, 8, 49, 230, 156, 148, 138, 49, 231, 32, 164, 82, 49, 230, 28, 132, 82, 50, 231, 32, 148, 146, 82, 230, 28, 132, 82, 82, 10, 165, 164, 146, 82, 107, 161, 148, 82, 82, 106, 173, 0, 0, 128, 2, 7, 0, 128, 0, 27, 52, 37, 22, 7, 40, 52, 100, 37, 0, 144, 10, 0, 96, 112, 28, 203, 242, 60, 81, 52, 85, 217, 118, 44, 201, 243, 68, 209, 52, 85, 213, 182, 29, 203, 242, 60, 81, 52, 77, 85, 181, 109, 203, 243, 68, 209, 52, 85, 213, 117, 117, 221, 242, 60, 81, 52, 85, 85, 117, 93, 93, 247, 68, 81, 53, 85, 213, 117, 101, 89, 247, 61, 81, 52, 85, 85, 117, 93, 89, 246, 125, 211, 84, 85, 213, 117, 101, 89, 182, 133, 95, 52, 85, 87, 117, 93, 89, 150, 101, 223, 88, 93, 213, 117, 101, 89, 182, 117, 91, 24, 86, 213, 117, 93, 89, 150, 109, 91, 55, 134, 91, 215, 117, 221, 247, 133, 97, 57, 58, 183, 110, 235, 186, 239, 251, 194, 241, 59, 199, 0, 0, 240, 4, 7, 0, 160, 2, 27, 86, 71, 56, 41, 26, 11, 44, 52, 100, 37, 0, 144, 1, 0, 64, 24, 131, 144, 65, 72, 33, 131, 16, 82, 72, 33, 165, 16, 82, 74, 9, 0, 0, 24, 112, 0, 0, 8, 48, 161, 12, 20, 26, 178, 18, 0, 136, 2, 0, 0, 8, 145, 82, 74, 41, 141, 148, 82, 74, 41, 165, 145, 82, 74, 41, 165, 148, 18, 66, 8, 33, 132, 16, 66, 8, 33, 132, 16, 66, 8, 33, 132, 16, 66, 8, 33, 132, 16, 66, 8, 33, 132, 16, 66, 8, 33, 132, 16, 66, 8, 5, 0, 248, 79, 56, 0, 248, 63, 216, 160, 41, 177, 56, 64, 161, 33, 43, 1, 128, 112, 0, 0, 192, 24, 165, 152, 114, 12, 58, 9, 41, 53, 140, 57, 6, 161, 148, 148, 82, 106, 173, 97, 140, 49, 8, 165, 164, 212, 90, 75, 149, 115, 16, 74, 73, 169, 181, 216, 98, 172, 156, 131, 80, 82, 74, 173, 197, 26, 99, 7, 33, 165, 214, 90, 172, 177, 214, 154, 59, 8, 41, 165, 22, 107, 172, 57, 216, 28, 74, 105, 45, 198, 88, 115, 206, 189, 247, 144, 82, 107, 49, 214, 90, 115, 239, 189, 151, 214, 98, 172, 53, 231, 220, 131, 16, 194, 180, 20, 99, 174, 185, 246, 224, 123, 239, 41, 182, 90, 107, 205, 61, 248, 32, 132, 80, 177, 213, 90, 115, 240, 65, 8, 33, 132, 139, 49, 247, 220, 131, 240, 61, 8, 33, 92, 140, 57, 231, 30, 132, 240, 193, 7, 97, 0, 0, 119, 131, 3, 0, 68, 130, 141, 51, 172, 36, 157, 21, 142, 6, 23, 26, 178, 18, 0, 8, 9, 0, 32, 16, 98, 138, 49, 231, 156, 131, 16, 66, 8, 145, 82, 140, 57, 231, 28, 132, 16, 66, 40, 37, 82, 138, 49, 231, 156, 131, 14, 66, 8, 37, 100, 140, 57, 231, 28, 132, 16, 66, 40, 165, 148, 140, 49, 231, 156, 131, 16, 66, 9, 165, 148, 146, 57, 231, 28, 132, 16, 66, 40, 165, 148, 82, 50, 231, 160, 131, 16, 66, 9, 165, 148, 82, 74, 231, 28, 132, 16, 66, 8, 165, 148, 82, 74, 233, 160, 131, 16, 66, 9, 165, 148, 82, 74, 41, 33, 132, 16, 66, 9, 165, 148, 82, 74, 41, 37, 132, 16, 66, 9, 165, 148, 82, 74, 41, 165, 132, 16, 74, 40, 165, 148, 82, 74, 41, 165, 148, 16, 66, 41, 165, 148, 82, 74, 41, 165, 148, 18, 66, 40, 165, 148, 82, 74, 41, 165, 148, 146, 66, 41, 165, 148, 82, 74, 41, 165, 148, 82, 82, 40, 165, 148, 82, 74, 41, 165, 148, 82, 74, 9, 165, 148, 82, 74, 41, 165, 148, 148, 82, 73, 5, 0, 0, 28, 56, 0, 0, 4, 24, 65, 39, 25, 85, 22, 97, 163, 9, 23, 30, 128, 66, 67, 86, 2, 0, 64, 0, 0, 20, 196, 86, 83, 137, 157, 65, 204, 49, 103, 169, 33, 8, 49, 168, 169, 66, 74, 41, 134, 49, 67, 202, 32, 166, 41, 83, 10, 33, 133, 33, 115, 138, 33, 2, 161, 197, 86, 75, 197, 0, 0, 0, 16, 4, 0, 8, 8, 9, 0, 48, 64, 80, 48, 3, 0, 12, 14, 16, 62, 7, 65, 39, 64, 112, 180, 1, 0, 8, 66, 100, 134, 72, 52, 44, 4, 135, 7, 149, 0, 17, 49, 21, 0, 36, 38, 40, 228, 2, 64, 133, 197, 69, 218, 197, 5, 116, 25, 224, 130, 46, 238, 58, 16, 66, 16, 130, 16, 196, 226, 0, 10, 72, 192, 193, 9, 55, 60, 241, 134, 39, 220, 224, 4, 157, 162, 82, 7, 1, 0, 0, 0, 0, 112, 0, 0, 15, 0, 0, 199, 5, 16, 17, 209, 28, 70, 134, 198, 6, 71, 135, 199, 7, 72, 72, 0, 0, 0, 0, 0, 200, 0, 192, 7, 0, 192, 33, 2, 68, 68, 52, 135, 145, 161, 177, 193, 209, 225, 241, 1, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 4, 4, 79, 103, 103, 83, 0, 4, 185, 1, 0, 0, 0, 0, 0, 0, 97, 78, 37, 84, 2, 0, 0, 0, 229, 30, 142, 167, 2, 28, 97, 156, 74, 82, 231, 20, 20, 10, 10, 16, 192, 81, 101, 117, 124, 50, 137, 63, 53, 36, 211, 95, 51, 174, 74, 80, 145, 255, 10, 186, 232, 252, 127, 46, 127, 21, 185, 52, 6, 60, 1, 0, 0, 64, 2, 194, 16, 34, 20, 130, 65, 201, 251, 241, 145, 224, 140, 61, 7, 64, 59, 119, 108, 85, 171, 178, 167, 179, 204, 82, 50, 187, 92, 74, 251, 153, 136, 133, 63, 57, 35, 144, 218, 131, 141, 130, 179, 229, 228, 4, 41, 218, 90, 45, 131, 59, 49, 106, 140, 9, 55, 96, 136, 132, 102, 206, 143, 179, 137, 223, 5, 236, 4, 202, 37, 30, 209, 54, 176, 231, 14, 184, 57, 91, 168, 2])],
                    ["s16le", new Uint8Array([82, 73, 70, 70, 150, 3, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0, 68, 172, 0, 0, 136, 88, 1, 0, 2, 0, 16, 0, 100, 97, 116, 97, 114, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 254, 255, 4, 0, 253, 255, 2, 0, 254, 255, 0, 0, 2, 0, 254, 255, 2, 0, 253, 255, 3, 0, 254, 255, 0, 0, 1, 0, 254, 255, 2, 0, 254, 255, 2, 0, 253, 255, 4, 0, 252, 255, 3, 0, 254, 255, 2, 0, 254, 255, 2, 0, 254, 255, 2, 0, 0, 0, 253, 255, 4, 0, 252, 255, 3, 0, 255, 255, 1, 0, 254, 255, 2, 0, 253, 255, 5, 0, 251, 255, 4, 0, 252, 255, 4, 0, 253, 255, 3, 0, 252, 255, 3, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 2, 0, 253, 255, 4, 0, 252, 255, 4, 0, 251, 255, 6, 0, 251, 255, 4, 0, 253, 255, 2, 0, 253, 255, 5, 0, 252, 255, 2, 0, 0, 0, 253, 255, 5, 0, 251, 255, 5, 0, 252, 255, 1, 0, 2, 0, 254, 255, 1, 0, 0, 0, 254, 255, 2, 0, 0, 0, 254, 255, 3, 0, 254, 255, 0, 0, 1, 0, 254, 255, 2, 0, 254, 255, 1, 0, 2, 0, 252, 255, 4, 0, 252, 255, 2, 0, 255, 255, 1, 0, 255, 255, 1, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 255, 255, 0, 0, 1, 0, 254, 255, 3, 0, 252, 255, 4, 0, 253, 255, 2, 0, 255, 255, 0, 0, 1, 0, 253, 255, 4, 0, 253, 255, 1, 0, 1, 0, 253, 255, 3, 0, 254, 255, 2, 0, 252, 255, 4, 0, 252, 255, 4, 0, 253, 255, 2, 0, 254, 255, 1, 0, 0, 0, 255, 255, 1, 0, 1, 0, 252, 255, 5, 0, 251, 255, 5, 0, 253, 255, 0, 0, 0, 0, 0, 0, 3, 0, 252, 255, 3, 0, 254, 255, 255, 255, 5, 0, 249, 255, 6, 0, 252, 255, 3, 0, 254, 255, 1, 0, 0, 0, 255, 255, 1, 0, 255, 255, 2, 0, 252, 255, 6, 0, 249, 255, 5, 0, 255, 255, 253, 255, 3, 0, 0, 0, 254, 255, 3, 0, 253, 255, 1, 0, 1, 0, 255, 255, 1, 0, 0, 0, 254, 255, 3, 0, 253, 255, 3, 0, 254, 255, 0, 0, 1, 0, 255, 255, 1, 0, 255, 255, 255, 255, 2, 0, 255, 255, 1, 0, 255, 255, 0, 0, 254, 255, 5, 0, 250, 255, 6, 0, 250, 255, 5, 0, 253, 255, 2, 0, 254, 255, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 3, 0, 252, 255, 4, 0, 251, 255, 5, 0, 252, 255, 4, 0, 253, 255, 2, 0, 253, 255, 3, 0, 255, 255, 0, 0, 2, 0, 252, 255, 3, 0, 255, 255, 0, 0, 2, 0, 254, 255, 255, 255, 3, 0, 253, 255, 2, 0, 0, 0, 254, 255, 2, 0, 255, 255, 0, 0, 1, 0, 255, 255, 0, 0, 0, 0, 1, 0, 255, 255, 1, 0, 255, 255, 0, 0, 1, 0, 255, 255, 1, 0, 255, 255, 0, 0, 0, 0, 0, 0, 1, 0, 254, 255, 1, 0, 0, 0, 0, 0, 1, 0, 254, 255, 1, 0, 1, 0, 253, 255, 5, 0, 249, 255, 7, 0, 252, 255, 1, 0, 1, 0, 253, 255, 3, 0, 255, 255, 0, 0, 1, 0, 254, 255, 1, 0, 1, 0, 254, 255, 4, 0, 252, 255, 1, 0, 1, 0, 255, 255, 2, 0, 253, 255, 2, 0, 255, 255, 1, 0, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 255, 255, 1, 0, 255, 255, 255, 255, 2, 0, 255, 255, 1, 0, 255, 255, 255, 255, 3, 0, 253, 255, 2, 0, 255, 255, 0, 0, 1, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 254, 255, 2, 0, 255, 255, 0, 0, 1, 0, 254, 255, 2, 0, 254, 255, 3, 0, 252, 255, 3, 0, 255, 255, 255, 255, 2, 0, 254, 255, 1, 0, 0, 0, 0, 0, 0, 0, 255, 255, 2, 0, 254, 255, 2, 0, 254, 255, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 252, 255, 6, 0, 250, 255, 6, 0, 252, 255, 1, 0, 1, 0, 255, 255, 1, 0, 255, 255, 2, 0, 254, 255, 1, 0, 0, 0, 255, 255, 3, 0, 252, 255, 3, 0, 254, 255, 1, 0, 0, 0, 0, 0, 255, 255, 2, 0, 254, 255, 1, 0, 0, 0, 255, 255, 2, 0, 253, 255, 4, 0, 252, 255, 4, 0, 252, 255, 4, 0, 253, 255, 2, 0, 254, 255, 1, 0, 255, 255, 2, 0, 255, 255, 0, 0, 0, 0, 255, 255, 1, 0, 0, 0, 0, 0, 1, 0, 254, 255, 2, 0, 254, 255, 2, 0, 255, 255, 255, 255, 3, 0, 252, 255, 4, 0, 252, 255, 3, 0, 255, 255, 0, 0, 0, 0, 255, 255, 1, 0, 0, 0, 255, 255, 2, 0, 254, 255, 0, 0, 1, 0, 255, 255, 0, 0, 2, 0, 254, 255, 0, 0, 2, 0, 253, 255, 3, 0, 254, 255, 1, 0, 0, 0, 255, 255, 1, 0, 0, 0])],
                    ["s24le", new Uint8Array([82, 73, 70, 70, 79, 5, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0, 68, 172, 0, 0, 204, 4, 2, 0, 3, 0, 24, 0, 100, 97, 116, 97, 43, 5, 0, 0, 0, 255, 255, 0, 2, 0, 0, 253, 255, 0, 3, 0, 0, 254, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 254, 255, 0, 3, 0, 0, 254, 255, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 253, 255, 0, 4, 0, 0, 252, 255, 0, 4, 0, 0, 252, 255, 0, 4, 0, 0, 253, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 2, 0, 0, 252, 255, 0, 5, 0, 0, 251, 255, 0, 4, 0, 0, 253, 255, 0, 3, 0, 0, 253, 255, 0, 3, 0, 0, 252, 255, 0, 5, 0, 0, 251, 255, 0, 4, 0, 0, 253, 255, 0, 2, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 254, 255, 0, 3, 0, 0, 253, 255, 0, 3, 0, 0, 253, 255, 0, 3, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 255, 255, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 253, 255, 0, 3, 0, 0, 255, 255, 0, 255, 255, 0, 2, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 0, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 3, 0, 0, 253, 255, 0, 2, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 0, 2, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 1, 0, 0, 1, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 255, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 253, 255, 0, 3, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 1, 0, 0, 253, 255, 0, 3, 0, 0, 254, 255, 0, 0, 0, 0, 2, 0, 0, 253, 255, 0, 2, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 2, 0, 0, 253, 255, 0, 2, 0, 0, 0, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 255, 255, 0, 3, 0, 0, 253, 255, 0, 2, 0, 0, 255, 255, 0, 255, 255, 0, 3, 0, 0, 253, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 255, 255, 0, 3, 0, 0, 253, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 255, 255, 0, 2, 0, 0, 254, 255, 0, 3, 0, 0, 254, 255, 0, 255, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 0, 2, 0, 0, 253, 255, 0, 4, 0, 0, 251, 255, 0, 5, 0, 0, 253, 255, 0, 1, 0, 0, 0, 0, 0, 255, 255, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 255, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 3, 0, 0, 253, 255, 0, 3, 0, 0, 253, 255, 0, 2, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 2, 0, 0, 252, 255, 0, 5, 0, 0, 252, 255, 0, 2, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 2, 0, 0, 252, 255, 0, 5, 0, 0, 251, 255, 0, 4, 0, 0, 254, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 2, 0, 0, 253, 255, 0, 3, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 1, 0, 0, 0, 0, 0, 255, 255, 0, 2, 0, 0, 253, 255, 0, 4, 0, 0, 252, 255, 0, 3, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 0, 0, 0, 1, 0, 0, 254, 255, 0, 2, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0, 0, 255, 255, 0, 1, 0])],
                    ["f32le", new Uint8Array([82, 73, 70, 70, 44, 7, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 3, 0, 1, 0, 68, 172, 0, 0, 16, 177, 2, 0, 4, 0, 32, 0, 102, 97, 99, 116, 4, 0, 0, 0, 185, 1, 0, 0, 80, 69, 65, 75, 16, 0, 0, 0, 1, 0, 0, 0, 172, 63, 179, 88, 0, 0, 96, 57, 163, 0, 0, 0, 100, 97, 116, 97, 228, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 184, 0, 0, 0, 57, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 0, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 192, 184, 0, 0, 192, 56, 0, 0, 128, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 192, 184, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 192, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 0, 0, 0, 0, 192, 184, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 192, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 192, 184, 0, 0, 32, 57, 0, 0, 32, 185, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 192, 184, 0, 0, 192, 56, 0, 0, 0, 185, 0, 0, 192, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 192, 184, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 32, 185, 0, 0, 64, 57, 0, 0, 32, 185, 0, 0, 0, 57, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 192, 184, 0, 0, 32, 57, 0, 0, 0, 185, 0, 0, 128, 56, 0, 0, 0, 0, 0, 0, 192, 184, 0, 0, 32, 57, 0, 0, 32, 185, 0, 0, 32, 57, 0, 0, 0, 185, 0, 0, 0, 56, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 0, 0, 0, 0, 128, 184, 0, 0, 192, 56, 0, 0, 128, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 128, 56, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 192, 56, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 192, 184, 0, 0, 0, 57, 0, 0, 192, 184, 0, 0, 0, 56, 0, 0, 0, 56, 0, 0, 192, 184, 0, 0, 192, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 56, 0, 0, 0, 185, 0, 0, 32, 57, 0, 0, 32, 185, 0, 0, 32, 57, 0, 0, 192, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 56, 0, 0, 0, 185, 0, 0, 192, 56, 0, 0, 128, 184, 0, 0, 0, 184, 0, 0, 32, 57, 0, 0, 96, 185, 0, 0, 64, 57, 0, 0, 0, 185, 0, 0, 192, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 0, 185, 0, 0, 64, 57, 0, 0, 96, 185, 0, 0, 32, 57, 0, 0, 0, 184, 0, 0, 192, 184, 0, 0, 192, 56, 0, 0, 0, 0, 0, 0, 128, 184, 0, 0, 192, 56, 0, 0, 192, 184, 0, 0, 0, 56, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 128, 184, 0, 0, 192, 56, 0, 0, 192, 184, 0, 0, 192, 56, 0, 0, 128, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 128, 184, 0, 0, 32, 57, 0, 0, 64, 185, 0, 0, 64, 57, 0, 0, 64, 185, 0, 0, 32, 57, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 192, 56, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 32, 185, 0, 0, 32, 57, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 192, 184, 0, 0, 192, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 128, 56, 0, 0, 0, 185, 0, 0, 192, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 184, 0, 0, 192, 56, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 0, 0, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 56, 0, 0, 192, 184, 0, 0, 32, 57, 0, 0, 96, 185, 0, 0, 96, 57, 0, 0, 0, 185, 0, 0, 0, 56, 0, 0, 0, 56, 0, 0, 192, 184, 0, 0, 192, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 0, 56, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 184, 0, 0, 192, 56, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 192, 56, 0, 0, 0, 185, 0, 0, 192, 56, 0, 0, 0, 184, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 185, 0, 0, 64, 57, 0, 0, 64, 185, 0, 0, 64, 57, 0, 0, 0, 185, 0, 0, 0, 56, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 192, 56, 0, 0, 0, 185, 0, 0, 192, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 192, 184, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 192, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 128, 56, 0, 0, 0, 184, 0, 0, 0, 184, 0, 0, 192, 56, 0, 0, 0, 185, 0, 0, 0, 57, 0, 0, 0, 185, 0, 0, 192, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 0, 0, 0, 0, 56, 0, 0, 0, 184, 0, 0, 0, 0, 0, 0, 128, 56, 0, 0, 128, 184, 0, 0, 0, 0, 0, 0, 128, 56, 0, 0, 192, 184, 0, 0, 192, 56, 0, 0, 128, 184, 0, 0, 0, 56, 0, 0, 0, 0, 0, 0, 0, 184, 0, 0, 0, 56, 0, 0, 0, 0])],
                    ["u8", new Uint8Array([82, 73, 70, 70, 221, 1, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0, 68, 172, 0, 0, 68, 172, 0, 0, 1, 0, 8, 0, 100, 97, 116, 97, 185, 1, 0, 0, 128, 128, 127, 128, 128, 128, 127, 128, 127, 128, 127, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 128, 127, 128, 128, 127, 128, 127, 128, 128, 128, 127, 128, 128, 128, 128, 128, 128, 128, 127, 128, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 128, 127, 128, 127, 128, 127, 128, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 128, 127, 128, 127, 128, 127, 127, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 127, 127, 128, 128, 127, 128, 127, 128, 128, 128, 128, 127, 128, 127, 128, 128, 127, 128, 128, 127, 128, 127, 128, 128, 127, 128, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 128, 127, 128, 128, 127, 128, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 127, 128, 128, 128, 128, 127, 128, 128, 128, 128, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 127, 128, 128, 127, 128, 127, 128, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 128, 127, 128, 127, 128, 128, 127, 127, 128, 127, 128, 128, 127, 128, 128, 128, 128, 128, 128, 127, 128, 127, 128, 128, 127, 128, 128, 127, 128, 127, 128, 128, 127, 128, 128, 127, 128, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 128, 128, 127, 128, 127, 128, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 127, 128, 127, 128, 127, 128, 128, 128, 127, 128, 127, 128, 127, 128, 127, 128, 128, 128, 127, 128, 127, 128, 128, 127])]
                ],
                o = function(e, n, o) {
                    var a = !0;
                    n && (a = !1), i[e] = a, r.length > 0 ? s() : (i.wav = i.s16le, t(null, i))
                },
                s = function() { n = r.pop(), e.decodeAudioData(n[1].buffer, function(e) { o(n[0], null, e) }, function(e) { o(n[0], e || new Error("decoding error"), null) }) };
            s()
        }, n.getAudioContextOnClick = function(e, t) {
            var n = /iPad|iPhone|iPod/.test(navigator.platform),
                i = n ? "touchend" : "click",
                r = function() {
                    var n;
                    e.removeEventListener(i, r, !1);
                    try { n = new AudioContext } catch (o) { return t(o, n) }
                    t(null, n)
                };
            e.addEventListener(i, r, !1)
        }
    }, {}],
    40: [function(e, t, n) {
        "use strict";
        ! function() {
            var n = e("./utils").log,
                i = e("./utils").browserDetails;
            t.exports.browserDetails = i, t.exports.extractVersion = e("./utils").extractVersion, t.exports.disableLog = e("./utils").disableLog;
            var r = e("./chrome/chrome_shim") || null,
                o = e("./edge/edge_shim") || null,
                s = e("./firefox/firefox_shim") || null,
                a = e("./safari/safari_shim") || null;
            switch (i.browser) {
                case "opera":
                case "chrome":
                    if (!r || !r.shimPeerConnection) return void n("Chrome shim is not included in this adapter release.");
                    n("adapter.js shimming chrome."), t.exports.browserShim = r, r.shimGetUserMedia(), r.shimMediaStream(), r.shimSourceObject(), r.shimPeerConnection(), r.shimOnTrack();
                    break;
                case "firefox":
                    if (!s || !s.shimPeerConnection) return void n("Firefox shim is not included in this adapter release.");
                    n("adapter.js shimming firefox."), t.exports.browserShim = s, s.shimGetUserMedia(), s.shimSourceObject(), s.shimPeerConnection(), s.shimOnTrack();
                    break;
                case "edge":
                    if (!o || !o.shimPeerConnection) return void n("MS edge shim is not included in this adapter release.");
                    n("adapter.js shimming edge."), t.exports.browserShim = o, o.shimGetUserMedia(), o.shimPeerConnection();
                    break;
                case "safari":
                    if (!a) return void n("Safari shim is not included in this adapter release.");
                    n("adapter.js shimming safari."), t.exports.browserShim = a, a.shimGetUserMedia();
                    break;
                default:
                    n("Unsupported browser!")
            }
        }()
    }, { "./chrome/chrome_shim": 41, "./edge/edge_shim": 43, "./firefox/firefox_shim": 45, "./safari/safari_shim": 47, "./utils": 48 }],
    41: [function(e, t, n) {
        "use strict";
        var i = e("../utils.js").log,
            r = e("../utils.js").browserDetails,
            o = {
                shimMediaStream: function() { window.MediaStream = window.MediaStream || window.webkitMediaStream },
                shimOnTrack: function() {
                    "object" != typeof window || !window.RTCPeerConnection || "ontrack" in window.RTCPeerConnection.prototype || Object.defineProperty(window.RTCPeerConnection.prototype, "ontrack", {
                        get: function() { return this._ontrack },
                        set: function(e) {
                            var t = this;
                            this._ontrack && (this.removeEventListener("track", this._ontrack), this.removeEventListener("addstream", this._ontrackpoly)), this.addEventListener("track", this._ontrack = e), this.addEventListener("addstream", this._ontrackpoly = function(e) {
                                e.stream.addEventListener("addtrack", function(n) {
                                    var i = new Event("track");
                                    i.track = n.track, i.receiver = { track: n.track }, i.streams = [e.stream], t.dispatchEvent(i)
                                }), e.stream.getTracks().forEach(function(t) {
                                    var n = new Event("track");
                                    n.track = t, n.receiver = { track: t }, n.streams = [e.stream], this.dispatchEvent(n)
                                }.bind(this))
                            }.bind(this))
                        }
                    })
                },
                shimSourceObject: function() { "object" == typeof window && (!window.HTMLMediaElement || "srcObject" in window.HTMLMediaElement.prototype || Object.defineProperty(window.HTMLMediaElement.prototype, "srcObject", { get: function() { return this._srcObject }, set: function(e) { var t = this; return this._srcObject = e, this.src && URL.revokeObjectURL(this.src), e ? (this.src = URL.createObjectURL(e), e.addEventListener("addtrack", function() { t.src && URL.revokeObjectURL(t.src), t.src = URL.createObjectURL(e) }), void e.addEventListener("removetrack", function() { t.src && URL.revokeObjectURL(t.src), t.src = URL.createObjectURL(e) })) : void(this.src = "") } })) },
                shimPeerConnection: function() {
                    window.RTCPeerConnection = function(e, t) {
                        i("PeerConnection"), e && e.iceTransportPolicy && (e.iceTransports = e.iceTransportPolicy);
                        var n = new webkitRTCPeerConnection(e, t),
                            r = n.getStats.bind(n);
                        return n.getStats = function(e, t, n) {
                            var i = this,
                                o = arguments;
                            if (arguments.length > 0 && "function" == typeof e) return r(e, t);
                            var s = function(e) {
                                    var t = {},
                                        n = e.result();
                                    return n.forEach(function(e) {
                                        var n = { id: e.id, timestamp: e.timestamp, type: e.type };
                                        e.names().forEach(function(t) { n[t] = e.stat(t) }), t[n.id] = n
                                    }), t
                                },
                                a = function(e, t) { var n = new Map(Object.keys(e).map(function(t) { return [t, e[t]] })); return t = t || e, Object.keys(t).forEach(function(e) { n[e] = t[e] }), n };
                            if (arguments.length >= 2) { var c = function(e) { o[1](a(s(e))) }; return r.apply(this, [c, arguments[0]]) }
                            return new Promise(function(t, n) { 1 === o.length && "object" == typeof e ? r.apply(i, [function(e) { t(a(s(e))) }, n]) : r.apply(i, [function(e) { t(a(s(e), e.result())) }, n]) }).then(t, n)
                        }, n
                    }, window.RTCPeerConnection.prototype = webkitRTCPeerConnection.prototype, webkitRTCPeerConnection.generateCertificate && Object.defineProperty(window.RTCPeerConnection, "generateCertificate", { get: function() { return webkitRTCPeerConnection.generateCertificate } }), ["createOffer", "createAnswer"].forEach(function(e) {
                        var t = webkitRTCPeerConnection.prototype[e];
                        webkitRTCPeerConnection.prototype[e] = function() { var e = this; if (arguments.length < 1 || 1 === arguments.length && "object" == typeof arguments[0]) { var n = 1 === arguments.length ? arguments[0] : void 0; return new Promise(function(i, r) { t.apply(e, [i, r, n]) }) } return t.apply(this, arguments) }
                    }), r.version < 51 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(e) {
                        var t = webkitRTCPeerConnection.prototype[e];
                        webkitRTCPeerConnection.prototype[e] = function() {
                            var e = arguments,
                                n = this,
                                i = new Promise(function(i, r) { t.apply(n, [e[0], i, r]) });
                            return e.length < 2 ? i : i.then(function() { e[1].apply(null, []) }, function(t) { e.length >= 3 && e[2].apply(null, [t]) })
                        }
                    });
                    var e = RTCPeerConnection.prototype.addIceCandidate;
                    RTCPeerConnection.prototype.addIceCandidate = function() { return null === arguments[0] ? Promise.resolve() : e.apply(this, arguments) }, ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(e) {
                        var t = webkitRTCPeerConnection.prototype[e];
                        webkitRTCPeerConnection.prototype[e] = function() { return arguments[0] = new("addIceCandidate" === e ? RTCIceCandidate : RTCSessionDescription)(arguments[0]), t.apply(this, arguments) }
                    })
                },
                attachMediaStream: function(e, t) { i("DEPRECATED, attachMediaStream will soon be removed."), r.version >= 43 ? e.srcObject = t : "undefined" != typeof e.src ? e.src = URL.createObjectURL(t) : i("Error attaching stream to element.") },
                reattachMediaStream: function(e, t) { i("DEPRECATED, reattachMediaStream will soon be removed."), r.version >= 43 ? e.srcObject = t.srcObject : e.src = t.src }
            };
        t.exports = { shimMediaStream: o.shimMediaStream, shimOnTrack: o.shimOnTrack, shimSourceObject: o.shimSourceObject, shimPeerConnection: o.shimPeerConnection, shimGetUserMedia: e("./getusermedia"), attachMediaStream: o.attachMediaStream, reattachMediaStream: o.reattachMediaStream }
    }, { "../utils.js": 48, "./getusermedia": 42 }],
    42: [function(e, t, n) {
        "use strict";
        var i = e("../utils.js").log;
        t.exports = function() {
            var e = function(e) {
                    if ("object" != typeof e || e.mandatory || e.optional) return e;
                    var t = {};
                    return Object.keys(e).forEach(function(n) {
                        if ("require" !== n && "advanced" !== n && "mediaSource" !== n) {
                            var i = "object" == typeof e[n] ? e[n] : { ideal: e[n] };
                            void 0 !== i.exact && "number" == typeof i.exact && (i.min = i.max = i.exact);
                            var r = function(e, t) { return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t };
                            if (void 0 !== i.ideal) { t.optional = t.optional || []; var o = {}; "number" == typeof i.ideal ? (o[r("min", n)] = i.ideal, t.optional.push(o), o = {}, o[r("max", n)] = i.ideal, t.optional.push(o)) : (o[r("", n)] = i.ideal, t.optional.push(o)) }
                            void 0 !== i.exact && "number" != typeof i.exact ? (t.mandatory = t.mandatory || {}, t.mandatory[r("", n)] = i.exact) : ["min", "max"].forEach(function(e) { void 0 !== i[e] && (t.mandatory = t.mandatory || {}, t.mandatory[r(e, n)] = i[e]) })
                        }
                    }), e.advanced && (t.optional = (t.optional || []).concat(e.advanced)), t
                },
                t = function(t, n) {
                    if (t = JSON.parse(JSON.stringify(t)), t && t.audio && (t.audio = e(t.audio)), t && "object" == typeof t.video) {
                        var r = t.video.facingMode;
                        if (r = r && ("object" == typeof r ? r : { ideal: r }), !(!r || "user" !== r.exact && "environment" !== r.exact && "user" !== r.ideal && "environment" !== r.ideal || navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode) && (delete t.video.facingMode, "environment" === r.exact || "environment" === r.ideal)) return navigator.mediaDevices.enumerateDevices().then(function(o) { o = o.filter(function(e) { return "videoinput" === e.kind }); var s = o.find(function(e) { return -1 !== e.label.toLowerCase().indexOf("back") }) || o.length && o[o.length - 1]; return s && (t.video.deviceId = r.exact ? { exact: s.deviceId } : { ideal: s.deviceId }), t.video = e(t.video), i("chrome: " + JSON.stringify(t)), n(t) });
                        t.video = e(t.video)
                    }
                    return i("chrome: " + JSON.stringify(t)), n(t)
                },
                n = function(e) { return { name: { PermissionDeniedError: "NotAllowedError", ConstraintNotSatisfiedError: "OverconstrainedError" }[e.name] || e.name, message: e.message, constraint: e.constraintName, toString: function() { return this.name + (this.message && ": ") + this.message } } },
                r = function(e, i, r) { t(e, function(e) { navigator.webkitGetUserMedia(e, i, function(e) { r(n(e)) }) }) };
            navigator.getUserMedia = r;
            var o = function(e) { return new Promise(function(t, n) { navigator.getUserMedia(e, t, n) }) };
            if (navigator.mediaDevices || (navigator.mediaDevices = { getUserMedia: o, enumerateDevices: function() { return new Promise(function(e) { var t = { audio: "audioinput", video: "videoinput" }; return MediaStreamTrack.getSources(function(n) { e(n.map(function(e) { return { label: e.label, kind: t[e.kind], deviceId: e.id, groupId: "" } })) }) }) } }), navigator.mediaDevices.getUserMedia) {
                var s = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                navigator.mediaDevices.getUserMedia = function(e) { return t(e, function(e) { return s(e)["catch"](function(e) { return Promise.reject(n(e)) }) }) }
            } else navigator.mediaDevices.getUserMedia = function(e) { return o(e) };
            "undefined" == typeof navigator.mediaDevices.addEventListener && (navigator.mediaDevices.addEventListener = function() { i("Dummy mediaDevices.addEventListener called.") }), "undefined" == typeof navigator.mediaDevices.removeEventListener && (navigator.mediaDevices.removeEventListener = function() { i("Dummy mediaDevices.removeEventListener called.") })
        }
    }, { "../utils.js": 48 }],
    43: [function(e, t, n) {
        "use strict";
        var i = e("sdp"),
            r = e("../utils").log,
            o = {
                shimPeerConnection: function() {
                    window.RTCIceGatherer && (window.RTCIceCandidate || (window.RTCIceCandidate = function(e) { return e }), window.RTCSessionDescription || (window.RTCSessionDescription = function(e) { return e })), window.RTCPeerConnection = function(e) {
                        var t = this,
                            n = document.createDocumentFragment();
                        if (["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function(e) { t[e] = n[e].bind(n) }), this.onicecandidate = null, this.onaddstream = null, this.ontrack = null, this.onremovestream = null, this.onsignalingstatechange = null, this.oniceconnectionstatechange = null, this.onnegotiationneeded = null, this.ondatachannel = null, this.localStreams = [], this.remoteStreams = [], this.getLocalStreams = function() { return t.localStreams }, this.getRemoteStreams = function() { return t.remoteStreams }, this.localDescription = new RTCSessionDescription({ type: "", sdp: "" }), this.remoteDescription = new RTCSessionDescription({ type: "", sdp: "" }), this.signalingState = "stable", this.iceConnectionState = "new", this.iceGatheringState = "new", this.iceOptions = { gatherPolicy: "all", iceServers: [] }, e && e.iceTransportPolicy) switch (e.iceTransportPolicy) {
                            case "all":
                            case "relay":
                                this.iceOptions.gatherPolicy = e.iceTransportPolicy;
                                break;
                            case "none":
                                throw new TypeError('iceTransportPolicy "none" not supported')
                        }
                        if (this.usingBundle = e && "max-bundle" === e.bundlePolicy, e && e.iceServers) {
                            var i = JSON.parse(JSON.stringify(e.iceServers));
                            this.iceOptions.iceServers = i.filter(function(e) { if (e && e.urls) { var t = e.urls; return "string" == typeof t && (t = [t]), t = t.filter(function(e) { return 0 === e.indexOf("turn:") && -1 !== e.indexOf("transport=udp") })[0], !!t } return !1 })
                        }
                        this.transceivers = [], this._localIceCandidatesBuffer = []
                    }, window.RTCPeerConnection.prototype._emitBufferedCandidates = function() {
                        var e = this,
                            t = i.splitSections(e.localDescription.sdp);
                        this._localIceCandidatesBuffer.forEach(function(n) {
                            var i = !n.candidate || 0 === Object.keys(n.candidate).length;
                            if (i)
                                for (var r = 1; r < t.length; r++) - 1 === t[r].indexOf("\r\na=end-of-candidates\r\n") && (t[r] += "a=end-of-candidates\r\n");
                            else -1 === n.candidate.candidate.indexOf("typ endOfCandidates") && (t[n.candidate.sdpMLineIndex + 1] += "a=" + n.candidate.candidate + "\r\n");
                            if (e.localDescription.sdp = t.join(""), e.dispatchEvent(n), null !== e.onicecandidate && e.onicecandidate(n), !n.candidate && "complete" !== e.iceGatheringState) {
                                var o = e.transceivers.every(function(e) { return e.iceGatherer && "completed" === e.iceGatherer.state });
                                o && (e.iceGatheringState = "complete")
                            }
                        }), this._localIceCandidatesBuffer = []
                    }, window.RTCPeerConnection.prototype.addStream = function(e) { this.localStreams.push(e.clone()), this._maybeFireNegotiationNeeded() }, window.RTCPeerConnection.prototype.removeStream = function(e) {
                        var t = this.localStreams.indexOf(e);
                        t > -1 && (this.localStreams.splice(t, 1), this._maybeFireNegotiationNeeded())
                    }, window.RTCPeerConnection.prototype.getSenders = function() { return this.transceivers.filter(function(e) { return !!e.rtpSender }).map(function(e) { return e.rtpSender }) }, window.RTCPeerConnection.prototype.getReceivers = function() { return this.transceivers.filter(function(e) { return !!e.rtpReceiver }).map(function(e) { return e.rtpReceiver }) }, window.RTCPeerConnection.prototype._getCommonCapabilities = function(e, t) { var n = { codecs: [], headerExtensions: [], fecMechanisms: [] }; return e.codecs.forEach(function(e) { for (var i = 0; i < t.codecs.length; i++) { var r = t.codecs[i]; if (e.name.toLowerCase() === r.name.toLowerCase() && e.clockRate === r.clockRate && e.numChannels === r.numChannels) { n.codecs.push(r); break } } }), e.headerExtensions.forEach(function(e) { for (var i = 0; i < t.headerExtensions.length; i++) { var r = t.headerExtensions[i]; if (e.uri === r.uri) { n.headerExtensions.push(r); break } } }), n }, window.RTCPeerConnection.prototype._createIceAndDtlsTransports = function(e, t) {
                        var n = this,
                            r = new RTCIceGatherer(n.iceOptions),
                            o = new RTCIceTransport(r);
                        r.onlocalcandidate = function(s) {
                            var a = new Event("icecandidate");
                            a.candidate = { sdpMid: e, sdpMLineIndex: t };
                            var c = s.candidate,
                                u = !c || 0 === Object.keys(c).length;
                            u ? (void 0 === r.state && (r.state = "completed"), a.candidate.candidate = "candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates") : (c.component = "RTCP" === o.component ? 2 : 1, a.candidate.candidate = i.writeCandidate(c));
                            var l = i.splitSections(n.localDescription.sdp);
                            l[a.candidate.sdpMLineIndex + 1] += -1 === a.candidate.candidate.indexOf("typ endOfCandidates") ? "a=" + a.candidate.candidate + "\r\n" : "a=end-of-candidates\r\n", n.localDescription.sdp = l.join("");
                            var d = n.transceivers.every(function(e) { return e.iceGatherer && "completed" === e.iceGatherer.state });
                            switch (n.iceGatheringState) {
                                case "new":
                                    n._localIceCandidatesBuffer.push(a), u && d && n._localIceCandidatesBuffer.push(new Event("icecandidate"));
                                    break;
                                case "gathering":
                                    n._emitBufferedCandidates(), n.dispatchEvent(a), null !== n.onicecandidate && n.onicecandidate(a), d && (n.dispatchEvent(new Event("icecandidate")), null !== n.onicecandidate && n.onicecandidate(new Event("icecandidate")), n.iceGatheringState = "complete");
                                    break;
                                case "complete":
                            }
                        }, o.onicestatechange = function() { n._updateConnectionState() };
                        var s = new RTCDtlsTransport(o);
                        return s.ondtlsstatechange = function() { n._updateConnectionState() }, s.onerror = function() { s.state = "failed", n._updateConnectionState() }, { iceGatherer: r, iceTransport: o, dtlsTransport: s }
                    }, window.RTCPeerConnection.prototype._transceive = function(e, t, n) {
                        var r = this._getCommonCapabilities(e.localCapabilities, e.remoteCapabilities);
                        t && e.rtpSender && (r.encodings = e.sendEncodingParameters, r.rtcp = { cname: i.localCName }, e.recvEncodingParameters.length && (r.rtcp.ssrc = e.recvEncodingParameters[0].ssrc), e.rtpSender.send(r)), n && e.rtpReceiver && (r.encodings = e.recvEncodingParameters, r.rtcp = { cname: e.cname }, e.sendEncodingParameters.length && (r.rtcp.ssrc = e.sendEncodingParameters[0].ssrc), e.rtpReceiver.receive(r))
                    }, window.RTCPeerConnection.prototype.setLocalDescription = function(e) {
                        var t, n, r = this;
                        if ("offer" === e.type) this._pendingOffer && (t = i.splitSections(e.sdp), n = t.shift(), t.forEach(function(e, t) {
                            var n = i.parseRtpParameters(e);
                            r._pendingOffer[t].localCapabilities = n
                        }), this.transceivers = this._pendingOffer, delete this._pendingOffer);
                        else if ("answer" === e.type) {
                            t = i.splitSections(r.remoteDescription.sdp), n = t.shift();
                            var o = i.matchPrefix(n, "a=ice-lite").length > 0;
                            t.forEach(function(e, t) {
                                var s = r.transceivers[t],
                                    a = s.iceGatherer,
                                    c = s.iceTransport,
                                    u = s.dtlsTransport,
                                    l = s.localCapabilities,
                                    d = s.remoteCapabilities,
                                    f = "0" === e.split("\n", 1)[0].split(" ", 2)[1];
                                if (!f) {
                                    var h = i.getIceParameters(e, n);
                                    if (o) {
                                        var p = i.matchPrefix(e, "a=candidate:").map(function(e) { return i.parseCandidate(e) }).filter(function(e) { return "1" === e.component });
                                        p.length && c.setRemoteCandidates(p)
                                    }
                                    var m = i.getDtlsParameters(e, n);
                                    o && (m.role = "server"), r.usingBundle && 0 !== t || (c.start(a, h, o ? "controlling" : "controlled"), u.start(m));
                                    var v = r._getCommonCapabilities(l, d);
                                    r._transceive(s, v.codecs.length > 0, !1)
                                }
                            })
                        }
                        switch (this.localDescription = { type: e.type, sdp: e.sdp }, e.type) {
                            case "offer":
                                this._updateSignalingState("have-local-offer");
                                break;
                            case "answer":
                                this._updateSignalingState("stable");
                                break;
                            default:
                                throw new TypeError('unsupported type "' + e.type + '"')
                        }
                        var s = arguments.length > 1 && "function" == typeof arguments[1];
                        if (s) {
                            var a = arguments[1];
                            window.setTimeout(function() { a(), "new" === r.iceGatheringState && (r.iceGatheringState = "gathering"), r._emitBufferedCandidates() }, 0)
                        }
                        var c = Promise.resolve();
                        return c.then(function() { s || ("new" === r.iceGatheringState && (r.iceGatheringState = "gathering"), window.setTimeout(r._emitBufferedCandidates.bind(r), 500)) }), c
                    }, window.RTCPeerConnection.prototype.setRemoteDescription = function(e) {
                        var t = this,
                            n = new MediaStream,
                            r = [],
                            o = i.splitSections(e.sdp),
                            s = o.shift(),
                            a = i.matchPrefix(s, "a=ice-lite").length > 0;
                        switch (this.usingBundle = i.matchPrefix(s, "a=group:BUNDLE ").length > 0, o.forEach(function(o, c) {
                            var u, l, d, f, h, p, m, v, g, y, _, b, w = i.splitLines(o),
                                x = w[0].substr(2).split(" "),
                                C = x[0],
                                T = "0" === x[1],
                                N = i.getDirection(o, s),
                                E = i.parseRtpParameters(o);
                            T || (_ = i.getIceParameters(o, s), b = i.getDtlsParameters(o, s), b.role = "client"), v = i.parseRtpEncodingParameters(o);
                            var j = i.matchPrefix(o, "a=mid:");
                            j = j.length ? j[0].substr(6) : i.generateIdentifier();
                            var O, D = i.matchPrefix(o, "a=ssrc:").map(function(e) { return i.parseSsrcMedia(e) }).filter(function(e) { return "cname" === e.attribute })[0];
                            D && (O = D.value);
                            var S = i.matchPrefix(o, "a=end-of-candidates").length > 0,
                                P = i.matchPrefix(o, "a=candidate:").map(function(e) { return i.parseCandidate(e) }).filter(function(e) { return "1" === e.component });
                            if ("offer" !== e.type || T) "answer" !== e.type || T || (u = t.transceivers[c], l = u.iceGatherer, d = u.iceTransport, f = u.dtlsTransport, h = u.rtpSender, p = u.rtpReceiver, m = u.sendEncodingParameters, g = u.localCapabilities, t.transceivers[c].recvEncodingParameters = v, t.transceivers[c].remoteCapabilities = E, t.transceivers[c].cname = O, (a || S) && P.length && d.setRemoteCandidates(P), t.usingBundle && 0 !== c || (d.start(l, _, "controlling"), f.start(b)), t._transceive(u, "sendrecv" === N || "recvonly" === N, "sendrecv" === N || "sendonly" === N), !p || "sendrecv" !== N && "sendonly" !== N ? delete u.rtpReceiver : (y = p.track, r.push([y, p]), n.addTrack(y)));
                            else {
                                var k = t.usingBundle && c > 0 ? { iceGatherer: t.transceivers[0].iceGatherer, iceTransport: t.transceivers[0].iceTransport, dtlsTransport: t.transceivers[0].dtlsTransport } : t._createIceAndDtlsTransports(j, c);
                                if (S && k.iceTransport.setRemoteCandidates(P), g = RTCRtpReceiver.getCapabilities(C), m = [{ ssrc: 1001 * (2 * c + 2) }], p = new RTCRtpReceiver(k.dtlsTransport, C), y = p.track, r.push([y, p]), n.addTrack(y), t.localStreams.length > 0 && t.localStreams[0].getTracks().length >= c) {
                                    var R = t.localStreams[0].getTracks()[c];
                                    h = new RTCRtpSender(R, k.dtlsTransport)
                                }
                                t.transceivers[c] = { iceGatherer: k.iceGatherer, iceTransport: k.iceTransport, dtlsTransport: k.dtlsTransport, localCapabilities: g, remoteCapabilities: E, rtpSender: h, rtpReceiver: p, kind: C, mid: j, cname: O, sendEncodingParameters: m, recvEncodingParameters: v }, t._transceive(t.transceivers[c], !1, "sendrecv" === N || "sendonly" === N)
                            }
                        }), this.remoteDescription = { type: e.type, sdp: e.sdp }, e.type) {
                            case "offer":
                                this._updateSignalingState("have-remote-offer");
                                break;
                            case "answer":
                                this._updateSignalingState("stable");
                                break;
                            default:
                                throw new TypeError('unsupported type "' + e.type + '"')
                        }
                        return n.getTracks().length && (t.remoteStreams.push(n), window.setTimeout(function() {
                            var e = new Event("addstream");
                            e.stream = n, t.dispatchEvent(e), null !== t.onaddstream && window.setTimeout(function() { t.onaddstream(e) }, 0), r.forEach(function(i) {
                                var r = i[0],
                                    o = i[1],
                                    s = new Event("track");
                                s.track = r, s.receiver = o, s.streams = [n], t.dispatchEvent(e), null !== t.ontrack && window.setTimeout(function() { t.ontrack(s) }, 0)
                            })
                        }, 0)), arguments.length > 1 && "function" == typeof arguments[1] && window.setTimeout(arguments[1], 0), Promise.resolve()
                    }, window.RTCPeerConnection.prototype.close = function() { this.transceivers.forEach(function(e) { e.iceTransport && e.iceTransport.stop(), e.dtlsTransport && e.dtlsTransport.stop(), e.rtpSender && e.rtpSender.stop(), e.rtpReceiver && e.rtpReceiver.stop() }), this._updateSignalingState("closed") }, window.RTCPeerConnection.prototype._updateSignalingState = function(e) {
                        this.signalingState = e;
                        var t = new Event("signalingstatechange");
                        this.dispatchEvent(t), null !== this.onsignalingstatechange && this.onsignalingstatechange(t)
                    }, window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
                        var e = new Event("negotiationneeded");
                        this.dispatchEvent(e), null !== this.onnegotiationneeded && this.onnegotiationneeded(e)
                    }, window.RTCPeerConnection.prototype._updateConnectionState = function() {
                        var e, t = this,
                            n = { "new": 0, closed: 0, connecting: 0, checking: 0, connected: 0, completed: 0, failed: 0 };
                        if (this.transceivers.forEach(function(e) { n[e.iceTransport.state]++, n[e.dtlsTransport.state]++ }), n.connected += n.completed, e = "new", n.failed > 0 ? e = "failed" : n.connecting > 0 || n.checking > 0 ? e = "connecting" : n.disconnected > 0 ? e = "disconnected" : n["new"] > 0 ? e = "new" : (n.connected > 0 || n.completed > 0) && (e = "connected"), e !== t.iceConnectionState) {
                            t.iceConnectionState = e;
                            var i = new Event("iceconnectionstatechange");
                            this.dispatchEvent(i), null !== this.oniceconnectionstatechange && this.oniceconnectionstatechange(i)
                        }
                    }, window.RTCPeerConnection.prototype.createOffer = function() {
                        var e = this;
                        if (this._pendingOffer) throw new Error("createOffer called while there is a pending offer.");
                        var t;
                        1 === arguments.length && "function" != typeof arguments[0] ? t = arguments[0] : 3 === arguments.length && (t = arguments[2]);
                        var n = [],
                            r = 0,
                            o = 0;
                        if (this.localStreams.length && (r = this.localStreams[0].getAudioTracks().length, o = this.localStreams[0].getVideoTracks().length), t) {
                            if (t.mandatory || t.optional) throw new TypeError("Legacy mandatory/optional constraints not supported.");
                            void 0 !== t.offerToReceiveAudio && (r = t.offerToReceiveAudio), void 0 !== t.offerToReceiveVideo && (o = t.offerToReceiveVideo)
                        }
                        for (this.localStreams.length && this.localStreams[0].getTracks().forEach(function(e) { n.push({ kind: e.kind, track: e, wantReceive: "audio" === e.kind ? r > 0 : o > 0 }), "audio" === e.kind ? r-- : "video" === e.kind && o-- }); r > 0 || o > 0;) r > 0 && (n.push({ kind: "audio", wantReceive: !0 }), r--), o > 0 && (n.push({ kind: "video", wantReceive: !0 }), o--);
                        var s = i.writeSessionBoilerplate(),
                            a = [];
                        n.forEach(function(t, n) {
                            var r, o, s = t.track,
                                c = t.kind,
                                u = i.generateIdentifier(),
                                l = e.usingBundle && n > 0 ? { iceGatherer: a[0].iceGatherer, iceTransport: a[0].iceTransport, dtlsTransport: a[0].dtlsTransport } : e._createIceAndDtlsTransports(u, n),
                                d = RTCRtpSender.getCapabilities(c),
                                f = [{ ssrc: 1001 * (2 * n + 1) }];
                            s && (r = new RTCRtpSender(s, l.dtlsTransport)), t.wantReceive && (o = new RTCRtpReceiver(l.dtlsTransport, c)), a[n] = { iceGatherer: l.iceGatherer, iceTransport: l.iceTransport, dtlsTransport: l.dtlsTransport, localCapabilities: d, remoteCapabilities: null, rtpSender: r, rtpReceiver: o, kind: c, mid: u, sendEncodingParameters: f, recvEncodingParameters: null }
                        }), this.usingBundle && (s += "a=group:BUNDLE " + a.map(function(e) { return e.mid }).join(" ") + "\r\n"), n.forEach(function(t, n) {
                            var r = a[n];
                            s += i.writeMediaSection(r, r.localCapabilities, "offer", e.localStreams[0])
                        }), this._pendingOffer = a;
                        var c = new RTCSessionDescription({ type: "offer", sdp: s });
                        return arguments.length && "function" == typeof arguments[0] && window.setTimeout(arguments[0], 0, c), Promise.resolve(c)
                    }, window.RTCPeerConnection.prototype.createAnswer = function() {
                        var e = this,
                            t = i.writeSessionBoilerplate();
                        this.usingBundle && (t += "a=group:BUNDLE " + this.transceivers.map(function(e) { return e.mid }).join(" ") + "\r\n"), this.transceivers.forEach(function(n) {
                            var r = e._getCommonCapabilities(n.localCapabilities, n.remoteCapabilities);
                            t += i.writeMediaSection(n, r, "answer", e.localStreams[0])
                        });
                        var n = new RTCSessionDescription({ type: "answer", sdp: t });
                        return arguments.length && "function" == typeof arguments[0] && window.setTimeout(arguments[0], 0, n), Promise.resolve(n)
                    }, window.RTCPeerConnection.prototype.addIceCandidate = function(e) {
                        if (null === e) this.transceivers.forEach(function(e) { e.iceTransport.addRemoteCandidate({}) });
                        else {
                            var t = e.sdpMLineIndex;
                            if (e.sdpMid)
                                for (var n = 0; n < this.transceivers.length; n++)
                                    if (this.transceivers[n].mid === e.sdpMid) { t = n; break }
                            var r = this.transceivers[t];
                            if (r) {
                                var o = Object.keys(e.candidate).length > 0 ? i.parseCandidate(e.candidate) : {};
                                if ("tcp" === o.protocol && 0 === o.port) return;
                                if ("1" !== o.component) return;
                                "endOfCandidates" === o.type && (o = {}), r.iceTransport.addRemoteCandidate(o);
                                var s = i.splitSections(this.remoteDescription.sdp);
                                s[t + 1] += (o.type ? e.candidate.trim() : "a=end-of-candidates") + "\r\n", this.remoteDescription.sdp = s.join("")
                            }
                        }
                        return arguments.length > 1 && "function" == typeof arguments[1] && window.setTimeout(arguments[1], 0), Promise.resolve()
                    }, window.RTCPeerConnection.prototype.getStats = function() {
                        var e = [];
                        this.transceivers.forEach(function(t) {
                            ["rtpSender", "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach(function(n) { t[n] && e.push(t[n].getStats()) })
                        });
                        var t = arguments.length > 1 && "function" == typeof arguments[1] && arguments[1];
                        return new Promise(function(n) {
                            var i = new Map;
                            Promise.all(e).then(function(e) { e.forEach(function(e) { Object.keys(e).forEach(function(t) { i.set(t, e[t]), i[t] = e[t] }) }), t && window.setTimeout(t, 0, i), n(i) })
                        })
                    }
                },
                attachMediaStream: function(e, t) { r("DEPRECATED, attachMediaStream will soon be removed."), e.srcObject = t },
                reattachMediaStream: function(e, t) { r("DEPRECATED, reattachMediaStream will soon be removed."), e.srcObject = t.srcObject }
            };
        t.exports = { shimPeerConnection: o.shimPeerConnection, shimGetUserMedia: e("./getusermedia"), attachMediaStream: o.attachMediaStream, reattachMediaStream: o.reattachMediaStream }
    }, { "../utils": 48, "./getusermedia": 44, sdp: 24 }],
    44: [function(e, t, n) {
        "use strict";
        t.exports = function() {
            var e = function(e) { return { name: { PermissionDeniedError: "NotAllowedError" }[e.name] || e.name, message: e.message, constraint: e.constraint, toString: function() { return this.name } } },
                t = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            navigator.mediaDevices.getUserMedia = function(n) { return t(n)["catch"](function(t) { return Promise.reject(e(t)) }) }
        }
    }, {}],
    45: [function(e, t, n) {
        "use strict";
        var i = e("../utils").log,
            r = e("../utils").browserDetails,
            o = {
                shimOnTrack: function() {
                    "object" != typeof window || !window.RTCPeerConnection || "ontrack" in window.RTCPeerConnection.prototype || Object.defineProperty(window.RTCPeerConnection.prototype, "ontrack", {
                        get: function() { return this._ontrack },
                        set: function(e) {
                            this._ontrack && (this.removeEventListener("track", this._ontrack), this.removeEventListener("addstream", this._ontrackpoly)), this.addEventListener("track", this._ontrack = e), this.addEventListener("addstream", this._ontrackpoly = function(e) {
                                e.stream.getTracks().forEach(function(t) {
                                    var n = new Event("track");
                                    n.track = t, n.receiver = { track: t }, n.streams = [e.stream], this.dispatchEvent(n)
                                }.bind(this))
                            }.bind(this))
                        }
                    })
                },
                shimSourceObject: function() { "object" == typeof window && (!window.HTMLMediaElement || "srcObject" in window.HTMLMediaElement.prototype || Object.defineProperty(window.HTMLMediaElement.prototype, "srcObject", { get: function() { return this.mozSrcObject }, set: function(e) { this.mozSrcObject = e } })) },
                shimPeerConnection: function() {
                    if ("object" == typeof window && (window.RTCPeerConnection || window.mozRTCPeerConnection)) {
                        window.RTCPeerConnection || (window.RTCPeerConnection = function(e, t) {
                            if (r.version < 38 && e && e.iceServers) {
                                for (var n = [], i = 0; i < e.iceServers.length; i++) {
                                    var o = e.iceServers[i];
                                    if (o.hasOwnProperty("urls"))
                                        for (var s = 0; s < o.urls.length; s++) {
                                            var a = { url: o.urls[s] };
                                            0 === o.urls[s].indexOf("turn") && (a.username = o.username, a.credential = o.credential), n.push(a)
                                        } else n.push(e.iceServers[i])
                                }
                                e.iceServers = n
                            }
                            return new mozRTCPeerConnection(e, t)
                        }, window.RTCPeerConnection.prototype = mozRTCPeerConnection.prototype, mozRTCPeerConnection.generateCertificate && Object.defineProperty(window.RTCPeerConnection, "generateCertificate", { get: function() { return mozRTCPeerConnection.generateCertificate } }), window.RTCSessionDescription = mozRTCSessionDescription, window.RTCIceCandidate = mozRTCIceCandidate), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(e) {
                            var t = RTCPeerConnection.prototype[e];
                            RTCPeerConnection.prototype[e] = function() { return arguments[0] = new("addIceCandidate" === e ? RTCIceCandidate : RTCSessionDescription)(arguments[0]), t.apply(this, arguments) }
                        });
                        var e = RTCPeerConnection.prototype.addIceCandidate;
                        RTCPeerConnection.prototype.addIceCandidate = function() { return null === arguments[0] ? Promise.resolve() : e.apply(this, arguments) };
                        var t = function(e) { var t = new Map; return Object.keys(e).forEach(function(n) { t.set(n, e[n]), t[n] = e[n] }), t },
                            n = RTCPeerConnection.prototype.getStats;
                        RTCPeerConnection.prototype.getStats = function(e, i, r) { return n.apply(this, [e || null]).then(function(e) { return t(e) }).then(i, r) }
                    }
                },
                attachMediaStream: function(e, t) { i("DEPRECATED, attachMediaStream will soon be removed."), e.srcObject = t },
                reattachMediaStream: function(e, t) { i("DEPRECATED, reattachMediaStream will soon be removed."), e.srcObject = t.srcObject }
            };
        t.exports = { shimOnTrack: o.shimOnTrack, shimSourceObject: o.shimSourceObject, shimPeerConnection: o.shimPeerConnection, shimGetUserMedia: e("./getusermedia"), attachMediaStream: o.attachMediaStream, reattachMediaStream: o.reattachMediaStream }
    }, { "../utils": 48, "./getusermedia": 46 }],
    46: [function(e, t, n) {
        "use strict";
        var i = e("../utils").log,
            r = e("../utils").browserDetails;
        t.exports = function() {
            var e = function(e) { return { name: { SecurityError: "NotAllowedError", PermissionDeniedError: "NotAllowedError" }[e.name] || e.name, message: { "The operation is insecure.": "The request is not allowed by the user agent or the platform in the current context." }[e.message] || e.message, constraint: e.constraint, toString: function() { return this.name + (this.message && ": ") + this.message } } },
                t = function(t, n, o) {
                    var s = function(e) {
                        if ("object" != typeof e || e.require) return e;
                        var t = [];
                        return Object.keys(e).forEach(function(n) {
                            if ("require" !== n && "advanced" !== n && "mediaSource" !== n) {
                                var i = e[n] = "object" == typeof e[n] ? e[n] : { ideal: e[n] };
                                if ((void 0 !== i.min || void 0 !== i.max || void 0 !== i.exact) && t.push(n), void 0 !== i.exact && ("number" == typeof i.exact ? i.min = i.max = i.exact : e[n] = i.exact, delete i.exact), void 0 !== i.ideal) {
                                    e.advanced = e.advanced || [];
                                    var r = {};
                                    r[n] = "number" == typeof i.ideal ? { min: i.ideal, max: i.ideal } : i.ideal, e.advanced.push(r), delete i.ideal, Object.keys(i).length || delete e[n]
                                }
                            }
                        }), t.length && (e.require = t), e
                    };
                    return t = JSON.parse(JSON.stringify(t)), r.version < 38 && (i("spec: " + JSON.stringify(t)), t.audio && (t.audio = s(t.audio)), t.video && (t.video = s(t.video)), i("ff37: " + JSON.stringify(t))), navigator.mozGetUserMedia(t, n, function(t) { o(e(t)) })
                },
                n = function(e) { return new Promise(function(n, i) { t(e, n, i) }) };
            if (navigator.mediaDevices || (navigator.mediaDevices = { getUserMedia: n, addEventListener: function() {}, removeEventListener: function() {} }), navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function() {
                    return new Promise(function(e) {
                        var t = [{ kind: "audioinput", deviceId: "default", label: "", groupId: "" }, { kind: "videoinput", deviceId: "default", label: "", groupId: "" }];
                        e(t)
                    })
                }, r.version < 41) {
                var o = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
                navigator.mediaDevices.enumerateDevices = function() { return o().then(void 0, function(e) { if ("NotFoundError" === e.name) return []; throw e }) }
            }
            if (r.version < 49) {
                var s = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                navigator.mediaDevices.getUserMedia = function(t) { return s(t)["catch"](function(t) { return Promise.reject(e(t)) }) }
            }
            navigator.getUserMedia = function(e, n, i) { return r.version < 44 ? t(e, n, i) : (console.warn("navigator.getUserMedia has been replaced by navigator.mediaDevices.getUserMedia"), void navigator.mediaDevices.getUserMedia(e).then(n, i)) }
        }
    }, { "../utils": 48 }],
    47: [function(e, t, n) {
        "use strict";
        var i = { shimGetUserMedia: function() { navigator.getUserMedia = navigator.webkitGetUserMedia } };
        t.exports = {
            shimGetUserMedia: i.shimGetUserMedia
        }
    }, {}],
    48: [function(e, t, n) {
        "use strict";
        var i = !0,
            r = {
                disableLog: function(e) { return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (i = e, e ? "adapter.js logging disabled" : "adapter.js logging enabled") },
                log: function() { if ("object" == typeof window) { if (i) return; "undefined" != typeof console && "function" == typeof console.log && console.log.apply(console, arguments) } },
                extractVersion: function(e, t, n) { var i = e.match(t); return i && i.length >= n && parseInt(i[n], 10) },
                detectBrowser: function() {
                    var e = {};
                    if (e.browser = null, e.version = null, e.minVersion = null, "undefined" == typeof window || !window.navigator) return e.browser = "Not a browser.", e;
                    if (navigator.mozGetUserMedia) e.browser = "firefox", e.version = this.extractVersion(navigator.userAgent, /Firefox\/([0-9]+)\./, 1), e.minVersion = 31;
                    else if (navigator.webkitGetUserMedia)
                        if (window.webkitRTCPeerConnection) e.browser = "chrome", e.version = this.extractVersion(navigator.userAgent, /Chrom(e|ium)\/([0-9]+)\./, 2), e.minVersion = 38;
                        else {
                            if (!navigator.userAgent.match(/Version\/(\d+).(\d+)/)) return e.browser = "Unsupported webkit-based browser with GUM support but no WebRTC support.", e;
                            e.browser = "safari", e.version = this.extractVersion(navigator.userAgent, /AppleWebKit\/([0-9]+)\./, 1), e.minVersion = 602
                        }
                    else {
                        if (!navigator.mediaDevices || !navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) return e.browser = "Not a supported browser.", e;
                        e.browser = "edge", e.version = this.extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2), e.minVersion = 10547
                    }
                    return e.version < e.minVersion && r.log("Browser: " + e.browser + " Version: " + e.version + " < minimum supported version: " + e.minVersion + "\n some things might not work!"), e
                }
            };
        t.exports = { log: r.log, disableLog: r.disableLog, browserDetails: r.detectBrowser(), extractVersion: r.extractVersion }
    }, {}]
}, {}, [1]);
/* global
webkitAudioContext webkitRTCPeerConnection mozRTCPeerConnection mozRTCSessionDescription mozRTCIceCandidate webkitOfflineAudioContext define getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/