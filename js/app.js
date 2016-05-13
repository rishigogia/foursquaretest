/**
 * Application JS file. Used with JQuery plugin to handle the search button and perform
 * the required action to display the various locations and plot them on the map.
 */
$(function() {
    // Variables
    var map;
    var summaryDiv = $('#summary div');
    var paginationDiv = $('.easyPaginateNav');
    var dataDiv = $('#venues');

    // Handling search button event
    $('#searchButton').click(function(event) {
        // Preventing search button default event to trigger
        event.preventDefault();
        // Foursquare URL
        var searchURL = 'https://api.foursquare.com/v2/venues/explore';
        // Various inputs to the Search URL
        var clientId = 'RJLEJSUSKTCEDTDSLVFFNHEJMZTLAKA4ESBHE2UPHULLH3KU';
        var clientSecret = '2N0L03G1AJCN2X5LKAHQ4SD5QRES1P3UMGNEN1YYIXM5VJQC';
        var searchLocation = $('#searchLocation').val();
        var searchString = 'client_id=' + clientId;
        searchString += '&client_secret=' + clientSecret;
        searchString += '&v=20131016';
        searchString += '&near=' + searchLocation;
        // Building the complete URL
        searchURL += '?' + searchString;

        // Sending JSON request
        $.getJSON (searchURL, function(data) {
            if(data.meta.code=='200') {
                // Checking the number of places returned
                var numPlaces = data.response.groups[0].items.length;

                // Setting the map center to the location requested
                mapCoords = new google.maps.LatLng(data.response.geocode.center.lat, data.response.geocode.center.lng);
                map.setCenter(mapCoords);

                // Emptying out the divs so new data could be added
                summaryDiv.empty();
                dataDiv.empty();
                $('.easyPaginateNav').empty();

                // Setting the Summary
                summaryDiv.append('<h4 style="text-align:center">' + numPlaces + ' popular venues found near ' +
                                  data.response.geocode.displayString + ' </h4>');

                // Traversing the JSon response
                $.each (data.response.groups[0].items, function (id, item) {
                   // Displaying the Venue
                   // A new Div is created
                    var venue = jQuery('<div/>', {
                        class: 'col-md-4 initialism',
                    }).appendTo(venues);

                    // Data is appended in the venue div
                    venue.append('<h4>' + item.venue.name + '</h4>');
                    venue.append('<p><b>Address</b>: ' + item.venue.location.formattedAddress + '<br>');
                    if(item.venue.url) {
                        venue.append('<p><b>URL</b>: <a target="_venueUrl" href=\'' + item.venue.url + '\'>' + item.venue.url + '</a></p>');
                    }
                    venue.append('<p><b>Users visited</b>: ' + item.venue.stats.usersCount + '</p>');
                    venue.append('<p><b>Reason for popularity</b>: ' + item.reasons.items[0].summary + '</p>');

                    // Plot the venues on the map
                    lat = item.venue.location.lat;
                    lng = item.venue.location.lng;

                    // Initialise and plot the marker on the map
                    var marker = new google.maps.Marker({
                        map: map,
                        position: {lat: lat, lng: lng},
                        // Displays title as the venue name and people visited the venue on hovering the marker
                        title: item.venue.name + ' : People visited - ' + item.venue.stats.usersCount
                    });
                });
            }
            $('#venues').easyPaginate({
                paginateElement: 'div',
                elementsPerPage: 3,
                effect: 'fade',
            });
        }).error(function() {
                resultDiv.append('<H3>Some error occurred. Data could not be retrieved</H3>');
        });
    });
    // Initialize Google Maps API
    $.getScript('https://www.google.com/jsapi', function() {
        google.load('maps', '3', {
            // Key to Google Maps
            other_params: 'key=AIzaSyCLlOzGhI8Wb-b8sE2LNn5elpa6JwTzkP4',
            callback: function() {
                // Setting the options eg. Zoom level, Center of Map etc.
                var options = {
                    zoom: 12,
                    center: new google.maps.LatLng(51.5074, -0.1278),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                // Assign the map to the view
                map = new google.maps.Map(document.getElementById('map'), options);
            }
        });
    });
});
