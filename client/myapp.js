var arr=[];
var temp="";
var innovation_center_name,street_Line1,street_Line2,city,state,zipcode,country,decription;
/*My myapp js code */
  if (Meteor.isClient) {
    console.log("in client side");
    //declaring collection
    addressCollection= new Meteor.Collection("addressCollection");
    var addressTerms=["streetLine1","streetLine2","city","state","country","zipcode"];
    //decalring variables for addnewPlace module  
    var placeSearch, autocomplete;
  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };
    function initialize() {
      console.log(" in old init function");
         // addplace_initialization();//init add-place initialization function
       
      var markers = [];
      var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
  //            mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    
       
    }
    Template.imported_data.innovation = function() {
  return Innovation.find({}, {
    limit: 10
  });
};

Template.maps.rendered = function() {
  console.log("in new render function");
   
   return GoogleMaps.init({
    sensor: true
  }, function() {
    var center, mapOptions;
    var markers = [];/*markers used for search bar component*/
    center = new google.maps.LatLng(30.77040275, -100.44512989);
    mapOptions = {
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.MAP
    };
	addplace_initialization();
    window.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
     //styles for map 
       var styles = [
{
    "featureType": "water",
    "stylers": [
      { "visibility": "simplified" },
      { "color": "#00708a" },
      { "lightness": 7 },
      { "saturation": -33 }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "lightness": -5 },
      { "color": "#e7a614" },
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#807f83" },
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "simplified" },
      { "color": "#e2e2e3" }
    ]
  },{
    "featureType": "landscape.natural.terrain",
    "elementType": "geometry.fill",
    "stylers": [
      { "saturation": -8 },
      { "color": "#8dc63f" },
      { "lightness": 32 }
    ]
  }
  ];
  
//end of the style declaration
    
  /*create a search bar for the map*/

   // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  console.log(input);
    var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      console.log("called search function");
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
      url: '/marker.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
      };
      // var image= 'marker.png';
      // Create a marker for each place.
      var marker = new google.maps.Marker({
      map: map,
      icon: image,
      title: place.name,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
   
    }

    map.fitBounds(bounds);
    map.setZoom(9); //set the zoom level for search
    });
   
  map.setOptions({styles: styles});
    return window.map.setCenter(center);
  
  });
};

