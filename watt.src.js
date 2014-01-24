/**
* watt Library v0.9.0 https://github.com/wanghetommy/watt/
* @date 2014-01-24 06:11
* @author taylor wong
* @Copyright 2013 wanghetommy@gmail.com Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/;
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

/**
 * bus.js - The browser-bus
 * @author wanghe
 */
watt.ns('bus',function(watt){

    watt.WVS.BUS = {};

    var Bus = function (ns){
        this.ns = ns || this._DEF_NAMESPACE;
        this.events={};
        if(watt.WVS.BUS[this.ns])
        return watt.WVS.BUS[this.ns];
        watt.WVS.BUS[this.ns] = this;
        return this;
    }

    Bus.prototype = {
        _DEF_NAMESPACE:'_defaultNS',
        /**
         * Bind events
         * @param name A string containing One or more space-separated event types.
         * @param callback A function to execute at the time the event is triggered.
         * @return {*}
         */
        on : function(name, callback) {
            var events = name.split(/\s+/),event;
            if(callback&&typeof callback == "function"){
                while (event = events.shift()) {
                    (this.events[event] || (this.events[event] = [])).push(callback);
                }
            }
            return this;
        },
        /**
         * Remove events.
         * If `callback` is undefined, remove all callbacks for the event types.
         * If `name` and `callback` are both undefined, remove all callbacks for all event types
         * @param name name of events
         * @param callback the handler of given event types.
         * @return {*}
         */
        off : function(name, callback) {
            if (!(name || callback)) {
                this.events = {};
            }else{
                var events = name.split(/\s+/),event,calls;
                while (event = events.shift()) {
                    calls = this.events[event];
                    if (calls) {
                        if (callback) {
                            for (var i = calls.length - 1; i >= 0; i--) {
                                if (calls[i] === callback) {
                                    calls.splice(i, 1)
                                }
                            }
                        }
                        else {
                            delete this.events[event];
                        }
                    }
                }
            }
            return this
        },
        /**
         * Bind once events
         * The handler is executed at most once per event type.
         * @param name A string containing One or more space-separated event types.
         * @param callback A function to execute at the time the event is triggered.
         */
        one:function (name, callback) {
            var that = this;
            var cb = function() {
                that.off(name, cb);
                callback.apply(this, arguments);
            }
            this.on(name, cb);
        },
        /**
         * Execute all handlers for the given event types.
         * @param name A string containing One or more space-separated event types
         * @param data Additional parameters to pass along to the event handler.
         * @param scope context of handler when it was executed.
         * @return {*}
         */
        emit : function(name, data , scope) {
            var events = name.split(/\s+/),event,calls,call;

            while (event = events.shift()) {
                //Copy callback lists to prevent modification.
                calls = (this.events[event]||[]).slice();
                while (call = calls.shift()) {
                    //aop------filter?
                    try{
                        call.apply(scope||this,data||[]);
                    }catch (e){
                        this.emit('error',[e],this);
                    }
                }
            }
            return this;
        }
    }

    var handler = function (args,handler) {
        if(args.length == 4){
            //ns,name,data ,scope
            if(typeof args[1] != "string"){
                args[3] = args[2];
                args[2] = args[1];
                args[1] = args[0];
                args[0] = watt['bus'].Bus._DEF_NAMESPACE;
            }
        }else{
            //ns, name, callback
            if(typeof args[1] == "function"){
                args[2] = args[1];
                args[1] = args[0];
                args[0] = watt['bus'].Bus._DEF_NAMESPACE;
            }
        }
        var buses = args.shift().split(/\s+/g),bus,_bus;
        while (bus = buses.shift()) {
            _bus = watt.WVS.BUS[bus||watt['bus'].Bus._DEF_NAMESPACE];
            if(_bus){
                _bus[handler].apply(_bus,args);
            }
        }
    }

    watt.ns({
        /**
         * Bind events
         * @param ns namespace of bus.
         * @param name A string containing One or more space-separated event types.
         * @param callback A function to execute at the time the event is triggered.
         * @return {*}
         */
        on : function(ns, name, callback) {
            handler([ns, name, callback],'on');
            return this;
        },
        /**
         * Remove events.
         * If `callback` is undefined, remove all callbacks for the event types.
         * If `name` and `callback` are both undefined, remove all callbacks for all event types
         * @param ns namespace of bus.
         * @param name name of events
         * @param callback the handler of given event types.
         * @return {*}
         */
        off : function(ns,name, callback) {
            handler([ns, name, callback],'off');
            return this
        },
        /**
         * Bind once events
         * The handler is executed at most once per event type.
         * @param ns namespace of bus.
         * @param name A string containing One or more space-separated event types.
         * @param callback A function to execute at the time the event is triggered.
         */
        one:function (ns,name, callback) {
            handler([ns, name, callback],'one');
            return this;
        },
        /**
         * Execute all handlers for the given event types.
         * @param ns namespace of bus.
         * @param name A string containing One or more space-separated event types
         * @param data A array.Additional parameters to pass along to the event handler.
         * @param scope context of handler when it was executed.
         * @return {*}
         */
        emit : function(ns,name,data ,scope) {
            handler([ns,name,data ,scope],'emit');
            return this;
        },
        Bus:function (ns) {
            new watt['bus'].Bus(ns);
        }
    },0);

    /**
     * build a bus use default namespace
     */
    return {Bus:new Bus()};
});

/**
 * watt.presenter.js - The Presenter of mvp
 * @author wanghe
 */
watt.ns('mvp',function(watt){

    var Presenter = function (ns,name,attr,cb){

        //ns, name, callback
        if(typeof name == "function"||typeof name == "object"){
            cb = attr;
            attr = name;
            name = ns;
            ns = watt['bus'].Bus._DEF_NAMESPACE;
        }

        if(typeof attr == "function"){
            cb = attr;
        }

        if(typeof cb != "function"){
            throw new Error("Handler is required in Presenter");
        }

        var _ = this;

        watt.apply(_,watt.apply({
            once:false
        }, attr));

        watt[this.once?'one':'on'](ns,name,function () {
            cb.apply(_,arguments);
        },this);

    }

    Presenter.prototype = {

        /**
         * render model to view
         * @param view
         * @param model
         */
        render : function(view,model) {}
    }


    watt.ns({
        /**
         *
         * @param ns
         * @param name
         * @param attr member variable
         * @param cb   call back func
         * @return {watt['mvp'].Presenter}
         * @constructor
         */
        Presenter : function(ns,name,attr,cb) {
            return new watt['mvp'].Presenter(ns,name,attr,cb);
        }
    },0);

    return {Presenter:Presenter};
});
