/**
 * Created with IntelliJ IDEA.
 * User: wanghe
 * Date: 13-12-24
 * Time: 上午9:30
 * To change this template use File | Settings | File Templates.
 */
console.log("===================bus");
watt.on("events/a",function () {
    console.log("i'm events-a1");
});

watt.on("events/a",function () {
    console.log("i'm events-a2");
});

watt.on("events-b events-c events-e",function () {
    console.log("i'm events-b&c");
});

watt.one("events-d",function () {
    var a = 10/g;
    console.log("i'm events-d");
});

watt.on("error",function (e) {
    console.log("Error:"+ e.message);
});
watt.emit("events/a");
watt.emit("events/a");
console.log("===emit events/a");
watt.emit("events-b");
console.log("===emit events-b");
watt.emit("events-d");
watt.emit("events-d");
console.log("===emit events-d");
watt.off("events/a");
watt.emit("events/a");
console.log("===emit events-a");

watt.emit("events-c");
console.log("===================presenter");


watt.Presenter("abc/def",function (data){



  console.log("hello def/efg");
});

watt.emit("abc/def");












