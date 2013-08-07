$(document).ready(function(){
    sizeBackground();

    setInterval(function() {
        var hue=Math.random()*100;
        var saturation=100;
        var lightness=36;
        var hsla="hsla(" + hue +"," + saturation +"," + lightness +",0);"
        var style = "style='background-color:'"
        $('#background-wrapper').append("<div class='popup' "+"style='" + style + "'>asdf</div>");
    }, 500);

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