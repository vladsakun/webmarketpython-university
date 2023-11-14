from django.shortcuts import render
from django.http import HttpResponse
import requests
import time
import re
import telepot
import urllib3
from string import digits
from news.models import Products
from collections import OrderedDict
from django.template.defaulttags import register
from http import cookies



# Получить значение из словаря в template
@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


# Конкатинация строк в template
@register.filter
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)


# Вывод в template basket.html заказы из cookies
def basket(request):
    cookies_list = {}
    size_list = ["S", "M", "L", "XL", "XXL", "XXXL", ]
    if request.COOKIES.get('amountOfOrders'):
        amountOfOrders = request.COOKIES.get('amountOfOrders')
        for i in range(1, int(amountOfOrders) + 1):
            if request.COOKIES.get('order' + str(i)):
                order = request.COOKIES.get('order' + str(i))
                current_id = re.findall(r'\d+', order)
                remove_digits = str.maketrans('', '', digits)
                current_size = order.translate(remove_digits)
                print("Aloha " + current_id[0])
                print(Products.objects.all().values_list("pk"))
                all_info = Products.objects.get(pk=current_id[0])
                current_price = all_info.price
                current_photo = all_info.image.url
                cookies_list.update({'id' + str(i): current_id})
                cookies_list.update({'size' + str(i): current_size})
                cookies_list.update({'price' + str(i): str(current_price)})
                cookies_list.update({'photo' + str(i): current_photo})
            else:
                continue

        response = render(request, 'basket/basket.html',
                          {'cookies': cookies_list, 'sizeList': size_list, 'sizeRange': range(0, 6),
                           'range': range(1, int(amountOfOrders) + 1)})
    else:
        response = render(request, 'basket/basket.html')

    return response


# Отправка сообщение через Телеграм Бота
def sendOrder(request, count, orderId, size, productId):
    # proxy_url = "http://proxy.server:3128"
    # telepot.api._pools = {
    #     'default': urllib3.ProxyManager(proxy_url=proxy_url, num_pools=3, maxsize=10, retries=False, timeout=30),
    # }
    # telepot.api._onetime_pool_spec = (urllib3.ProxyManager, dict(proxy_url=proxy_url, num_pools=1, maxsize=1, retries=False, timeout=30))
    # suff for free acc
    bot_token = "718629272:AAGV3_wEe5ujSB-MFOqL_3-Gb_nJrzLiRTU"
    bot = telepot.Bot(bot_token)
    chatid = "392529642"
    name = request.COOKIES.get('username')
    surname = request.COOKIES.get('usersurname')
    phone = request.COOKIES.get('userphone')
    post = request.COOKIES.get('userpost')
    mail = request.COOKIES.get('usermail')
    current_id = productId
    print(current_id)
    remove_digits = str.maketrans('', '', digits)
    current_size = size
    all_info = Products.objects.get(pk=current_id)
    current_price = all_info.price * int(count)
    current_title = all_info.title
    bot.sendMessage(chatid, "Id: " + str(current_id) + "; Название товара: " + str(current_title) + "; Размер: "
                     + str(current_size) + "; Количество " + count + "; Цена: " + str(
        current_price) + """;      """ + "Контакная информация: " + "Имя: " + name + "; Фамилия: " + surname + "; Почта: " + post + "; Телефон: " + phone + "; E-Mail: " + mail + "; ")
    return request
