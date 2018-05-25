$( () => {
  console.log('loaded');

  const wgerExerciseSearchURL = "https://wger.de/api/v2/exercise/";
  // const yelpBusinessSearchURL = "https://api.yelp.com/v3/businesses/search";
  // const zomatoRestaurantSearchURL = "https://developers.zomato.com/api/v2.1/search";
  // const googlePlacesAPI = "AIzaSyCNXGBWzvMPHHmMKGkVlOmqpqHe6kEJGMg";
  const meetUPSearchURL = "https://api.meetup.com/find/groups"; 

  function getDataFromWgerURL (searchTerm, callback) {
    const settings = {
      url: wgerExerciseSearchURL,
      data: {
        limit: 1,
        format: 'json',
        key: '87fa7805120a2575bf0cfc73a720d562dffc1e95',
        name: `${searchTerm}`,
        language: 2,
      },
      type: 'GET',
      dataType: 'json',
      success: callback
    };
    $.ajax(settings);
  }

  function renderWgerResult (results) {
    return `
    <div>
    <h2>
    <p class="jsResultName">${results.name}</p>
    <div>${results.description}</div>
    </div>
    `
  }

  function displayWgerSearchData (data) {
    const result = data.results.map ((item, index) => renderWgerResult(item));
    $('.jsSearchResults').html(result);
    $('.jsSearchResults').show();
  }

  function watchWgerSubmit () {
    $('#jsSearchWgerForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.searchWger');
      const query = queryTarget.val();
      queryTarget.val("");
      getDataFromWgerURL(query, displayWgerSearchData);
    });
  }

  $(watchWgerSubmit);

  function getDataFromMeetUpApi (searchTerm, callback) {
    const settings = {
      url: meetUPSearchURL,
      data: {
        key: 'd2084c1a24653b5c5b364227b7966',
        sign: true,
        host: `public`,
        text: `${searchTerm}`,
        page: 5
      },
      type: 'GET',
      dataType: 'json',
      success: callback
    };
    $.ajax(settings);
    console.log(settings.data.page);
    $('#moreMeetUps').submit(event => {
      event.preventDefault();
      settings.data.page += 5;
    });
  }

  function renderMeetUpResult (result) {
    return `
    <div>
      <h2>
      <a class="jsResultName" href="${result.link}" target="_blank">${result.name}</a>
    </div>
    `
  }

  function displayMeetUpSearchData (data) {
    const results = data.map ((item, index) => renderMeetUpResult(item));
    $('.jsSearchResults').html(results);
    $('.jsSearchResults').show();
  }

  function watchMeetUpSubmit() {
    $('#jsSearchMeetUpForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.searchMeetUp');
      const query = queryTarget.val();
      queryTarget.val("");
      getDataFromMeetUpApi(query, displayMeetUpSearchData);
      $('#moreMeetUps').show();
    });
  }

  $(watchMeetUpSubmit);

  function getDataFromYelpApi (searchTerm, callback) {
    const settings = {
      url: yelpBusinessSearchURL,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer x3Q8P6wpx7_c07NORePWSHb6nf8m--SU8G-H6uevrcKxCy1r2osuOqYanNnlxuD91yGzWmUKlXVP_lqIVek979v__oZnsDV-Mx57VGeoWs14tOnaoEursqeQwXYDW3Yx');
      },
      data: {
        location: {
          city: "San Francisco",
          country: "US",
          address2: "",
          address3: "",
          state: "CA",
          address1: "375 Valencia St",
          zip_code: "94103"
        },
        open_now: true,
        categories: `${searchTerm}`,
        page: 5
      },
      type: 'GET',
      dataType: 'json',
      success: callback
    };
    $.ajax(settings);
  }

  function renderYelpResult (result) {
    return `
    <div>
      <h2>
      <a class="jsResultName" href="${result.url}" target="_blank">${result.name}</a>
    </div>
    `
  }

  function displayYelpSearchData (data) {
    const results = data.map ((item, index) => renderYelpResult(item));
    $('.jsSearchResults').html(results);
    $('.jsSearchResults').show();
  }

  function watchYelpSubmit() {
    $('#jsSearchYelpForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.searchYelp');
      const query = queryTarget.val();
      queryTarget.val("");
      getDataFromYelpApi(query, displayMeetUpSearchData);
      $('#moreMeetUps').show();
    });
  }

  $(watchYelpSubmit);
  
  $('#workout').click(function(e) {
    $('#workoutPage').show();
    $('#restaurantPage').hide();
    $('#meetUpPage').hide();
    $('#description').hide();
  });
  
  $('#restaurant').click(function(e) {
    $('#restaurantPage').show();
    $('#workoutPage').hide();
    $('#meetUpPage').hide();
    $('#description').hide();
  });
  
  $('#meetups').click(function(e) {
    $('#meetUpPage').show();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('#description').hide();
    $('.jsSearchResults').hide();
  });
  
  $('.fa-home').click(function(e) {
    $('#description').show();
    $('#meetUpPage').hide();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('.jsSearchResults').hide();
  });
  

});

