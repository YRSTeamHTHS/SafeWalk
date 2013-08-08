var isWindowSize = ($(window).width() >= 768);

$(document).ready(function() {

    //connect to socket.io
    var socket = io.connect('/');
    socket.on('livereport', function (data) {
        newBubble(data.report)
        $("#live-feed").prepend('<div class="feed-item"><hr>'+time + type + comment+'</div>')
    });

    /**
     * dragging mobile sidebar
     */
    $("#feed-btn,#dir-btn").mousedown(function(e){
        if($(window).width() < 768 && $("#map-content").hasClass("normal")) {
            //alert($("#map-content").hasClass("normal"));

            $(document).mousemove(function(e){

                if (e.which ===1 &&
                    e.pageY < $(window).height() &&
                    e.pageY > 0 &&
                    e.pageX < $(window).width() &&
                    e.pageX > 0
                    ) {
                    $("#map-content").height(e.pageY);
                }
                else if ($("#map-content").hasClass("collapsed")) {$(document).unbind("mousemove");}

                else {
                    $("#map-content").removeClass("normal");


                    changeMobileSidebar(true);
                    $(document).unbind("mousemove");
                    return;
                }
                return;

            });
            return;
        }
        if($(window).width() < 768 && $("#map-content").hasClass("collapsed")) {
            //alert($("#map-content").hasClass("normal"));

            $(document).mousemove(function(e){

                if (e.which ===1 &&
                    e.pageY < $(window).height() &&
                    e.pageY > 0 &&
                    e.pageX < $(window).width() &&
                    e.pageX > 0
                    ) {
                    $("#map-content").height(e.pageY);
                }
                else if ($("#map-content").hasClass("normal")) {$(document).unbind("mousemove");}

                else {
                    closeMobileSidebar(true);
                    $(document).unbind("mousemove");
                    return;
                }
                return;

            });
            return;
        }
        return;
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
    });

    /**
     * switch to the feed button on click
     */
    $("#feed-btn").click(function() {
        $("#directions").fadeOut();
        $("#feed").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        changeMobileSidebar($("#map-content").hasClass("normal"));
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

    /**
     * toggle the open/closed state of the sidebar
     */
    $("#shrink-arrow").click(function() {
        /*$(this).innerHTML='&#59237;';*/
        var type=$(this).data('type');
        if(type=='close') {
           closeWindowSidebar();
        } else if (type=='open') {
            openWindowSidebar();
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
                openMobileSidebar(0);
                $("#map-content,.navbar").click(function() {
                    closeMobileSidebar();
                });
            }
            else {
                closeMobileSidebar();
            }
        } else if ($(window).width() >= 768 && !isWindowSize) {
            isWindowSize = true;
            var mobileBarClosed = $("#map-content").hasClass("normal");
            if (mobileBarClosed) {
                closeWindowSidebar();
                closeMobileSidebar();
            }

            else {
                openWindowSidebar();
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
 * switch to the mobile sidebar
 * @param bool normal       whether in normal state
 */
function changeMobileSidebar(normal) {
    if(normal && $(window).width() < 768) {
        openMobileSidebar(500);
        //click anywhere to exit list
        // TODO: assign in initialization, have check state
        $("#map-content,.navbar").click(function() {
            closeMobileSidebar();
        });
    }
}

/**
 * close the mobile sidebar
 */
function closeMobileSidebar() {
    time=500;
    $("#sidebar .btn").removeClass("on");
    $("#map-content").css({"background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    //$("#map-content").css({'height':'', "background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    $("#map-content").animate({
        height: '100%'
    }, time, function(){});
    $(".navbar").css("background-color", "");
    setTimeout(function(){
        google.maps.event.trigger(map, 'resize');
    },500);
}

/**
 * open the mobile sidebar
 * @param int t     animation time of height change
 */
function openMobileSidebar(t) {
    $("#map-content").css({'min-height':'60px', "background-color": "rgba(0,0,0,0.4)"}).removeClass("normal").addClass("collapsed");
    $("#map-content").animate({
        height: '20%'
    }, t, function(){});
    $(".navbar").css("background-color", "#223044");
}

/**
 * close the main desktop sidebar
 */
function closeWindowSidebar() {
    $("#shrink-arrow").data('type', 'open').html('&#59237;');
    $("#map-content").css('width','100%');
    setTimeout(function(){
        google.maps.event.trigger(map, 'resize');
    },500);
}

/**
 * open the main desktop sidebar
 */
function openWindowSidebar() {
    $("#shrink-arrow").data('type', 'close').html('&#59238;');
    $("#map-content").css('width','');
}

/**
 * get directions by request
 * @param start     start location
 * @param end       end location
 */

function getDirections(start, end) {
    $.getJSON('/navigate/nav?start=344234568&end=2345009892', function(data) {
        var coors = [];
        for (var i=0; i<data.path.length; i++) {
            coors.push(new google.maps.LatLng(data.path[i].lat, data.path[i].lon));
        }
        var path = new google.maps.Polyline({
            path: coors,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        path.setMap(map);
    });
}

/**
 * set a timeout on direction retrieval
 */
$(function(){
    setTimeout(function(){
        getDirections();
    },2000);
});
