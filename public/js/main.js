$(document).ready(function() {
    $("#feed-btn").click(function() {
        $("#directions").fadeOut();
        $("#feed").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        collapseMap($("#map-content").hasClass("normal"));
    });

    $("#dir-btn").click(function() {
        $("#feed").fadeOut();
        $("#directions").fadeIn();

        $("#sidebar .btn").removeClass("on");
        $(this).addClass("on");
        collapseMap($("#map-content").hasClass("normal"));
    });

    $("#shrink-arrow").click(function() {
        /*$(this).innerHTML='&#59237;';*/
        var type=$(this).data('type');
        if(type=='close') {
            $(this).data('type', 'open');
            $(this).html('&#59237;');
            $("#map-content").css('width','100%');
        } else {
            $(this).data('type', 'close');
            $(this).html('&#59238;');
            $("#map-content").css('width','');
        }
    });

    $("#feed-btn").click(function() {
        $("#directions").hide();
        $("#feed").fadeIn();
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

function collapseMap(normal) {
    if(normal && $(window).width() < 768) {
        $("#map-content").css('height','20%');
        $("#map-content").css('min-height','60px'); //make min width 60 so the list buttons don't go under the navbar
        $("#map-content").removeClass("normal");
        $("#map-content").addClass("collapsed");

        //darken rest of screen
        $("#map-content").css("background-color", "rgba(0,0,0,0.4)");
        $(".navbar").css("background-color", "#223044");

        //click anywhere to exit list
        $("#map-content,.navbar").click(function() {
            collapseDirectionsBar();
        });
    }
}

function collapseDirectionsBar() {

    $("#sidebar .btn").removeClass("on");
    $("#map-content").css('height','');
    $("#map-content").removeClass("collapsed");
    $("#map-content").addClass("normal");
    $("#map-content").css("background-color", "transparent");
    $(".navbar").css("background-color", "");
}