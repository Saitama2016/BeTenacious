$( () => {
  console.log('loaded');

  const meetUPSearchURL = "https://api.meetup.com/find/groups";

  function getDataFromMeetUpApi (searchTerm, callback) {
    const settings = {
      url: meetUPSearchURL,
      data: {
        key: 'd2084c1a24653b5c5b364227b7966',
        sign: true,
        host: `public`,
        text: `${searchTerm}`,
        per_page: 5
      },
      Origin: '*',
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
    $('.jsSearchResults').html(results);
    $('.jsSearchResults').show();
  }

  function watchSubmit() {
    $('.jsSearchForm').submit(event => {
      event.preventDefault();
      const queryTarget = $(event.currentTarget).find('.searchMeetUp');
      const query = queryTarget.val();
      queryTarget.val("");
      getDataFromMeetUpApi(query, displayMeetUpSearchData);
    });
  }

  $(watchSubmit);

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

  // $.getJSON( "https://api.meetup.com/find/groups?key=d2084c1a24653b5c5b364227b7966&sign=true&host=public&text=Running&per_page=5", function( data ) {
  //     console.log('It works!', data);
  //     // var items = [];
  //     // $.each( data, function( key, val ) {
  //     //   items.push( "<li id='" + key + "'>" + val + "</li>" );
  //     // });

  //     // $( "<ul/>", {
  //     //   "class": "my-new-list",
  //     //   html: items.join( "" )
  //     // }).appendTo( "body" );
  // });

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
  });
  
  $('.fa-home').click(function(e) {
    $('#description').show();
    $('#meetUpPage').hide();
    $('#fitnessPage').hide();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('#nutritionPage').hide();
    $('.jsSearchResults').hide();
  });
  

});

