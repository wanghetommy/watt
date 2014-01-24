/**
 * Created with IntelliJ IDEA.
 * User: wanghe
 * Date: 13-12-24
 * Time: 上午9:30
 * To change this template use File | Settings | File Templates.
 */
var b = [123,12,3,"a"];
var c = ["g","f",["dd","aa"],"d","a"];
var d = [{i:8},{i:18},{i:3},{i:58},{i:28}];

watt.util.eachAll(b,function (d,i) {
    console.log(i+":=="+d);
});

console.log("===================");

watt.util.sor(b,function (a,b) {
   return a.i > b.i
});

watt.util.eachAll(b,function (d,i) {
    console.log(i+":=="+ d);
});














