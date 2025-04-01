from django.shortcuts import render, redirect
from .forms import FormConfig


# Create your views here.
def form_config(request):
    return render(request, 'form_config/configpage.html')



# def my_view(request):
#     if request.method == 'POST':
#         form = FormConfig(request.POST)
#         if form.is_valid():
#             # Сохраните данные в сессии или передайте их в URL
#             request.session['hands'] = form.cleaned_data['hands']
#             return redirect('hand_gesture:getting_data')  # Переход к представлению в другом приложении
#     else:
#         form = FormConfig()
#     return render(request, 'form_config/configpage.html', {'form': form})
