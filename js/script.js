var   PHOTOS = []
	, PHOTOS_LOCAL
	, PHOTOS_FLICKR
	, ASPECT_RATIO = 1.5
	, PORTRAIT_CLASS = 'portrait'
	, MAX_WIDTH = 240
	, MIN_WIDTH = 175
	, FLIP_INTERVAL = 2 * 1000 // in ms
	, FLIPBOARD_SELECTOR = '.flipboard'
	, CARD_TEMPLATE = '#card-template'
	, CARD_SELECTOR = 'li'
	, FRAME_SELECTOR = '.flipcard'
	, FRONT_FACE = '.face.front'
	, BACK_FACE = '.face.back'
	, TRANSITION_TIME = 0.4 * 1000 // in ms
	, TRANSITION_TO_BACK = 'reveal-backface'
	, TRANSITION_TO_FRONT = 'reveal-frontface'
	, active_board
	;

function Flipboard () {
	var   o = this
		, $board = $(FLIPBOARD_SELECTOR)
		, $parent = $(window)
		, cards = []
		, card_template = _.template($(CARD_TEMPLATE).html())
		, shuffled_photos = []
		, shuffled_cards = []
		, flipper
		, animator
		, animation_queue = []
		, resize_handler
		, columns, rows, width, height;
	
	
	function reset_dimensions () {
		var   full_width = $parent.width()
			, full_height = $parent.height()
			, raw_rows;
		
		// start with _ideal_ number of cols
		columns = Math.ceil(full_width / MAX_WIDTH)
		
		do {

			width = Math.floor(full_width / columns);
			raw_rows = full_height / (width / ASPECT_RATIO);
			rows = Math.ceil(raw_rows);
			
		} while ( 

			// try increasing the number of columns and iterating if the height clipping is beyond a certain percentage
			rows - raw_rows >= 0.5 &&
			full_width/columns >= MIN_WIDTH &&
			columns++
		);

		// now that we have the number of cols and rows, we compute the _ideal_ height
		height = Math.floor(full_height / rows);


		// at this point we have whole number for cols, rows and each card's dimensions
		// however, there will most likely be a few extra horizontal & vertical pixels
		// <del>so we first look for flexbox and outsource this problem to the browser if possible</del>
		// <ins>for now we'll just reduce the size of our board to suit our whole numbers</ins>

		$board.show().css({
			  'width': (columns * width) + 'px'
			, 'height': (rows * height) + 'px'
			, 'left': '50%'
			, 'top': '50%'
			, 'margin-left': - (columns * width / 2) + 'px'
			, 'margin-top': - (rows * height / 2) + 'px'
		});
	}
	
	function reset_cards () {
		var $card;
		
		// add new cards
		while (cards.length < columns * rows) {
			$card = $(card_template())
			
			$board.append($card);
			cards[cards.length] = $card[0];
			
			flip_card($card[0]);
		}
		
		// discard unused cards
		while (cards.length > columns * rows) $(cards.pop()).remove();
		
		// update card dimensions
		$(cards).width(width).height(height);
		
		// reset card flipper
		shuffled_cards = [];
	}
	
	function get_random_photo () {
		if (!shuffled_photos || !shuffled_photos.length) shuffled_photos = _.shuffle(PHOTOS);
		
		return shuffled_photos.shift();
	}
	
	function get_random_card () {
		if (!shuffled_cards || !shuffled_cards.length) shuffled_cards = _.shuffle(cards);
		
		return shuffled_cards.shift();
	}
	
	function flip_card (card, close_card) {
		
		// close card or flip over with a new image
		close_card = !!close_card;
		
		var   $frame = $(FRAME_SELECTOR, card || get_random_card())
			, image = (close_card ? null : new Image())
			, transition
			;
		
		if ($frame.hasClass(TRANSITION_TO_BACK)) {
			transition = {
				  $face: $(FRONT_FACE, $frame)
				, addClass: TRANSITION_TO_FRONT
				, removeClass: TRANSITION_TO_BACK
			}
		} else {
			transition = {
				  $face: $(BACK_FACE, $frame)
				, addClass: TRANSITION_TO_BACK
				, removeClass: TRANSITION_TO_FRONT
			}
		}
		
		function flip () {
			animate(function() {
				
				transition.$face.empty().removeClass(PORTRAIT_CLASS);
				
				if (image) {
					if (image.width < image.height) transition.$face.addClass(PORTRAIT_CLASS)
					transition.$face.append(image);
				}
				
				$frame.addClass(transition.addClass).removeClass(transition.removeClass);
			});
		}
		
		if (image) {
			$(image).load(flip);
			image.src = get_random_photo();
			
		} else flip();
		
	}
	
	function animate (animation) {
		if (animation && typeof animation == 'function') animation_queue.push(animation);
		
		if (!animator) animator = window.setInterval(function() {
			
			if (animation_queue.length) {
				(animation_queue.shift())();
				
			} else {
				window.clearInterval(animator);
				animator = null;
			}
			
		}, 25);
	}
	
	function start_flipping () {
		if (!flipper) flipper = window.setInterval(flip_card, FLIP_INTERVAL);
	}
	
	function stop_flipping () {
		if (!flipper) return;

		window.clearInterval(flipper);
		flipper = null;
	}
	
	this.reset = function() {
		reset_dimensions();
		reset_cards();
	};
	
	this.start = function() {
		if (!resize_handler) resize_handler = _.throttle(o.reset, 100); // execute max. once per 100 ms
		
		$(window).resize(resize_handler);
		resize_handler();
		
		start_flipping();
	};
	
	this.stop = function() {
		stop_flipping();
		$(window).unbind('resize', resize_handler);
		
		for (var i = cards.length; i--; ) flip_card(cards[i], true);
		
		animate(function() {
			_.delay(function() {
				$board.hide();

				columns = 0, rows = 0;
				reset_cards();
			}, TRANSITION_TIME);
		});
	};

}


function dismantle () {
	var   $container = $('#header').addClass('dismantle')
		, $spotlight = $('.spotlight', $container)
		, $left = $('.strip .flushleft', $container)
		, $right = $('.strip .flushright', $container)
		;
	
	$spotlight
		.css({ bottom: $container.outerHeight() - $spotlight.outerHeight() - $spotlight.offset().top })
		.animate({
			  width: $container.outerWidth()
			, marginRight: -$container.outerWidth() / 2
			, opacity: 0
		}, 400);
	
	$('h1,h2', $container).fadeOut(600);
	
	$left.animate({ marginLeft: -$left.outerWidth() }, 400, 'swing', function() { $left.hide() });
	$right.animate({ marginRight: -$right.outerWidth() }, 400, 'swing', function() { $right.hide() });
	
	$('.andy', $container).animate({ marginTop: 0 }, 600, 'swing', function() { $(this).hide() });
	$('.footer a', $container).fadeOut(400);
}

