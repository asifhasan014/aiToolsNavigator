from django.db import models

class MasterData(models.Model):
    ai_tool_name = models.CharField(max_length=255)
    descriptions = models.TextField(blank=True, null=True)
    payment_condition = models.CharField(max_length=255, blank=True, null=True)
    useable_for = models.CharField(max_length=255, blank=True, null=True)
    charges = models.CharField(max_length=255, blank=True, null=True)
    review = models.CharField(max_length=255, blank=True, null=True)
    tool_link = models.TextField(blank=True, null=True)
    major_category = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.ai_tool_name

class RecommendationData(models.Model):
    ai_tool_name = models.CharField(max_length=255)
    descriptions = models.TextField(blank=True, null=True)
    useable_for = models.CharField(max_length=255, blank=True, null=True)
    master_data = models.ForeignKey(MasterData, on_delete=models.CASCADE)

    def __str__(self):
        return self.ai_tool_name