import requests
import telebot
from django.shortcuts import render
from django.http import HttpResponseRedirect

bot_token = "718629272:AAGV3_wEe5ujSB-MFOqL_3-Gb_nJrzLiRTU"
bot = telebot.TeleBot(bot_token)
chatid = "392529642"


def cookies_demo(request):
    template_name = 'mainApp/delivery.html'
    current_phone_number = "Your number"  # default number
    if request.method == 'GET':
        if 'phone' in request.COOKIES:
            current_phone_number = request.COOKIES['phone']
            print("GET:phone:" + request.COOKIES.get('phone'))
    elif request.method == 'POST':
        current_phone_number = request.POST.get('phone')
        print("POST:phone:" + request.POST['phone'])
        bot.send_message(392529642, current_phone_number)
    response = render(request, 'mainApp/delivery.html', {
        'current_phone_number': current_phone_number
    })
    response.set_cookie('phone', current_phone_number)
    return response
