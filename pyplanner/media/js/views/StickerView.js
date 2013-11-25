/**
 * Created by mihael on 11/4/13.
 */
var StickerView = Backbone.View.extend({

    className: 'stickli',
    tagName: 'div',
    template: '#stickerTemplate',
    container: '#sortable',
    color: 'ffffff',
    font: '000000',
    minSize: 150,

    attributes : function () {
        return {
            class : this.className,
            id : 's' + this.model.get( 'sticker_id' ),
            style: 'background: #'+ this.model.color + ";color: #"+this.model.font+";width:"+this.model.get("width")+"px;height:"+this.model.get("height")+"px;",
            position: this.model.get('position')
        };
    },

    events: {
        'click .btn_trash': 'hideSticker',
        'click .btn_archive': 'hideSticker',
        'dblclick': 'showEditArea',
        'click .ccolor': 'noAnchor',
        'click .header': 'topResize',
        'click .lt-bar': 'leftTopResize',
        'click .left-bar': 'leftResize',
        'click .right-bar': 'rightResize',
        'click .bottom-bar': 'bottomResize',
        'click .rb-bar': 'rightBottomResize'
        /*'mouseover .header': 'enableSort',
        'mouseout .header': 'disableSort'*/
    },
    rightResize: function(e)
    {
        var margin = parseInt($(this.el).css("margin-right"));
        var currentWidth = this.model.get('width');
        var newWidth = currentWidth + this.minSize + margin;
        //var zIndex = $(this.el).css("z-index");
        var el = this.el;
        //$(el).css("z-index", this.nextZindex());
        this.model.set({width: newWidth});
        this.model.save();

        $(el).animate({
            width: newWidth + "px"
        }, 250, function(){
            $("#sortable").isotope( 'reLayout', function(){
                //$(el).attr("z-index", zIndex);
            } );
        });
    },
    leftResize: function(e)
    {
        var currentWidth = this.model.get('width');
        if(currentWidth > this.minSize)
        {
            var margin = parseInt($(this.el).css("margin-right"));
            var currentWidth = this.model.get('width');
            var newWidth = currentWidth - this.minSize - margin;
            //var zIndex = $(this.el).css("z-index");
            var el = this.el;
            //$(el).css("z-index", this.nextZindex());
            this.model.set({width: newWidth});
            this.model.save();

            $(el).animate({
                width: newWidth + "px"
            }, 250, function(){
                $("#sortable").isotope('reLayout', function(){
                    //$(el).css("z-index", zIndex);
                });
            });
        }
    },
    topResize: function(e)
    {
        if(e.currentTarget.className == e.target.className && (e.target.className == "header" || e.target.className == "lt-bar"))
        {
            var currentHeight = this.model.get('height');
            if(currentHeight > this.minSize)
            {
                var margin = parseInt($(this.el).css("margin-bottom"));
                var currentHeight = this.model.get('height');
                var newHeight = currentHeight - this.minSize - margin;
                //var zIndex = $(this.el).css("z-index");
                var el = this.el;
                //$(this.el).css("z-index", this.nextZindex());
                this.model.set({height: newHeight});
                this.model.save();

                $(el).animate({
                    height: newHeight + "px"
                }, 250, function(){
                    $("#sortable").isotope('reLayout', function(){
                        //$(el).css("z-index", zIndex);
                    });
                });
            }
        }
    },
    bottomResize: function(e)
    {
        var margin = parseInt($(this.el).css("margin-bottom"));
        var currentHeight = this.model.get('height');
        var newHeight = currentHeight + this.minSize + margin;
        //var zIndex = $(this.el).css("z-index");
        var el = this.el;
        //$(this.el).css("z-index", this.nextZindex());
        this.model.set({height: newHeight});
        this.model.save();

        $(el).animate({
            height: newHeight + "px"
        }, 250, function(){
            $("#sortable").isotope('reLayout', function(){
                //$(el).css("z-index", zIndex);
            });
        });
    },
    leftTopResize: function(e)
    {
        var currentWidth = this.model.get('width');
        var currentHeight = this.model.get('height');

        if(currentWidth > this.minSize && currentHeight <= this.minSize)
            this.leftResize(e);
        else if(currentWidth <= this.minSize && currentHeight > this.minSize)
            this.topResize(e);
        else
        {
            this.leftResize(e);
            this.topResize(e);
        }
    },
    rightBottomResize: function(e)
    {
        this.rightResize(e);
        this.bottomResize(e);
    },
    noAnchor: function(){
        return false;
    },
    showEditArea: function(e)
    {
        $(e.currentTarget).find(".sbody").hide();
        $(e.currentTarget).find(".sArea").show();
        var data = $(e.currentTarget).find(".sArea").val();
        $(e.currentTarget).find(".sArea").focus().val('').val(data);
    },
    initialize: function(options) {
        this.font = this.model.font;
    },
    render: function() {

        this.template = $(this.template).html();
        this.context = {
            body: this.model.get("body"),
            sticker_id: this.model.get("sticker_id"),
            font_color: this.font
        };

        var compiled = _.template(this.template, this.context);
        $(this.el).html(compiled);

        if(this.model.newSticker)
        {
            hideAreas(true);

            $(this.container).prepend(this.el);
            window.scrollTo(0, 0);

            $(this.el).find(".sbody").hide();
            $(this.el).find(".sArea").show();
            $(this.el).find(".sArea").focus();

            $("#sortable").isotope( 'reloadItems' );
            $('#sortable').isotope({ sortBy : 'position' });
        }
        else
        {
            $(this.container).append(this.el);
        }

        var el = this.el;


        $(el).droppable({
            over: function(){
                $(el).css("opacity", "0.5");
            },
            out: function(){
                $(el).css("opacity", "1");
            },
            drop: function(e, ui){
                $(el).css("opacity", "1");

                var curPosition = parseInt($(el).attr("position"));
                var oldPosition = parseInt($(ui.draggable).attr("position"));

                $(ui.draggable).attr("position", curPosition);

                var sticks = $(".stickli");
                if(curPosition > oldPosition)
                {
                    for(var i=0;i<sticks.length;i++)
                    {
                        if( parseInt($(sticks[i]).attr("position")) < curPosition && parseInt($(sticks[i]).attr("position")) > oldPosition )
                        {
                            var nPos = parseInt($(sticks[i]).attr("position"));
                            nPos--;
                            $(sticks[i]).attr("position", nPos);
                        }
                    }
                    $(el).attr("position", curPosition-1);
                }
                else if(curPosition < oldPosition)
                {
                    for(var i=0;i<sticks.length;i++)
                    {
                        if( parseInt($(sticks[i]).attr("position")) > curPosition && parseInt($(sticks[i]).attr("position")) < oldPosition )
                        {
                            var nPos = parseInt($(sticks[i]).attr("position"));
                            nPos++;
                            $(sticks[i]).attr("position", nPos);
                        }
                    }
                    $(el).attr("position", curPosition+1);
                }


                var sticker_id = parseInt(ui.draggable.attr("id").substr(1));

                var sticker = stickCollection.where({sticker_id: sticker_id})[0];
                sticker.set({position: curPosition});
                sticker.save();


                //$(ui.draggable).css("top", 0);
                //$(ui.draggable).css("left", 0);
                //$(ui.draggable).css("z-index", $(el).attr("z-index"));

                $("#sortable").isotope( 'reloadItems' );
                $('#sortable').isotope({ sortBy : 'position' });
            }
        });
        $(this.el).draggable({
            start: function(e, ui){
                //$(el).css("z-index", view.nextZindex());
                $(el).css("-webkit-transform", "none");
            },
            stop: function(){
                $("#sortable").isotope( 'reloadItems' );
                $("#sortable").isotope('reLayout');
            }
        });

        return this;
    },
    hideSticker: function(e){

        var stick = this.el;
        var stickView = this;

        $(stick).find(".header").hide("fade");
        $(stick).css("margin","0");
        $(stick).css("padding","0");
        $(".ui-resizable-handle").hide();

        $(this.el).animate({width: "0px"}, 500, 'swing', function(){
            var dataTarget = $(e.currentTarget).attr("data-target");

            if(dataTarget == 'archive')
            {
                stickView.model.urlRoot = '/a/dashboard/sticker-archive/';
            }

            stickView.model.id = stickView.model.get('sticker_id');
            stickView.model.destroy();

            $(stick).remove();
        });

        return false;
    },
    nextZindex: function (obj){
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

});