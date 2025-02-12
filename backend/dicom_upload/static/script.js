const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const cancelBtn = document.getElementById("cancelBtn");
const progressContainer = document.getElementById("progress-container");
const statusText = document.getElementById("statusText");

let files = [];
let xhrRequests = [];

// ✅ Prevent default behavior (Fixes downloading issue)
["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
});

// ✅ Highlight drop area on dragover
dropArea.addEventListener("dragover", () => dropArea.classList.add("highlight"));
dropArea.addEventListener("dragleave", () => dropArea.classList.remove("highlight"));

// ✅ Handle dropped files
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();

    dropArea.classList.remove("highlight");
    files = [...e.dataTransfer.files];
    updateFileList();
});

// ✅ Handle file selection via input
fileInput.addEventListener("change", (e) => {
    files = [...e.target.files];
    updateFileList();
});

// ✅ Clicking the drop area opens file dialog
dropArea.addEventListener("click", () => fileInput.click());

// ✅ Clicking "Upload"
uploadBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (files.length === 0) {
        alert("Please select a file first!");
        return;
    }
    uploadFiles();
});

// ✅ Function to update file list
function updateFileList() {
    statusText.textContent = files.length > 0 ? `${files.length} file(s) selected` : "No files selected!";
}

// ✅ Upload files
function uploadFiles() {
    progressContainer.innerHTML = "";
    statusText.textContent = "Uploading...";
    xhrRequests = []; // Reset previous requests

    files.forEach((file, index) => {
        const formData = new FormData();
        formData.append("dicom_files", file); // Ensure this matches Django backend

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload/", true);
        xhr.setRequestHeader("X-CSRFToken", getCSRFToken());

        // ✅ Progress tracking
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percent = (event.loaded / event.total) * 100;
                document.getElementById(`progress-bar-${index}`).style.width = percent + "%";
            }
        };

        // ✅ Handle upload completion
        xhr.onload = function () {
            if (xhr.status == 200) {
                statusText.textContent = "Upload successful!";
            } else {
                statusText.textContent = "Upload failed!";
            }
            cancelBtn.disabled = true;
        };

        xhrRequests.push(xhr);
        xhr.send(formData);

        // ✅ Create progress bar for each file
        const progressBarContainer = document.createElement("div");
        progressBarContainer.className = "progress";

        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        progressBar.id = `progress-bar-${index}`;

        progressBarContainer.appendChild(progressBar);
        progressContainer.appendChild(progressBarContainer);
    });

    cancelBtn.disabled = false;
}

// ✅ Get CSRF Token
function getCSRFToken() {
    return document.querySelector("[name=csrfmiddlewaretoken]").value;
}

// ✅ Cancel upload
cancelBtn.addEventListener("click", () => {
    xhrRequests.forEach((xhr) => xhr.abort());
    statusText.textContent = "Upload canceled!";
    cancelBtn.disabled = true;
});