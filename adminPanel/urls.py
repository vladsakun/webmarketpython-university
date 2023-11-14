from django.urls import path, re_path

from . import views

urlpatterns = [
    path('', views.index),
    re_path(r'^products/edit/(?P<productType>\w+)$', views.editProducts),
    re_path(r'^product/show/(?P<productId>\w+)$', views.showEditProduct),
    re_path(r'^product/search/(?P<name>\w+)$', views.search),
    path('comments', views.commentsAdmin),
    re_path(r'^comment/delete/(?P<commentId>\w+)$', views.commentDeleteAdmin),
    re_path(r'^comment/submit/(?P<commentId>\w+)$', views.commentSubmitAdmin),
    re_path(r'^product/edit/(?P<productId>\w+)/(?P<title>\w+)/(?P<price>\w+)/(?P<status>\w+)/(?P<post>\w+)/(?P<gender>\w+)$', views.editProduct),
]
"""
Файл містить шляхи до відповідних функцій для кожного URL-адреси, що використовується в адмін-панелі.
"""
