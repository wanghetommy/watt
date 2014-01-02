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

        //TODO 判断attr是否为cb？
        //attr为此Presenter的成员属性


        if(typeof cb != "function"){
            throw new Error("Handler is required in Presenter");
        }

        watt.apply(this,watt.apply({
            once:false
        }, attr));
        var _ = this;
        watt[this.once?'one':'on'](ns,name,function (view,model) {
            cb.call(_,view,model);
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
        Presenter : function(ns,name,attr,cb) {
            return new watt['mvp'].Presenter(ns,name,attr,cb);
        }
    },0);

    return {Presenter:Presenter};
});
