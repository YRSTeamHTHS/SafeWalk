//$(document).ready(function(){
//    $('#report-choices').modal('hide');
//
//    $('#report-type-btn').focus(function(){
//        $('#report-type-btn').click();
//    });
//
//    //Report choices modal
//    /*$('#report-choices').modal({
//        keyboard: false
//    })*/
//
//    $('.report-type-option').click(function() {
//        var reportChoice = $(this).text()
//        $('#report-type-btn').text(reportChoice).css('color','black');
//        $("#report-type-hidden").val(reportChoice);
//        $('#report-choices').modal('hide');
//        $('#inputComment').focus();
//    })
//
//    setInterval(function() {
//        if ($("#inputCode").val().length > 0 && $("#report-type-btn").text() !== "Report Type") {
//            $("#report-submit-btn").prop("disabled", false);
//        }
//    }, 200);
//});

window.reportForm = new function() {
    var _this = this;
    $(function() {
        _this.$modal = $("#report-modal");
        _this.$form = $("#report-form");
        _this.$form.on('submit', function(e) {
            _this.submit();
            e.preventDefault();
        });
        _this.$modal.on('hidden.bs.modal', function() {
            _this.state('hidden');
        });
    });

    this.show = function() {
        this.$modal.modal('show');
    };

    this.submit = function() {
        _this.state('loading');
        $.post(_this.$form.attr('action'), _this.$form.serialize(), function(data) {
            console.log('Report submit result:', data);
            _this.state('done');
        });
    };

    this.hide = function() {
        this.$modal.modal('hide');
    };

    this.state = function(state) {
        switch (state) {
            case 'loading':
                console.log('Submitting report');
                _this.$modal.removeClass('done').addClass('loading');
                break;
            case 'done':
                _this.$modal.removeClass('loading').addClass('done');
                this.hide();
                break;
            case 'hidden':
                _this.$modal.removeClass('loading').removeClass('done');
        }
    };
};