from django.db import models
from datetime import datetime
from django.urls import reverse



class Comments(models.Model):
    user_name = models.CharField(max_length=120)
    comment = models.TextField()
    limitations = models.TextField()
    category = models.TextField()
    status = models.TextField()
    merits = models.TextField()
    date = models.DateTimeField(default=datetime.now)
    product_id = models.IntegerField()


class Products(models.Model):
    title = models.CharField(max_length=120)
    post = models.TextField(null=True)
    status = models.CharField(max_length=120, default="yes")
    type = models.CharField(max_length=120)
    date = models.DateTimeField(null=True)
    price = models.IntegerField(null=True)
    image = models.FileField(null=True,blank=True)
    image2 = models.FileField(null=True,blank=True)
    image3 = models.FileField(null=True,blank=True)
    gender = models.CharField(max_length=10, default="male")

    def __str__(self):
        return self.title


    def get_absolute_url(self):
        return reverse('news:detail', kwargs={'pk':self.id})

