"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.contrib import admin
from django.urls import path, include

from news import views
from mainApp import urls as mainApp_urls
from basket import urls as basket_urls
from news import urls as news_urls
from django.contrib.auth import urls as auth_urls
from user_example import urls as user_example_urls
from adminPanel import urls as adminPanel_urls
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('adminpanel/', admin.site.urls),
    path('mainApp/', include(mainApp_urls)),
    path('basket/', include(basket_urls)),
    path('', include(news_urls, namespace="news")),
    path('accounts/', include(auth_urls)),
    path('user/', include(user_example_urls)),
    path('admin/', include(adminPanel_urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)