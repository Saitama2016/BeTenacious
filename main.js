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
    <p class="workoutName">${results.name}</p>
    <p class="workoutDescription">${results.description}</p>
    </div>
    `
  }

  function displayWgerSearchData (data) {
    const result = data.results.map ((item, index) => renderWgerResult(item));
    $('.jsSearchWgerWorkouts').html(result);
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

  function renderYoutubeVideoResults (result) {
    return `
    <div>
    <h2>
    <a class='jsVideoLink' href="https://www.youtube.com/watch?v=${result.id.videoId}">
      <img class='jsThumbnail' src='${result.snippet.thumbnails.medium.url}' alt='Youtube video thumbnail'>
    </a>
    <a class='jsVideoLink' href="https://www.youtube.com/watch?v=${result.id.videoId}">
      <p class='jsVideoTitle'>${result.snippet.title}</p>
    </a>
    </div>
    `
  }

  function displayYoutubeResult (data) {
    const searchResults = data.items.map((item, index) => renderYoutubeVideoResults(item));
    $('.jsSearchYoutubeVideos').html(searchResults);
  }

  function getDataFromMeetUpApi (searchTerm, callback) {
    const settings = {
      url: meetupSearchURL,
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
      <a class="jsMeetupName" href="${result.link}" target="_blank">${result.name}</a>
    </div>
    `
  }

  function displayMeetUpSearchData (data) {
    const results = data.map ((item, index) => renderMeetUpResult(item));
    $('.jsSearchMeetups').html(results);
  }

  function getDataFromGooglePlacesApi (searchTerm, callback) {
    const settings = {
      url: googlePlacesSearchURL,
      type: 'GET',
      success: callback
    };
    $.ajax(settings);
  }

  function renderGoogleResult (results) {
    return `
    <div>
      <h2>
      <p class="restaurantName">${results.name}</p>
      <a href="https://maps.google.com/?q=${results.formatted_address}" class="streetAddress" target="_blank"><p>${results.formatted_address}</p></a>
    </div>
    `
  }

  function displayGoogleSearchData (data) {
    const restaurant = data.results.map ((item, index) => renderGoogleResult(item));
    $('.jsSearchRestaurants').html(restaurant);
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
      showWorkoutResults();
    });
  }

  function restaurantAndFoodSubmit() {
    $('#jsSearchNutritionForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('#searchNutrition');
      const query = queryTarget.val();
      queryTarget.val("");
      //Input Promise.all method to call in parallel
      getRecipesFromYoutubeSearchApi(query, displayYoutubeResult);
      getDataFromGooglePlacesApi(query, displayGoogleSearchData);
      showNutritionResults();
    });
  }

  function callSubmitButtons () {
    $(watchWorkoutSubmit);
    $(restaurantAndFoodSubmit);
  }

  function showWorkoutResults () {
    $('.jsSearchResults').show();
    $('#workoutOptions').show();
    $('#workoutResult').show();
    $('#tutorials').show();
    $('#fitnessGroups').show();
    $('#description').hide();
    $('#youtubeWorkoutVideos').hide();
    $('#meetups').hide();
  }

  function switchToWgerDescription () {
    $('#description').click(function(e) {
      showWorkoutResults();
    })
  }

  function showWorkoutPage () {
    $('#showWorkoutPage').click(function(e) {
      $('#workoutPage').show();
      $('#appOptions').show();
      $('#nutrition').show();
      $('#workout').hide();
      $('#welcomePage').hide();
      $('.jsSearchResults').hide();
      $('.jsSearchNutritionResults').hide();
      $('html').css("background-color", "rgb(4, 214, 193)");
    });
  }

  function showNutritionPage () {
    $('#showNutritionPage').click(function(e) {
      $('#nutritionPage').show();
      $('#appOptions').show();
      $('#workout').show();
      $('#nutrition').hide();
      $('#welcomePage').hide();
      $('.jsSearchResults').hide();
      $('.jsSearchNutritionResults').hide();
      $('html').css("background-color", "rgb(66, 244, 122)");
    });
  }
  
  function switchToWorkout () {
    $('#workout').click(function(e) {
      $('#workoutPage').show();
      $('#nutrition').show();
      $('#workout').hide();
      $('#nutritionPage').hide();
      $('#welcomePage').hide();
      $('.jsSearchResults').hide();
      $('.jsSearchNutritionResults').hide();
      $('html').css("background-color", "rgb(4, 214, 193)");
    });
  }
  
  function switchToNutrition () {
    $('#nutrition').click(function(e) {
      $('#nutritionPage').show();
      $('#workout').show();
      $('#workoutPage').hide();
      $('#nutrition').hide();
      $('#welcomePage').hide();
      $('.jsSearchResults').hide();
      $('.jsSearchNutritionResults').hide();
      $('html').css("background-color", "rgb(66, 244, 122)");
    });
  }

  function showWorkoutTutorials () {
    $('#tutorials').click(function(e) {
      $('#youtubeWorkoutVideos').show();
      $('#description').show();
      $('#fitnessGroups').show();
      $('#tutorials').hide();
      $('#workoutResult').hide();
      $('#meetups').hide();
    });
  }
  
  function showMeetups () {
    $('#fitnessGroups').click(function(e) {
      $('#meetups').show();
      $('#tutorials').show();
      $('#description').show();
      $('#youtubeWorkoutVideos').hide();
      $('#fitnessGroups').hide();
      $('#workoutResult').hide();
    });
  }

  function showNutritionResults () {
    $('.jsSearchNutritionResults').show();
    $('#nutritionOptions').show();
    $('#googleRestaurants').show();
    $('#recipes').show();
    $('#restaurants').hide();
    $('#youtubeRecipeVideos').hide();
  }
  
  function switchToRestaurants () {
    $('#restaurants').click(function(e) {
      $('#recipes').show();
      $('#googleRestaurants').show();
      $('#restaurants').hide();
      $('#youtubeRecipeVideos').hide();
    });
  }
  
  function switchToRecipes () {
    $('#recipes').click(function(e) {
      $('#restaurants').show();
      $('#youtubeRecipeVideos').show();
      $('#recipes').hide();
      $('#googleRestaurants').hide();
    });
  }
  
  function resetBeTenacious () {
    $('#appName').click(function(e) {
      $('#welcomePage').show();
      $('#workoutPage').hide();
      $('#nutritionPage').hide();
      $('#appOptions').hide();
      $('.jsSearchResults').hide();
      $('.jsSearchNutritionResults').hide();
      $('html').css("background", "rgba(230, 15, 15, 0.884)");
    });
  }

  function showHomePage () {
    $('.fa-home').click(function(e) {
      $('#welcomePage').show();
      $('#workoutPage').hide();
      $('#nutritionPage').hide();
      $('#appOptions').hide();
      $('.jsSearchResults').hide();
      $('.jsSearchNutritionResults').hide();
      $('html').css("background", "rgba(230, 15, 15, 0.884)");
    });
  }
  
  function handleBeTenaciousButtons () {
    showHomePage();
    showNutritionPage();
    showWorkoutResults();
    showWorkoutPage();
    showWorkoutTutorials();
    showMeetups();
    showNutritionResults();
    switchToNutrition();
    switchToWorkout();
    switchToWgerDescription();
    switchToRestaurants();
    switchToRecipes();
    resetBeTenacious();
  }

  callSubmitButtons();
  handleBeTenaciousButtons();

});