Template.maps.events({
  'mouseenter #map-canvas ': function() {

    // console.log("In markerCluster function");
    var markerCluster, markers, places;
    markers = [];
    places = Innovation.find();
    places.forEach(function(place) {
      var c, coord, infoWindow, marker;
      c = place.COORDINATES.replace(/[() ]/g, '').split(',');
      coord = new google.maps.LatLng(parseFloat(c[0]), parseFloat(c[1]));
      marker = new google.maps.Marker({
         position: coord,
          title: place.LOCATION
      });
      markers.push(marker);
      infoWindow = new google.maps.InfoWindow({
        content: UI.toHTML(Template["infoWindowContent"].extend({
          title: place['Title'],
          coord: place['COORDINATES'],
          type:place['Type'],
          affiliation:place['Company Affiliation'],
          address: place['Address'],
          description:place['Short Description'],
          status: place['2_STATUS_HIGH_LEVEL']
        }))
      });
      google.maps.event.addListener(marker, 'click', function() {
        return infoWindow.open(window.map, marker);
      });
      // return console.log("Added: " + place.LOCATION);
    });
    return markerCluster = new MarkerClusterer(window.map, markers);
  }
});
   function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
    // [START region_fillform]
	function fillInAddress() {
	  // Get the place details from the autocomplete object.
	  var place = autocomplete.getPlace();

	  for (var component in componentForm) {
		document.getElementById(component).value = '';
		document.getElementById(component).disabled = false;
	  }

	  // Get each component of the address from the place details
	  // and fill the corresponding field on the form.
	  var j=0;
	
	  for (var i = 0; i < place.address_components.length; i++) {
		var addressType = place.address_components[i].types[0];
		if (componentForm[addressType]) {
		  var val = place.address_components[i][componentForm[addressType]];
		  document.getElementById(addressType).value = val;
		   // console.log("line one: ", val);
		   
		   arr[j++]=val;
		   // session.set(addressTerms[i],val);
		}
	  } 
	   console.log("for loop complete");
	   //display the array arr
	   temp="";
	   for(var i=0;i<arr.length;i++)
	   {temp=temp+arr[i]+" ";}
	  }
	// [END region_fillform]
  // [START region_geolocation]
  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  function geolocate() {
  console.log("geo locate function call");
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(
        position.coords.latitude, position.coords.longitude);
        autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,geolocation));
    });
    } 
  }
  // [END region_geolocation]
  function addplace_initialization()
    {
      // Create the autocomplete object, restricting the search
    // to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('autocomplete')),
      { types: ['geocode'] });
    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
    fillInAddress();
    });
    }
    
    //this part gets called when add-place button is clicked and no user has logged in 
  //   UI.body.events({
  //   'click .PlaceButton': function (e,t) {
  //     e.preventDefault();
 	//    console.log("inserting data in DB");
	 //   var a= document.getElementById("innovationcenter").value;
	 //   console.log(a);
	 //   addressDB.insert({
	 //   innovationCenter:a,/*document.getElementById(innovationcenter).value,*/
	 //   address:temp});
	 //   console.log("data inserted without login");
     
  //   }
  // });
  UI.body.events({

    'click #ShowMap':function(e,t){
      e.preventDefault();
      $('#map-canvas').show();
      $('.adminwrapper').hide();

    }
  });
  UI.body.events({

    'click #CloseMap':function(e,t){
      e.preventDefault();
      $('#map-canvas').hide();
      $('.adminwrapper').show();

    }
  });

  UI.body.events({
    'click .slideout-menu-toggle':function(e,t){
              
                    event.preventDefault();
                    console.log("form opened..");

                    var slideoutMenu = $('.slideout-menu');
                    var slideoutMenuWidth = $('.slideout-menu').width();
                    
                    // toggle open class
                     slideoutMenu.toggleClass("open");
                    
                    // // slide menu
                     if (slideoutMenu.hasClass("open")) {
                         slideoutMenu.animate({
                             left: "0px"
                         }); 
                     } else {
                         slideoutMenu.animate({
                             left: -slideoutMenuWidth
                         }, 250);    
                     }

                }
           
    

  });
    Deps.autorun(function(computation){
  var currentUser=Meteor.user();
  if(currentUser){
    console.log("logged in");
    $('#map-canvas').hide();
  }
  else if(!computation.firstRun){
    console.log("logged out");
    $('#map-canvas').show();
  }
});
// expose the Entries collection to the entries template (as 'entries')
    Template.entries.entries = function () {
        // return all logged in user entries sorted by time 
       //   return addressDB.find({userId: Meteor.userId()}, { sort: { time: -1 }});
        // return all user entries sorted by time 
          return addressDB.find({}, { sort: { time: -1 }});
    }


    // create events for the 'entries' template
    Template.entries.events = {
        // map the event (click) for the control for the given selector
        'click input#clear': function (event) {
            // make call to a server-side function to do remove the entries,
            // since you can't just call anything you want from the client
            Meteor.call('removeAllEntries');
        }
    }
  
   
//this part gets called when add-place button is clicked.
  UI.body.events({
    'click .PlaceButton': function (e) {
       e.preventDefault();
     console.log("inserting data in DB");
     innovation_center_name= document.getElementById("innovationcenter").value;
     street_Line1=document.getElementById("street_number").value;
     street_Line2=document.getElementById("route").value;
     city=document.getElementById("locality").value;
     state=document.getElementById("administrative_area_level_1").value;
     zipcode=document.getElementById("postal_code").value;
     country=document.getElementById("country").value; 
     description=document.getElementById("description").value;

     temp= " "+street_Line1+" "+street_Line2+" "+city+" "+state+" "+zipcode+" "+country;
     var user = Meteor.user();
     var userId= Meteor.userId();
             if (!user) {
                 return;
             }
             if(!userId){return;}
     console.log("new user created by the meteor user function ");
     addressDB.insert({
      userId:userId,
      user:user,
     innovationCenter:innovation_center_name,
     description:description,/*document.getElementById(innovationcenter).value,*/
     address:temp});
     console.log("data inserted");
     
     //now clear all the fields of form 
     document.getElementById("innovationcenter").value='';
     document.getElementById("street_number").value='';
     document.getElementById("route").value='';
     document.getElementById("locality").value='';
     document.getElementById("administrative_area_level_1").value='';
     document.getElementById("postal_code").value='';
     document.getElementById("country").value='';
     document.getElementById("description").value='';
     //show a message that data is inserted
     document.getElementById('messagebox').innerHTML="New Place Added";
     //display the message 
     $("#messagebox").fadeIn(2000).delay(500).fadeOut(2000);
     console.log("done");
  
    }
  });
  
  /*Accounts sign-in configuration*/
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });
   

    
  }
  

  if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup
    if (Innovation.find().count() === 0) {
    return ctc.AddCsvToCollection("data.csv", Innovation, function(jsonArray) {
      console.log("fetch Innovation: ");
      return console.log(Innovation.find().fetch());
    });
  }

  
  

    });
  }
  
  
