from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import user_login, user_register, user_logout, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('login/', user_login, name='login'),
    path('register/', user_register, name='register'),
    path('logout/', user_logout, name='logout'),
    path('', include(router.urls)),
]
