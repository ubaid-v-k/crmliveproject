from django.contrib import admin
from django.urls import path, include

from django.shortcuts import redirect

urlpatterns = [
    path('', lambda request: redirect('login')),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/core/', include('core.urls')),
]
