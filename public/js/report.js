$(document).ready(function(){
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
}