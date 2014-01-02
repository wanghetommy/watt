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
