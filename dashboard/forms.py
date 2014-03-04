from django import forms
from django.forms import ModelForm
from dashboard.models import Color, Sticker


class ColorForm(ModelForm):
    ## hex_value = forms.CharField(min_length=6, max_length=6, required=True)
    ## name = forms.CharField(required=True)
    class Meta:
        model = Color
        fields = ['hex_value', 'name']


class StickerForm(ModelForm):
    color_id = forms.IntegerField()

    def clean_color_id(self):
        col_id = self.cleaned_data['color_id']
        try:
            col = Color.objects.get(pk=col_id)
        except Color.DoesNotExist:
            raise forms.ValidationError("Color not exists")
        else:
            self.instance.color = col

    class Meta:
        model = Sticker
        fields = ['sticker_id', 'body', 'width', 'height', 'position']


class UploadImageForm(forms.Form):
    sticker = forms.IntegerField(required=True)
    image = forms.ImageField(required=True)