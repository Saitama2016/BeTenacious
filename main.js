"use strict";
$( () => {
  //List of API endpoints
  const wgerExerciseSearchURL = "https://wger.de/api/v2/exercise/";
  const meetupSearchURL = "https://gainful-seaplane.glitch.me/api/meetup/groups";
  const youtubeSearchURL = "https://www.googleapis.com/youtube/v3/search";
  const zomatoRestaurantSearchURL = "https://developers.zomato.com/api/v2.1/search";

  //Begin API integration and rendering with Wger API
  //Start with get request for Muscle Groups
  function getWorkoutDataFromWgerApi (muscleGroup, callback) {
      const settings = {
        url: wgerExerciseSearchURL,
        data: {
          key: '87fa7805120a2575bf0cfc73a720d562dffc1e95',
          category: `${muscleGroup}`,
          language: 2,
          status: 2
        },
        type: 'GET',
        dataType: 'json',
        success: callback
      };
      $.ajax(settings);
  }

    //Function for invalid inputs or no results
    function noWgerResults () {
      return `
      <div>
        <h2>
        <p class="noResults">Sorry, no results found! Try again or search at 
        <a href="https://wger.de/en/exercise/overview/" target="_blank">Wger Exercises</a> for more assistance!</p>
      </div>
      `
    }

  //Render options for workouts based on Muscle Group request
  function renderWorkouts (results) {
    return `
    <option value='${results.name}'>${results.name}</option>
    `
  }

  //Create function to display list of workouts for selected Muscle Groups
  function displayWorkoutOptions (data) {
    const result = data.results.map ((item) => renderWorkouts(item));
    if (data.results.length === 0) {
      $('.jsSearchWgerWorkouts').html(noWgerResults());
    } else {
      $('#selectWorkout').html(result);
    }
  }

  //Create function to allow user to select corresponding workouts for each muscle group
  function watchWorkoutList () {
    document.querySelector('#selectMuscleGroup').addEventListener('change', function(e) {
      event.preventDefault();
      const query = e.target.options[e.target.selectedIndex].value;
      getWorkoutDataFromWgerApi(query, displayWorkoutOptions);
    });
  }

  //Create get request for workout names using Wger API
  function getExerciseNameFromWgerApi (workoutName, callback) {
      const settings = {
        url: wgerExerciseSearchURL,
        data: {
          key: '87fa7805120a2575bf0cfc73a720d562dffc1e95',
          name: workoutName,
          language: 2,
          status: 2
        },
        type: 'GET',
        dataType: 'json',
        success: callback
      };
      $.ajax(settings);
  }

  //Render workout name and description
  function renderExerciseNameResult (results) {
    return `
    <div>
    <h2>
    <p class="workoutName">${results.name}</p>
    <p class="workoutDescription">${results.description}</p>
    </div>
    `
  }

  //Display workout name and descriptions
  function displayWgerSearchData (data) {
    const result = data.results.map ((item) => renderExerciseNameResult(item));
    if (data.results.length === 0) {
      $('.jsSearchWgerWorkouts').html(noWgerResults());
    } else {
      $('.jsSearchWgerWorkouts').html(result);
    }
  }

  //Begin YouTube Search API integration for Workout videos
  function getWorkoutsFromYoutubeSearchApi (workoutName, callback) {
    const settings = {
      url: youtubeSearchURL,
      data: {
        q: `${workoutName} workout`,
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
      <a class="youtubeWorkoutQuery" href="https://www.youtube.com/results?search_query=${workoutName} workout" target="_blank">
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
      <a class="youtubeRecipeQuery" href="https://www.youtube.com/results?search_query=${searchTerm} healthy recipe" target="_blank">
        <p>Find more videos right here!</p>
      </a>
    </div>
    `);
  }

  function renderYoutubeWorkoutResults (result) {
    return `
    <div>
    <h2>
    <a class="jsWorkoutVideoLink" href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
      <img class="jsThumbnail" src='${result.snippet.thumbnails.medium.url}' alt='Youtube video thumbnail'>
    </a>
    <a class="jsWorkoutVideoLink" href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
      <p class="jsWorkoutVideoTitle">${result.snippet.title}</p>
    </a>
    </div>
    `
  }

  function renderYoutubeRecipeResults (result) {
    return `
    <div>
    <h2>
    <a class="jsRecipeVideoLink" href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
      <img class="jsThumbnail" src='${result.snippet.thumbnails.medium.url}' alt='Youtube video thumbnail'>
    </a>
    <a class="jsRecipeVideoLink" href="https://www.youtube.com/watch?v=${result.id.videoId}" target="_blank">
      <p class="jsRecipeVideoTitle">${result.snippet.title}</p>
    </a>
    </div>
    `
  }

  //Function for invalid inputs or no results
  function noYoutubeResults () {
    return `
    <div>
      <h2>
      <p class="noResults">Sorry, no results found! Try again or search at 
      <a href="https://www.youtube.com/" target="_blank">YouTube</a> for more assistance!</p>
    </div>
    `
  }

  function displayYoutubeWorkoutResult (data) {
    const searchResults = data.items.map((item) => renderYoutubeWorkoutResults(item));
    if (data.items.length === 0) {
      $('.jsSearchYoutubeVideos').html(noYoutubeResults());
      $('#moreWorkoutVideos').hide();
      $('#moreRecipes').hide();
    } else {
      $('.jsSearchYoutubeVideos').html(searchResults);
      $('#moreWorkoutVideos').show();
      $('moreRecipes').show();
    }
  }

  function displayYoutubeRecipeResult (data) {
    const searchResults = data.items.map((item) => renderYoutubeRecipeResults(item));
    if (data.items.length === 0) {
      $('.jsSearchYoutubeVideos').html(noYoutubeResults());
      $('#moreWorkoutVideos').hide();
      $('#moreRecipes').hide();
    } else {
      $('.jsSearchYoutubeVideos').html(searchResults);
      $('#moreWorkoutVideos').show();
      $('moreRecipes').show();
    }
  }

  //Begin Meetup API integration 
  function getDataFromMeetUpApi (callback) {
    const settings = {
      url: meetupSearchURL,
      type: 'GET',
      dataType: 'json',
      success: callback
    };
    $.ajax(settings);
    $('#moreMeetups').html( `
    <div>
    <h2>
      <p id="findMoreMeetups"> Not what you're looking for?
      <a id="meetupQuery" href="https://www.meetup.com/find/sports-fitness/" 
      target="_blank"> Find more Meetups here!</a>
      </p>
    </div>
    `)
  }

  function renderMeetUpResult (result) {
    return `
    <div>
      <h2>
      <a class="jsMeetupName" href="${result.link}" target="_blank">${result.name}</a>
    </div>
    `
  }

  //Check for invalid inputs or no results
  function noMeetUpResults () {
    return `
    <div>
      <h2>
      <p class="noResults">Sorry, no results around your area! Try again or search at 
      <a href="https://www.meetup.com/find/sports-fitness/" target="_blank">Meetup</a> for more assistance!</p>
    </div>
    `
  }

  function displayMeetUpSearchData (data) {
    const results = data.map ((item) => renderMeetUpResult(item));
    if (data.length === 0) {
      $('.jsSearchMeetups').html(noMeetUpResults());
      $('#moreMeetups').hide();
    } else {
      $('.jsSearchMeetups').html(results);
      $('#moreMeetups').show();
    }
  }

  //Begin Zomato Integration and rendering
  function getDataFromZomatoApi (searchTerm, callback) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      const settings = {
        data: {
          q: `${searchTerm}`,
          count: 5,
          lat: latitude,
          long: longitude,
          radius: 50,
          sort: 'real_distance'
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
      $('#moreRestaurants').html( `
        <div>
        <h2>
          <p id="findMoreRestaurants"> Not what you're looking for?
          <a id="zomatoQuery" href="https://www.zomato.com/" 
          target="_blank"> Find more Restaurants here!</a>
          </p>
        </div>
      `);
    });
  }
  
  function renderZomatoResults (restaurants) {
    return `
    <div>
      <h2>
      <p class="restaurantName">${restaurants.restaurant.name}</p>
      <a href="https://maps.google.com/?q=${restaurants.restaurant.location.address}" class="streetAddress" 
      target="_blank"><p>${restaurants.restaurant.location.address}</p></a>
    </div>
    `
  }

  //Check for invalid inputs or no results
  function noZomatoResults () {
      return `
      <div>
        <h2>
        <p class="noResults">Sorry, no results around your area! Try again or search at 
        <a href="https://www.zomato.com" target="_blank">Zomato</a> for more assistance!</p>
      </div>
      `
  }

  function displayZomatoSearchData (data) {
    const results = data.restaurants.map ((item, index) => renderZomatoResults(item));
    if (data.restaurants.length === 0) {
      $('.jsSearchRestaurants').html(noZomatoResults());
    } else {
      $('.jsSearchRestaurants').html(results);
    }
  }

  //Display Workout Description, Tutorials, and Meetups after clicking submit for Workout Page
  function watchWorkoutSubmit () {
    document.querySelector('#selectWorkout').addEventListener('change', function(e) {
      const query = e.target.options[e.target.selectedIndex].value;
      getExerciseNameFromWgerApi(query, displayWgerSearchData);
      getWorkoutsFromYoutubeSearchApi(query, displayYoutubeWorkoutResult);
      getDataFromMeetUpApi(displayMeetUpSearchData);
      showWorkoutResults();
    });
  }

  //Display Recipes and Local Restaurants after clicking submit for Nutrition Page
  function restaurantAndFoodSubmit() {
    $('#jsSearchNutritionForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('#searchNutrition');
      const query = queryTarget.val();
      queryTarget.val("");
      getRecipesFromYoutubeSearchApi(query, displayYoutubeRecipeResult);
      getDataFromZomatoApi(query, displayZomatoSearchData);
      showNutritionResults();
    });
  }

  //Create Function to Call Submit Buttons
  function callSubmitButtons () {
    $(watchWorkoutList);
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
      $('html').css("background-color", "#0083bb");
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
      $('html').css("background-color", "#29bf89");
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
      $('html').css("background-color", "#0083bb");
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
      $('html').css("background-color", "#29bf89");
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
    $('#zomatoRestaurants').hide();
    $('#recipes').hide();
  }
  
  //Allow User to see Local Restaurants
  function switchToRestaurants () {
    $('#restaurants').click(function(e) {
      $('#recipes').show();
      $('#zomatoRestaurants').show();
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
      $('#zomatoRestaurants').hide();
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
      $('html').css("background", "#0197b2");
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

