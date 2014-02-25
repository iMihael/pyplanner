var ColorView = Backbone.View.extend({

    className: 'top-color',
    container: '.top-colors',
    template: '#colorTemplate',


    events: {
        'click': 'createSticker'
    },

    render: function() {
//        this.context = {'name': this.model.get('name'), 'hex_value': this.model.get('hex_value'), 'color_id': this.model.get('color_id')};
//        this.template = $(this.template).html();
//
//        var compiled = _.template(this.template, this.context);
        $(this.el).html($(this.template).html());
        $(this.el).attr("cid", this.model.get('color_id'));
        $(this.el).attr("style", "background:#" + this.model.get('hex_value'));
        $(this.container).append(this.el);

        return this;
    },

    createSticker: function() {

        var newStick = new StickerModel({
            color_id: this.model.get('color_id'),
            position: stickCollection.maxPosition() + 1
        });

        stickCollection.unshift(newStick);

        newStick.save();

        return false;
    }
});