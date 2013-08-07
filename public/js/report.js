$(document).ready(function(){
    $('#report-choices').modal('hide');

    $('#report-type-btn').focus(function(){
        $('#report-type-btn').click();
    });

    //Report choices modal
    /*$('#report-choices').modal({
        keyboard: false
    })*/

    $('.report-type-option').click(function() {
        var reportChoice = $(this).text()
        $('#report-type-btn').text(reportChoice).css('color','black');
        $("#report-type-hidden").val(reportChoice);
        $('#report-choices').modal('hide');
        $('#inputComment').focus();
    })

    setInterval(function() {
        if ($("#inputCode").val().length > 0 && $("#report-type-btn").text() !== "Report Type") {
            $("#report-submit-btn").prop("disabled", false);
        }
    }, 200);
});