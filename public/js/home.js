$(document).ready(function(){
    sizeBackground();
    var count = 0;
    setInterval(function() {
        var hue=Math.random()*100;
        var saturation='80%';
        var lightness='70%';
        var hsla="hsla(" + hue +"," + saturation +"," + lightness +",1);"
        /*var left=Math.random()*$('#background-wrapper').width();
        var top=Math.random()*$('#background-wrapper').height();
        var distance=10000;
        $('.popup').each(function() {
            var pos=$(this).position();
            var new_distance=Math.sqrt(Math.pow(pos.left-left,2)+Math.pow(pos.top-top,2));
            if(new_distance<distance) {
                distance=new_distance;
            }
        });
        var count = 0;
        while (distance < 100 && count < 100) {
            distance = 10000;
            count++;
            left=Math.random()*$('#background-wrapper').width();
            top=Math.random()*$('#background-wrapper').height();
            $('.popup').each(function() {
                var pos=$(this).position();
                var new_distance=Math.sqrt(Math.pow(pos.left-left,2)+Math.pow(pos.top-top,2));
                if(new_distance<distance) {
                    distance=new_distance;
                }
            });
            console.log(distance);
        }*/
        var left=Math.random()*$('#background-wrapper').width();
        left=left/$('#background-wrapper').width()*100+'%;';
        var top='90%;'//top/$('#background-wrapper').height()*100+'%;';
        var style = "style='position: absolute; background-color:"+hsla+"left:" + left + "top:" + top +"'";
        var html=$("<div class='popup' "+ style + ">aasdfjasdflufbvakf<br/>aasdfjasdflufbvakf<br/>aasdfjasdflufbvakf<br/></div>");
        $('#background-wrapper').prepend(html);
        $(html).animate({
            opacity:0.75
        },2000);
        $(html).animate({
            top:'-200px'
        }, {duration: 8000, complete: function(){
            $(this).remove();
        }, queue: false});
    }, 1000);

    $(window).resize(function() {
        sizeBackground();
    });

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

    function switchToTab(url, time) {
        if (url=="search") {
            hideHomeTab("tab-directions");
            showHomeTab("tab-search",time);
        } else if (url=="directions") {
            hideHomeTab("tab-search");
            showHomeTab("tab-directions",time);
        }
    }
    function showHomeTab(tab, time) {
        var newId = document.getElementById(tab + "-content");
        var currentId = document.getElementById(tab);
        $(currentId).addClass("active");
        $(newId).fadeIn(time);
    }
    function hideHomeTab(tab) {
        var newId = document.getElementById(tab + "-content");
        //console.log(newId);
        var currentId = document.getElementById(tab);
        $(currentId).removeClass("active");
        $(newId).hide();
    }
});