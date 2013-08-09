/**
 * @see google
 */
//var google;

$(document).ready(function () {

    /*document.ontouchstart = function(e){
        e.preventDefault();
    }*/

    /*$('.addwebcam').bind('click', function(e) {
        $('#cameraformwebcam').show(); //opens up a new form
        $('.addwebcam').hide(); //now hide the button
    });*/

    //load appropriate map and also prepopulate from and to fields

    /*var ScrollFix = function(elem) {
        // Variables to track inputs
        var startY, startTopScroll;

        elem = elem || document.querySelector(elem);

        // If there is no element, then do nothing
        if(!elem)
            return;

        // Handle the start of interactions
        elem.addEventListener('touchstart', function(event){
            startY = event.touches[0].pageY;
            startTopScroll = elem.scrollTop;

            if(startTopScroll <= 0)
                elem.scrollTop = 1;

            if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
                elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
        }, false);
    };*/

    var param = _getParameters();
    switch (param.type) {
        case "search":
            $.ajax({
                url: "/navigate/search",
                data: {
                    search: param.search
                },
                success: function (data) {
                    $("#map-wrapper").html(data);
                    $("#map-directions-end").val(param.search);
                }
            });
            break;
        case "directions":
            $.ajax({
                url: "/navigate/nav",
                data: {
                    from: param.from,
                    to: param.to
                },
                success: function (data) {
                    $("#map-directions-start").val(param.from);
                    $("#map-directions-end").val(param.to);
                    $("#map-wrapper").html(data);
                }
            });
    }

    //preload some feed items
    $.getJSON('/report/getall', function (data) {
        $.each(data, function (key, val) {
            var time = _processDate(new Date(val.time));
            var type = val.type;
            var comment = val.comment;
            _createFeedItem(time,type,comment);
        });
    });


    /**
     * retrieve the get parameters and their values in a querystring
     * @returns urlParams   url parameters in object format
     * @private
     */
    function _getParameters() {
        var decode, match, pl, query, search, urlParams;
        pl = /\+/g;
        search = /([^&=]+)=?([^&]*)/g;
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        };
        query = window.location.search.substring(1);
        urlParams = {};
        while ((match = search.exec(query))) {
            urlParams[decode(match[1])] = decode(match[2]);
        }
        return urlParams;
    };

    /**
     * process a js Date object
     * @param date
     * @private
     */
    function _processDate(date) {
        var longdate = date.toDateString();
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return longdate + " @ " + time;
    }

    var isWindowSize = ($(window).width() >= 768);


    //connect to socket.io
    try {
        var socket = io.connect('/');
        socket.on('livereport', function (data) {

            data=data.report; //@todo for some reason there is a nested report
            _createFeedItem(_processDate(new Date(data.time)),data.type,data.comment);
            incrementBadge();
        });
    } catch(err) {

    }

    /**
     * dragging collapsed sidebar
     */

    var isSlideUp=0;

    $("#feed-btn,#dir-btn").mousedown(function(e){

        //highlight based on which content is already shown
        if ($("#directions").is(":visible") ) {
            $("#dir-btn").addClass("on");
            $("#feed-btn").removeClass("on");
        } else if ($("#feed").is(":visible") ) {
            $("#feed-btn").addClass("on");
            $("#dir-btn").removeClass("on");
        }

        if($(window).width() < 768 && $("#map-content").hasClass("normal")) {

            //alert(2);
            isSlideUp =1;


            $(document).mousemove(function(e){


                if (e.which===1 &&
                    $("#map-content").hasClass("normal") &&
                    e.pageY < $(window).height() &&
                    e.pageY > 0 &&
                    e.pageX < $(window).width() &&
                    e.pageX > 0
                    ) {
                    $("#map-content").height(e.pageY);
                }
                else {
                    //$("#map-content").removeClass("normal");
                    //changeMobileSidebar(true);
                    $(document).unbind("mousemove");
                    return;
                }
                return;

            });
            return;
        }
        if($(window).width() < 768 && $("#map-content").hasClass("collapsed")) {

            //alert(3);
            isSlideUp =-1;
            var latestHeight = $("#map-content").height();

            $(document).mousemove(function(e){

                /*$(document).mouseup(function(e){
                 if (Math.abs(e.pageY) - latestHeight >60) {
                 $("#map-content").removeClass("collapsed");
                 _closeMobileSidebar();
                 $(document).unbind("mousemove");
                 }
                 else {
                 $("#map-content").height(latestHeight);
                 }
                 });*/

                if (e.which ===1 &&
                    $("#map-content").hasClass("collapsed") &&
                    e.pageY < $(window).height() &&
                    e.pageY > 0 &&
                    e.pageX < $(window).width() &&
                    e.pageX > 0
                    ) {
                    $("#map-content").height(e.pageY);
                    if (Math.abs(e.pageY) - latestHeight <60){
                        $("#map-content").height('20%');
                    }

                }

                else if ($("#map-content").height() - latestHeight > 60){
                    //$("#map-content").removeClass("collapsed");
                    //_closeMobileSidebar();
                    $(document).unbind("mousemove");
                    return;
                }
                return;
            });
            return;
        }

    });


    $("#feed-btn,#dir-btn").mouseup(function() {

        if (!($("#map-content").hasClass("isUp"))) { _openMobileSidebar(500);}
        if ($("#map-content").hasClass("isUp")){ _closeMobileSidebar();}

    });

    $("#feed-btn,#dir-btn").bind('touchend', function() {

        if (!($("#map-content").hasClass("isUp"))) { _openMobileSidebar(500);}
        if ($("#map-content").hasClass("isUp")){ _closeMobileSidebar();}

    });

    /**
     * dragging mobile sidebar
     */
    $("#feed-btn,#dir-btn").bind('touchstart', function(e){

        e.preventDefault();


        //highlight based on which content is already shown
        if ($("#directions").is(":visible") ) {
            $("#dir-btn").addClass("on");
            $("#feed-btn").removeClass("on");
        } else if ($("#feed").is(":visible") ) {
            $("#feed-btn").addClass("on");
            $("#dir-btn").removeClass("on");
        }

        if($(window).width() < 768 && $("#map-content").hasClass("normal")) {
            $(document).bind('touchmove', function(e){

                e.preventDefault();
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

                if (
                    $("#map-content").hasClass("normal") &&
                    touch.pageY < $(window).height() &&
                    touch.pageY > 0 &&
                    touch.pageX < $(window).width() &&
                    touch.pageX > 0
                    ) {
                    $("#map-content").height(touch.pageY);
                }
                else {
                    $("#map-content").removeClass("normal");
                    changeMobileSidebar(true);
                    $(document).unbind("touchmove");
                    return;
                }
                return;

            });
            return;
        }
        if($(window).width() < 768 && $("#map-content").hasClass("collapsed")) {


            var latestHeight = $("#map-content").height();

            $(document).bind('touchmove', function(e){

                e.preventDefault();
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

                /*$(document).mouseup(function(e){
                 if (Math.abs(e.pageY) - latestHeight >60) {
                 $("#map-content").removeClass("collapsed");
                 _closeMobileSidebar();
                 $(document).unbind("mousemove");
                 }
                 else {
                 $("#map-content").height(latestHeight);
                 }
                 });*/

                if (
                    $("#map-content").hasClass("collapsed") &&
                    touch.pageY < $(window).height() &&
                    touch.pageY > 0 &&
                    touch.pageX < $(window).width() &&
                    touch.pageX > 0
                    ) {
                    $("#map-content").height(touch.pageY);
                }

                else {
                    $("#map-content").removeClass("collapsed");
                    _closeMobileSidebar();
                    $(document).unbind("touchmove");
                    return;
                }
                return;
            });
            return;
        }

    });

    /**
     * switch to the feed tab on click
     */
    $("#feed-btn").click(function() {
        $("#directions").fadeOut();
        $("#feed").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        changeMobileSidebar($("#map-content").hasClass("normal"));
        clearBadge();
    });

    $("#feed-btn").bind('touchstart',function(e) {
        e.preventDefault();

        $("#directions").fadeOut();
        $("#feed").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        //changeMobileSidebar($("#map-content").hasClass("normal"));
        clearBadge();
    });

    /**
     *
     */
    $("#dir-btn").click(function() {
        $("#feed").fadeOut();
        $("#directions").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        changeMobileSidebar($("#map-content").hasClass("normal"));
    });

    $("#dir-btn").bind('touchstart', function(e) {

        e.preventDefault();
        $("#feed").fadeOut();
        $("#directions").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        //changeMobileSidebar($("#map-content").hasClass("normal"));
    });

    /**
     * toggle the open/closed state of the sidebar
     */
    $("#shrink-arrow").click(function() {
        /*$(this).innerHTML='&#59237;';*/
        var type=$(this).data('type');
        if(type=='close') {
            _closeWindowSidebar();
        } else if (type=='open') {
            _openWindowSidebar();
        }

        //highlight based on which content is already shown
        if ($("#directions").is(":visible") ) {
            $("#dir-btn").addClass("on");
            $("#feed-btn").removeClass("on");
        } else if ($("#feed").is(":visible") ) {
            $("#feed-btn").addClass("on");
            $("#dir-btn").removeClass("on");
        }
    });

    /**
     * show the feed tab in the sidebar on click
     */
    $("#feed-btn").click(function() {
        $("#directions").hide();
        $("#feed").fadeIn();
    });

    /**
     * change scrollbar location on window resize
     * switch to the mobile scrollbar formatting if necessary
     */
    $(window).resize(function() {

        if ($(window).width() < 768 && isWindowSize) {
            isWindowSize = false;
            var barType = $("#shrink-arrow").data('type');
            if (barType=="close"){
                _openMobileSidebar(0);
                $("#map-content,.navbar").click(function() {
                    _closeMobileSidebar();
                });
            }
            else {
                _closeMobileSidebar();
            }
        } else if ($(window).width() >= 768 && !isWindowSize) {
            isWindowSize = true;
            var mobileBarClosed = $("#map-content").hasClass("normal");
            if (mobileBarClosed) {
                _closeWindowSidebar();
                _closeMobileSidebar();
            }

            else {
                _openWindowSidebar();
                $("#map-content").css({'height':'', "background-color": "transparent"}).removeClass("collapsed").addClass("normal");
                $(".navbar").css("background-color", "");
            }
        }
        setTimeout(function(){
            google.maps.event.trigger(map, 'resize');
        },500);

    });

});

