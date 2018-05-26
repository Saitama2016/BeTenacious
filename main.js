$( () => {
  console.log('loaded');

  const wgerExerciseSearchURL = "https://wger.de/api/v2/exercise/";
  const googlePlacesSearchURL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
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

  function getDataFromGooglePlacesApi (searchTerm, callback) {
    const settings = {
      url: googlePlacesSearchURL,
      data: {
        query: "restaurants",
        opennow: true,
        radius: 20
      },
      type: 'GET',
      success: callback
    };
    $.ajax(settings);
  }

  function renderGoogleResult (results) {
    return `
    <div>
      <h2>
      <p>${results.name}</p>
    </div>
    `
  }

  function displayGoogleSearchData (data) {
    const restaurant = data.results.map ((item, index) => renderGoogleResult(item));
    $('.jsSearchResults').html(restaurant);
    $('.jsSearchResults').show();
  }

  function watchGoogleSubmit() {
    $('#jsSearchYelpForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.searchYelp');
      const query = queryTarget.val();
      queryTarget.val("");
      getDataFromGooglePlacesApi(query, displayGoogleSearchData);
      console.log(1);
    });
  }

  $(watchGoogleSubmit);

  $('#showWorkoutPage').click(function(e) {
    $('#workoutPage').show();
    $('nav').show();
    $('#restaurant').hide();
    $('#welcomePage').hide();
  });

  $('#showNutritionPage').click(function(e) {
    $('#nutritionPage').show();
    $('nav').show();
    $('#restaurant').show();
    $('#workout').hide();
    $('#meetups').hide();
    $('#welcomePage').hide();
  });
  
  $('#workout').click(function(e) {
    $('#workoutPage').show();
    $('#restaurantPage').hide();
    $('#meetUpPage').hide();
    $('#welcomePage').hide();
  });
  
  $('#restaurant').click(function(e) {
    $('#restaurantPage').show();
    $('#workoutPage').hide();
    $('#meetUpPage').hide();
    $('#welcomePage').hide();
  });
  
  $('#meetups').click(function(e) {
    $('#meetUpPage').show();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('#welcomePage').hide();
    $('.jsSearchResults').hide();
  });
  
  $('.fa-home').click(function(e) {
    $('#welcomePage').show();
    $('#meetUpPage').hide();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('nav').hide();
    $('.jsSearchResults').hide();
  });
  

});

