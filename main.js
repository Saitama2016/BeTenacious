$( () => {
  console.log('loaded');

  const wgerExerciseSearchURL = "https://wger.de/api/v2/exercise/";
  const googlePlacesSearchURL = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const meetUPSearchURL = "https://api.meetup.com/find/groups";
  const youtubeSearchURL = "https://www.googleapis.com/youtube/v3/search"; 

  function getDataFromWgerApi (searchTerm, callback) {
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
      getDataFromWgerApi(query, displayWgerSearchData);
    });
  }

  $(watchWgerSubmit);

  function getDataFromYoutubeSearchApi (searchTerm, callback) {
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

  function watchYouTubeSubmit() {
    $('#jsSearchWgerForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.searchWger');
      const query = queryTarget.val();
      queryTarget.val("");
      getDataFromYoutubeSearchApi(query, displayYoutubeResult);
    });
  }

  $(watchYouTubeSubmit);

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
    $('.jsSearchResults').html(restaurant);
    $('.jsSearchResults').show();
  }

  function watchGoogleSubmit() {
    $('#jsSearchGoogleForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.searchGoogle');
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
    $('#restaurantPage').show();
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

