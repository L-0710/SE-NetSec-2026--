from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import detect_url, analyze_email, get_detection_history, URLDetectionViewSet, EmailAnalysisViewSet, PhishingFeatureViewSet

router = DefaultRouter()
router.register(r'url-detections', URLDetectionViewSet)
router.register(r'email-analyses', EmailAnalysisViewSet)
router.register(r'phishing-features', PhishingFeatureViewSet)

urlpatterns = [
    path('detect-url/', detect_url, name='detect-url'),
    path('analyze-email/', analyze_email, name='analyze-email'),
    path('detection-history/', get_detection_history, name='detection-history'),
    path('', include(router.urls)),
]
