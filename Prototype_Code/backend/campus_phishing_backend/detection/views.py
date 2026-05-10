from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import re
from .models import URLDetection, EmailAnalysis, PhishingFeature

class URLDetectionViewSet(viewsets.ModelViewSet):
    queryset = URLDetection.objects.all()
    permission_classes = [IsAuthenticated]

class EmailAnalysisViewSet(viewsets.ModelViewSet):
    queryset = EmailAnalysis.objects.all()
    permission_classes = [IsAuthenticated]

class PhishingFeatureViewSet(viewsets.ModelViewSet):
    queryset = PhishingFeature.objects.all()
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
def detect_url(request):
    url = request.data.get('url')
    if not url:
        return Response({'message': 'URL不能为空'}, status=status.HTTP_400_BAD_REQUEST)
    
    # 简单的 URL 钓鱼检测逻辑
    is_phishing = False
    confidence = 0.0
    
    # 白名单域名 - 教育机构和可信域名
    whitelist_patterns = [
        r'\.edu\.cn$',      # 中国教育网域名
        r'\.edu$',          # 国际教育域名
        r'\.ac\.cn$',       # 中国科研机构域名
        r'\b(?:tsinghua|pku|fudan|zhejiang|shanghai)\.edu\.cn\b',  # 知名高校
        r'\b(?:baidu|google|bing|taobao|jd|weixin|weibo)\.com\b',  # 知名网站
    ]
    
    # 检查是否在白名单中
    for pattern in whitelist_patterns:
        if re.search(pattern, url, re.IGNORECASE):
            # 白名单域名直接返回安全
            detection = URLDetection(
                url=url,
                is_phishing=False,
                confidence=0.0,
                user=request.user if request.user.is_authenticated else None
            )
            detection.save()
            return Response({
                'url': url,
                'is_phishing': False,
                'confidence': 0.0,
                'message': '检测完成',
                'reason': '该域名属于可信教育机构或知名网站'
            }, status=status.HTTP_200_OK)
    
    # 检查 URL 特征
    phishing_features = PhishingFeature.objects.filter(feature_type='url')
    for feature in phishing_features:
        if re.search(feature.pattern, url):
            is_phishing = True
            confidence += feature.severity * 0.2
    
    # 检查常见钓鱼模式
    suspicious_patterns = [
        r'login|signin|account|verify|secure|bank',
        r'\b(?:paypal|apple|google|facebook|amazon)\b.*\.(?!com$)',
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}',  # IP 地址
        r'\b(?:www\.)?[a-z0-9-]+\.(?:ru|tk|ga|cf|ml|gq)\b',  # 可疑域名（排除cn，避免误判中国网站）
    ]
    
    for pattern in suspicious_patterns:
        if re.search(pattern, url, re.IGNORECASE):
            is_phishing = True
            confidence += 0.1
    
    # 限制置信度范围
    confidence = min(confidence, 1.0)
    
    # 保存检测记录
    detection = URLDetection(
        url=url,
        is_phishing=is_phishing,
        confidence=confidence,
        user=request.user if request.user.is_authenticated else None
    )
    detection.save()
    
    return Response({
        'url': url,
        'is_phishing': is_phishing,
        'confidence': confidence,
        'message': '检测完成'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_detection_history(request):
    # 获取当前用户的检测历史
    if request.user.is_authenticated:
        detections = URLDetection.objects.filter(user=request.user).order_by('-detection_time')[:20]
    else:
        # 未登录用户返回空列表或最近的公共记录
        detections = URLDetection.objects.filter(user__isnull=True).order_by('-detection_time')[:20]
    
    history = []
    for detection in detections:
        history.append({
            'id': detection.id,
            'url': detection.url,
            'is_phishing': detection.is_phishing,
            'confidence': detection.confidence,
            'detection_time': detection.detection_time.strftime('%Y-%m-%d %H:%M')
        })
    
    return Response({
        'status': 'success',
        'data': history
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def analyze_email(request):
    email_header = request.data.get('email_header')
    if not email_header:
        return Response({'message': '邮件头不能为空'}, status=status.HTTP_400_BAD_REQUEST)
    
    # 简单的邮件钓鱼检测逻辑
    is_phishing = False
    confidence = 0.0
    
    # 检查邮件特征
    phishing_features = PhishingFeature.objects.filter(feature_type='email')
    for feature in phishing_features:
        if re.search(feature.pattern, email_header):
            is_phishing = True
            confidence += feature.severity * 0.2
    
    # 检查常见钓鱼邮件模式
    suspicious_patterns = [
        r'Received:.*\b(?:unknown|untrusted|suspicious)\b',
        r'From:.*\b(?:no-reply|admin|support)\b.*@.*\.(?!com$)',
        r'Subject:.*\b(?:urgent|important|action required|account)\b',
        r'Return-Path:.*\b(?:bounce|noreply)\b',
    ]
    
    for pattern in suspicious_patterns:
        if re.search(pattern, email_header, re.IGNORECASE):
            is_phishing = True
            confidence += 0.1
    
    # 限制置信度范围
    confidence = min(confidence, 1.0)
    
    # 保存分析记录
    analysis = EmailAnalysis(
        email_header=email_header,
        is_phishing=is_phishing,
        confidence=confidence,
        user=request.user if request.user.is_authenticated else None
    )
    analysis.save()
    
    return Response({
        'is_phishing': is_phishing,
        'confidence': confidence,
        'message': '分析完成'
    }, status=status.HTTP_200_OK)
