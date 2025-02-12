# DICOM_UPLOAD_PROJECT

## Overview
DICOM_UPLOAD_PROJECT is a web-based application built using Django (Python) for handling DICOM file uploads. It provides an intuitive interface to upload DICOM files to an Orthanc PACS server with features like real-time status updates, drag-and-drop file uploads, progress tracking, and filtering options.

## Features
- **DICOM File Upload**: Supports manual selection and drag-and-drop uploads.
- **Progress Tracking**: Displays real-time upload progress.
- **Cancel & Resume Upload**: Allows users to cancel uploads and resume if interrupted.
- **Real-time Status Updates**: Uses AJAX/WebSockets to update file upload status dynamically.
- **Filters for File Status**: Allows filtering uploads by institution name and study date.
- **Integration with Orthanc**: Ensures secure storage and transfer of DICOM files.


## Installation
### Prerequisites
- Python (>=3.8)
- Django (>=4.0)
- React (>=18.0)
- Node.js & npm
- Orthanc PACS (Configured)

### Backend Setup
1. Clone the repository:
   
   git clone https://github.com/rjangid631/dicom_upload_project.git
   cd dicom_upload_project/backend
  
2. Create a virtual environment and activate it:
   
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
3. Install dependencies:
   
   pip install -r requirements.txt
   
4. Apply migrations and run the server:
   
   python manage.py migrate
   python manage.py runserver




## Usage
1. Open http://localhost:8000/ to access the Django app.
2. Use the upload page to select or drag-and-drop DICOM files.
3. Monitor upload progress in real-time.
4. Check upload status with filtering options.

## API Endpoints
- POST /upload/ - Upload DICOM files.
- GET /status/ - Fetch the status of uploaded files.
- GET /filter/ - Retrieve filtered file status.

## Future Enhancements
- WebSocket-based real-time updates.
- Authentication for secure uploads.
- Enhanced UI with additional metadata display.

## License
This project is licensed under the MIT License.

