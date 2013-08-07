var isWindowSize = ($(window).width() >= 768);

$(document).ready(function() {

    $("#feed-btn,#dir-btn").mousedown(function(e){
        if($(window).width() < 768) {
            $(document).mousemove(function(e){

                if (e.which!=0 &&
                    $("#map-content").hasClass("normal") &&
                    e.pageY < $(window).height() &&
                    e.pageY > 0 &&
                    e.pageX < $(window).width() &&
                    e.pageX > 0
                    ) {
                    $("#map-content").height(e.pageY);
                }
                else {
                    openMobileSidebar(300);
                    return;
                }

           });
        }
    });


    $("#feed-btn").click(function() {
        $("#directions").fadeOut();
        $("#feed").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        changeMobileSidebar($("#map-content").hasClass("normal"));
    });

    $("#feed-btn").click(function() {
        $("#directions").fadeOut();
        $("#feed").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        changeMobileSidebar($("#map-content").hasClass("normal"));
    });

    $("#dir-btn").click(function() {
        $("#feed").fadeOut();
        $("#directions").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        changeMobileSidebar($("#map-content").hasClass("normal"));
    });

    $("#shrink-arrow").click(function() {
        /*$(this).innerHTML='&#59237;';*/
        var type=$(this).data('type');
        if(type=='close') {
           closeWindowSidebar();
        } else if (type=='open') {
            openWindowSidebar();
        }
    });

    $("#feed-btn").click(function() {
        $("#directions").hide();
        $("#feed").fadeIn();
    });

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

function changeMobileSidebar(normal) {
    if(normal && $(window).width() < 768) {
        openMobileSidebar();
        //click anywhere to exit list
        // TODO: assign in initialization, have check state
        $("#map-content,.navbar").click(function() {
            closeMobileSidebar();
        });
    }
}

function closeMobileSidebar() {
    time=500;
    $("#sidebar .btn").removeClass("on");
    $("#map-content").css({"background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    //$("#map-content").css({'height':'', "background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    $("#map-content").animate({
        height: '100%',
    }, time, function(){});
    $(".navbar").css("background-color", "");
    setTimeout(function(){
        google.maps.event.trigger(map, 'resize');
    },500);
}

function openMobileSidebar(t) {
    $("#map-content").css({'min-height':'60px', "background-color": "rgba(0,0,0,0.4)"}).removeClass("normal").addClass("collapsed");
    $("#map-content").animate({
        height: '20%',
    }, t, function(){});
    $(".navbar").css("background-color", "#223044");
}

function closeWindowSidebar() {
    $("#shrink-arrow").data('type', 'open').html('&#59237;');
    $("#map-content").css('width','100%');
    setTimeout(function(){
        google.maps.event.trigger(map, 'resize');
    },500);
}

function openWindowSidebar() {
    $("#shrink-arrow").data('type', 'close').html('&#59238;');
    $("#map-content").css('width','');
}