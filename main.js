$( () => {

  const wgerExerciseSearchURL = "https://wger.de/api/v2/exercise/";
  const googlePlacesSearchURL = "https://detailed-cactus.glitch.me/api/google/place";
  const meetupSearchURL = "https://gainful-seaplane.glitch.me/api/meetup/groups";
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
    <p class="jsWorkoutName">${results.name}</p>
    <p>${results.description}</p>
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
    <a class='jsVideoLink' href="https://www.youtube.com/watch?v=${result.id.videoId}">
      <p class='jsVideoTitle'>${result.snippet.title}</p>
      <img class='jsThumbnail' src='${result.snippet.thumbnails.medium.url}' alt='Youtube video thumbnail'>
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
      text: `${searchTerm}`
      },
      type: 'GET',
      dataType: 'json',
      success: callback
    };
    $.ajax(settings);
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
      getRecipesFromYoutubeSearchApi(query, displayYoutubeResult);
      getDataFromGooglePlacesApi(query, displayGoogleSearchData);
    });
  }

  $(watchWorkoutSubmit);
  $(restaurantAndFoodSubmit);

  $('#showWorkoutPage').click(function(e) {
    $('#workoutPage').show();
    $('nav').show();
    $('#nutrition').show();
    $('#workout').hide();
    $('#welcomePage').hide();
    $('.jsSearchResults').hide();
    $('html').css("background", "linear-gradient(rgb(2, 114, 103), rgb(4, 214, 193))");
  });

  $('#showNutritionPage').click(function(e) {
    $('#nutritionPage').show();
    $('nav').show();
    $('#workout').show();
    $('#nutrition').hide();
    $('#welcomePage').hide();
    $('.jsSearchResults').hide();
    $('html').css("background", "linear-gradient(rgb(22, 122, 35), rgb(66, 244, 122))");
  });
  
  $('#workout').click(function(e) {
    $('#workoutPage').show();
    $('#nutrition').show();
    $('#workout').hide();
    $('#nutritionPage').hide();
    $('#welcomePage').hide();
    $('.jsSearchResults').hide();
    $('html').css("background", "linear-gradient(rgb(2, 114, 103), rgb(4, 214, 193))");
  });
  
  $('#nutrition').click(function(e) {
    $('#nutritionPage').show();
    $('#workout').show();
    $('#workoutPage').hide();
    $('#nutrition').hide();
    $('#welcomePage').hide();
    $('.jsSearchResults').hide();
    $('html').css("background", "linear-gradient(rgb(22, 122, 35), rgb(66, 244, 122))");
  });
  
  
  $('#appName').click(function(e) {
    $('#welcomePage').show();
    $('#workoutPage').hide();
    $('#nutritionPage').hide();
    $('nav').hide();
    $('.jsSearchResults').hide();
    $('html').css("background", "rgba(42, 39, 240, 0.377)");
  });

  $('.fa-home').click(function(e) {
    $('#welcomePage').show();
    $('#workoutPage').hide();
    $('#nutritionPage').hide();
    $('nav').hide();
    $('.jsSearchResults').hide();
    $('html').css("background", "rgba(42, 39, 240, 0.377)");
  });
  

});

