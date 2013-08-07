$(document).ready(function(){
    sizeBackground();//adjust size of background image
    var count = 0;//running count of bubbles on the screen

    //connect to socket.io
    var socket = io.connect('/');
    socket.on('livereport', function (data) {
        newBubble(data.report)//@todo poopy nested report
        //socket.emit('my other event', { my: 'data' });
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
        console.log("new bubble")
        type = report.type
        comment = report.comment
        console.log(report)
        console.log (report.type)
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


/**
 * functions for toggling between search and directions tabs
 */
$(function() {
    $.history.on('load change push pushed', function(event, url, type) {
        if (url=="search"||url=="directions") {
            if (event.type=='load') {
                //console.log('load' + ': ' + url);
                switchToTab(url, 0);
            } else if (event.type=='push' || event.type=='change') {
                //console.log('push/change' + ': ' + url);
                switchToTab(url, 200);
            }
        }
    }).listen('hash');
    $('body').on('click', 'a', function(event) {
        $.history.push($(this).attr('href'));
        event.preventDefault();
    });

    /**
     * switch to tab based on url anchor
     * @param url
     * @param time
     */
    function switchToTab(url, time) {
        if (url=="search") {
            hideHomeTab("tab-directions");
            showHomeTab("tab-search",time);
        } else if (url=="directions") {
            hideHomeTab("tab-search");
            showHomeTab("tab-directions",time);
        }
    }

    /**
     * make home tab active
     * @param tab
     * @param time
     */
    function showHomeTab(tab, time) {
        var newId = document.getElementById(tab + "-content");
        var currentId = document.getElementById(tab);
        $(currentId).addClass("active");
        $(newId).fadeIn(time);
    }

    /**
     * make home tab inactive
     * @param tab
     */
    function hideHomeTab(tab) {
        var newId = document.getElementById(tab + "-content");
        //console.log(newId);
        var currentId = document.getElementById(tab);
        $(currentId).removeClass("active");
        $(newId).hide();
    }
});