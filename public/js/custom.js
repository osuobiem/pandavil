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
  const element = e.target;
  const filterType = $(element).attr('name');

  // Store filters
  if (filterType == "years") {
    // Set filter parameters
    localStorage.setItem('year', element.value);
  } else if (filterType == "genres") {
    // Set filter parameters
    localStorage.setItem('genre', element.value);
  }

  // Send filter request
  if ((localStorage.getItem('year') == "*" || localStorage.getItem('year') == null) && (localStorage.getItem('genre') == "*" || localStorage.getItem('genre') == null)) {
    // Redirect to home page
    window.location.replace("/");
  } else {
    if (!(localStorage.getItem('genre') == "*" || localStorage.getItem('genre') == null) && (localStorage.getItem('year') == "*" || localStorage.getItem('year') == null)) {
      // Redirect to page with movies of the selected genre
      window.location.replace("/filter?genre=" + localStorage.getItem('genre'));
    } else if ((localStorage.getItem('genre') == "*" || localStorage.getItem('genre') == null) && !(localStorage.getItem('year') == "*" || localStorage.getItem('year') == null)) {
      // Redirect to page with movies of the selected genre
      window.location.replace("/filter?year=" + localStorage.getItem('year'));
    } else {
      // Redirect to page with movies of the selected genre
      window.location.replace("/filter?genre=" + localStorage.getItem('genre') + "&year=" + localStorage.getItem('year'));
    }
  }
});
