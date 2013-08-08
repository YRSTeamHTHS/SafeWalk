$(document).ready(function(){
    sizeBackground();//adjust size of background image
    var count = 0;//running count of bubbles on the screen

    //connect to socket.io
    var socket = io.connect('/');
    socket.on('livereport', function (data) {
        newBubble(data.report)//@todo poopy nested report
    });

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

});