// configs
var tileSize = 100;
var cloneSize = tileSize / 1.5;
var extendSize = 50;
var perExtend = 10;
var animationSpeed = 50;

$(function() {
	initGame();
});

var initGame = function() {

	var $game = $('#game');
	var $extend = $('<div>Extend the board</div>');
	var $tile = $('<div class="tile"></div>');
	var $row = $('<div class="row"></div>');

	// Restart
	$game.empty();

	var h = $(window).height();
	var w = $(window).width();

	var createExtender = function() {

		$extend
		.css({
			'height' : extendSize,
			'line-height' : extendSize + 'px'
		});

		$extend
		.clone()
		.appendTo($game)
		.addClass('extend-x');
		
		$extend
		.clone()
		.appendTo($game)
		.addClass('extend-y')
		.css({
			'left' : w / 2 - extendSize / 2
		});
	}();

	var createBoard = function() {

		// finish the started tiles
		tilesPerRow = Math.floor(w / tileSize) + 1;
		tileRows = Math.floor(h / tileSize) + 1;
		
		// don't break the flows
		gameSize = {'height' : tileSize * tileRows, 'width' : tileSize * tilesPerRow},
		$game.css(gameSize);
		
		// build a row
		for (var i = 0; i < tilesPerRow; i++) {
			var cloneTileSizeDiff = tileSize - cloneSize
			$tile.css( 	{	
				'height' : tileSize - cloneTileSizeDiff, 
				'width' : tileSize - cloneTileSizeDiff, 
				'padding' : cloneTileSizeDiff / 2
			});
			$tile.clone().appendTo($row).attr('data-tileNumber', i);
		}

		// build the board
		for (var j = tileRows - 1; j >= 0; j--) {
			$row.clone().appendTo($game).attr('data-rowNumber', j);
		}
	}();

	var createPrison = function() {

		var $circle = $('<div class="clone"></div>');
		$circle.css({'height' : cloneSize, 'width' : cloneSize});
		
		var $prisonCell1 = $('div[data-rowNumber=0]>div[data-tileNumber=0]');
		var $prisonCell2 = $('div[data-rowNumber=0]>div[data-tileNumber=1]').addClass('wall');
		var $prisonCell3 = $('div[data-rowNumber=1]>div[data-tileNumber=0]').addClass('wall');

		$circle.clone().appendTo($prisonCell1);
		$circle.clone().appendTo($prisonCell2);
		$circle.clone().appendTo($prisonCell3);
	}();

	// Bind Eventhandler
	$(window).on('resize', resize);
	$('.clone').on('click', move);
	$('.extend-y').on('click', extendY);
	$('.extend-x').on('click', extendX);
}

var move = function(event) {

	// extract the number of the original's parent classes
	var tileNumber = parseInt($(this).parent().attr('data-tileNumber'));
	var rowNumber = parseInt($(this).parent().parent().attr('data-rowNumber'));

	var $thisTile = $(this).parent();
	var $upperTile = $('div[data-rowNumber=' + (rowNumber + 1) + ']>div[data-tileNumber=' + tileNumber + ']');
	var $righterTile = $('div[data-rowNumber=' + rowNumber + ']>div[data-tileNumber=' + (tileNumber + 1) + ']');
	var $clone = $(this).clone();

	var upperRighterTileExist = $upperTile.length && $righterTile.length;
	var rightOrLeftCircle = $upperTile.children().length  || $righterTile.children().length;


	if (upperRighterTileExist  && !rightOrLeftCircle) {

		var $animation1 = $clone
							.clone()
							.appendTo($thisTile)
							.css({
								'position' : 'relative'
							});
		var $animation2 = $clone
							.clone()
							.appendTo($thisTile)
							.css({
								'z-index' : '1',
								'position' : 'absolute',
								'bottom' : (tileSize - cloneSize)/2
							});
		
		$(this).remove();

		$animation1
		.animate(
		{'bottom' : '+=' + tileSize + 'px'},
		animationSpeed,
		function() {
			$animation1.remove();
			$clone
			.appendTo($upperTile)
			.on('click', move);
		});
		
		$animation2
		.animate({
			'left' : '+=' + tileSize + 'px',
		},
		animationSpeed,
		function() {
			$animation2.remove();
			$clone
			.clone()
			.appendTo($righterTile)
			.css({'left' : '-=' + tileSize + 'px'})
			.on('click', move);
		});
	}
	else {
		// Wrong Move Warning
		$('.small-modal').fadeIn('fast');
		setTimeout( function() {
			$('.small-modal').fadeOut('slow');
		}, 1000);
	}
}



var resize = function(event) {
	var h = $(window).height();
	var w = $(window).width();

	$('.extend-y')
	.css({
		'left' : w / 2 - extendSize / 2
	});
}

var	extendX = function(event) {
	var rowLength = $('.row').length;
	var $latestRow = $('.row').eq(0);

	var $factoryRow = $latestRow.clone().removeClass(rowLength - 1 + '');;
	$factoryRow.children().empty();

	for (i = perExtend; i > 0; i--) {
		$factoryRow
		.clone()
		.insertBefore($latestRow)
		.attr('data-rowNumber', rowLength + i - 1);
	}
}

var	extendY = function(event) {
	var  tileLength = $('.row').eq(0).children('.tile').length;
	var $latestTile = $('.row .tile').eq(0);

	var $factoryTile = $latestTile.clone().removeClass('0');
	$factoryTile.empty();

	// refresh the width so the layout doesn't break
	$('.row').css({'width' : $('.row').width() + perExtend  * tileSize});

	for (i = 0; i < perExtend; i++) {
		$factoryTile
		.clone()
		.appendTo('.row')
		.attr('data-tileNumber', tileLength + i + '');
	}
}