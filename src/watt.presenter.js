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
