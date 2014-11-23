$(function init() {
    $('.leaflet-map').each(function initMap () {
        var   $container = $(this)
            , defaults = {
                  zoom: 5
                , latitude: 12.9833
                , longitude: 77.5833
                , label: "Bangalore"
                , scrollwheel: false
                , styles: [{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#aee2e0"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#abce83"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#769E72"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#7B8758"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#EBF4A4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#8dab68"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#5B5B3F"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ABCE83"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#A4C67D"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#9BBF72"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#EBF4A4"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#87ae79"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#7f2200"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":4.1}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#495421"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]}]
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
              center: new google.maps.LatLng(options.latitude, options.longitude)
            , zoom: options.zoom
            , scrollwheel: options.scrollwheel
            , styles: options.styles
        });

        var latLng = new google.maps.LatLng(options.latitude, options.longitude);

        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: options.label
        });
    });
});
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
