<?php function html_header($title = '') {
?>
<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" id="droidcon-in" class="no-js oldie ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" id="droidcon-in" class="no-js oldie ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" id="droidcon-in" class="no-js ie8"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--> <html id="droidcon-in" class="no-js" lang="en"> <!--<![endif]-->
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<title>Droidcon India 2011<?php if ($title) echo " - $title"; ?></title>
<meta name="description" content="Droidcon India. 18th - 19th November 2011, Bangalore.">

<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=PT+Sans:400,700">
<link rel="stylesheet" href="_css/style.combined.css">
<script type="text/javascript">
WebFontConfig = {
	custom: {
		families: ['LeagueGothicRegular'],
	    urls: [ '_css/league_gothic.css' ]
	},
};
(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
	    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();
</script>
<script src="_js/libs/modernizr-2.0.6.min.js"></script>
</head>
<body>
<?php
}


function page_header($active_tab = false) {
?>
<div id="page">


<div id="header" class="container bleed clearfix">
<hgroup class="clearfix">
<h3><a href="//hasgeek.com"><span class="has">Has</span><span class="geek">Geek</span> Presents</a></h3>

<!-- <ul id="parallax">
<li id="parallax-layer-1" data-xrange="48"></li>
<li id="parallax-layer-2" data-xrange="28"></li>
<li id="parallax-layer-3" data-xrange="0"></li>
<li id="parallax-layer-4" data-xrange="5"></li>
<li id="parallax-layer-5" data-xrange="-25" data-yrange="-13"></li>
</ul> -->

<div class="titles">
<h1><a href="./">Droidcon</a></h1>
<h2>18&#8211;19 Nov 2011, India</h2>
</div><!-- .titles -->

<p><a title="Venue Information" href="venue"><span class="expanded">MLR Convention Centre, </span>Whitefield, Bangalore</a></p>
</hgroup>

<nav id="text">
<ul class="clearfix flexlist">
<li<?php echo $active_tab === 0 ? ' class="active"':'' ?>><a href="./#text">Home</a></li>
<li<?php echo $active_tab === 1 ? ' class="active"':'' ?>><a href="blog#text">News<span class="expanded"> &amp; Updates</span></a></li>
<li<?php echo $active_tab === 2 ? ' class="active"':'' ?>><a href="schedule#text">Programme</a></li>
<li<?php echo $active_tab === 3 ? ' class="active"':'' ?>><a href="venue#text">Venue<span class="expanded"> Information</span></a></li>
<li class="register">
<a href="http://droidcon.doattend.com/">Register<span class="expanded"> Now</span></a>
<div class="tickets">
<a href="http://droidcon.doattend.com/">	
<dl class="clearfix">
<dt>Regular</dt>
<dd><span class="expanded">Rs </span>1800</dd>
<dt class="inactive">At Venue</dt>
<dd class="inactive"><span class="expanded">Rs </span>2200</dd>
<!-- <dt>Early Geek</dt>
<dd>Rs 1400</dd>
<dt class="inactive">Super Early Geek</dt>
<dd class="inactive">Sold Out</dd> -->
</dl>
</a>
</div><!-- #tickets -->
</li>
</ul>
</nav>

<hr>
</div><!-- #header -->

<?php
}


function page_footer() {
?>
<div id="footer">
<hr class="invisible">

<div class="container clearfix">

<!-- <ul class="nav">
<li><a href="./">Home</a></li>
<li><a href="blog.php">News</a></li>
<li><a href="schedule">Programme</a></li>
<li><a href="venue">Venue</a></li>
</ul> -->


<!-- <p>Droidcon India is an event by the fine fellows at <a href="http://hasgeek.in/">HasGeek</a>, -->
<!-- in association with <a href="http://droidcon.com/">Droidcon Europe</a> and the -->
<!-- <a href="http://www.meetup.com/blrdroid/">Bangalore Android User Group</a>.</p> -->
</div>
</div><!-- #footer -->

<div id="partners" class="clearfix">
<div class="shadow">
<h3>Our Partners</h3>
<ul class="partners">
<li><a title="Droidcon.com" href="//droidcon.com"><img src="_img/partners/droidcon_com.png" alt="Droidcon.com"></a></li>
<li><a title="Bangalore Android User Group" href="http://blrdroid.org/"><img src="_img/partners/baug.png" alt="Bangalore Android User Group"></a></li>
<li><a title="Mobile Monday Bangalore" href="//www.momob.in"><img src="_img/partners/momo.png" alt="Mobile Monday Bangalore"></a></li>
<li><a title="Medianama" href="//medianama.com"><img src="_img/partners/medianama.png" alt="Medianama"></a></li>
</ul>
</div>
</div><!-- #partners -->

</div><!-- #page -->

<!-- <script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script> -->
<!-- <script>window.jQuery || document.write('<script src="_js/libs/jquery-1.6.2.min.js"><\/script>')</script> -->
<!-- <script src="_js/script.combined.js"></script> -->
<!--[if lt IE 7 ]>
<script src="../_js/libs/dd_belatedpng.js"></script>
<script>DD_belatedPNG.fix("img, .png_bg");</script>
<![endif]-->

<script>
 var _gaq=[['_setAccount','UA-19123154-16'],['_trackPageview']];
 (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
 g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
 s.parentNode.insertBefore(g,s)}(document,'script'));
</script>

<?php
}

function html_footer() {
?>
</body>
</html>
<?php
}

?>
