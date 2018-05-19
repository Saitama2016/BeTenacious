$( () => {
  console.log('loaded');


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

  $('#fitness').click(function(e) {
    $('#fitnessPage').show();
    $('#workoutPage').hide();
    $('#nutritionPage').hide();
    $('#restaurantPage').hide();
    $('#meetUpPage').hide();
  });
  
  $('#workout').click(function(e) {
    $('#workoutPage').show();
    $('#fitnessPage').hide();
    $('#nutritionPage').hide();
    $('#restaurantPage').hide();
    $('#meetUpPage').hide();
  });
  
  $('#nutrition').click(function(e) {
    $('#nutritionPage').show();
    $('#fitnessPage').hide();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('#meetUpPage').hide();
  });
  
  $('#restaurant').click(function(e) {
    $('#restaurantPage').show();
    $('#fitnessPage').hide();
    $('#workoutPage').hide();
    $('#nutritionPage').hide();
    $('#meetUpPage').hide();
  });
  
  $('#meetups').click(function(e) {
    $('#meetUpPage').show();
    $('#fitnessPage').hide();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('#nutritionPage').hide();
  });
  
  $('.fa-home').click(function(e) {
    $('#meetUpPage').hide();
    $('#fitnessPage').hide();
    $('#workoutPage').hide();
    $('#restaurantPage').hide();
    $('#nutritionPage').hide();
  });

});

