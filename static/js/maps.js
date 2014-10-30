$(function initLeaflets() {
    $('.leaflet-map').each(function initLeafletMap () {
        var   $container = $(this)
            , defaults = {
                  zoom: 5
                , marker: [12.89994, 77.58519] // bangalore
                , label: null
                , maxZoom: 18
                , attribution: '<a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>'
                , subdomains: ['otile1','otile2','otile3','otile4']
                , scrollWheelZoom: false
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
        
        map = new L.Map($container[0], {
              center: options.center || options.marker
            , zoom: options.zoom
            , scrollWheelZoom: options.scrollWheelZoom
        });
        
        L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
              maxZoom: options.maxZoom
            , attribution: options.attribution
            , subdomains: options.subdomains
        }).addTo(map);
        
        
        marker = new L.marker(options.marker).addTo(map);
        if (options.label) marker.bindPopup(options.label).openPopup();
    })
});
