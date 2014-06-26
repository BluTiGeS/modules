$(document).ready(function(){
	
	/* category pages => list and grid view */
	if (typeof page_name != 'undefined' && !in_array(page_name, ['product']))
		bindGridLegal(); 
	
	/* product pages combinations/attributes */
	else {
		
		$(document).on('click', '.color_pick', function(e){
			findCombinationLegal();
		});

		$(document).on('change', '.attribute_select', function(e){
			findCombinationLegal();
		});

		$(document).on('click', '.attribute_radio', function(e){
			findCombinationLegal();
		});
		
		var url_found = checkUrl();
		
		if (typeof productHasAttributes != 'undefined' && productHasAttributes && !url_found)
			findCombinationLegal();
			
		$('.old-price .old-price-display').replaceWith($('#old_price_display'));
		
	}
	
	/* Show Imprint in mobile view */
	if ($(document).width() <= 767)
	{
		accordionFooter('disable'); 
	}
	
});

function findCombinationLegal() {
	
	//create a temporary 'choice' array containing the choices of the customer
	var choice = [];
	$('#attributes select, #attributes input[type=hidden], #attributes input[type=radio]:checked').each(function(){
		choice.push(parseInt($(this).val()));
	});

	if (typeof product_weight == 'undefined' || !product_weight)
		product_weight = 0;
	
	if (typeof combinations == 'undefined' || !combinations)
		combinations = [];
	//testing every combination to find the conbination's attributes' case of the user
	for (var combination = 0; combination < combinations.length; ++combination)
	{
		//verify if this combinaison is the same that the user's choice
		var combinationMatchForm = true;
		$.each(combinations[combination]['idsAttributes'], function(key, value)
		{
			if (!in_array(parseInt(value), choice))
				combinationMatchForm = false;
		});

		if (combinationMatchForm)
		{
			
			var weight_combination = combinationsFromController[combinations[combination]['idCombination']]['weight'];
			
			$('.weight-info .weight-value').text(parseFloat(product_weight) + parseFloat(weight_combination));
			
			//leave the function because combination has been found
			return;
		}
	}
	
}

function bindGridLegal()
{
	var view = $.totalStorage('displayLegal');
	if (view && view != 'grid')
		displayLegal('view');
	else
		displayLegal('grid');
		
	$(document).on('click', '#grid', function(e){
		e.preventDefault();
		displayLegal('grid');
	});
	$(document).on('click', '#list', function(e){
		e.preventDefault();
		displayLegal('list');
	});
} 

function displayLegal(view)
{
    /* List-View */
	if (view == 'list')
    {
        $('.product_list > li').each(function(index, element) {
			/* add delivery-info after center-block availability */
			var deliveryinfo = $(element).find('.delivery-info').html();
			if (deliveryinfo != null) { 
				$(element).find('.availability').after('<span class="delivery-info eu-legal">'+deliveryinfo+'</span>');
			}
			/* don't duplicate weight-info if already exists */
			if($(element).find('.right-block .weight-info').length <= 0) {
				/* append weight-info in right-block content-price */
				var weightinfo = $(element).find('.weight-info').html();
				if (weightinfo != null) { 
					$(element).find('.content_price').append('<span class="weight-info eu-legal">'+weightinfo+'</span>');
				}
			}
		});
                
        $.totalStorage('displayLegal', 'list');
    }
	/* Grid-View */
    else 
    {
        $('.product_list > li').each(function(index, element) {
			/* add weight-info after right-block availability and delivery-info */
			var weightinfo = $(element).find('.weight-info').html();
			if (weightinfo != null) { 
				$(element).find('.availability').after('<span class="weight-info eu-legal">'+weightinfo+'</span>');
			}
			/* add delivery-info after right-block availability */
			var deliveryinfo = $(element).find('.delivery-info').html();
			if (deliveryinfo != null) { 
				$(element).find('.availability').after('<span class="delivery-info eu-legal">'+deliveryinfo+'</span>');
			}
		});
                
        $.totalStorage('displayLegal', 'grid');
    }    
}