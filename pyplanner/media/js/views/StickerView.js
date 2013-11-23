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
        'click .ccolor': 'noAnchor',
        'click .header': 'resize',
        'click .lt-bar': 'resize',
        'click .left-bar': 'resize',
        'click .right-bar': 'resize',
        'click .bottom-bar': 'resize',
        'click .rb-bar': 'resize'
        /*'mouseover .header': 'enableSort',
        'mouseout .header': 'disableSort'*/
    },
    resize: function(e)
    {
        console.log(e);
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
    }

});