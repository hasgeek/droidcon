
$(function init() {
    $('.leaflet-map').each(function initMap () {
        var   $container = $(this)
            , defaults = {
                  zoom: 5
                , center: new google.maps.LatLng(12.9833, 77.5833)
                , label: "Bangalore"
                , scrollwheel: false
                , styles: [{featureType:"administrative",stylers:[{visibility:"off"}]},{featureType:"poi",stylers:[{visibility:"simplified"}]},{featureType:"road",elementType:"labels",stylers:[{visibility:"simplified"}]},{featureType:"water",stylers:[{visibility:"simplified"}]},{featureType:"transit",stylers:[{visibility:"simplified"}]},{featureType:"landscape",stylers:[{visibility:"simplified"}]},{featureType:"road.highway",stylers:[{visibility:"off"}]},{featureType:"road.local",stylers:[{visibility:"on"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{visibility:"on"}]},{featureType:"water",stylers:[{color:"#84afa3"},{lightness:52}]},{stylers:[{saturation:-17},{gamma:0.36}]},{featureType:"transit.line",elementType:"geometry",stylers:[{color:"#3f518c"}]}]
            }
            , args
            , options
            , map
            , marker
            ;
        
        // remove any child elements from the container
        $container.empty();
        
        args = $container.data();
        if (args.marker) { args.marker = args.marker.split(','); }
        options = $.extend({}, defaults, args);

        var map = new google.maps.Map($container[0], {
              center: options.center
            , zoom: options.zoom
            , scrollwheel: options.scrollwheel
            , styles: options.styles
        });

        var marker = new google.maps.Marker({
            position: options.center,
            map: map,
            title: options.label
        });
    });
});
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
