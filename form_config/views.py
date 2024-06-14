from django.shortcuts import render


# Create your views here.
def from_config(request):
    return render(request, 'form_config/configpage.html')
