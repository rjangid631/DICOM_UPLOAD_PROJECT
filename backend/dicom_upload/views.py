import os
import requests
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Orthanc API configurations
ORTHANC_URL = "https://pacs.reportingbot.in/instances"  # Update if needed
ORTHANC_USERNAME = "admin"
ORTHANC_PASSWORD = "phP@123!"

def index(request):
    """Render the upload page."""
    return render(request, "index.html")

@csrf_exempt
def upload_dicom(request):
    """Handle DICOM file uploads and send them to Orthanc."""
    if request.method == 'POST' and request.FILES:
        files = request.FILES.getlist('dicom_files')  # Support multiple files
        responses = []

        # Ensure media directory exists
        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)

        for uploaded_file in files:
            file_path = os.path.join(settings.MEDIA_ROOT, uploaded_file.name)

            # Save file temporarily
            try:
                with open(file_path, 'wb+') as destination:
                    for chunk in uploaded_file.chunks():
                        destination.write(chunk)
            except Exception:
                return JsonResponse({"error": "File saving failed"}, status=500)

            # Send to Orthanc
            try:
                with open(file_path, 'rb') as f:
                    response = requests.post(
                        ORTHANC_URL,
                        auth=(ORTHANC_USERNAME, ORTHANC_PASSWORD),
                        files={"file": (uploaded_file.name, f, 'application/dicom')}
                    )

                if response.status_code == 200:
                    responses.append({
                        "file": uploaded_file.name,
                        "message": "Upload successful",
                        "orthanc_response": response.json()
                    })
                else:
                    responses.append({
                        "file": uploaded_file.name,
                        "error": "Upload failed",
                        "details": response.text
                    })
            except requests.exceptions.RequestException as e:
                responses.append({"file": uploaded_file.name, "error": str(e)})
            
            finally:
                # Clean up the saved file
                if os.path.exists(file_path):
                    os.remove(file_path)

        return JsonResponse({"uploads": responses}, status=200)

    return JsonResponse({'error': 'Invalid request'}, status=400)