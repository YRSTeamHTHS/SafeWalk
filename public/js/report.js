/**
 * report functions bound to window object
 */
window.reportForm = new function() {
    var _this = this;
    /**
     * form initialization
     */
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

    /**
     * show the modal
     */
    this.show = function() {
        this.$modal.modal('show');
    };

    /**
     * hide the modal
     */
    this.hide = function() {
        this.$modal.modal('hide');
        $("#form-code").val("");
        $("#form-type").val("");
        $("#form-comment").val("");
    };

    /**
     * submit the form
     */
    this.submit = function() {
        _this.state('loading');
        $.post(_this.$form.attr('action'), _this.$form.serialize(), function(data) {
            console.log('Report submit result:', data);
            _this.state('done');
        });
    };

    /**
     * current modal state to display
     * @param state     state to toggle to
     */
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

    /**
     * counts the characters in the comment input field
     */
    $('#char-count').text(140 + ' characters left');
    $('#form-comment').keydown(function () {
        var max = 140;
        var len = $(this).val().length;
        if (len > max) {
            $('#char-count').text((len-max) + ' characters over');
        } else {
            var char = max - len;
            $('#char-count').text(char + ' characters left');
        }
    });

    /**
     * validates form-code field
     */
    setInterval(function() {
        if(_checkFields()) {
            $('#report-submit-btn').removeClass('disabled');
        } else {
            $('#report-submit-btn').addClass('disabled');
        }
    }, 200);

    /**
     * validates forms
     */
    var regex = /^\d+$/;
    function _checkFields() {
        var code = $('#form-code').val();
        var commentLength=$("#form-comment").val().length;
        if (commentLength > 140) {
            $('#char-count').css('color','red');
        } else {
            $('#char-count').css('color','gray');
        }
        return ( code != "" && $('#form-type').val()!=null && regex.test(code) ) && commentLength<=140;
    }
};