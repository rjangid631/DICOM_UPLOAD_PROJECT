from django.urls import path
from .views import index, upload_dicom 

urlpatterns = [
    path('', index, name='index'),
    path('upload/', upload_dicom, name='upload_dicom'),
]