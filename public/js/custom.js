$('.download-btn').click(() => {
  link = $('.download-btn').data('link');

  $.ajax({
    type: "get",
    url: "/get-download-url/?link=" + link,
    success: function (res) {

      $('#download-trigger').attr('href', res);

      document.getElementById('download-trigger').click()
    }
  });
});

// Handle genre filter change
$("#genre-select").on('change', (e) => {
  const element = e.target;
  if (element.value == "*") {
    // Redirect to home page
    window.location.replace("/");
  } else {
    // Redirect to page with movies of the selected genre
    window.location.replace("/filter?genre=" + element.value);
  }
});
