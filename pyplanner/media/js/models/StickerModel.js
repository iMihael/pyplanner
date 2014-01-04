var StickerModel = Backbone.Model.extend({
    urlRoot: '/a/dashboard/sticker/',
    view: false,
    newSticker: false,

    defaults: {
        sticker_id: 0,
        body: '',
        color_id: 0,
        width: 150,
        height: 150,
        position: 0
    },
    color: 'ffffff',
    font: '000000',


    updateView: function(model)
    {
        if(model.view == false)
        {
            model.newSticker = true;
            model.view = new StickerView({
                model: model
            });

            model.view.render();
            $("#sortable").isotope('reLayout');
        }
    },
    updateColor: function(model)
    {
        var color = cCollection.where({color_id: model.get('color_id')});
        if(color.length > 0)
        {
            model.save();
        }
    },
    initialize: function(attributes, options){

        this.on("change:position", function (model){
            model.save();
        });

        this.on("change:sticker_id", this.updateView);
        this.on("change:color_id", this.updateColor);

        var color = cCollection.where({color_id: this.get('color_id')})[0];
        this.color = color.get('hex_value');
        this.font = color.get('font_color');

        if(this.get("sticker_id") != 0)
        {
            this.view = new StickerView({
                model: this
            });

            this.view.render();
        }
    }
});

var StickerCollection = Backbone.Collection.extend({

    url: '/a/dashboard/stickers/',
    model: StickerModel,

    initialize: function(models, options)
    {

    },
    maxPosition: function()
    {
        if(this.length > 0)
        {
            var max = parseInt(this.at(0).get('position'));

            for(var i=1;i<this.length;i++)
            {
                if( parseInt(this.at(i).get('position')) > max)
                    max = parseInt(this.at(i).get('position'));
            }

            return max;
        }
        else
            return -1;
    }
});