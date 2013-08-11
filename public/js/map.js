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
                    $("#map-directions-end").val(param.search);
            break;
        case "directions":
                    $("#map-directions-start").val(param.from);
                    $("#map-directions-end").val(param.to);
            break;
    }

    /**
     * preload some feed items
     * iterates throough fetched data and generates feed items
     */
    $.getJSON('/report/getall', function (data) {
        $.each(data, function (key, val) {
            var time = _processDate(new Date(val.time));
            var type = val.type;
            var comment = val.comment;
            _createFeedItem(time,type,comment, -1);
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
    }

    // begin directions search using the parameters
    var params = _getParameters();
    var geocoder = new google.maps.Geocoder();

    switch (params['type']) {
        case 'directions':
            geocoder.geocode({'address': params['from']}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat1 = results[0].geometry.location.lat();
                    var lon1 = results[0].geometry.location.lng();
                    geocoder.geocode({'address': params['to']}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var lat2 = results[0].geometry.location.lat();
                            var lon2 = results[0].geometry.location.lng();
                            console.log(lat1, lon1, lat2, lon2);
                            window.directions.get(lat1, lon1, lat2, lon2);
                        }
                    });
                }
            });
            break;
        case 'search':
            geocoder.geocode({'address': params['search']}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    window.map.gmap.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: window.map.gmap,
                        position: results[0].geometry.location
                    });
                }
            });
            break;
    }


    /**
     * connect to socket io - reports
     *
     * dynamically update list of
     */
    try {
        var socket = io.connect('/');
        socket.on('livereport', function (data) {
            var report = data.report; //@todo for some reason there is a nested report
            _createFeedItem(_processDate(new Date(report.time)),report.type,report.comment, -1);
            $("#live-feed").mCustomScrollbar("update");

            incrementBadge();
            window.intersections.update(report['id'], {'reports': [report]});
        });
    } catch(err) {
    console.log("Unable to connect to socket");
    }


    /**
     * dragging collapsed sidebar
     *
     * Scrolling works like this:
     * Starting from clicking down the mouse,
     * while the mouse moves when it is held down,
     * The sidebar will follow the mouse...
     * Once released, onClick and onUp functions will occur
     * onClick loads the right data based on whichever button was clicked
     * onUp checks whether the sidebar is up (#map-content.class(isUp)),
     * and then animates correct animation.
     * Once animation is done the isUp class will update so the new clickDown
     * function will correctly respond.
     */
    var isWindowSize = ($(window).width() >= 768);
    var latestHeight;

    $("#feed-btn, #dir-btn").mousedown(function(e){

        //highlight based on which content is already shown
        if ($("#directions").is(":visible") ) {
            $("#dir-btn").addClass("on");
            $("#feed-btn").removeClass("on");
        } else if ($("#feed").is(":visible") ) {
            $("#feed-btn").addClass("on");
            $("#dir-btn").removeClass("on");
        }

        if($(window).width() < 768 && !($("#map-content").hasClass("isUp"))) {

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
            });
        }

        if($(window).width() < 768 && $("#map-content").hasClass("isUp")) {
            latestHeight = $("#map-content").height();

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
            });
        }
    });

    /**
     * dragging mobile sidebar (desktop)
     */
    $("#feed-btn,#dir-btn").mouseup(function() {
        if ($(window).width() < 768){
            //alert(3);
            if (!($("#map-content").hasClass("isUp"))) {
                _openMobileSidebar(500);
                $(document).unbind('mousemove');
            }
            if ($("#map-content").hasClass("isUp") && $("#map-content").height() - latestHeight > 60){
                _closeMobileSidebar();
                $(document).unbind('mousemove');
            }
        }
        $(document).unbind('mousemove');
    });


    /**
     * dragging mobile sidebar (phone)
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

        if($(window).width() < 768 && !($("#map-content").hasClass("isUp"))) {
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
            });

        }
        if($(window).width() < 768 && $("#map-content").hasClass("isUp")) {

            latestHeight = $("#map-content").height();

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
\
                if (
                    $("#map-content").hasClass("collapsed") &&
                    touch.pageY < $(window).height() &&
                    touch.pageY > 0 &&
                    touch.pageX < $(window).width() &&
                    touch.pageX > 0
                    ) {
                    $("#map-content").height(touch.pageY);
                    if (Math.abs(touch.pageY) - latestHeight <60){
                        $("#map-content").height('20%');
                    }
                }
            });
        }

    });

    /**
     * expands or collapses the sidebar (phone)
     */
    $("#feed-btn,#dir-btn").bind('touchend', function() {
        if ($(window).width() < 768){
            if (!($("#map-content").hasClass("isUp"))) {
                _openMobileSidebar(500);
                $(document).unbind('touchmove');
            }
            if ($("#map-content").hasClass("isUp") && $("#map-content").height() - latestHeight > 60){
                _closeMobileSidebar();
                $(document).unbind('touchmove');
            }
        }
        $(document).unbind('touchmove');
    });

    /**
     * switch to the feed tab on click
     */
    $("#feed-btn").click(function() {
        if (!($("#map-content").hasClass("isUp"))) {
            $("#directions").fadeOut();
            $("#feed").fadeIn();
            _updateScrollbars();
            $("#sidebar .btn").removeClass("on");
            $(this).addClass("on");
            clearBadge();
        }
    });

    /**
     * switch to tab feed on click (phone)
     */
    $("#feed-btn").bind('touchstart',function(e) {
        e.preventDefault();

        if (!($("#map-content").hasClass("isUp"))) {
            $("#directions").fadeOut();
            $("#feed").fadeIn();
            _updateScrollbars();
            $("#sidebar .btn").removeClass("on");
            $(this).addClass("on");
            clearBadge();
        }
    });

    /**
     * switch to directions tab on click (desktop)
     */
    $("#dir-btn").click(function() {
        if (!($("#map-content").hasClass("isUp"))) {
            $("#feed").fadeOut();
            $("#directions").fadeIn();
            _updateScrollbars();
            $("#sidebar .btn").removeClass("on");
            $(this).addClass("on");
        }
    });

    /**
     * switch to directions tab on click (phone)
     */
    $("#dir-btn").bind('touchstart', function(e) {
        e.preventDefault();
        if (!($("#map-content").hasClass("isUp"))) {
            $("#feed").fadeOut();
            $("#directions").fadeIn();
            _updateScrollbars();
            $("#sidebar .btn").removeClass("on");
            $(this).addClass("on");
        }
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
        _updateScrollbars();
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

/**
 * increase the badge count in the live feed tab and in the html title tag
 */
function incrementBadge(){
    if (!($('#feed-btn').hasClass('on'))) {
        newFeeds = parseInt($('#feed-badge').html())+1;
        $('#feed-badge').html(newFeeds).css("background-color","#c0392b");
        $('title').text("("+newFeeds+") " + "SafeWalk")
    }
}

/**
 * clears the badge count in the live feed and the title tag
 */
function clearBadge(){
    $('#feed-badge').html(0).css("background-color","");
    $('title').text("SafeWalk");
}

/**
 * create new feed item
 * @param time
 * @param type
 * @param comment
 */
function _createFeedItem(time,type,comment, pending) {
    var html=$('<div class="feed-item feed-item-hidden"><hr>' + '<div class="feed-type">' + type + '</div><div class="feed-comment">' + comment + '</div><div class="feed-time">—' + time + '</div></div>');
    if (pending == -1)
    $("#live-feed").prepend(html);
    else
    $("#live-feed .mCSB_container").append(html);
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

    }
}

/**
 * close the mobile sidebar
 */
function _closeMobileSidebar() {
    time=500;
    $("#map-content").css({"background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    //$("#map-content").css({'height':'', "background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    $("#map-content").animate({
        height: '100%'
    }, time, function(){$("#map-content").removeClass("isUp");$("#sidebar .btn").removeClass("on");});
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
        }, t, function(){
            $("#map-content").addClass("isUp");
            $("#map-content,.navbar, .navbar-brand").click(function(e) {
            e.preventDefault();
            _closeMobileSidebar();
        });
    });
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

        // Demo directions
        // window.directions.get('344234568', '2345009892');

        $.getJSON('/intersections/all', function(data) {
            console.log("Got intersections data");
            window.intersections = new IntersectionsData(data.data);
            _this.LiveMVCArray = new LiveMVCArray(window.intersections);
            console.log("LiveMVCArray", _this.LiveMVCArray);
            window.heatmap = new google.maps.visualization.HeatmapLayer({
                data: _this.LiveMVCArray.MVCArray
            });
            console.log('heatmap', window.heatmap);
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
    var intersections = IntersectionsDataObject;
    this.index_map = {};

    this._pushToMVC = function(intersection) {
        return (_this.MVCArray.push(this._newLatLng(intersection)) - 1);
    };

    this._calcIntersectionWeight = function(intersection) {
        return Math.random();
//        return intersection['crimes'].length + intersection['reports'].length;
    };

    this._newLatLng = function(intersection) {
        var lat = intersection['loc']['coordinates'][1];
        var lon = intersection['loc']['coordinates'][0];
        var weight = _this._calcIntersectionWeight(intersection);
        return {location: new google.maps.LatLng(lat, lon), weight: weight};
    };

    IntersectionsDataObject.addUpdateListener(function(intersection_id) {
        var intersection = intersections.get(intersection_id);
        console.log("Updating weight for", intersection_id);
        var index = _this.index_map[intersection_id];
        var newLatLng = _this._newLatLng(intersection);
        _this.MVCArray.setAt(index, newLatLng);
    });

    intersections.each(function(intersection) {
        _this.index_map[intersection['id']] = _this._pushToMVC(intersection);
    });
};

/**
 * removes duplicate object entries in an array
 * @see _isEqual
 * @param a             array to run check on
 * @returns {Array}     array with duplicates removed
 * @private
 */
function _removeDuplicates(a) {
    var isAdded, arr=[];
    for(var i = 0; i < a.length; i++) {
        isAdded = arr.some(function(v) {//custom array callback function
            return _isEqual(v, a[i]);
        });
        if( !isAdded ) {
            arr.push(a[i]);
        }
    }
    return arr;
}
/**
 * checks whether two objects are equal by comparing their name parameters
 * @param a                 first object to compare
 * @param b                 second object to compare
 * @returns {boolean}       whether same or different
 * @private
 */
function _isEqual(a, b) {
    if(a.name!== b.name) {
        return false;
    }
    return true
}

window.directions = new function() {
    this.get = function(lat1, lon1, lat2, lon2) {
        console.log('Getting directions', lat1, lon1, lat2, lon2);
        $.post('/navigate/navCoordinates', {lat1: lat1, lon1: lon1, lat2: lat2, lon2: lon2}, function(data) {
            console.log('Directions data:', data);
            window.directions.renderList(data.start, data.end, data['roads']);
            window.directions.renderMap(data['path']);
        });
    };

    this.directionsPanel = $("#directions .side-content");
    this.renderList = function(start, end, roads) {
        start='<div class="nav-dir-icon start">&#xf0aa;</div></div><strong>Start</strong><br />';
        var startElem = $('<div class="departure"></div>');
        startElem.html(start).appendTo(this.directionsPanel);
        var directionsList = $('<ol class="directions"></ol>');
        roads=_removeDuplicates(roads);
        directionsList.appendTo(this.directionsPanel);
        for (var i=0; i<roads.length; i++) {
            var name = roads[i]['name'];
            var roadElem = $('<li style="display:none"></li>');
            var dir=Math.random();
            var turnIcon;
            if (dir > 0.5) {
                dir='<b>left</b>';
                turnIcon='<span class="nav-dir-icon middle">&#xf0a8;</span>';
            } else {
                dir='<b>right</b>';
                turnIcon='<span class="nav-dir-icon middle">&#xf0a9;</span>';
            }
            var timeTo=Math.round(Math.random()*9) + " minutes";
            timeTo='<div class="dist-time">'+timeTo+'</div>';
            roadElem.html(turnIcon+'Turn '+dir+' onto <b>'+name+'</b>'+timeTo).appendTo(directionsList).show(5000);
        }

        end='<div class="nav-dir-icon end">&#xf0ab;</div></div><strong>End</strong><br />';
        var endElem = $('<div class="arrival"></div>');
        endElem.html(end).appendTo(this.directionsPanel);
        _updateScrollbars();
    };

    this.renderMap = function(path) {
        // TODO: fix line display at corners
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

/**
 * disables scrollbars and recreates them when called
 * scrollbars require divs to not have display:none property to be created
 * retrieves more items in the live feed when scrolled to bottom
 *
 * @todo
 * @return void
 * @private
 */
var totalScrollCall = true;
function _updateScrollbars() {
    $("#live-feed,#directions-scrollbar").mCustomScrollbar("destroy");
    $("#directions-scrollbar").mCustomScrollbar({
        scrollButtons:{enable:true},scrollInertia:0,theme:"dark-thick"
    })
    $("#live-feed").mCustomScrollbar({
        scrollButtons:{enable:true},scrollInertia:0,theme:"dark-thick",
        callbacks:{
            onTotalScroll:function(){
                if (totalScrollCall == true) {
                    totalScrollCall = false;
                nLoaded = $(".feed-item").length
                $.ajax({
                    url: "/report/getLimitSkip",
                    data: {skip: nLoaded},
                    type: "POST",
                    success: function(data) {
                        $.each(data, function (key, val) {
                            var time = _processDate(new Date(val.time));
                            var type = val.type;
                            var comment = val.comment;
                            _createFeedItem(time,type,comment,1);
                        });
                        $("#live-feed").mCustomScrollbar("update");
                        totalScrollCall = true;
                        }
                    })
                }
            },
            onTotalScrollOffset:100
        }
    })
}

/**
 * process a js Date object
 * @param date
 * @private
 */
function _processDate(date) {
    var longdate = date.toDateString();
    var time = _formatNumber(date.getHours()) + ":" + _formatNumber(date.getMinutes()) + ":" + _formatNumber(date.getSeconds());
    return longdate + " @ " + time;
}

/**
 * formats a two digit number
 * if number is less than 10, pads a zero.
 * @param number        number to format
 * @returns string      formatted number
 * @private
 */
function _formatNumber(number) {
    if (parseInt(number) < 10) {
        return "0" + number;
    }
    else return number;
}