function assemble () {
	var $container = $('#header').removeClass('dismantle');
	
	// in reverse
	
	$('.footer a', $container).fadeIn(400);
	$('.andy', $container).show().animate({ marginTop: -122 }, 600, 'swing');
	$('.strip .flushright', $container).show().animate({ marginRight: 0 }, 400, 'swing');
	$('.strip .flushleft', $container).show().animate({ marginLeft: 0 }, 400, 'swing');
	$('h1,h2', $container).fadeIn(600);
	
	$('.spotlight', $container)
		.css({ bottom: 'auto' })
		.animate({
			  width: '20em'
			, marginRight: '-10em'
			, opacity: 1
		}, 400);
	
}

function main () {
	active_board = new Flipboard();
	
	function activate (e) {
		dismantle();
		_.delay(active_board.start, 600);
		
		if (e.stopPropagation) e.stopPropagation();
	}
	
	function deactivate () {
		active_board.stop();
		_.delay(assemble, 600);
	}
	
	$('.spotlight, .andy').bind('click', activate);
	$('#header').click(function() {
		if (!$(this).hasClass('dismantle')) return;
		
		deactivate();
	})
	
	// fix sub-pixel css rounding off issue
	var   $left = $('.half.flushleft')
		, $right = $('.half.flushright')
		, pageWidth = $(window).width()
		;
	if ($left.width() + $right.width() != pageWidth) {
		$left.width( Math.ceil(pageWidth/2) )
		$right.width( Math.floor(pageWidth/2) )
	}
	
}


