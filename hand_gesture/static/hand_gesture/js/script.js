function get_sum(isOpenFingers){
    let sum = 0;
    for([key, value] of Object.entries(isOpenFingers)){
        if (value){
            sum = sum + Math.round(key);
        }
    }
    return sum;
}

const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
const gestureElement = document.getElementById('gesture');

const fingers = parseInt(localStorage.getItem('fingers'));
const mode = localStorage.getItem('mode');
const exercises = parseInt(localStorage.getItem('exercises'));

const hands = new Hands({locateFile: (file) => {
  return "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" + file;
}});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

const exlist = [];
//const one_fingers_list = [16, 8, 4, 2, 1, 2, 4, 8, 16];
const one_fingers_list = [16, 8, 4, 1, 4, 8, 16];               //without ring finger
//const two_fingers_list = [3, 5, 6, 9, 10, 12, 17, 18, 20, 24];
const two_fingers_list = [3, 5, 6, 9, 10, 12, 17, 20, 24];      //without ring finger
const more_fingers_list = [16, 24, 28, 30, 31];

//Generate list of exercises
switch (fingers){
    case 1:
        switch (mode){
            case "std":
                exlist.push(...one_fingers_list);
                if (exercises > 10){
                    for(let i=0; i<Math.floor(exercises/10+1); i++){
                        exlist.push(...one_fingers_list);
                    }
                }
                break;
            case "rnd":
                for (let i = 0; i < exercises; i++) {
                    let randomItem = one_fingers_list[Math.floor(Math.random() * one_fingers_list.length)];
                    exlist.push(randomItem);
                }
                break;
        }
    case 2:
        switch (mode){
            case "std":
                exlist.push(...two_fingers_list);
                if (exercises > 10){
                    for(let i=0; i<Math.floor(exercises/10+1); i++){
                        exlist.push(two_fingers_list);
                    }
                }
                break;
            case "rnd":
                for (let i = 0; i < exercises; i++) {
                    let randomItem = two_fingers_list[Math.floor(Math.random() * two_fingers_list.length)];
                    exlist.push(randomItem);
                }
                break;
        }
    case 5:
        switch (mode){
            case "std":
                exlist.push(...more_fingers_list);
                if (exercises > 10){
                    for(let i=0; i<Math.floor(exercises/10+2); i++){
                        exlist.push(...more_fingers_list);
                    }
                }
                break;
            case "rnd":
                for (let i = 0; i < exercises; i++) {
                    exlist.push(Math.floor(Math.random() * 32));
                }

                break;
        }
}

console.log("this is");
console.log("exercises :", exercises);
console.log("fingers :", fingers);
console.log("mode :", mode);

for(let i=0; i<exercises; i++){
    console.log(exlist[i]);
}

let iter = 0;
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
      var isOpenFingers = {
          16: landmarks[5].y > landmarks[4].y,    //thumb   10000
          8: landmarks[6].y > landmarks[8].y,     //index   01000
          4: landmarks[10].y > landmarks[12].y,   //middle  00100
          2: landmarks[14].y > landmarks[16].y,   //ring    00010
          1: landmarks[18].y > landmarks[20].y    //pinky   00001
      };

      let sum = get_sum(isOpenFingers);
      if(sum == exlist[iter] && iter<=exercises){
          console.log("DONE!!!!");
          iter++;
          if (iter == exercises){
            console.log("FINISH!!!!!");
            exlist = [];
            iter = 0;
          }
          else{
            console.log("NEXT EX IS :", exlist[iter]);
          }
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