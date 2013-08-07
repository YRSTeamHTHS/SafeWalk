$(document).ready(function() {
    $('#nav-btn').click(function(){
        if($(this).data('type')=='open') {
            console.log('opening-nav');
            $(this).data('type', 'close');
            $('.navbar-nav').css('backgroundColor', 'rgb(52, 73, 94)');
        } else {
            console.log('closing-nav');
            $(this).data('type', 'open');
            $('.navbar-nav').css('backgroundColor','transparent');
        }
    });
});