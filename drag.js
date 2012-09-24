$(document).ready(function(){
	$.fn.DragArticles = function() {
		// set up draggable elements
		$(".listing > tbody > tr.dropTarget").draggable({
			appendTo:"body",
			cursor:"pointer",
			cursorAt:{top:20,left:100},
			helper:function(){
				//this is the drag box that you see when you drag
				return $('<div class="dragBox"><p>Drag to change the<br/> ordering of this article</p></div>');
			}
		});
		
		//set up the droppable list elements
		$(".listing > tbody > tr.dropTarget").droppable({
			accept: ".listing > tr.dropTarget",
			hoverClass: 'droppable-hover',
			tolerance: 'pointer',
			drop: function(ev, ui) {
				var dropEl = this;
				var dragEl = $(ui.draggable);
		
				// get article id
				var articleId = dragEl.find("input:hidden").get(0).value;
				
				// get order
				// if they are different, we need to find out if it is above or below
				var dropOrder = 0;
				// lastObj will contain the element of where we need to insertBefore...
				var lastObj;
				var rowCount = 0;
				var isBefore;
				dropOrder = $(dropEl).find("input:hidden").get(1).value;
				
				// set the row count that we will be dropping it in
				rowCount = $(dropEl).find("input:hidden").get(1).value;
				
				// set lastObj
				lastObj = $(dropEl);
				
				if (dragEl.find("input:hidden").get(1).value > rowCount)
					isBefore = true;
				else
					isBefore = false;
		
				// insert before lastObj
				if (isBefore)
					dragEl.insertBefore(lastObj);
				else
					dragEl.insertAfter(lastObj);

				// loop through all draggables and update their counts
				$(".listing > tbody > tr.dropTarget").each(
					function(intIndex) {
						if (intIndex % 2 == 0) {
							$(this).removeClass("alt");
						} else {
							$(this).addClass("alt");
					}
					if (dragEl.find("input:hidden").get(0).value != $(this).find("input:hidden").get(0).value) {
						// adjust the rowcount
						if (isBefore) {
							// move everything up by 1
							if ($(this).find("input:hidden").get(1).value >= dropOrder)
								$(this).find("input:hidden").get(1).value++;
						} else {
							// move everything down by 1
							if ($(this).find("input:hidden").get(1).value <= dropOrder)
								$(this).find("input:hidden").get(1).value--;
						}
					} else {
						$(this).find("input:hidden").get(1).value = dropOrder;
					}
				});
		
				// set the url of our php page that will accept an articleid and position to update it
				var url = "pageThatDoesArticleUpdate.php?articleid=" + articleId + "&position=" + dropOrder;
				$.get(url);
			}
		});
	}
	
	$(function(){ $("#content").DragArticles();});
});