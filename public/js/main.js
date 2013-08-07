var pastWindowSize = $(window).size();

$(document).ready(function() {
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

        if ($(window).width() < 768) {
            pzstWindowSize = $(window).size();
            var barType = $("#shrink-arrow").data('type');
            if (barType=="close")
                closeMobileSidebar();
            else
                openMobileSidebar();

                $("#map-content,.navbar").click(function() {
                    closeMobileSidebar();
                });
        } else if ($(window).width() >= 768) {
            var mobileBarClosed = $("#map-content").hasClass("normal");
            if (mobileBarClosed) {
                closeWindowSidebar();
                closeMobileSidebar();
            }

            else
                openWindowSidebar();
                closeMobileSidebar();
        }

    });


    $(".nav-tabs > li").click(function() {

        if(!$(this).hasClass("active")){
            var newId = "#" + $(this).attr("id") + "-content";
            $(".nav-tabs > li").removeClass("active");
            $(this).addClass("active");
            $(".tabcontent > div").hide();
            $(newId).fadeIn();
        }
    });
});

function changeMobileSidebar(normal) {
    if(normal && $(window).width() < 768) {

        openMobileSidebar();

        //click anywhere to exit list
        $("#map-content,.navbar").click(function() {
            closeMobileSidebar();
        });
    }
}

function closeMobileSidebar() {

    $("#sidebar .btn").removeClass("on");
    $("#map-content").css('height','');
    $("#map-content").removeClass("collapsed");
    $("#map-content").addClass("normal");
    $("#map-content").css("background-color", "transparent");
    $(".navbar").css("background-color", "");
}

function openMobileSidebar() {

    $("#map-content").css('height','20%');
    $("#map-content").css('min-height','60px'); //make min width 60 so the list buttons don't go under the navbar
    $("#map-content").removeClass("normal");
    $("#map-content").addClass("collapsed");

    //darken rest of screen
    $("#map-content").css("background-color", "rgba(0,0,0,0.4)");
    $(".navbar").css("background-color", "#223044");
}



function closeWindowSidebar() {
    $(this).data('type', 'open');
    $(this).html('&#59237;');
    $("#map-content").css('width','100%');
}

function openWindowSidebar() {
    $(this).data('type', 'close');
    $(this).html('&#59238;');
    $("#map-content").css('width','');
}