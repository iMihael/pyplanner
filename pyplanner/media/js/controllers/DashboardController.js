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
                sBody.html(newText);

                var stick = parseInt(area.attr("stick"));
                var sticker = stickCollection.where({sticker_id: stick})[0];
                sticker.set({body: newText});
                sticker.save();
            }
            area.hide();
            sBody.show();
        }
    }
}

$(function(){
    cCollection = new ColorCollection();

    cCollection.fetch({
        success: function(collection, response, options){

            stickCollection = new StickerCollection();

            stickCollection.fetch({
                success: function(collection, response, options) {

                    $("#sortable").sortable({
                        stop: sortStop,
                        start: sortStart/*,
                        disabled: true*/
                    });

                    $("#sortable").disableSelection();

                    $('.st_button').qtip({
                        position: {
                            my: 'bottom center',
                            at: 'top center'
                        },
                        style: {
                            classes: 'qtip-light'
                        },
                        show: {
                            solo: true
                        }
                    });

                    $('.ccolor').qtip({
                        position: {
                            my: 'center center',
                            at: 'top center'
                        },
                        show: {
                            event: 'click',
                            solo: true
                        },
                        hide: 'unfocus',
                        content: {
                            text: function(event, api){
                                return $(".tipColors").html();
                            },
                            title: "Choose sticker color",
                            button: true
                        },
                        style: {
                            classes: 'qtip-light'
                        }
                    });
                }
            });
        }
    });

    $("body").click(hideAreas);
});