PHOTOS_LOCAL = [];
PHOTOS_FLICKR = [
'http://farm8.staticflickr.com/7012/6393327761_819224d6e8_m.jpg',
'http://farm8.staticflickr.com/7012/6393328151_edc10dfe51_m.jpg',
'http://farm8.staticflickr.com/7166/6393328445_e13137c78b_m.jpg',
'http://farm7.staticflickr.com/6217/6393328959_f9381d793b_m.jpg',
'http://farm7.staticflickr.com/6231/6393329297_73ef472e8d_m.jpg',
'http://farm8.staticflickr.com/7014/6393329645_bfc20eced6_m.jpg',
'http://farm8.staticflickr.com/7153/6393329985_413eff008d_m.jpg',
'http://farm8.staticflickr.com/7157/6393330319_676ecbffaf_m.jpg',
'http://farm8.staticflickr.com/7030/6393330611_4d4746468f_m.jpg',
'http://farm7.staticflickr.com/6048/6393330935_8d1a4eb304_m.jpg',
'http://farm7.staticflickr.com/6240/6393331227_b2c5673eb6_m.jpg',
'http://farm8.staticflickr.com/7144/6393331515_46e2319422_m.jpg',
'http://farm8.staticflickr.com/7159/6393331795_4c59ce14a0_m.jpg',
'http://farm7.staticflickr.com/6102/6393332103_ca6fbe9fa3_m.jpg',
'http://farm8.staticflickr.com/7024/6393332421_08d3333c87_m.jpg',
'http://farm8.staticflickr.com/7009/6393332695_bf4349cba3_m.jpg',
'http://farm8.staticflickr.com/7007/6393332995_909d93df3d_m.jpg',
'http://farm7.staticflickr.com/6094/6393333267_ae04722084_m.jpg',
'http://farm8.staticflickr.com/7169/6393333545_51145828f0_m.jpg',
'http://farm8.staticflickr.com/7011/6393333859_9233cf1afc_m.jpg',
'http://farm8.staticflickr.com/7030/6393334117_b7a30c6534_m.jpg',
'http://farm7.staticflickr.com/6214/6393334375_dd108b7e22_m.jpg',
'http://farm7.staticflickr.com/6107/6393334685_63ea7d1464_m.jpg',
'http://farm8.staticflickr.com/7008/6393334997_c76898e474_m.jpg',
'http://farm7.staticflickr.com/6227/6393335303_0b93c1eea4_m.jpg',
'http://farm8.staticflickr.com/7033/6393335593_567ec169db_m.jpg',
'http://farm7.staticflickr.com/6045/6393335875_6e707a4048_m.jpg',
'http://farm8.staticflickr.com/7143/6393336163_2809eef320_m.jpg',
'http://farm8.staticflickr.com/7007/6393336509_00e6923a95_m.jpg',
'http://farm8.staticflickr.com/7164/6393336791_d00f6b3c9f_m.jpg',
'http://farm8.staticflickr.com/7165/6393337057_13ac94529c_m.jpg',
'http://farm8.staticflickr.com/7156/6393337489_166c42ee63_m.jpg',
'http://farm8.staticflickr.com/7029/6393337831_64ee68f8b2_m.jpg',
'http://farm8.staticflickr.com/7165/6393338155_560816c2a8_m.jpg',
'http://farm8.staticflickr.com/7141/6393338427_660fedc486_m.jpg',
'http://farm8.staticflickr.com/7154/6393338671_f83bdf7b72_m.jpg',
'http://farm8.staticflickr.com/7173/6393338921_8d2c1e1fda_m.jpg',
'http://farm8.staticflickr.com/7015/6393339163_037acf787d_m.jpg',
'http://farm7.staticflickr.com/6060/6393339475_860e59d462_m.jpg',
'http://farm8.staticflickr.com/7175/6393339803_8f42054423_m.jpg',
'http://farm8.staticflickr.com/7033/6393340051_dd10c87114_m.jpg',
'http://farm8.staticflickr.com/7157/6393340317_4eafe4319b_m.jpg',
'http://farm7.staticflickr.com/6053/6393340581_425e0e593e_m.jpg',
'http://farm7.staticflickr.com/6038/6393340805_47d24404f2_m.jpg',
'http://farm8.staticflickr.com/7163/6393341109_9bfb76f437_m.jpg',
'http://farm7.staticflickr.com/6053/6393341385_d97cd8bf15_m.jpg',
'http://farm8.staticflickr.com/7145/6393341651_07421c34e0_m.jpg',
'http://farm8.staticflickr.com/7153/6393341865_374708c5e8_m.jpg',
'http://farm7.staticflickr.com/6236/6393342161_bbb1853967_m.jpg',
'http://farm7.staticflickr.com/6050/6393342435_a06d2dc15a_m.jpg',
'http://farm8.staticflickr.com/7174/6393342719_525b32f2f5_m.jpg',
'http://farm7.staticflickr.com/6118/6393343035_83bafff86b_m.jpg',
'http://farm8.staticflickr.com/7018/6393343341_48385747dd_m.jpg',
'http://farm7.staticflickr.com/6031/6393343621_25ca3781e2_m.jpg',
'http://farm7.staticflickr.com/6213/6393343847_5d825a5fb1_m.jpg',
'http://farm8.staticflickr.com/7004/6393344073_915042dba3_m.jpg',
'http://farm8.staticflickr.com/7035/6393344323_18bf05307b_m.jpg',
'http://farm8.staticflickr.com/7017/6393344575_4d5fd54b21_m.jpg',
'http://farm8.staticflickr.com/7150/6393344837_887fdcc3a9_m.jpg',
'http://farm7.staticflickr.com/6214/6393345081_43a265ce78_m.jpg',
'http://farm8.staticflickr.com/7168/6393345327_963d8c1b94_m.jpg',
'http://farm8.staticflickr.com/7022/6393345631_700586af6d_m.jpg',
'http://farm8.staticflickr.com/7029/6393345923_d13e973c80_m.jpg',
'http://farm8.staticflickr.com/7023/6393346181_6e24669a76_m.jpg',
'http://farm7.staticflickr.com/6216/6393346479_1fdca8f1bf_m.jpg',
'http://farm7.staticflickr.com/6034/6393346755_c10ceb8d09_m.jpg',
'http://farm8.staticflickr.com/7030/6393347043_42db8a03cb_m.jpg',
'http://farm8.staticflickr.com/7018/6393347249_5cd41701ba_m.jpg',
'http://farm8.staticflickr.com/7145/6393347501_cd12645676_m.jpg',
'http://farm8.staticflickr.com/7159/6393347815_7a809e6618_m.jpg',
'http://farm8.staticflickr.com/7168/6393348071_f089afa140_m.jpg',
'http://farm7.staticflickr.com/6224/6393348347_f601c482f8_m.jpg',
'http://farm8.staticflickr.com/7149/6393348603_f424437f88_m.jpg',
'http://farm8.staticflickr.com/7161/6393348859_ddb2eea08a_m.jpg',
'http://farm8.staticflickr.com/7019/6393349149_2a04f8ac27_m.jpg',
'http://farm7.staticflickr.com/6052/6393349459_523e496c6d_m.jpg',
'http://farm8.staticflickr.com/7013/6393349755_50c5cf674a_m.jpg',
'http://farm8.staticflickr.com/7004/6393350039_d6feb5186c_m.jpg',
'http://farm8.staticflickr.com/7009/6393350337_34c4de701f_m.jpg',
'http://farm8.staticflickr.com/7017/6393350601_5fc9fe3e48_m.jpg',
'http://farm8.staticflickr.com/7156/6393350853_f91d6b5f76_m.jpg',
'http://farm7.staticflickr.com/6113/6393351101_88798110fc_m.jpg',
'http://farm8.staticflickr.com/7023/6393351381_81d211bf6f_m.jpg',
'http://farm8.staticflickr.com/7165/6393351659_64857db22d_m.jpg',
'http://farm8.staticflickr.com/7022/6393351961_abf3e0c909_m.jpg',
'http://farm8.staticflickr.com/7153/6393352159_a7a364ace6_m.jpg',
'http://farm8.staticflickr.com/7009/6393352393_31d2899153_m.jpg',
'http://farm8.staticflickr.com/7173/6393352643_b59df3884b_m.jpg',
'http://farm8.staticflickr.com/7142/6393352917_081286c934_m.jpg',
'http://farm7.staticflickr.com/6093/6393353201_8083e6834a_m.jpg',
'http://farm8.staticflickr.com/7165/6393353407_7500c8dc19_m.jpg',
'http://farm7.staticflickr.com/6044/6393353677_7335965145_m.jpg',
'http://farm8.staticflickr.com/7165/6393353941_43946f4290_m.jpg',
'http://farm8.staticflickr.com/7160/6393354185_0c2a3c8ba8_m.jpg',
'http://farm7.staticflickr.com/6109/6393354413_c0485273b9_m.jpg',
'http://farm8.staticflickr.com/7016/6393354689_4f1de7927a_m.jpg',
'http://farm8.staticflickr.com/7005/6393354927_40f57c926f_m.jpg',
'http://farm7.staticflickr.com/6106/6393355271_dc0c83c4ed_m.jpg',
'http://farm8.staticflickr.com/7031/6393355489_6b88d72bfa_m.jpg',
'http://farm8.staticflickr.com/7144/6393355635_258ebff069_m.jpg',
'http://farm8.staticflickr.com/7006/6393355835_e547db495a_m.jpg',
'http://farm8.staticflickr.com/7002/6393356065_b02d2c06db_m.jpg',
'http://farm7.staticflickr.com/6055/6393356203_bbc8421eee_m.jpg',
'http://farm7.staticflickr.com/6236/6393356289_fbdeb4dbbc_m.jpg',
'http://farm8.staticflickr.com/7143/6393356479_cb3eab251c_m.jpg',
'http://farm8.staticflickr.com/7003/6393356765_80100ddce9_m.jpg',
'http://farm7.staticflickr.com/6118/6393356937_e57399fbd9_m.jpg',
'http://farm8.staticflickr.com/7004/6393357097_31c9b3d857_m.jpg',
'http://farm8.staticflickr.com/7158/6393357287_2f69452d29_m.jpg',
'http://farm8.staticflickr.com/7162/6393357449_71f2526236_m.jpg',
'http://farm7.staticflickr.com/6233/6393357633_7c8fe96f19_m.jpg',
'http://farm8.staticflickr.com/7145/6393357787_85792656ff_m.jpg',
'http://farm8.staticflickr.com/7034/6393357981_48c88092d7_m.jpg',
'http://farm8.staticflickr.com/7170/6393358163_035d017b7c_m.jpg',
'http://farm8.staticflickr.com/7012/6393358487_1f82fa6c8a_m.jpg',
'http://farm8.staticflickr.com/7012/6393358739_46c03ed5eb_m.jpg',
'http://farm7.staticflickr.com/6117/6393359015_b6f899b860_m.jpg',
'http://farm8.staticflickr.com/7028/6393359249_3386d62d4e_m.jpg',
'http://farm7.staticflickr.com/6059/6393359495_195b27098b_m.jpg',
'http://farm8.staticflickr.com/7034/6393359751_ebb4e411f8_m.jpg',
'http://farm7.staticflickr.com/6216/6393359995_c4db01bdf1_m.jpg',
'http://farm8.staticflickr.com/7002/6393360225_d9dd8bd0ac_m.jpg',
'http://farm7.staticflickr.com/6050/6393360463_3c4d46bc6c_m.jpg',
'http://farm8.staticflickr.com/7166/6393360719_b3f671c142_m.jpg',
'http://farm7.staticflickr.com/6052/6393361087_dd9eb8d8c1_m.jpg',
'http://farm8.staticflickr.com/7024/6393361279_e9684effef_m.jpg',
'http://farm8.staticflickr.com/7032/6393361513_aa5427a129_m.jpg',
'http://farm8.staticflickr.com/7155/6393361739_f772d99e2f_m.jpg',
'http://farm8.staticflickr.com/7168/6393361991_262f472ff0_m.jpg',
'http://farm8.staticflickr.com/7033/6393362221_ccd236113c_m.jpg',
'http://farm7.staticflickr.com/6091/6393369515_d87fab48d2_m.jpg',
'http://farm7.staticflickr.com/6223/6393369855_8fe5aaf3d3_m.jpg',
'http://farm8.staticflickr.com/7021/6393370235_4c56295aa6_m.jpg',
'http://farm8.staticflickr.com/7003/6393370655_084248a394_m.jpg',
'http://farm8.staticflickr.com/7160/6393371055_1c29cf308e_m.jpg',
'http://farm8.staticflickr.com/7024/6393371391_170e1e3942_m.jpg',
'http://farm8.staticflickr.com/7029/6393371713_6b76278dec_m.jpg',
'http://farm8.staticflickr.com/7025/6393372105_de10097842_m.jpg',
'http://farm8.staticflickr.com/7159/6393372433_2ef9bc2081_m.jpg',
'http://farm8.staticflickr.com/7035/6393372745_e76143d5a2_m.jpg',
'http://farm8.staticflickr.com/7146/6393373129_f8e0241796_m.jpg',
'http://farm7.staticflickr.com/6211/6393373479_2da067d133_m.jpg',
'http://farm8.staticflickr.com/7153/6393373823_9ecf71832c_m.jpg',
'http://farm7.staticflickr.com/6217/6393374167_97a3aa2a77_m.jpg',
'http://farm8.staticflickr.com/7017/6393374535_e2881f21fa_m.jpg',
'http://farm8.staticflickr.com/7172/6393374887_5e2af5f818_m.jpg',
'http://farm7.staticflickr.com/6228/6393375229_7184f8ef3e_m.jpg',
'http://farm8.staticflickr.com/7023/6393375555_ec716078a5_m.jpg',
'http://farm7.staticflickr.com/6053/6393375765_63a2073eae_m.jpg',
'http://farm7.staticflickr.com/6095/6393376045_deeb77a9c0_m.jpg',
'http://farm8.staticflickr.com/7155/6393376293_b1bedcd68a_m.jpg',
'http://farm7.staticflickr.com/6211/6393376605_469e101513_m.jpg',
'http://farm8.staticflickr.com/7151/6393376797_b85a89909c_m.jpg',
'http://farm8.staticflickr.com/7157/6393377083_73d9818209_m.jpg',
'http://farm7.staticflickr.com/6057/6393377371_d6a2155f4a_m.jpg',
'http://farm8.staticflickr.com/7001/6393377681_bf64b54d1d_m.jpg',
'http://farm8.staticflickr.com/7006/6393377983_b732f77de4_m.jpg',
'http://farm7.staticflickr.com/6226/6393378273_a7a901eca6_m.jpg',
'http://farm8.staticflickr.com/7030/6393378455_96f6d7bb36_m.jpg',
'http://farm8.staticflickr.com/7175/6393378641_50547b21f6_m.jpg',
'http://farm7.staticflickr.com/6103/6393378775_488a349cfb_m.jpg',
'http://farm8.staticflickr.com/7168/6393379017_1c51778571_m.jpg',
'http://farm8.staticflickr.com/7165/6393379277_61d4a2ccca_m.jpg',
'http://farm8.staticflickr.com/7030/6393379523_604c7fc81e_m.jpg',
'http://farm8.staticflickr.com/7006/6393379791_5e4180177b_m.jpg',
'http://farm8.staticflickr.com/7018/6393380063_4012124f6f_m.jpg',
'http://farm8.staticflickr.com/7144/6393380335_169ba6219b_m.jpg',
'http://farm7.staticflickr.com/6099/6393380635_e0ff1f9fea_m.jpg',
'http://farm8.staticflickr.com/7024/6393380875_2c202ace8c_m.jpg',
'http://farm8.staticflickr.com/7011/6393381089_b66b281fc9_m.jpg',
'http://farm8.staticflickr.com/7007/6393381377_92a504c2eb_m.jpg',
'http://farm7.staticflickr.com/6093/6393381713_08afdb08ed_m.jpg',
'http://farm8.staticflickr.com/7001/6393381953_415b6b82bc_m.jpg',
'http://farm8.staticflickr.com/7151/6393382215_598b04d983_m.jpg',
'http://farm8.staticflickr.com/7160/6393382501_ebbd33e3cd_m.jpg',
'http://farm8.staticflickr.com/7008/6393382783_b6685bd03b_m.jpg',
'http://farm7.staticflickr.com/6058/6393383045_19f4000072_m.jpg',
'http://farm7.staticflickr.com/6046/6393383229_b55666c923_m.jpg',
'http://farm8.staticflickr.com/7153/6393383415_3cc9a25c8f_m.jpg',
'http://farm7.staticflickr.com/6094/6393383681_ea166c7221_m.jpg',
'http://farm8.staticflickr.com/7147/6393383983_9fdae82bd9_m.jpg',
'http://farm8.staticflickr.com/7030/6393384205_c71da5a953_m.jpg',
'http://farm8.staticflickr.com/7152/6393384467_87b6b74304_m.jpg',
'http://farm8.staticflickr.com/7025/6393384675_6b289f71a3_m.jpg',
'http://farm8.staticflickr.com/7162/6393384851_a8870b3e3f_m.jpg',
'http://farm7.staticflickr.com/6108/6393385101_fd376c65fb_m.jpg',
'http://farm7.staticflickr.com/6227/6393385375_28ec4edcca_m.jpg',
'http://farm8.staticflickr.com/7156/6393385707_39fe8223d3_m.jpg',
'http://farm8.staticflickr.com/7166/6393385941_5ea0966f87_m.jpg',
'http://farm8.staticflickr.com/7002/6393386175_04cbcf91c9_m.jpg',
'http://farm8.staticflickr.com/7164/6393386427_af8a71905e_m.jpg',
'http://farm8.staticflickr.com/7020/6393386691_a91631139c_m.jpg',
'http://farm8.staticflickr.com/7009/6393386923_6a7b1b7b82_m.jpg',
'http://farm7.staticflickr.com/6114/6393387077_18b6f1a86a_m.jpg',
'http://farm7.staticflickr.com/6215/6393387319_e477e69e32_m.jpg',
'http://farm8.staticflickr.com/7147/6393387579_f8081e8538_m.jpg',
'http://farm8.staticflickr.com/7155/6393387873_f46569dd27_m.jpg',
'http://farm8.staticflickr.com/7144/6393388119_9fec46183a_m.jpg',
'http://farm8.staticflickr.com/7007/6393388379_c698f61bc6_m.jpg',
'http://farm8.staticflickr.com/7170/6393388619_85ae7757bf_m.jpg',
'http://farm7.staticflickr.com/6221/6393388845_04bd97a4ae_m.jpg',
'http://farm7.staticflickr.com/6057/6393389093_446a7f8a54_m.jpg',
'http://farm8.staticflickr.com/7011/6393389305_ef791a051a_m.jpg',
'http://farm7.staticflickr.com/6034/6393389529_a8965a745a_m.jpg',
'http://farm8.staticflickr.com/7157/6393389821_7f8e33f8ce_m.jpg',
'http://farm8.staticflickr.com/7025/6393390013_b9138fd2ca_m.jpg',
'http://farm8.staticflickr.com/7004/6393390223_9081de780c_m.jpg',
'http://farm8.staticflickr.com/7028/6393390439_8ac595d057_m.jpg',
'http://farm8.staticflickr.com/7153/6393390637_caa93ac922_m.jpg',
'http://farm8.staticflickr.com/7005/6393390881_5412525b36_m.jpg',
'http://farm8.staticflickr.com/7156/6393391141_2b9a7d88c0_m.jpg',
'http://farm8.staticflickr.com/7017/6393391305_c81aaf264e_m.jpg',
'http://farm8.staticflickr.com/7164/6393391461_b95dd9dda6_m.jpg',
'http://farm8.staticflickr.com/7162/6393391701_835825cf93_m.jpg',
'http://farm8.staticflickr.com/7144/6393392049_d238e28d6d_m.jpg',
'http://farm8.staticflickr.com/7021/6393392261_e5f0ab58b0_m.jpg',
'http://farm7.staticflickr.com/6237/6393392513_832ecd8618_m.jpg',
'http://farm8.staticflickr.com/7007/6393392777_f7abd3f73b_m.jpg',
'http://farm8.staticflickr.com/7175/6393393013_8155a5b6eb_m.jpg',
'http://farm8.staticflickr.com/7167/6393393417_5fc00d960f_m.jpg',
'http://farm7.staticflickr.com/6117/6393393689_fdd191dd88_m.jpg',
'http://farm7.staticflickr.com/6222/6393393935_9a970940c8_m.jpg',
'http://farm8.staticflickr.com/7169/6393394175_55506d593b_m.jpg',
'http://farm8.staticflickr.com/7163/6393394389_d1a7c4d9fb_m.jpg',
'http://farm7.staticflickr.com/6045/6393394671_a63065351c_m.jpg',
'http://farm8.staticflickr.com/7144/6393394989_93ffded891_m.jpg',
'http://farm8.staticflickr.com/7024/6393395237_f35ae2abfa_m.jpg',
'http://farm8.staticflickr.com/7150/6393395455_1da3848e78_m.jpg',
'http://farm7.staticflickr.com/6095/6393395671_58be4a51aa_m.jpg',
'http://farm7.staticflickr.com/6112/6393395915_a6bcda01bd_m.jpg',
'http://farm8.staticflickr.com/7152/6393396147_bbc89f2b1f_m.jpg',
'http://farm8.staticflickr.com/7175/6393396455_5d46d40a87_m.jpg',
'http://farm8.staticflickr.com/7144/6393396743_1b870ef2ee_m.jpg',
'http://farm8.staticflickr.com/7012/6393397037_2f4865572f_m.jpg',
'http://farm8.staticflickr.com/7029/6393397351_48dccccdcd_m.jpg',
'http://farm7.staticflickr.com/6111/6393397639_8ffe19a396_m.jpg',
'http://farm8.staticflickr.com/7011/6393397925_f81dff5ca7_m.jpg',
'http://farm8.staticflickr.com/7002/6393398143_83046f761a_m.jpg',
'http://farm8.staticflickr.com/7148/6393398437_4de88a6d8a_m.jpg',
'http://farm8.staticflickr.com/7011/6393398731_8b4845958b_m.jpg',
'http://farm8.staticflickr.com/7009/6393398997_5073e04124_m.jpg',
'http://farm8.staticflickr.com/7163/6393399237_ba25ed69d2_m.jpg',
'http://farm7.staticflickr.com/6102/6393399521_8024aac2aa_m.jpg',
'http://farm8.staticflickr.com/7005/6393399757_bba0718784_m.jpg',
'http://farm7.staticflickr.com/6212/6393399935_68d6034d5a_m.jpg',
'http://farm8.staticflickr.com/7033/6393400191_bcc351da5d_m.jpg',
'http://farm8.staticflickr.com/7021/6393400389_63439ff91d_m.jpg',
'http://farm8.staticflickr.com/7159/6393400665_699c9d7e74_m.jpg',
'http://farm8.staticflickr.com/7019/6393400867_cc7d7a9b5e_m.jpg',
'http://farm7.staticflickr.com/6228/6393401053_dfe60374ec_m.jpg',
'http://farm8.staticflickr.com/7163/6393401367_aee8d50c7f_m.jpg',
'http://farm8.staticflickr.com/7141/6393401657_f1b965351c_m.jpg',
'http://farm7.staticflickr.com/6054/6393401927_27d8d81898_m.jpg',
'http://farm8.staticflickr.com/7168/6393402111_6d6b96499c_m.jpg',
'http://farm8.staticflickr.com/7162/6393402285_bb04022e50_m.jpg',
'http://farm7.staticflickr.com/6119/6393402569_51b2742c11_m.jpg',
'http://farm7.staticflickr.com/6120/6393402803_58347819ce_m.jpg',
'http://farm8.staticflickr.com/7004/6393403155_b9987e099c_m.jpg',
'http://farm7.staticflickr.com/6051/6393403357_d5f52b8fd3_m.jpg',
'http://farm8.staticflickr.com/7158/6393403557_eb48762258_m.jpg',
'http://farm8.staticflickr.com/7032/6393406587_e20c9419ac_m.jpg',
'http://farm8.staticflickr.com/7028/6393406873_2dabfb7bd4_m.jpg',
'http://farm8.staticflickr.com/7160/6393407025_9c77a22415_m.jpg',
'http://farm8.staticflickr.com/7005/6393407259_2e83e47cd6_m.jpg',
'http://farm8.staticflickr.com/7147/6393407519_a18413aa0d_m.jpg',
'http://farm7.staticflickr.com/6038/6393407771_ee24d89799_m.jpg',
'http://farm8.staticflickr.com/7035/6393408005_ce468bbf92_m.jpg',
'http://farm8.staticflickr.com/7159/6393408237_7fe2b3ec1f_m.jpg',
'http://farm7.staticflickr.com/6117/6393408469_8b83c1df99_m.jpg',
'http://farm8.staticflickr.com/7016/6393408703_14aa6f55aa_m.jpg',
'http://farm8.staticflickr.com/7175/6393408917_9169edac5e_m.jpg',
'http://farm8.staticflickr.com/7017/6393409185_f8df0cd842_m.jpg',
'http://farm8.staticflickr.com/7146/6393409405_9fa30b0fcd_m.jpg',
'http://farm8.staticflickr.com/7155/6393409647_4ed0a1abe1_m.jpg',
'http://farm8.staticflickr.com/7158/6393409799_b0fde7ca11_m.jpg',
'http://farm7.staticflickr.com/6228/6393410017_348c6a35e4_m.jpg',
'http://farm8.staticflickr.com/7016/6393410341_1cd7eeafe3_m.jpg',
'http://farm8.staticflickr.com/7017/6393410553_16f868b121_m.jpg',
'http://farm8.staticflickr.com/7161/6393410683_52bf349440_m.jpg',
'http://farm7.staticflickr.com/6214/6393410853_1dde202174_m.jpg',
'http://farm7.staticflickr.com/6232/6393411063_ea9755e684_m.jpg',
'http://farm8.staticflickr.com/7173/6393411295_bebb7d7e3e_m.jpg',
'http://farm8.staticflickr.com/7016/6393411489_f3bf7b1ee6_m.jpg',
'http://farm8.staticflickr.com/7023/6393411651_a0cdb9405b_m.jpg',
'http://farm8.staticflickr.com/7169/6393411857_dc153e34d0_m.jpg',
'http://farm7.staticflickr.com/6229/6393411991_7edd8f11d7_m.jpg',
'http://farm8.staticflickr.com/7162/6393412177_e5a470766f_m.jpg',
'http://farm7.staticflickr.com/6118/6393412405_0a8c61d0da_m.jpg',
'http://farm7.staticflickr.com/6059/6393412659_56dc550d52_m.jpg',
'http://farm8.staticflickr.com/7032/6393412927_2603027c8d_m.jpg',
'http://farm8.staticflickr.com/7141/6393413117_518076084c_m.jpg',
'http://farm7.staticflickr.com/6213/6393413349_c4f10018e9_m.jpg',
'http://farm8.staticflickr.com/7009/6393413547_4c9d358c85_m.jpg',
'http://farm8.staticflickr.com/7013/6393413779_697fb1216c_m.jpg',
'http://farm8.staticflickr.com/7032/6393413945_839f5cdb37_m.jpg',
'http://farm8.staticflickr.com/7168/6393414147_c0cb0dc77a_m.jpg',
'http://farm8.staticflickr.com/7147/6393414359_1a6e42ce06_m.jpg',
'http://farm8.staticflickr.com/7026/6393414583_af0ce1525b_m.jpg',
'http://farm8.staticflickr.com/7018/6393414803_6a1e523418_m.jpg',
'http://farm8.staticflickr.com/7004/6393415051_9d4830821f_m.jpg',
'http://farm8.staticflickr.com/7149/6393415269_40553f5736_m.jpg',
'http://farm8.staticflickr.com/7029/6393415487_c4c83e94d3_m.jpg',
'http://farm8.staticflickr.com/7174/6393415775_04ce5507dd_m.jpg',
'http://farm7.staticflickr.com/6224/6393416017_347ea1be5f_m.jpg',
'http://farm7.staticflickr.com/6038/6393416293_05a96fe86a_m.jpg',
'http://farm7.staticflickr.com/6119/6393416527_981a3a6ac2_m.jpg',
'http://farm8.staticflickr.com/7012/6393416741_e77a23c712_m.jpg',
'http://farm8.staticflickr.com/7031/6393416877_77b9f066f2_m.jpg',
'http://farm8.staticflickr.com/7007/6393417051_e3e0a078c9_m.jpg',
'http://farm8.staticflickr.com/7031/6393417293_3f7a2762b1_m.jpg',
'http://farm8.staticflickr.com/7145/6393417563_99c231283a_m.jpg',
'http://farm8.staticflickr.com/7020/6393417729_2251feab61_m.jpg',
'http://farm8.staticflickr.com/7142/6393417927_975a1c6bc8_m.jpg',
'http://farm8.staticflickr.com/7026/6393418185_1d380e51e2_m.jpg',
'http://farm8.staticflickr.com/7006/6393418341_3298604666_m.jpg',
'http://farm7.staticflickr.com/6036/6393418487_31fbbff1d6_m.jpg',
'http://farm7.staticflickr.com/6237/6393418741_f8f6a50ced_m.jpg',
'http://farm8.staticflickr.com/7028/6393418981_8360e57da0_m.jpg',
'http://farm8.staticflickr.com/7159/6393419187_f325551179_m.jpg',
'http://farm8.staticflickr.com/7169/6393419435_50a899efc6_m.jpg',
'http://farm7.staticflickr.com/6112/6393419707_a42f4a5099_m.jpg',
'http://farm7.staticflickr.com/6092/6393419863_d056520a36_m.jpg',
'http://farm8.staticflickr.com/7165/6393420075_18f4a8208f_m.jpg',
'http://farm8.staticflickr.com/7155/6393420377_5b10c4973d_m.jpg',
'http://farm8.staticflickr.com/7019/6393420599_2ca8cda8d9_m.jpg',
'http://farm8.staticflickr.com/7017/6393420821_79d6c78b28_m.jpg',
'http://farm8.staticflickr.com/7034/6393421071_5a6df82352_m.jpg',
'http://farm8.staticflickr.com/7004/6393421307_e4d0649308_m.jpg',
'http://farm7.staticflickr.com/6229/6393421501_f0e2dcd92e_m.jpg',
'http://farm8.staticflickr.com/7015/6393421693_f552734516_m.jpg',
'http://farm8.staticflickr.com/7018/6393421885_c2ed40d44b_m.jpg',
'http://farm8.staticflickr.com/7013/6393422119_783f200109_m.jpg',
'http://farm8.staticflickr.com/7009/6393422325_a228205888_m.jpg',
'http://farm8.staticflickr.com/7169/6393422529_95523b12a6_m.jpg',
'http://farm8.staticflickr.com/7142/6393422777_d672d14c77_m.jpg',
'http://farm8.staticflickr.com/7158/6393423025_2ca3f89769_m.jpg',
'http://farm8.staticflickr.com/7142/6393423313_dec439a8ba_m.jpg',
'http://farm7.staticflickr.com/6047/6393423527_f82ca1f894_m.jpg',
'http://farm7.staticflickr.com/6048/6393423707_d2b3e52c19_m.jpg',
'http://farm7.staticflickr.com/6095/6393423887_363f65d16f_m.jpg',
'http://farm7.staticflickr.com/6058/6393424075_d7f85d8dde_m.jpg',
'http://farm8.staticflickr.com/7158/6393424321_a3723afeae_m.jpg',
'http://farm8.staticflickr.com/7021/6393424539_101923228e_m.jpg',
'http://farm8.staticflickr.com/7165/6393424759_30609f3b65_m.jpg',
'http://farm7.staticflickr.com/6231/6393425231_c5511e29da_m.jpg',
'http://farm8.staticflickr.com/7002/6393425453_18d53c40ca_m.jpg',
'http://farm7.staticflickr.com/6094/6393425625_007be6d1e1_m.jpg',
'http://farm8.staticflickr.com/7029/6393425839_49527d6b38_m.jpg',
'http://farm7.staticflickr.com/6091/6393426023_bb6f8763dd_m.jpg',
'http://farm8.staticflickr.com/7003/6393426149_ae32e1e60a_m.jpg',
'http://farm7.staticflickr.com/6055/6393426475_e92515b930_m.jpg',
'http://farm7.staticflickr.com/6107/6393426631_d81d00de50_m.jpg',
'http://farm8.staticflickr.com/7174/6393426815_9522187145_m.jpg',
'http://farm8.staticflickr.com/7030/6393427047_3048336d6e_m.jpg',
'http://farm8.staticflickr.com/7162/6393427211_a0961b942b_m.jpg',
'http://farm7.staticflickr.com/6101/6393427433_ca4956c4b6_m.jpg',
'http://farm7.staticflickr.com/6049/6393427647_efd69e676a_m.jpg',
'http://farm8.staticflickr.com/7023/6393427895_2c980216be_m.jpg',
'http://farm8.staticflickr.com/7155/6393428103_cbb580a51f_m.jpg',
'http://farm7.staticflickr.com/6219/6393428385_f526fa9232_m.jpg',
'http://farm8.staticflickr.com/7033/6393428643_a32a7756c2_m.jpg',
'http://farm7.staticflickr.com/6118/6393428853_bee0704a13_m.jpg',
'http://farm7.staticflickr.com/6094/6393429075_f7bbbe88b2_m.jpg',
'http://farm8.staticflickr.com/7018/6393429279_dbfd546a86_m.jpg',
'http://farm7.staticflickr.com/6229/6393429543_8097b7efef_m.jpg',
'http://farm8.staticflickr.com/7020/6393429757_9b9f0fb7f4_m.jpg',
'http://farm7.staticflickr.com/6058/6393430011_a5a3d4f478_m.jpg',
'http://farm8.staticflickr.com/7013/6393430179_f69b6ed1f4_m.jpg',
'http://farm7.staticflickr.com/6108/6393430359_d5130122ec_m.jpg',
'http://farm8.staticflickr.com/7001/6393430599_b00859bcce_m.jpg',
'http://farm7.staticflickr.com/6042/6393430847_7ebf5f2fd6_m.jpg',
'http://farm8.staticflickr.com/7154/6393431085_2a88e5a33b_m.jpg',
'http://farm8.staticflickr.com/7145/6393431323_7c97a050a1_m.jpg',
'http://farm8.staticflickr.com/7020/6393431605_8332b0109a_m.jpg',
'http://farm8.staticflickr.com/7158/6393431881_5151940cb9_m.jpg',
'http://farm8.staticflickr.com/7003/6393432127_a1d39b9820_m.jpg',
'http://farm8.staticflickr.com/7156/6393432391_e961f9be98_m.jpg',
'http://farm8.staticflickr.com/7023/6393432609_9abcd28441_m.jpg',
'http://farm8.staticflickr.com/7014/6393432813_cd62b06e9f_m.jpg',
'http://farm8.staticflickr.com/7144/6393433065_4b80bfc243_m.jpg',
'http://farm8.staticflickr.com/7018/6393433255_c43c4a71e2_m.jpg',
'http://farm8.staticflickr.com/7158/6393433435_f6d2bd5fed_m.jpg',
'http://farm7.staticflickr.com/6105/6393433741_5ba170a3c8_m.jpg',
'http://farm8.staticflickr.com/7008/6393434015_927ca5f263_m.jpg',
'http://farm7.staticflickr.com/6056/6393434251_39dbd5e0d1_m.jpg',
'http://farm8.staticflickr.com/7169/6393434485_ee0ecea139_m.jpg',
'http://farm7.staticflickr.com/6227/6393434699_f8baf7c3d8_m.jpg',
'http://farm8.staticflickr.com/7010/6393434887_5bd38ab5da_m.jpg',
'http://farm7.staticflickr.com/6040/6393435141_8155b8ae7b_m.jpg',
'http://farm7.staticflickr.com/6216/6393450849_0b9d5c3355_m.jpg',
'http://farm8.staticflickr.com/7028/6393451029_130d37dcaf_m.jpg',
'http://farm8.staticflickr.com/7032/6393451263_0d33d53655_m.jpg',
'http://farm8.staticflickr.com/7168/6393451435_cca74f31f0_m.jpg',
'http://farm8.staticflickr.com/7003/6393451597_86bae238ae_m.jpg',
'http://farm8.staticflickr.com/7162/6393451791_c46645c675_m.jpg',
'http://farm8.staticflickr.com/7165/6393452037_5f4d7317e7_m.jpg',
'http://farm8.staticflickr.com/7149/6393452287_f089fb9506_m.jpg',
'http://farm8.staticflickr.com/7017/6393452639_c5c4daf046_m.jpg',
'http://farm7.staticflickr.com/6105/6393452853_2fbd84f7c9_m.jpg',
'http://farm8.staticflickr.com/7141/6393453127_0665819b62_m.jpg',
'http://farm8.staticflickr.com/7033/6393453391_6c736a4ca7_m.jpg',
'http://farm8.staticflickr.com/7144/6393453677_6767668acd_m.jpg',
'http://farm8.staticflickr.com/7027/6393453939_d10f0b3218_m.jpg',
'http://farm8.staticflickr.com/7162/6393454245_8f9436188d_m.jpg',
'http://farm8.staticflickr.com/7010/6393454493_b161e44587_m.jpg',
'http://farm8.staticflickr.com/7019/6393454767_f03e64b063_m.jpg',
'http://farm8.staticflickr.com/7163/6393455061_14a35a0ff5_m.jpg',
'http://farm8.staticflickr.com/7011/6393455255_720231dcf4_m.jpg',
'http://farm7.staticflickr.com/6108/6393455541_cd76a7b228_m.jpg',
'http://farm8.staticflickr.com/7156/6393455809_0bbb038299_m.jpg',
'http://farm8.staticflickr.com/7147/6393455967_01c5dc3587_m.jpg',
'http://farm7.staticflickr.com/6037/6393456081_3eec51153e_m.jpg',
'http://farm8.staticflickr.com/7144/6393456257_70bff58c5b_m.jpg',
'http://farm8.staticflickr.com/7154/6393456457_b1a8263c5e_m.jpg',
'http://farm8.staticflickr.com/7160/6393456675_5ecf296e3d_m.jpg',
'http://farm7.staticflickr.com/6112/6393456821_d82e5f91a5_m.jpg',
'http://farm7.staticflickr.com/6099/6393457079_f02b15cd2c_m.jpg',
'http://farm7.staticflickr.com/6221/6393457305_9bc371f689_m.jpg',
'http://farm8.staticflickr.com/7146/6393457513_04368a92af_m.jpg',
'http://farm8.staticflickr.com/7015/6393457763_b92b118463_m.jpg',
'http://farm8.staticflickr.com/7153/6393457975_0bba613a2f_m.jpg',
'http://farm7.staticflickr.com/6239/6393458113_5722b7ef56_m.jpg',
'http://farm7.staticflickr.com/6226/6393458319_4e22e9c8d0_m.jpg',
'http://farm7.staticflickr.com/6218/6393458539_1e0a7e49ff_m.jpg',
'http://farm8.staticflickr.com/7034/6393458747_76d2092d52_m.jpg',
'http://farm8.staticflickr.com/7141/6393458985_4a7068c652_m.jpg',
'http://farm8.staticflickr.com/7172/6393459161_36244c5e54_m.jpg',
'http://farm7.staticflickr.com/6042/6393459371_51704ea222_m.jpg',
'http://farm8.staticflickr.com/7141/6393459587_d6132f1e70_m.jpg',
'http://farm8.staticflickr.com/7145/6393459773_15cfb0c92f_m.jpg',
'http://farm8.staticflickr.com/7001/6393459957_3a11cd09bf_m.jpg',
'http://farm8.staticflickr.com/7017/6393460125_71fefd42bb_m.jpg',
'http://farm8.staticflickr.com/7169/6393460287_1cebe23778_m.jpg',
'http://farm8.staticflickr.com/7023/6393460469_58df479f13_m.jpg',
'http://farm7.staticflickr.com/6228/6393460645_9b433e8d10_m.jpg',
'http://farm8.staticflickr.com/7020/6393460811_13eafc6018_m.jpg',
'http://farm8.staticflickr.com/7169/6393461013_165d4f30d9_m.jpg',
'http://farm8.staticflickr.com/7019/6393461181_d041123dbc_m.jpg',
'http://farm8.staticflickr.com/7157/6393461355_bfb0530f45_m.jpg',
'http://farm8.staticflickr.com/7002/6393461547_0229a032fd_m.jpg',
'http://farm7.staticflickr.com/6225/6393461681_05f992d83b_m.jpg',
'http://farm8.staticflickr.com/7169/6393461867_a5a89a11cf_m.jpg',
'http://farm8.staticflickr.com/7032/6393462041_bb31581dc6_m.jpg',
'http://farm7.staticflickr.com/6042/6393462175_9c96cf8360_m.jpg',
'http://farm7.staticflickr.com/6118/6393462357_8fe79422c0_m.jpg',
'http://farm8.staticflickr.com/7010/6393462481_5b9d96043b_m.jpg',
'http://farm7.staticflickr.com/6119/6393462641_bcaed407ac_m.jpg',
'http://farm7.staticflickr.com/6033/6393462779_3f1c68763d_m.jpg',
'http://farm7.staticflickr.com/6114/6393462929_417c253a5f_m.jpg',
'http://farm8.staticflickr.com/7028/6393463105_c026e31cdd_m.jpg',
'http://farm8.staticflickr.com/7149/6393463237_93e7dc3401_m.jpg',
'http://farm8.staticflickr.com/7174/6393463435_e6b69faaef_m.jpg'];

PHOTOS = PHOTOS_FLICKR;

$(main)
