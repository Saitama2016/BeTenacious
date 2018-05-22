$( () => {
  console.log('loaded');

  const meetUPSearchURL = "https://api.meetup.com/find/groups";
  const yelpBusinessSearchURL = "https://api.yelp.com/v3/businesses/search";

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
      console.log(settings.data.page);
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

  $.getJSON( "https://wger.de/api/v2/exercise/?page=2", function( data ) {
      console.log('It works!', data);
      // var items = [];
      // $.each( data, function( key, val ) {
      //   items.push( "<li id='" + key + "'>" + val + "</li>" );
      // });

      // $( "<ul/>", {
      //   "class": "my-new-list",
      //   html: items.join( "" )
      // }).appendTo( "body" );
  });

  function getDataFromYelpApi (searchTerm, callback) {
    const settings = {
      url: yelpBusinessSearchURL,
      data: {
        key: 'x3Q8P6wpx7_c07NORePWSHb6nf8m--SU8G-H6uevrcKxCy1r2osuOqYanNnlxuD91yGzWmUKlXVP_lqIVek979v__oZnsDV-Mx57VGeoWs14tOnaoEursqeQwXYDW3Yx',
        open_now: true,
        categories: `${searchTerm}`,
        page: 5
      },
      type: 'GET',
      dataType: 'json',
      success: callback
    };
    $.ajax(settings);
    console.log(settings.data.page);
    // $('#moreMeetUps').submit(event => {
    //   event.preventDefault();
    //   settings.data.page += 5;
    //   console.log(settings.data.page);
    // });
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


  $('#fitness').click(function(e) {
    $('#fitnessPage').show();
    $('#workoutPage').hide();
    $('#nutritionPage').hide();
    $('#restaurantPage').hide();
    $('#meetUpPage').hide();
    $('#description').hide();
  });
  
  $('#workout').click(function(e) {
    $('#workoutPage').show();
    $('#fitnessPage').hide();
    $('#nutritionPage').hide();
    $('#restaurantPage').hide();
    $('#meetUpPage').hide();
    $('#description').hide();
  });
  
  $('#nutrition').click(function(e) {
    $('#nutritionPage').show();
    $('#fitnessPage').hide();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('#meetUpPage').hide();
    $('#description').hide();
  });
  
  $('#restaurant').click(function(e) {
    $('#restaurantPage').show();
    $('#fitnessPage').hide();
    $('#workoutPage').hide();
    $('#nutritionPage').hide();
    $('#meetUpPage').hide();
    $('#description').hide();
  });
  
  $('#meetups').click(function(e) {
    $('#meetUpPage').show();
    $('#fitnessPage').hide();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('#nutritionPage').hide();
    $('#description').hide();
    $('.jsSearchResults').hide();
    $('#moreMeetUps').hide();
  });
  
  $('.fa-home').click(function(e) {
    $('#description').show();
    $('#meetUpPage').hide();
    $('#fitnessPage').hide();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('#nutritionPage').hide();
    $('.jsSearchResults').hide();
    $('#moreMeetUps').hide();
  });
  

});

