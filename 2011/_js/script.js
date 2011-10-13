function main () {
	$('#header .titles h1').fitText(0.274);
	$('#header .titles h2').fitText(1.005);
	
	parallax();
}

function parallax () {
	$('#parallax li').plaxify();
	$.plax.enable();
}

$(main);