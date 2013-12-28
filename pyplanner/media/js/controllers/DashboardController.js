var cCollection;
var stickCollection;

function sortStop(event, ui)
{
    var offset = parseInt(ui.item.attr("index")) - parseInt(ui.item.index());
    if(offset != 0)
    {
        var sticker_id = parseInt(ui.item.attr("id").substr(1));

        var sticker = stickCollection.where({sticker_id: sticker_id})[0];
        var sPosition = parseInt(sticker.get('position'));

        sPosition += offset;
        sticker.set({position: sPosition});
    }
}

function sortStart(event, ui)
{
    ui.item.attr("index", ui.item.index());
}

function hideAreas(e)
{
    if((typeof(e) == 'boolean' && e) || e.target.className != 'sArea')
    {
        var area = $("#sortable .sArea:visible");
        var sBody = $("#sortable .sbody:hidden");

        if(area.length > 0 && sBody.length > 0)
        {
            if(sBody.html().trim() != area.val())
            {

                var newText = area.val().trim();
                var stick = parseInt(area.attr("stick"));
                var sticker = stickCollection.where({sticker_id: stick})[0];
                sticker.set({body: newText});
                sticker.save();

                sBody.html(sticker.view.nl2br(sticker.view.encode(newText)));
            }
            area.hide();
            sBody.show();
        }
    }


}
function nZindex(obj){
       var highestIndex = 0;
       var currentIndex = 0;
       var elArray = Array();
       if(obj){ elArray = obj.getElementsByTagName('*'); }else{ elArray = document.getElementsByTagName('*'); }
       for(var i=0; i < elArray.length; i++){
          if (elArray[i].currentStyle){
             currentIndex = parseFloat(elArray[i].currentStyle['zIndex']);
          }else if(window.getComputedStyle){
             currentIndex = parseFloat(document.defaultView.getComputedStyle(elArray[i],null).getPropertyValue('z-index'));
          }
          if(!isNaN(currentIndex) && currentIndex > highestIndex){ highestIndex = currentIndex; }
       }
       return(highestIndex+1);
    }

$(function(){
    cCollection = new ColorCollection();

    cCollection.fetch({
        success: function(collection, response, options){

            stickCollection = new StickerCollection();

            stickCollection.fetch({
                success: function(collection, response, options) {

                    $('#sortable').isotope({
                        itemSelector: '.stickli',
                        getSortData: {
                            position: function($elem)
                            {
                                return parseInt($elem.attr("position"), 10);
                            }
                        },
                        sortBy: 'position',
                        sortAscending : false,
                        animationEngine: 'jquery'
                    });


                }
            });
        }
    });

    $("body").click(hideAreas);
});