function incrementBadge(){
    if (!($('#feed-btn').hasClass('on'))) {
        $('#feed-badge').html(getInt($('#feed-badge').html())+1).css("background-color","#c0392b");
    }
}

function clearBadge(){
    $('#feed-badge').html(0).css("background-color","");
}
/**
 * parses integer, returns 0 if empty string
 * @param num
 * @returns {*}
 */
function getInt(num){
    if(num=="") {
        return 0;
    }
    else {
        return parseInt(num);
    }
}

/**
 * create new feed item
 * @param time
 * @param type
 * @param comment
 */
function _createFeedItem(time,type,comment) {
    var html=$('<div class="feed-item feed-item-hidden"><hr>' + '<div class="feed-type">' + type + '</div><div class="feed-comment">' + comment + '</div><div class="feed-time">—' + time + '</div></div>');
    $("#live-feed").prepend(html);
    html.removeClass('feed-item-hidden',300);
}

/**
 * switch to the mobile sidebar
 * @param bool normal       whether in normal state
 */
function changeMobileSidebar(normal) {
    if(normal && $(window).width() < 768) {
        _openMobileSidebar(500);
        //click anywhere to exit list
        // TODO: assign in initialization, have check state
        $("#map-content,.navbar, .navbar-brand").click(function(e) {
            e.preventDefault();
            _closeMobileSidebar();
        });
    }
}

