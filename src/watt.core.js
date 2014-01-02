;
(function (window) {
    var watt = {
        version: 0.1
    };

    /**
     * @param pka string of namespace
     * @return {*}
     */
    function NS(pka) {
        var space = watt;
        for (var i = 0; i < pka.length; i++) {
            space = (space[pka[i]] = space[pka[i]] || {});
        }
        return space;
    }

    watt.apply = function(d, e) {
        if (d && e && typeof e == "object") {
            for ( var a in e) {
                if (typeof e[a] != 'undefined')
                    d[a] = e[a]
            }
        }
        return d
    }

    /**
     * namespace manager
     * @param ns
     * @param func
     * @return {*}
     */
    watt.ns = function (ns,func) {
        var target = (typeof ns == "string")?NS(ns.split(".")):watt;

        watt.apply(target,ns);

        if(func&&typeof func == "function"){
            func = func.apply(target,[watt]);
        }

        return watt.apply(target,func);
    }

    /**
     * Watt Virtual Stack.hold all inner instance of watt.
     * @type {{}}
     */
    watt.WVS = {}


    window.watt = watt;
})(window);
