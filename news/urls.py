from django.urls import path, re_path
from django.views.generic import ListView, DetailView
from news.models import Products
from news import views

app_name = 'news'

"""
Конфігурація URL для додатку "news".

`urlpatterns` містить список шляхів до відображень. Для отримання додаткової інформації дивіться:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/

Приклади:
Функційні відображення
    1. Додайте імпорт: from my_app import views
    2. Додайте URL до urlpatterns: url(r'^$', views.home, name='home')

Відображення на основі класів
    1. Додайте імпорт: from other_app.views import Home
    2. Додайте URL до urlpatterns: url(r'^$', Home.as_view(), name='home')

Включення іншого URLconf
    1. Додайте імпорт: from blog import urls as blog_urls
    2. Додайте URL до urlpatterns: url(r'^blog/', include(blog_urls))
"""
urlpatterns = [
    path('', views.index, name='index'),
    path('TShirts', views.productFilter, name='tshirt-filter'),
    path('Shoes', views.productFilter, name='shoes-filter'),
    path('Bags', views.productFilter, name='bags-filter'),
    path('Sweatshirts', views.productFilter, name='sweatshirts-filter'),
    path('Hats', views.productFilter, name='hats-filter'),
    re_path(r'^comments/(?P<productId>\w+)$', views.showComments, name='show-comments'),
    re_path(r'^deleteCookie/(?P<cookie>\w+)$', views.deleteCookie, name='delete-cookie'),
    re_path(r'^addComment/(?P<productId>\w+)/(?P<userName>\w+)/(?P<merits>\w+|)/(?P<limitations>\w+|)/(?P<commentText>[\w\-]+)$', views.addComment, name='add-comment'),
    path('<int:pk>', views.DetailView.as_view(), name='detail'),
    path('products/create', views.productCreate, name='products-create'),
]
