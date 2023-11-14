import telebot
import re
import json
import requests
import telebot
from .models import Products
from .models import Comments
from http import cookies
from django.contrib import messages
from django.shortcuts import redirect, render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.core.paginator import Paginator
from django.views.generic import DetailView
from .forms import PostForm

"""
Функція для створення нового продукту.

При GET-запиті повертає форму для створення продукту.
При POST-запиті перевіряє форму на валідність та зберігає новий продукт у базу даних.
Після успішного збереження перенаправляє користувача на сторінку з детальною інформацією про продукт.

Parameters:
request (HttpRequest): Об'єкт запиту.

Returns:
HttpResponse: Відповідь на запит.
"""
def productCreate(request):
    q = Products.objects.values_list('type', flat=True).distinct()
    form = PostForm(request.POST or None, request.FILES or None)
    if form.is_valid():
        instance = form.save(commit=False)
        instance.save()
        messages.success(request, "Успішно створено!")
        return HttpResponseRedirect(instance.get_absolute_url())
    context = {
        "form":form,
        'categories': q, 
        'range': range(0,q.count())
    }
    return render(request, "news/post_form.html", context)


# Функція для видалення кукі з запиту
def deleteCookie(request, cookie):
    """
    Видаляє кукі з запиту та оновлює інші кукі.

    Аргументи:
    - request: запит, який містить кукі
    - cookie: індекс кукі, яке потрібно видалити

    Повертає:
    - response: відповідь з оновленими кукі
    """
    one_week_age = 24 * 60 * 60
    response = HttpResponse()
    amountOfOrders = request.COOKIES.get('amountOfOrders')
    last_cookie = request.COOKIES.get('order' + amountOfOrders)
    response.set_cookie('order' + str(cookie), last_cookie)
    response.delete_cookie('order' + str(amountOfOrders))
    amountOfOrders = int(amountOfOrders) - 1
    response.set_cookie('amountOfOrders', amountOfOrders, max_age=one_week_age)
    return response


def addComment(request, productId, userName, commentText, merits="pass", limitations="pass"):
    """
    Додає коментар до продукту з вказаним ідентифікатором.

    :param request: запит
    :param productId: ідентифікатор продукту
    :param userName: ім'я користувача
    :param commentText: текст коментаря
    :param merits: переваги продукту (за замовчуванням "pass")
    :param limitations: недоліки продукту (за замовчуванням "pass")
    :return: відповідь сервера
    """
    current_status = "no"
    current_category = Products.objects.values_list('type', flat=True).get(pk=productId)
    commentText = commentText.replace('_', ' ')
    userName = userName.replace('_', ' ')
    merits = merits.replace('_', ' ')
    limitations = limitations.replace('_', ' ')
    c = Comments(user_name=userName,
                 category=current_category,
                 merits=merits,
                 limitations=limitations,
                 comment=commentText,
                 product_id=productId,
                 status=current_status)
    c.save()
    response = HttpResponse()
    return response


def showComments(request, productId):
    """
    Функція, яка відображає коментарі для певного продукту.

    :param request: запит користувача
    :param productId: ідентифікатор продукту
    :return: відображення сторінки з коментарями
    """
    current_product_id = productId
    comments_list = Comments.objects.filter(product_id=current_product_id).order_by('-date')
    comment_paginator = Paginator(comments_list, 5)
    comment_page = request.GET.get('page')
    comments_list = comment_paginator.get_page(comment_page)
    return render(request, 'news/comments.html', {"comments_list": comments_list})


#Вывод отдельного продукта по id
class DetailView(DetailView):
    model = Products
    template_name = "news/post.html"

    def post(self, request, pk):
        null = None
        max_age = 365 * 24 * 60 * 60
        one_week_age = 7* 24 * 60 * 60
        current_id = pk
        deletedCookies = []
        template = "basket/basket.html"
        # Оброботчик нажатия на кнопку "Добавить в корзину"
        if request.POST.get('add-to-basket') == 'add-to-basket':
            current_size = request.POST.get('size')
            # Если размер не указан
            if current_size == null:
                return HttpResponseRedirect("/" + current_id)
                # Иначе добавить в корзину
            else:
                response = HttpResponseRedirect("/basket/")
                amountOfOrders = request.COOKIES.get('amountOfOrders')
                # Если нет заказов, то количество заказов = 1 и доб. кол. заказов в cookies
                if amountOfOrders == None:
                    amountOfOrders = int(1)
                    response.set_cookie('amountOfOrders', amountOfOrders, max_age=one_week_age)
                    # Иначе добавить 1 к текущему кол. заказов и доб. кол. заказов в cookies
                else:
                    amountOfOrders = request.COOKIES.get('amountOfOrders')
                    amountOfOrders = int(amountOfOrders) + 1
                    response.set_cookie('amountOfOrders', amountOfOrders, max_age=one_week_age)

                for i in range(1, int(amountOfOrders) + 1):
                    if request.COOKIES.get('deletedCookie' + str(i)):
                        deletedCookies.append(request.COOKIES.get('deletedCookie' + str(i)))
                    else:
                        continue

                if len(deletedCookies) == 0:
                    response.set_cookie('order' + str(amountOfOrders), current_size + str(current_id), max_age=one_week_age)
                else:
                    amountOfOrder = deletedCookies[0]
                    response.set_cookie('order' + str(amountOfOrder), current_size + str(current_id), max_age=one_week_age)
                    response.delete_cookie('deletedCookie' + amountOfOrder, max_age=one_week_age)

                return response


def userInfo(request):
    return render(request, 'mainApp/homePage.html')


#Вывод товаров по категориям из меню в header
def productFilter(request):
    # chat_id = "410161554"
    # bot_token = "718629272:AAGV3_wEe5ujSB-MFOqL_3-Gb_nJrzLiRTU"
    # bot = telebot.TeleBot(bot_token)
    # for i in range(1,50):
    #     bot.send_message(chat_id, "Не забудь пропуск завтра. Эта цифра увеличивается в цикле " + str(i))
    url = request.META.get('PATH_INFO')
    url = url.replace('/', '')
    object_list = Products.objects.filter(type=url.lower())
    paginator = Paginator(object_list, 12)
    page = request.GET.get('page')
    object_list = paginator.get_page(page)
    active_class = "menu-item-active"
    return render(request, "news/posts.html", {"object_list": object_list, "active_class": active_class})


#Все товары
def index(request):
    return render(request, "news/main_page.html")
