from django.shortcuts import render

def index(request):
    return render(request, 'mainApp/homePage.html')

def contact(request):
    return render(request, 'mainApp/basic.html', {'values': ['Наш телефон', '(123) 123-123']})

def delivery(request):
    return render(request, 'mainApp/delivery.html')



# Create your views here.
