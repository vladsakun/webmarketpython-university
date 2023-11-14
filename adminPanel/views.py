from django.shortcuts import render
from news.models import Products, Comments
from django.contrib.auth import authenticate, login as auth_login
from news.forms import PostForm
from django.contrib import messages
from django.http import HttpResponse, HttpResponseRedirect
from django.core.paginator import Paginator


def index(request):
    """
    Функція, що відображає головну сторінку адміністративної панелі.
    """
    q = Products.objects.values_list('type', flat=True).distinct()
    form = PostForm(request.POST or None, request.FILES or None)
    if form.is_valid():
        instance = form.save(commit=False)
        instance.save()
        messages.success(request, "Успішно створено!")
        return HttpResponseRedirect(instance.get_absolute_url())
    context = {
        "form": form,
        'categories': q,
        'range': range(0, q.count())
    }
    return render(request, 'adminPanel/adminMainPage.html', {'categories': q, 'range': range(0, q.count())})


def editProducts(request, productType):
    """
    Функція, що відображає сторінку редагування продуктів з певним типом.

    :param request: запит користувача
    :param productType: тип продукту
    """
    if not Products.objects.filter(title__contains='super').exists():
        search = "None"
    
    print(search)
    objects_list = Products.objects.filter(type=productType)
    paginator = Paginator(objects_list, 3)
    page = request.GET.get('page')
    objects_list = paginator.get_page(page)
    return render(request, "adminPanel/editProducts.html", {"object_list": objects_list, 'search': search})


def search(request, name):
    """
    Функція, що відображає сторінку знайдених продуктів за назвою.

    :param request: запит користувача
    :param name: назва продукту
    """
    if Products.objects.filter(title__icontains=name).exists():
        search = Products.objects.filter(title__icontains=name)
        return render(request, "adminPanel/editProducts.html", {"object_list": search})
    else:
        search = "None"
    return render(request, "adminPanel/editProducts.html", {"error": search})


def showEditProduct(request, productId):
    """
    Функція, що відображає сторінку редагування конкретного продукту.

    :param request: запит користувача
    :param productId: ідентифікатор продукту
    """
    product_info = Products.objects.get(id=productId)
    return render(request, "adminPanel/productEdit.html", {"object_list": product_info})


def commentsAdmin(request):
    """
    Функція, що відображає сторінку з коментарями, що очікують на підтвердження.
    """
    comments_list = Comments.objects.filter(status="no")
    return render(request, "adminPanel/commentsAdmin.html", {"comments_list": comments_list})


def commentSubmitAdmin(request, commentId):
    """
    Функція, що змінює статус коментаря на "підтверджено".

    :param request: запит користувача
    :param commentId: ідентифікатор коментаря
    """
    comment = Comments.objects.get(id=commentId)
    comment.status = "yes"
    comment.save()
    return request


def commentDeleteAdmin(request, commentId):
    """
    Функція, що видаляє коментар.

    :param request: запит користувача
    :param commentId: ідентифікатор коментаря
    """
    comment = Comments.objects.get(id=commentId).delete()
    return request


def editProduct(request, productId, title, price, status, post, gender):
    """
    Функція, що змінює інформацію про продукт.

    :param request: запит користувача
    :param productId: ідентифікатор продукту
    :param title: назва продукту
    :param price: ціна продукту
    :param status: статус продукту
    :param post: опис продукту
    :param gender: стать продукту
    """
    product_info = Products.objects.get(id=productId)
    post = post.replace('_', ' ')
    status = status.replace('_', ' ')
    title = title.replace('_', ' ')
    price = price.replace('_', ' ')
    gender = gender.replace('_', ' ')
    product_info.gender = gender
    product_info.price = price
    product_info.post = post
    product_info.status = status
    product_info.title = title
    product_info.save()
    return request
