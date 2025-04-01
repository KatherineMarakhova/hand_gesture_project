from django.urls import path
from . import views

urlpatterns = [
    # path('', views.my_view, name='config_page')
    path('', views.form_config, name='config_page')
]
