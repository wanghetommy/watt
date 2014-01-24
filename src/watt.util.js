/**
 * Created with IntelliJ IDEA.
 *
 * User: taylor
 * Date: 14-1-3
 * Time: 上午11:39
 */
/**
 * @author wanghe
 */
watt.ns('util',function(watt){

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    return {
        each : function(t,f,s,d) {
            var j = t.length, r;
            for ( var i = 0; i < j; i++) {
                if (d&&isArray(t[i])) {
                    watt['util'].each(t[i],f, s);
                } else {
                    r = f.call(s||t, t[i],i);
                    if (typeof r === "boolean" && !r) {
                        break;
                    }
                }
            }
        },
        eachAll : function(t,f,s) {
            this.each(t,f,s,true);
        },
        sor : function(t,f) {
            var L = t.length-1,T;
            for(var i = 0; i < L; i++){
                for (var j = L; j > i;j--) {
                    if (f ? !f(t[j], t[j - 1]) : (t[j] < t[j - 1])) {
                        T = t[j];
                        t[j] = t[j - 1];
                        t[j - 1] = T;
                    }
                }
            }
        }
    }
});
