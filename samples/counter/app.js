/**
 * A simple samples show multi Presenter receive the Text from input
 *
 * User: taylor
 * Date: 13-12-27
 * Time: 下午6:05
 */
$(function () {

    /**
     * define Presenter
     */
    watt.Presenter("receive",function (text){
        $("#left").append("<span class='textPanel'>"+text.toUpperCase()+"</span>");
    });


    watt.Presenter("receive",function (text){
        $("#right").append("<span class='textPanel'>"+text+"</span>");
    });


    watt.Presenter("receive",{
        number:0 //define member variable
    },function (){
        $("#mid").html(++this.number);
    });

    watt.Presenter("send",function (){
        var text = $("#inputText").val();
        if(text!=""){
            watt.emit("receive",[text]);
            $("#inputText").val("");
        }
    });


    $("#sendBtn").click(function () {
        watt.emit("send");
    });

    $("#inputText").keyup(function (e) {
        if(e.keyCode == 13){
            watt.emit("send");
        }
        e.stopPropagation();
    }).focus();


});