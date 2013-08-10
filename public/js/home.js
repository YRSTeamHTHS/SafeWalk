/**
 * adjusts background image sized based on ratio of window height and width
 */
function sizeBackground() {
    ratio=$(window).width()/($(window).height()-60);
    imgRatio=1.33;
    if (ratio < imgRatio) {
        height=($(window).height()-60);
        width=height*imgRatio;
        height=height+'px';
        width=width+'px';
    } else {
        width=$(window).width();
        height=width*(1/imgRatio);
        height=height+'px';
        width=width+'px';
    }
    dim=width + ' ' + height;
    $('#background-wrapper').css('backgroundSize', dim);
}

$.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D%2212695841%22&format=json&u=c', function(data) {
    var thing=data.query.results.channel.item.condition;
    var temperature=Math.round(5/9*(parseInt(thing.temp)-32))+'&#176; C';
    var code=parseInt(thing.code);
    var condition=thing.text;
    if ($.inArray(code,[31,32,33,34,36,24,25]) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/clear.jpg")');
    }
    else if ($.inArray(code,[27,28,29,30]) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/partly-cloudy.jpg")');
    }
    else if ($.inArray(code,[1,2,5,6,8,9,10,11,12,17,18,35,40]) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/rain.jpg")');
    }
    else if ($.inArray(code,[3,4,37,38,39,45,47]) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/lightning.jpg")');
    }
    else if ($.inArray(code,[13,7,14,15,16,41,42,43,46]) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/snow.jpg")');
    }
    else {
        $('#background-wrapper').css('background', 'url("/img/weather/cloudy.jpg")');
    }

    var imgUrl = $('#background-wrapper').css('backgroundImage');
    $('<img>').attr('src',function(){
        imgUrl = imgUrl .substring(4, imgUrl.length-1);
        return imgUrl;
    }).load(function(){
        sizeBackground();
    });

    $('#weather').html(temperature + ' – ' + condition);
});

$(document).ready(function(){

    sizeBackground();
    //adjust size of background image
    var count = 0;//running count of bubbles on the screen

    //connect to socket.io
    try {
        var socket = io.connect('/');
        socket.on('livereport', function (data) {
            newBubble(data.report)//@todo poopy nested report
        });
    } catch(err) {

    }

    /**
     * creates a new bubble in a random location
     *
     * @param timestamp     of comment
     * @param type          of comment
     * @param comment       of comment
     * @return bubble       html
     */
    function newBubble(report) {
        type = report.type;
        comment = report.comment;
        var hue=Math.random()*100;
        var saturation='80%';
        var lightness='70%';
        var hsla="hsla(" + hue +"," + saturation +"," + lightness +",1);"

        var left=Math.random()*$('#background-wrapper').width();
        left=left/$('#background-wrapper').width()*100+'%;';
        var top='90%;'//top/$('#background-wrapper').height()*100+'%;';
        var style = "style='position: absolute; background-color:"+hsla+"left:" + left + "top:" + top +"'";
        var html=$("<div class='popup' "+ style + ">"+type+"<br/>"+comment+"<br/></div>");
        $('#background-wrapper').prepend(html);
        $(html).animate({
            opacity:0.75
        },2000);
        $(html).animate({
            top:'-200px'
        }, {duration: 8000, complete: function(){
            $(this).remove();
        }, queue: false});
    }

    /**
     * adjusts background image size when window is resized
     */
    $(window).resize(function() {
        sizeBackground();
    });

});