/**
 * close the mobile sidebar
 */
function _closeMobileSidebar() {
    time=500;
    $("#sidebar .btn").removeClass("on");
    $("#map-content").css({"background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    //$("#map-content").css({'height':'', "background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    $("#map-content").animate({
        height: '100%'
    }, time, function(){$("#map-content").removeClass("isUp");});
    $(".navbar").css("background-color", "");
    setTimeout(function(){
        google.maps.event.trigger(map, 'resize');
    },500);

    $(".navbar-brand").unbind("click");
}

/**
 * open the mobile sidebar
 * @param int t     animation time of height change
 */
function _openMobileSidebar(t) {
    $("#map-content").css({'min-height':'60px', "background-color": "rgba(0,0,0,0.4)"}).removeClass("normal").addClass("collapsed");
    $("#map-content").animate({
        height: '20%'
    }, t, function(){$("#map-content").addClass("isUp");});
    $(".navbar").css("background-color", "#223044");
    setTimeout(function(){
        google.maps.event.trigger(map, 'resize');
    },500);
    $(".navbar-brand").click(function () {return false;});
}

/**
 * close the main desktop sidebar
 */
function _closeWindowSidebar() {
    $("#shrink-arrow").data('type', 'open').html('&#59237;');
    $("#map-content").css('width','100%');
    setTimeout(function(){
        google.maps.event.trigger(map, 'resize');
    },500);

}

/**
 * open the main desktop sidebar
 */
