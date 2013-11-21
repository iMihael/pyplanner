var ColorView = Backbone.View.extend({

    className: 'add-st-btn',
    container: '.colors',
    template: '#colorTemplate',


    events: {
        'click a': 'createSticker'
    },

    render: function() {
        this.context = {'name': this.model.get('name'), 'hex_value': this.model.get('hex_value')};
        this.template = $(this.template).html();

        var compiled = _.template(this.template, this.context);
        $(this.el).html(compiled);
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