/**
 * Created by mihael on 11/4/13.
 */
var StickerView = Backbone.View.extend({

    className: 'stickli',
    tagName: 'div',
    template: '#stickerTemplate',
    container: '#sortable',
    color: 'ffffff',
    minWidth: 150,

    attributes : function () {
        return {
            class : this.className,
            id : 's' + this.model.get( 'sticker_id' ),
            style: 'background: #'+ this.model.color + ";width:"+this.model.get("width")+"px;height:"+this.model.get("height")+"px;",
            position: this.model.get('position')
        };
    },

    events: {
        'click .btn_trash': 'hideSticker',
        'click .btn_archive': 'hideSticker',
        'dblclick': 'showEditArea',
        'click .ccolor': 'noAnchor'
        /*'mouseover .header': 'enableSort',
        'mouseout .header': 'disableSort'*/
    },

    noAnchor: function(){
        return false;
    },
//    enableSort: function(e)
//    {
//        $("#sortable").sortable('enable');
//    },
//    disableSort: function(e)
//    {
//        $("#sortable").sortable('disable');
//    },
    showEditArea: function(e)
    {
        $(e.currentTarget).find(".sbody").hide();
        $(e.currentTarget).find(".sArea").show();
        var data = $(e.currentTarget).find(".sArea").val();
        $(e.currentTarget).find(".sArea").focus().val('').val(data);
    },
    initialize: function(options) {

    },
    stopResize: function(e, ui) {
        var id = parseInt(ui.element[0].id.substr(1));
        var w = ui.size.width;
        var h = ui.size.height;

        var stick = stickCollection.where({sticker_id: id})[0];

        stick.set({width: w});
        stick.set({height: h});

        stick.save();

        $("#sortable").isotope( 'reLayout' );
    },
    render: function() {

        this.template = $(this.template).html();
        this.context = {
            body: this.model.get("body"),
            sticker_id: this.model.get("sticker_id")
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
        }
        else
            $(this.container).append(this.el);

        $(this.el).resizable({
            autoHide: true,
            stop: this.stopResize,
            resize: this.resizeProcess,
            handles: "s"
        });

        return this;
    },
    resizeProcess: function(e, ui)
    {

//        ui.size.width = ui.originalSize.width;

//        var oW = parseInt(ui.originalSize.width);
//        var oH = parseInt(ui.originalSize.height);
//        var w = parseInt(ui.size.width);
//        var h = parseInt(ui.size.height);
//
//        var wN = oW / this.minWidth;
//        var hN = oH / this.minHeight;
//
//        if(oW < w)
//            wN++;
//        else if(oW > w && wN > 1)
//            wN--;
//
//
//        if(oH < h)
//            hN++;
//        else if(oH > h && hN > 1)
//            hN--;
//
//        var width = wN * this.minWidth;
//        var height = hN * this.minHeight;
//
//        ui.element.css("width", width + 'px');
//        ui.element.css("height", height + 'px');
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
    }

});