function _openWindowSidebar() {
    $("#shrink-arrow").data('type', 'close').html('&#59238;');
    $("#map-content").css('width','');
}

window.map = new function() {
    var _this = this;

    this.initialize = function() {
        var latlng = new google.maps.LatLng(53.481136,-2.227279);
        var myOptions = {
            zoom: 15,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        _this.gmap = new google.maps.Map(document.getElementById("map-content"), myOptions);

        window.directions.get('344234568', '2345009892');

        $.getJSON('/intersections/all', function(data) {
            window.intersections = new IntersectionsData(data);
            _this.LiveMVCArray = new LiveMVCArray(window.intersections);
            console.log(_this.LiveMVCArray);
            window.heatmap = new google.maps.visualization.HeatmapLayer({
                data: _this.LiveMVCArray.MVCArray
            });
            window.heatmap.setMap(window.map.gmap);
        });
    };
    google.maps.event.addDomListener(window, "load", this.initialize);
};

/**
 * @param {IntersectionsData} IntersectionsDataObject
 */
var LiveMVCArray = function(IntersectionsDataObject) {
    var _this = this;
    this.MVCArray = new google.maps.MVCArray();
    this.intersections = IntersectionsDataObject.data;
    this.index_map = {};

    this._pushToMVC = function(intersection) {
        var weight = this._calcIntersectionWeight(intersection);
        return (this.MVCArray.push(new google.maps.LatLng(intersection['lat'], intersection['lon'], weight)) - 1);
    };

    this._calcIntersectionWeight = function(intersection) {
        //return (intersection['crimes'].length + intersection['reports'].length);
        // TODO: calculate length of intersection crimes/reports correctly
        return Math.random();
    };

    IntersectionsDataObject.addUpdateListener(function(intersection_id) {
        var index = _this.index_map[intersection_id];
        var newLatLng = new google.maps.LatLng(lat, lon, _this._calcIntersectionWeight(intersection_id));
        _this.MVCArray.setAt(index, newLatLng);
    });

    for (var id in this.intersections) {
        if (this.intersections.hasOwnProperty(id)) {
            this.index_map[id] = this._pushToMVC(this.intersections[id]);
        }
    }
};

function removeDuplicates(a) {
    var isAdded, arr=[];
    for(var i = 0; i < a.length; i++) {
        isAdded = arr.some(function(v) {//custom array callback function
            return isEqual(v, a[i]);
        });
        if( !isAdded ) {
            arr.push(a[i]);
        }
    }
    return a;
}
function isEqual(a, b) {
    if(a.name!== b.name) {
        return false;
    }
    return true
}

window.directions = new function() {
    /**
     * get directions by request
     * @param start     start location
     * @param end       end location
     */
    this.get = function(start, end) {
        var url = '/navigate/nav?start=' + encodeURIComponent(start) + '&end=' + encodeURIComponent(end);
        $.getJSON(url, function(data) {
            console.log('Directions data:', data);
            window.directions.renderList(start, end, data['roads']);
            window.directions.renderMap(data['path']);
        });
    };

    this.directionsPanel = $("#directions .side-content");
    this.renderList = function(start, end, roads) {
        var startElem = $('<div class="departure"></div>');
        startElem.text(start).appendTo(this.directionsPanel);
        var directionsList = $('<ol class="directions"></ol>');
        roads=removeDuplicates(roads);
        directionsList.appendTo(this.directionsPanel);
        for (var i=0; i<roads.length; i++) {
            var name = roads[i]['name'];
            var roadElem = $('<li></li>');
            var dir=Math.random();
            if (dir > 0.5) {
                dir='<b>left</b>';
            } else {
                dir='<b>right</b>';
            }
            var timeTo="TIME TO DESTINATION";
            timeTo='<div class="dist-time">'+timeTo+'</div>';
            roadElem.html('Turn '+dir+' onto <b>'+name+'</b>').appendTo(directionsList);
        }

        var endElem = $('<div class="arrival"></div>');
        endElem.text(end).appendTo(this.directionsPanel);
    };

    this.renderMap = function(path) {
        // TODO: use MVC path type for easier updating
        // TODO: fix line display
        var coors = [];
        for (var i=0; i<path.length; i++) {
            coors.push(new google.maps.LatLng(path[i]['lat'], path[i]['lon']));
        }
        var line = new google.maps.Polyline({
            'path': coors,
            'strokeColor': "#FF0000",
            'strokeOpacity': 1.0,
            'strokeWeight': 5
        });
        line.setMap(window.map.gmap);
    }
};
