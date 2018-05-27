$( () => {

  const wgerExerciseSearchURL = "https://wger.de/api/v2/exercise/";
  const googlePlacesSearchURL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const meetupSearchURL = "https://api.meetup.com/find/groups";
  const youtubeSearchURL = "https://www.googleapis.com/youtube/v3/search"; 

  function getDataFromWgerApi (searchTerm, callback) {
    const settings = {
      url: wgerExerciseSearchURL,
      data: {
        limit: 1,
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
    $('.jsSearchWgerWorkouts').html(result);
  }

  function watchWorkoutSubmit () {
    $('#jsSearchWorkoutForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('#searchWorkout');
      const query = queryTarget.val();
      queryTarget.val("");
      getDataFromWgerApi(query, displayWgerSearchData);
      getWorkoutsFromYoutubeSearchApi(query, displayYoutubeResult);
      getDataFromMeetUpApi(query, displayMeetUpSearchData);
      $('.jsSearchResults').show();
    });
  }

  function getWorkoutsFromYoutubeSearchApi (searchTerm, callback) {
    const settings = {
      url: youtubeSearchURL,
      data: {
        q: `${searchTerm} + workout`,
        key: 'AIzaSyCNXGBWzvMPHHmMKGkVlOmqpqHe6kEJGMg',
        part: 'snippet'
      },
      type: 'GET',
      dataType: 'json',
      success: callback
    };
    $.ajax(settings);
  }

  function getRecipesFromYoutubeSearchApi (searchTerm, callback) {
    const settings = {
      url: youtubeSearchURL,
      data: {
        q: `${searchTerm} + healthy recipe`,
        key: 'AIzaSyCNXGBWzvMPHHmMKGkVlOmqpqHe6kEJGMg',
        part: 'snippet'
      },
      type: 'GET',
      dataType: 'json',
      success: callback
    };
    $.ajax(settings);
  }

  function renderYoutubeResult (result) {
    return `
    <div>
    <h2>
    <a class='jsImageLink' href="https://www.youtube.com/watch?v=${result.id.videoId}">
      <p>${result.snippet.title}</p>
      <img class='jsImage' src='${result.snippet.thumbnails.medium.url}'>
    </a>
    </div>
    `
  }

  function displayYoutubeResult (data) {
    const searchResults = data.items.map((item, index) => renderYoutubeResult(item));
    $('.jsSearchYoutubeVideos').html(searchResults);
  }

  function getDataFromMeetUpApi (searchTerm, callback) {
    const settings = {
      url: meetupSearchURL,
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
    $('.jsSearchMeetups').html(results);
    $('.jsSearchResults').show();
  }

  function getDataFromGooglePlacesApi (searchTerm, callback) {
    const settings = {
      url: googlePlacesSearchURL,
      data: {
        key: "AIzaSyCNXGBWzvMPHHmMKGkVlOmqpqHe6kEJGMg",
        query: `restaurants in ${searchTerm}`,
        open_now: true,
        radius: 20,
        types: 'restaurant'
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
      <a href="https://maps.google.com/?q=${results.formatted_address}" target="_blank"><p>${results.formatted_address}</p></a>
    </div>
    `
  }

  function displayGoogleSearchData (data) {
    const restaurant = data.results.map ((item, index) => renderGoogleResult(item));
    $('.jsSearchRestaurants').html(restaurant);
    $('.jsSearchResults').show();
  }

  function restaurantAndFoodSubmit() {
    $('#jsSearchNutritionForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('#searchNutrition');
      const query = queryTarget.val();
      queryTarget.val("");
      getDataFromGooglePlacesApi(query, displayGoogleSearchData);
      getRecipesFromYoutubeSearchApi(query, displayYoutubeResult);
    });
  }

  $(watchWorkoutSubmit);
  $(restaurantAndFoodSubmit);

  $('#showWorkoutPage').click(function(e) {
    $('#workoutPage').show();
    $('nav').show();
    $('#restaurant').show();
    $('#workout').hide();
    $('#welcomePage').hide();
    $('.jsSearchResults').hide();
  });

  $('#showNutritionPage').click(function(e) {
    $('#nutritionPage').show();
    $('nav').show();
    $('#workout').show();
    $('#restaurant').hide();
    $('#welcomePage').hide();
    $('.jsSearchResults').hide();
  });
  
  $('#workout').click(function(e) {
    $('#workoutPage').show();
    $('#restaurant').show();
    $('#workout').hide();
    $('#nutritionPage').hide();
    $('#welcomePage').hide();
    $('.jsSearchResults').hide();
  });
  
  $('#restaurant').click(function(e) {
    $('#nutritionPage').show();
    $('#workout').show();
    $('#workoutPage').hide();
    $('#restaurant').hide();
    $('#welcomePage').hide();
    $('.jsSearchResults').hide();
  });
  
  
  $('#appName').click(function(e) {
    $('#welcomePage').show();
    $('#workoutPage').hide();
    $('#nutritionPage').hide();
    $('nav').hide();
    $('.jsSearchResults').hide();
  });

  $('.fa-home').click(function(e) {
    $('#welcomePage').show();
    $('#workoutPage').hide();
    $('#nutritionPage').hide();
    $('nav').hide();
    $('.jsSearchResults').hide();
  });
  

});

