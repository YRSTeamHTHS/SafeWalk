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
        $("#form-code").val("");
        $("#form-type").val("");
        $("#form-comment").val("");
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
    $('#form-code').keyup(function() {
        if($('#form-code').val()!="" && $('#form-code').val()!=null) {
            $('#report-submit-btn').removeClass('disabled');
        } else {
            $('#report-submit-btn').addClass('disabled');
        }x
    });
    $('#form-type').click(function() {
        if($('#form-code').val()!="" && $('#form-type').val()!=null) {
            $('#report-submit-btn').removeClass('disabled');
        } else {

        }
    });
};