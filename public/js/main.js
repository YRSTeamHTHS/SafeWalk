var isWindowSize = ($(window).width() >= 768);

$(document).ready(function() {
    sizeBackground();

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

    setInterval(function() {
        if ($("#inputCode").val().length > 0 && $("#report-type-btn").text() !== "Report Type") {
            $("#report-submit-btn").prop("disabled", false);
        }
    }, 200)

    $("#report-submit-btn").click(function() {
        var code = $("#inputCode").text();
        var type = $("#report-type-btn").text();
        var comment = $("#inputComment").text();

        $.ajax({
            url: "/ajax/addReport",
            type: 'POST',
            data: {
                code:code,
                type:type,
                comment:comment
            },
            dataType: 'json'
        });

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
        setTimeout(function(){
            google.maps.event.trigger(map, 'resize');
        },500);

        sizeBackground();
    });

    function sizeBackground() {
        ratio=$(window).width()/$(window).height();
        imgRatio=1.33;
        if (ratio < imgRatio) {
            height=$(window).height();
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
        $('#home').css('backgroundSize', dim);
    }

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
    time=500;
    $("#sidebar .btn").removeClass("on");
    $("#map-content").css({"background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    //$("#map-content").css({'height':'', "background-color": "transparent"}).removeClass("collapsed").addClass("normal");
    $("#map-content").animate({
        height: '100%',
    }, time, function(){});
    $(".navbar").css("background-color", "");
}

function openMobileSidebar() {
    time=500;
    if ($('#shink-arrow').data('type')==null) {
        time=0;
    }
    $("#map-content").css({'min-height':'60px', "background-color": "rgba(0,0,0,0.4)"}).removeClass("normal").addClass("collapsed");
    $("#map-content").animate({
        height: '20%',
    }, time, function(){});
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