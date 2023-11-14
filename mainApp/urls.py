from django.urls import path, re_path

from mainApp import cookies
from . import views

urlpatterns = [
    path(r'^$', views.index, name='index'),
    path(r'^contact/$', views.contact, name='contact'),
    path(r'^delivery/$', cookies.cookies_demo, name='delivery'),
    
]
