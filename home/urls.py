from django.contrib import admin
from django.urls import path
from . import views

admin.site.site_header = "AI Navigator Tools Analysis"
admin.site.site_title = "Welcome to AI Navigator Dashboard"
admin.site.index_title = "Welcome to the portal"

urlpatterns = [
    path("", views.home, name="myDashboard"),
    path('chart/', views.charts, name='charts'),
    path('recommendation/', views.recommendation, name='recommendationData'),
    path('get_recommendations/', views.get_recommendations, name='get_recommendations'),
    path('ai_tool/<int:pk>/', views.ai_tool_detail, name='ai_tool_detail'),
    path('update_view_count/<int:pk>/', views.update_view_count, name='update_view_count'),
]
