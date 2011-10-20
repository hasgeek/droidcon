<?php include "_template.php" ?>
<?php html_header("Venue") ?>
<?php page_header(3) ?>

<link rel="stylesheet" href="_js/libs/leaflet/leaflet.css" />
<!--[if lte IE 8]><link rel="stylesheet" href="_js/libs/leaflet/leaflet.ie.css" /><![endif]-->

<div id="content">

<div class="container strip clearfix">
<h2>Classy Audience, Classy Venue</h2>

	<p class="images">
		<img alt="" src="_img/venue.jpg" width="555" height="289">
	</p>

	<p>The MLR Convention Centre - Whitefield has just opened and is already one of the leading venues in Bangalore, for conventions and celebrations. World class facilities, carefully designed architectural details, and interior design make it a landmark on the city's facilities.</p>
	
	<h3>Address</h3>
	
	<p>MLR Convention Centre<br>
	Dyvasandra Industrial Layout<br>
	Near Brigade Metropolis<br>
	Whitefield Road, Mahadevapura<br>
	Bangalore - 560 048</p>
	
	<h3>Location</h3>
	<!-- 
		<p class="images map"><a title="View on Google Maps" href="http://www.google.com/maps?q=MLR+Convention+Centre+-+Whitefield,+Bangalore,+Karnataka,+India&amp;hl=en&amp;ll=12.998745,77.702093&amp;spn=0.024964,0.030856&amp;sll=12.945528,77.667487&amp;sspn=0.207784,0.246849&amp;vpsrc=6&amp;hq=MLR+Convention+Centre+-&amp;hnear=Whitefield,+Bengaluru,+Bengaluru+Rural,+Karnataka,+India&amp;t=m&amp;z=15"><img src="http://maps.google.com/maps/api/staticmap?&amp;markers=color:red|12.998745,77.702093&amp;size=550x250&amp;zoom=14&amp;maptype=roadmap&amp;sensor=false" width="550" height="250"></a></p>
	 -->
	<div id="map" style="height: 300px; width: 580px;"></div>
<script type="text/javascript" src="_js/libs/leaflet/leaflet.js"></script>
<script type="text/javascript">
(function(){
	var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/0cb2761ce981414391f2941dd891892c/997/256/{z}/{x}/{y}.png',
		cloudmadeAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
		cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib});
	var map = new L.Map('map');
	var venue = new L.LatLng(12.99908,77.7020824);
	map.setView(venue, 14).addLayer(cloudmade); // geographical point (longitude and latitude);

	var venueMarker = new L.Marker(venue);
	map.addLayer(venueMarker);
	venueMarker.bindPopup("MLR Convention Center").openPopup();

	map.getPanes()["popupPane"].className = "swinging leaflet-popup-pane";
})();
</script>
</div>

</div><!-- #content -->

<?php page_footer() ?>
<?php html_footer() ?>