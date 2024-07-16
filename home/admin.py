from django.contrib import admin
from .models import MasterData, RecommendationData

admin.site.register(MasterData)
admin.site.register(RecommendationData)