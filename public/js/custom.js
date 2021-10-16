$('.download-btn').click(() => {
    link = $('.download-btn').data('link');

    $.ajax({
        type: "get",
        url: "/get-download-url/?link="+link,
        success: function (res) {
            
            $('#download-trigger').attr('href', res);
            
            document.getElementById('download-trigger').click()
        }
    });
});