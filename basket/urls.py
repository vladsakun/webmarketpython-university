from django.conf.urls import include
from django.views.generic import ListView, DetailView

from basket import views

from django.urls import path, re_path

urlpatterns = [
    path('', views.basket, name='basket'),
    re_path(r'^sendOrder/(?P<count>\w+)/(?P<orderId>\w+)/(?P<size>\w+)/(?P<productId>\w+)$', views.sendOrder, name='send-order'),
]

