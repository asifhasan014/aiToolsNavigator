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
]
