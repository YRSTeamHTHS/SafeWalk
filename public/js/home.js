var rssoutput="";
var feedurl="http://weather.yahooapis.com/forecastrss?w=12695841&u=c";
var feedlimit=10;
var re = new RegExp("Current Conditions:\n(.*), (.*)\nForecast:");
var condition="";
var temperature="";

function setBackground(condition, temperature) {
    if ($.inArray(condition, ['clear (night)','sunny', 'fair (night)', 'fair (day)', 'hot', 'haze', 'smoky']) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/clear.jpg")');
    }
    else if ($.inArray(condition, ['mostly cloudy (night)', "mostly cloudy (day)", "partly cloudy (night)", "partly cloudy (day)"]) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/partly-cloudy.jpg")');
    }
    else if ($.inArray(condition, ["tropical storm", "hurricane", "mixed rain and snow", "mixed rain and sleet", "freezing drizzle", "drizzle", "freezing rain", "showers", "hail", "sleet", "mixed rain and hail", "scattered showers"]) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/rain.jpg")');
    }
    else if ($.inArray(condition, ["severe thunderstorms", "thunderstorms", "isolated thunderstorms", "scattered thunderstorms", "thundershowers", "isolated thundershowers"]) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/lightning.jpg")');
    }
    else if ($.inArray(condition, ["snow flurries", "mixed snow and sleet", "light snow showers", "blowing snow", "snow", "heavy snow", "scattered snow showers", "heavy snow", "snow showers"]) !=-1) {
        $('#background-wrapper').css('background', 'url("/img/weather/snow.jpg")');
    }
    else {
        $('#background-wrapper').css('background', 'url("/img/weather/cloudy.jpg")');
    }
    $('#weather').html(temperature);
}

$(document).ready(function(){
    function displayfeed(result){
        if (!result.error){
            var thefeeds=result.feed.entries;
            for (var i=0; i<thefeeds.length; i++) {
                rssoutput+=thefeeds[i].contentSnippet;
            }
        }
        condition=rssoutput.match(re)[1];
        temperature=rssoutput.match(re)[2];
        setBackground(condition, temperature);
        sizeBackground();
    }
    function rssfeedsetup(){
        var feedpointer=new google.feeds.Feed(feedurl);
        feedpointer.setNumEntries(feedlimit);
        feedpointer.load(displayfeed);
    }

    rssfeedsetup();
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
                window.tabs.switchToTab(url, 0);
            } else if (event.type=='push' || event.type=='change') {
                //console.log('push/change' + ': ' + url);
                window.tabs.switchToTab(url, 200);
            }
        }
    }).listen('hash');
    $('body').on('click', 'a', function(event) {
        $.history.push($(this).attr('href'));
        event.preventDefault();
    });
});

window.tabs = new function() {
    /**
     * switch to tab based on url anchor
     * @param url
     * @param time
     */
    this.switchToTab = function(url, time) {
        if (url=="search") {
            this.hideHomeTab("tab-directions");
            this.showHomeTab("tab-search", time);
        } else if (url=="directions") {
            this.hideHomeTab("tab-search");
            this.showHomeTab("tab-directions", time);
        }
    };

    /**
     * make home tab active
     * @param tab
     * @param time
     */
    this.showHomeTab = function(tab, time) {
        var newId = document.getElementById(tab + "-content");
        var currentId = document.getElementById(tab);
        $(currentId).addClass("active");
        $(newId).fadeIn(time);
    };

    /**
     * make home tab inactive
     * @param tab
     */
    this.hideHomeTab = function(tab) {
        var newId = document.getElementById(tab + "-content");
        //console.log(newId);
        var currentId = document.getElementById(tab);
        $(currentId).removeClass("active");
        $(newId).hide();
    };
};