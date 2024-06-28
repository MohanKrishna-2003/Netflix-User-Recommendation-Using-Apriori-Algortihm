from django.contrib import admin
from django.urls import path, include
from NetflixUsingML import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.result, name='result'),
]

