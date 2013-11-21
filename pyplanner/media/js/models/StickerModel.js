var StickerModel = Backbone.Model.extend({
    urlRoot: '/a/dashboard/sticker/',
    view: false,
    newSticker: false,

    defaults: {
        sticker_id: 0,
        body: '',
        color_id: 0,
        width: 200,
        height: 200,
        position: 0
    },
    color: 'ffffff',

    updateView: function(model)
    {
        if(model.view == false)
        {
            model.newSticker = true;
            model.view = new StickerView({
                model: model
            });

            model.view.render();
        }
    },
    initialize: function(attributes, options){

        this.on("change:position", function (model){
            model.save();
        });

        this.on("change:sticker_id", this.updateView);

        var color = cCollection.where({color_id: this.get('color_id')})[0];
        this.color = color.get('hex_value');

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