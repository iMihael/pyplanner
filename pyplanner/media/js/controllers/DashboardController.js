var cCollection;
var stickCollection;
var page = 0;
var scrollDetect = true;
var mouseY;
var pageY;
var mouseX;
var pageX;

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

                sBody.html(sticker.view.replaceUrls(sticker.view.nl2br(sticker.view.encode(newText))));
            }
            area.hide();
            sBody.show();
            initTooltips();
        }
    }

    $(".btn_ccolor").popover('hide');
}



function initTooltips()
{
    $.each($('.u-tip'), function(key, value){

        if(typeof($(value).attr("init")) == 'undefined')
        {
            $(value).attr("init", "init");
            var href = $(value).attr('href');
            var body = '<img class="u-loader" src="/media/images/loader.gif" />';
            $(value).tooltip({
                html: true,
                placement: 'auto bottom',
                title: body,
                container: 'body',
                delay: { show: 500, hide: 100 }
            });

            var id = MD5(href);

            body = '<img src="/a/dashboard/snap/'+ encodeURIComponent(href) +'/?id='+id+'" />';
            $.get("/a/dashboard/snap/" + encodeURIComponent(href) + "/?id=" + id, function(data){
                if(data == "0")
                {
                    $(value).tooltip('destroy');
                    return;
                }
                var show = $('.u-loader').length;

                $(value).tooltip('destroy');
                $(value).tooltip({
                    html: true,
                    placement: 'auto bottom',
                    title: body,
                    container: 'body',
                    delay: { show: 500, hide: 100 }
                });
                $(value).on('shown.bs.tooltip', function () {
                    if( parseInt( $(window).height()) - 300 < mouseY )
                    {
                        $(".tooltip").css("top", (pageY - 330) + "px");
                    }
                    if(parseInt($(window).width()) - 350 < mouseX )
                    {
                        $(".tooltip").css("left", (pageX - 350) + "px");
                    }
                });

                if(show)
                {
                    $(value).tooltip('show')
                }
            });
        }
    });
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

                    initTooltips();

                }
            });
        }
    });

    $("body").click(hideAreas);

    $(window).scroll(function() {

        if(parseInt($(window).scrollTop() + $(window).height()) == parseInt($(document).height()) && scrollDetect)  //user scrolled to bottom of the page?
        {
            scrollDetect = false;
            page++;
            stickCollection.fetch({
                add: true,
                remove: false,
                merge: false,
                success: function(collection){
                    if(collection.length == 0)
                    {
                        scrollDetect = false;
                        return;
                    }

                    $("#sortable").isotope( 'reloadItems' );
                    $('#sortable').isotope({ sortBy : 'position' });
                    $("body").css("height", $(document).height());
                    scrollDetect = true;
                    initTooltips();
                }
            });
        }
    });

    $( document ).on( "mousemove", function( event ) {
        mouseY =  parseInt(event.clientY);
        pageY = parseInt(event.pageY);
        pageX = parseInt(event.pageX);
        mouseX = parseInt(event.clientX)
    });

    $("#upload-input").change(function(){
        $("#upload-form").submit();
    });

    $("#upload-iframe").load(function(){
        var url = $("#upload-iframe").contents().find("body").html().trim();
        $("#s" + $("#upload-iframe").attr("sid")).css("background-image", "url("+url+")");
        $("#s" + $("#upload-iframe").attr("sid")).css("background-size", "cover");
    });
});