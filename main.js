"use strict";
$( () => {
  //List of API endpoints
  const wgerExerciseSearchURL = "https://wger.de/api/v2/exercise/";
  const meetupSearchURL = "https://gainful-seaplane.glitch.me/api/meetup/groups";
  const youtubeSearchURL = "https://www.googleapis.com/youtube/v3/search";
  const zomatoRestaurantSearchURL = "https://developers.zomato.com/api/v2.1/search";

  //Begin API integration and rendering with Wger API
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

  //Begin YouTube Search API integration for Workout videos
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
    //Offer more than 5 Workout videos via search query hyperlink
    $('#moreWorkoutVideos').html(`
    <div>
    <h2>
      <a id="youtubeQuery" href="https://www.youtube.com/results?search_query=${searchTerm} workout" target="_blank">
        <p>Find more videos right here!</p>
      </a>
    </div>
    `);
  }

  //Begin Youtube Search API integration and rendering for Recipes
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
    //Offer more Recipes via search query
    $('#moreRecipes').html( `
    <div>
    <h2>
      <a id="youtubeQuery" href="https://www.youtube.com/results?search_query=${searchTerm} healthy recipe" target="_blank">
        <p>Find more videos right here!</p>
      </a>
    </div>
    `);
  }

  function renderYoutubeVideoResults (result) {
    return `
    <div>
    <h2>
    <a class="jsVideoLink" href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
      <img class="jsThumbnail" src='${result.snippet.thumbnails.medium.url}' alt='Youtube video thumbnail'>
    </a>
    <a class="jsVideoLink" href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
      <p class="jsVideoTitle">${result.snippet.title}</p>
    </a>
    </div>
    `
  }

  function displayYoutubeResult (data) {
    const searchResults = data.items.map((item, index) => renderYoutubeVideoResults(item));
    $('.jsSearchYoutubeVideos').html(searchResults);
  }

  //Begin Meetup API integration 
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

  //Begin Zomato Integration and rendering
  function getDataFromZomatoApi (searchTerm, callback) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position.coords.latitude, position.coords.longitude);
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      const settings = {
        data: {
          q: `${searchTerm}`,
          lat: latitude,
          long: longitude
        },
        headers:{
          'Accept': 'application/json',
          'user-key': 'be7e22f251c54d22f6ba3f036235fdb2'
        },
        dataType: 'json',
        type: 'GET',
        success: callback
      };
      $.ajax(zomatoRestaurantSearchURL,settings);
    });
  }
  
  function renderZomatoResults (restaurants) {
    return `
    <div>
      <h2>
      <p class="restaurantName">${restaurants.restaurant.name}</p>
      <a href="https://maps.google.com/?q=${restaurants.restaurant.location.address}" class="streetAddress" target="_blank"><p>${restaurants.restaurant.location.address}</p></a>
    </div>
    `
  }

  function displayZomatoSearchData (data) {
    const results = data.restaurants.map ((item, index) => renderZomatoResults(item));
    $('.jsSearchRestaurants').html(results);
  }

  //Display Workout Description, Tutorials, and Meetups after clicking submit for Workout Page
  function watchWorkoutSubmit () {
    $('#jsSearchWorkoutForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('#searchWorkout');
      const query = queryTarget.val();
      queryTarget.val("");
      if (query === "" || query === undefined) {
        alert("input required!")
      } else {
      getDataFromWgerApi(query, displayWgerSearchData);
      getWorkoutsFromYoutubeSearchApi(query, displayYoutubeResult);
      getDataFromMeetUpApi(query, displayMeetUpSearchData);
      showWorkoutResults();
      }
    });
  }

  //Display Recipes and Local Restaurants after clicking submit for Nutrition Page
  function restaurantAndFoodSubmit() {
    $('#jsSearchNutritionForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('#searchNutrition');
      const query = queryTarget.val();
      queryTarget.val("");
      console.log(query);
      if (query === "" || query === undefined) {
        alert("input required");
      } else { 
      //Input Promise.all method to call in parallel
      getRecipesFromYoutubeSearchApi(query, displayYoutubeResult);
      getDataFromZomatoApi(query, displayZomatoSearchData);
      showNutritionResults();
      };
    });
  }

  //Create Function to Call Submit Buttons
  function callSubmitButtons () {
    $(watchWorkoutSubmit);
    $(restaurantAndFoodSubmit);
  }

  //Show one API data at a time for Workout Page
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

  //Allow User to switch to Workout Description
  function switchToWgerDescription () {
    $('#description').click(function(e) {
      showWorkoutResults();
    })
  }

  //Allow User to see Workout Page from Welcome Page
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

  //Allow User to see Nutrition Page from Welcome Page
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
  
  //Allow User to switch to Workout Page
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
  
  //Allow User to switch to Nutrition Page
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

  //Allow User to see Workout Tutorials
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
  
  //Allow User to see local Meetups
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

  //Allow User to see Nutrition Page Results
  function showNutritionResults () {
    $('.jsSearchNutritionResults').show();
    $('#nutritionOptions').show();
    $('#youtubeRecipeVideos').show();
    $('#restaurants').show();
    $('#googleRestaurants').hide();
    $('#recipes').hide();
  }
  
  //Allow User to see Local Restaurants
  function switchToRestaurants () {
    $('#restaurants').click(function(e) {
      $('#recipes').show();
      $('#googleRestaurants').show();
      $('#restaurants').hide();
      $('#youtubeRecipeVideos').hide();
    });
  }
  
  //Allow User to see Recipes
  function switchToRecipes () {
    $('#recipes').click(function(e) {
      $('#restaurants').show();
      $('#youtubeRecipeVideos').show();
      $('#recipes').hide();
      $('#googleRestaurants').hide();
    });
  }
  
  //Allow User to return to the Home Page and clear results
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

  //Allow User to return to the Home Page and clear results through an alternate route
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
  
  //Handle each Event Listener for User Flow
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

  //Call Submit and jQuery Commands
  callSubmitButtons();
  handleBeTenaciousButtons();

});

