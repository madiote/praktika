L.Indoor = L.Layer.extend({
    options: {
        getLevel: function (e) {
            return e.properties.level
        }
    },
    initialize: function (e, t) {
        L.setOptions(this, t), t = this.options;
        var l = this._layers = {};
        if (this._map = null, "level" in this.options ? this._level = this.options.level : this._level = null, "onEachFeature" in this.options) var n = this.options.onEachFeature;
        this.options.onEachFeature = function (e, i) {
            if (n && n(e, i), "markerForFeature" in t) {
                var o = t.markerForFeature(e);
                if (void 0 !== o) {
                    o.on("click", function (e) {
                        i.fire("click", e)
                    });
                    var s = t.getLevel(e);
                    if (void 0 === s) console.warn("level undefined for"), console.log(e);
                    else {
                        function r(e) {
                            l[e].addLayer(o)
                        }
                        L.Util.isArray(s) ? s.forEach(r) : r(s)
                    }
                }
            }
        }, this.addData(e)
    },
    addTo: function (e) {
        return e.addLayer(this), this
    },
    onAdd: function (e) {
        if (this._map = e, null === this._level) {
            var t = this.getLevels();
            0 !== t.length && (this._level = t[0])
        }
        null !== this._level && this._level in this._layers && this._map.addLayer(this._layers[this._level])
    },
    onRemove: function (e) {
        this._level in this._layers && this._map.removeLayer(this._layers[this._level]), this._map = null
    },
    addData: function (e) {
        if (null !== e) {
            var t = this._layers,
                l = this.options;
            (L.Util.isArray(e) ? e : e.features).forEach(function (e) {
                var n = l.getLevel(e);
                null != n && "geometry" in e && (L.Util.isArray(n) ? n.forEach(function (n) {
                    (n in t ? t[n] : t[n] = L.geoJson({
                        type: "FeatureCollection",
                        features: []
                    }, l)).addData(e)
                }) : (n in t ? t[n] : t[n] = L.geoJson({
                    type: "FeatureCollection",
                    features: []
                }, l)).addData(e))
            })
        }
    },
    getLevels: function () {
        return Object.keys(this._layers)
    },
    getLevel: function () {
        return this._level
    },
    setLevel: function (e) {
        if ("object" == typeof e && (e = e.newLevel), this._level !== e) {
            var t = this._layers[this._level],
                l = this._layers[e];
            null !== this._map && (this._map.hasLayer(t) && this._map.removeLayer(t), l && this._map.addLayer(l)), this._level = e
        }
    },
    addLayerToLevel: function (e, t) {
        var l = this,
            n = this._layers,
            i = this.options;
        L.Util.isArray(e) ? e.forEach(function (e) {
            l.addLayerToLevel(e, t)
        }) : (layergroup = e in n ? n[e] : n[e] = L.geoJson({
            type: "FeatureCollection",
            features: []
        }, i), layergroup.addLayer(t))
    },
    resetStyle: function (e) {
        return e.options = e.defaultOptions, this._setLayerStyle(e, this.options.style), this
    },
    _setLayerStyle: function (e, t) {
        "function" == typeof t && (t = t(e.feature)), e.setStyle && e.setStyle(t)
    }
}), L.indoor = function (e, t) {
    return new L.Indoor(e, t)
}, L.Control.Level = L.Control.extend({
    includes: L.Evented.prototype,
    options: {
        position: "bottomright",
        parseLevel: function (e) {
            return parseFloat(e, 10)
        }
    },
    initialize: function (e) {
        L.setOptions(this, e), this._map = null, this._buttons = {}, this._listeners = [], this._level = e.level, this.addEventListener("levelchange", this._levelChange, this)
    },
    onAdd: function (e) {
        var t = L.DomUtil.create("div", "leaflet-bar leaflet-control");
        t.style.font = "18px 'Lucida Console',Monaco,monospace";
        for (var l = this._buttons, n = this._level, i = this, o = [], s = 0; s < this.options.levels.length; s++) {
            var r = this.options.levels[s],
                a = i.options.parseLevel(r);
            o.push({
                num: a,
                label: r
            })
        }
        for (o.sort(function (e, t) {
                return e.num - t.num
            }), s = o.length - 1; s >= 0; s--) {
            r = o[s].num;
            var h = o[s].label,
                u = L.DomUtil.create("a", "leaflet-button-part", t);
            r !== n && h !== n || (u.style.backgroundColor = "#b0b0b0"), u.appendChild(u.ownerDocument.createTextNode(h)),
                function (e) {
                    u.onclick = function () {
                        i.toggleLevel(e)
                    }
                }(r), l[r] = u
        }
        return t
    },
    _levelChange: function (e) {
        null !== this._map && (void 0 !== e.oldLevel && null !== e.oldLevel && (this._buttons[e.oldLevel].style.backgroundColor = "#FFFFFF"), null !== e.newLevel && (this._buttons[e.newLevel].style.backgroundColor = "#b0b0b0"))
    },
    setLevel: function (e) {
        if (e !== this._level) {
            var t = this._level;
            this._level = e, this.fireEvent("levelchange", {
                oldLevel: t,
                newLevel: e
            })
        }
    },
    toggleLevel: function (e) {
        e === this._level && (e = null), this.setLevel(e)
    },
    getLevel: function () {
        return this._level
    }
}), L.Control.level = function (e) {
    return new L.Control.Level(e)
};