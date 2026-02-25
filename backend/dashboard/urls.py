from django.urls import path
from .views import (
    DashboardStatsAPIView,
    DashboardSalesChartAPIView,
    DashboardConversionAPIView,
    DashboardTeamAPIView,
    DashboardNotificationsAPIView
)

urlpatterns = [
    path('', DashboardStatsAPIView.as_view(), name='dashboard-stats'),
    path('sales-chart/', DashboardSalesChartAPIView.as_view(), name='dashboard-sales-chart'),
    path('conversion/', DashboardConversionAPIView.as_view(), name='dashboard-conversion'),
    path('team/', DashboardTeamAPIView.as_view(), name='dashboard-team'),
    path('notifications/', DashboardNotificationsAPIView.as_view(), name='dashboard-notifications'),
]
