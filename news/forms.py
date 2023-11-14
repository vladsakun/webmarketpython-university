from django import forms

from .models import Products

class PostForm(forms.ModelForm):
	class Meta:
		model = Products
		fields = [
			"title",
			"image",
			"image2",
			"image3",
			"status",
			"type",
			"post",
			"price",
		]
			
		