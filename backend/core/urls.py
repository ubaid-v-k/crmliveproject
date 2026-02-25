from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, CompanyViewSet, DealViewSet, TicketViewSet, SendCrmEmailView, DatabaseFixView

router = DefaultRouter()
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'deals', DealViewSet, basename='deal')
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('', include(router.urls)),
    path('send-email/', SendCrmEmailView.as_view(), name='send-crm-email'),
    path('fix-db/', DatabaseFixView.as_view(), name='fix-database'),
]
