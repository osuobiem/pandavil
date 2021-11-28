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
$("#genre-select, #year-select").on('change', (e) => {

  year = $('#year-select').val();
  year = !year || year == '*' ? false : year;

  genre = $('#genre-select').val();
  genre = !genre || genre == '*' ? false : genre;

  // Send filter request
  if (!year && !genre) {
    // Redirect to home page
    window.location.replace("/");
  } else {
    url = '';

    url += genre ? '?genre='+genre : '';
    
    if(year) {
      url += url.length > 0 ? '&year='+year : '?year='+year;
    }

    window.location.replace('/'+url);
  }
});
