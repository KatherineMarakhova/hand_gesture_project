

const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
const gestureElement = document.getElementById('gesture');

fingers = localStorage.getItem('fingers');
mode = localStorage.getItem('mode');
exercises = localStorage.getItem('exercises');

const hands = new Hands({locateFile: (file) => {
  return "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" + file;
}});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onResults);

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});

      // Определение жестов
      const thumbIsOpen = landmarks[4].y < landmarks[3].y;
      const indexFingerIsOpen = landmarks[8].y < landmarks[6].y;

      if (thumbIsOpen && indexFingerIsOpen) {
        gestureElement.textContent = 'Thumb and Index Finger are Open';
      } else {
        gestureElement.textContent = 'Unknown Gesture';
      }
    }
  }
  canvasCtx.restore();
}

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();
