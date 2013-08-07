var isWindowSize = ($(window).width() >= 768);

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

        if ($(window).width() < 768 && isWindowSize) {
            isWindowSize = false;
            var barType = $("#shrink-arrow").data('type');
            if (barType=="close"){
                openMobileSidebar();
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

    });


    /*$(".nav-tabs > li").click(function() {

        if(!$(this).hasClass("active")){
            var newId = "#" + $(this).attr("id") + "-content";
            $(".nav-tabs > li").removeClass("active");
            $(this).addClass("active");
            $(".tabcontent > div").hide();
            $(newId).fadeIn();
        }
    });*/

    function showHomeTab(tab, time) {
        var newId = document.getElementById(tab + "-content");
        var currentId = document.getElementById(tab);
        $(currentId).addClass("active");
        $(newId).fadeIn(time);
    }
    function hideHomeTab(tab) {
        var newId = document.getElementById(tab + "-content");
        console.log(newId);
        var currentId = document.getElementById(tab);
        $(currentId).removeClass("active");
        $(newId).hide();
    }
    function switchToTab(url, time) {
        if (url=="search") {
            hideHomeTab("tab-directions");
            showHomeTab("tab-search",time);
        } else if (url=="directions") {
            hideHomeTab("tab-search");
            showHomeTab("tab-directions",time);
        }
    }

    $(function() {
        $.history.on('load change push pushed', function(event, url, type) {
            /*if (event.type=='load') {
                console.log('load' + ': ' + url);
                if (url=="search"||url=="directions") {
                    switchToTab(url, 0);
                }
            } else if (event.type=='push' || event.type=='change') {
                console.log('push/change' + ': ' + url);
                if (url=="search"||url=="directions") {
                    switchToTab(url, 200);
                }

            } else if (event.type='pushed') {
                console.log('pushed' + ': ' + url);
            }*/
            if (url=="search"||url=="directions") {
                if (event.type=='load') {
                    console.log('load' + ': ' + url);
                    switchToTab(url, 0);
                } else if (event.type=='push' || event.type=='change') {
                    console.log('push/change' + ': ' + url);
                    switchToTab(url, 200);
                }
            }
        }).listen('hash');
        $('body').on('click', 'a', function(event) {
            $.history.push($(this).attr('href'));
            event.preventDefault();
        });
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
    $("#sidebar .btn").removeClass("on");
    $("#map-content").css({'height':'', "background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    $(".navbar").css("background-color", "");
}

function openMobileSidebar() {
    $("#map-content").css({'height':'20%', 'min-height':'60px', "background-color": "rgba(0,0,0,0.4)"}).removeClass("normal").addClass("collapsed");
    $(".navbar").css("background-color", "#223044");
}

function closeWindowSidebar() {
    $("#shrink-arrow").data('type', 'open').html('&#59237;');
    $("#map-content").css('width','100%');
    //google.maps.event.trigger(map, "resize");
}

function openWindowSidebar() {
    $("#shrink-arrow").data('type', 'close').html('&#59238;');
    $("#map-content").css('width','');
    //google.maps.event.trigger(map, "resize");
}