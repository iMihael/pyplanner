var ColorModel = Backbone.Model.extend({
    urlRoot: '/a/dashboard/color/',
    defaults: {
        color_id: 0,
        hex_value: 'ffffff',
        name: 'white',
        font_color: '000000'
    },
    initialize: function(){
        //console.log('Color model init.' + this.get('hex_value'));
        var view = new ColorView({
            model: this
        });
        view.render();

        var hView = new ColorView({
            className: 'add-st-btn horizontal',
            model: this
        });
        hView.container = '.tipColors';

        hView.render();
    }
});

var ColorCollection = Backbone.Collection.extend({
    url: '/a/dashboard/colors/',
    model: ColorModel,

    initialize: function()
    {
        //console.log('Color collection init');
    }
});