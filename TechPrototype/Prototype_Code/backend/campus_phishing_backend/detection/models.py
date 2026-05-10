from django.db import models

class URLDetection(models.Model):
    url = models.URLField(max_length=2048)
    is_phishing = models.BooleanField(default=False)
    confidence = models.FloatField(default=0.0)
    detection_time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('user.User', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        db_table = 'url_detections'
        verbose_name = 'URL检测记录'
        verbose_name_plural = 'URL检测记录'

class EmailAnalysis(models.Model):
    email_header = models.TextField()
    is_phishing = models.BooleanField(default=False)
    confidence = models.FloatField(default=0.0)
    analysis_time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('user.User', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        db_table = 'email_analyses'
        verbose_name = '邮件分析记录'
        verbose_name_plural = '邮件分析记录'

class PhishingFeature(models.Model):
    FEATURE_TYPE_CHOICES = (
        ('url', 'URL特征'),
        ('email', '邮件特征'),
    )
    
    feature_type = models.CharField(max_length=20, choices=FEATURE_TYPE_CHOICES)
    pattern = models.CharField(max_length=512)
    description = models.CharField(max_length=512)
    severity = models.IntegerField(default=1)
    
    class Meta:
        db_table = 'phishing_features'
        verbose_name = '钓鱼特征'
        verbose_name_plural = '钓鱼特征'
