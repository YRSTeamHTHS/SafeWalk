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
    var regex = /^\d+$/;
    function _checkFields() {
        var code = $('#form-code').val();
        return code!="" && $('#form-type').val()!=null && regex.test(code);
    }

    $('#form-code').keyup(function() {
        if(_checkFields()) {
            $('#report-submit-btn').removeClass('disabled');
        } else {
            $('#report-submit-btn').addClass('disabled');
    }
    });
    $('#form-type').click(function() {
        if(_checkFields()) {
            $('#report-submit-btn').removeClass('disabled');
        } else {
            $('#report-submit-btn').addClass('disabled');
        }
    });
    setInterval(function() {
        if(_checkFields()) {
            $('#report-submit-btn').removeClass('disabled');
        } else {
            $('#report-submit-btn').addClass('disabled');
        }
    }, 100);
};