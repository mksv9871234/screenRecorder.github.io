let mediaRecorder;
let recordedBlobs;
let recordedVideo = document.getElementById('recordedVideo');
let downloadButton = document.getElementById('downloadButton');

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

startButton.addEventListener('click', () => {
    navigator.mediaDevices.getDisplayMedia({
        video: true
    })
    .then(handleSuccess)
    .catch(handleError);
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    stopButton.disabled = true;
    startButton.disabled = false;
    downloadButton.disabled = false;
});

downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recorded.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
});

function handleSuccess(stream) {
    startButton.disabled = true;
    stopButton.disabled = false;

    recordedBlobs = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.start();
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function handleStop() {
    downloadButton.disabled = false;

    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    recordedVideo.src = window.URL.createObjectURL(blob);
}

function handleError(error) {
    alert('Error: ', error);
}
