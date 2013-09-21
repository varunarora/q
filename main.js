$(document).ready(function(){
	setTimeout(function(){
		var openingStatement = ', <span class="welcome-guest-name">Janahi</span>';
		$('.welcome-screen').append(openingStatement);
		$('.welcome-guest-name').fadeIn('slow');
		
		setTimeout(slideUpWelcome, 2000);
	}, 2000);
	
	$('.catalog-box').click(function(event){
		$('.home-catalog').slideUp('slow');
		$('.catalog-explorer').fadeIn('slow');
		
		// Bind explorer items click events.
		bindExplorerClickEvents();
		
		$('.catalog-explorer').css('height', $(window).height());
			
		$('.catalog-explorer-controls').fadeIn('slow');
		
		event.preventDefault();
		event.stopPropagation();
		return false;
	});
	
	$('.catalog-explorer').children().draggable();
	
	bindZoomButtons();
});

function slideUpWelcome(){
	$('.welcome-screen').animate({
		opacity: 'toggle',
		top: '-200'
	}, 500, function(){
		$(this).remove();
		showCatalog();
	});
/*
	setTimeout(function(){
		$('.welcome-screen').slideUp('slow', function(){
			$(this).fadeOut('fast');
			showCatalog();
		});
	}, 1000);
*/
}

function showCatalog(){
	$('.home-catalog').fadeIn('slow', function(){
		//$(this).slideUp();
	});
}

function bindZoomButtons(){
	$('.zoom-in-explorer').click(function(){
		$('.catalog-explorer').children().each(function(){
			$(this).width($(this).width()+1);
			$(this).height($(this).height()+1);
		});
	});
	$('.zoom-out-explorer').click(function(){
		$('.catalog-explorer').children().each(function(){
			$(this).width($(this).width()-1);
		});
	});
}

function bindExplorerClickEvents(){
	$('.catalog-explorer').children().each(function(){
		bindExplorerItemClick(this);
	});
}

function bindExplorerItemClick(explorerItem){
	$(explorerItem).click(function(event){
		var centerHeight = $(window).height() / 2;
		var centerWidth = $(window).width() / 2;
		
		var originalTop = $(event.target).css('top');
		var originalLeft = $(event.target).css('left');
		
		var currentHeight = $(event.target).height();
		var currentWidth = $(event.target).width();

		var imageCopy = $('<img/>', {
        	'src': explorerItem.src,
        	'class': 'no-show'
    	});

		$('body').append(imageCopy);

    	var originalWidthToHeight = imageCopy.width() / imageCopy.height();

		var finalObjectWidth, finalObjectHeight;
		if (originalWidthToHeight > 1) {
			finalObjectWidth = $(window).width() - 50;
			finalObjectHeight = finalObjectWidth / originalWidthToHeight;
			
			if (finalObjectHeight > $(window).height()){
				finalObjectHeight = $(window).height() - 50;
				finalObjectWidth = finalObjectHeight * originalWidthToHeight;					
			}
		} else {
			finalObjectHeight = $(window).height() - 50;
			finalObjectWidth = finalObjectHeight * originalWidthToHeight;
		}

		$(explorerItem).animate({
			top: centerHeight - currentHeight,
			left: centerWidth - currentWidth,
			width: currentWidth * 2,
			height: currentHeight * 2
		}, 800, function(){
			$(explorerItem).addClass('is-zoomed');
			$('.popup-background').addClass('show-popup-background');
			$(explorerItem).animate({
				top: centerHeight - finalObjectHeight / 2,
				left: centerWidth - finalObjectWidth / 2,
				height: finalObjectHeight,
				width: finalObjectWidth
			}, 800, function(){
				$(explorerItem).unbind();
				
				$(explorerItem).click(function(event){
					closeOpenResource(event, [originalTop, originalLeft],
						[currentWidth, currentHeight]	
					);
				});
			});
		});
	});
}

function closeOpenResource(event, originalPositions, originalSize){
	$('.popup-background').removeClass('show-popup-background');
	$(event.target).removeClass('is-zoomed');
	
	$(event.target).animate({
		top: originalPositions[0],
		left: originalPositions[1],
		width: originalSize[0],
		height: originalSize[1]
	}, 1000, function(){
		console.log($(event.target));
		$(event.target).draggable();
		bindExplorerItemClick(event.target);
	});
	
}