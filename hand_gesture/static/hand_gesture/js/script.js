const notivication = document.getElementById('notification');           // всплывающее уведомление
const videoElement = document.getElementById('video');                  // видео-элемент
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');                       // канва с видео и отрисовкой образов рук
canvasCtx.translate(600, 0);
canvasCtx.scale(-1, 1);

const outputDiv = document.getElementById('output');
const outputDivNextval = document.getElementById('nextval');
const outputDivNextimg = document.getElementById('gesture_image');
const outputDivResult = document.getElementById('result');
let timer = document.getElementById('header-timer');

timer.innerHTML = "00:00:00";
const start_time = new Date();
var time_interval = setInterval(myTimer, 0);

// ==== HANDS BLOCK ====

const hand_location = localStorage.getItem('hands');                    // выбор рук
const fingers = parseInt(localStorage.getItem('fingers'));              // кол-во участвующих пальцев
const mode = localStorage.getItem('mode');                              // выбор режима
const exercises = parseInt(localStorage.getItem('exercises'));          // кол-во упражнений
const hands = new Hands({locateFile: (file) => {
    return "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" + file;
}});

hands.setOptions({
    maxNumHands: hand_location=="Multi"? 2 : 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

const exlist = [];
const one_fingers_list = [16, 8, 4, 1, 4, 8, 16];
const two_fingers_list = [3, 6, 9, 12, 17, 20, 24];
const more_fingers_list = [16, 24, 28, 31];
const all_fingers = [16, 8, 4, 1, 3, 6, 9, 12, 17, 20, 24, 28, 31];

console.log(exercises);

//Generate list of exercises
switch (fingers){
    case 1:
        switch (mode){
            case "std":
                for(let i=0; i<exercises; i++){
                    exlist.push(one_fingers_list[i % one_fingers_list.length]);
                }
                break;
            case "rnd":
                for (let i = 0; i < exercises; i++) {
                    let randomItem = one_fingers_list[Math.floor(Math.random() * one_fingers_list.length)];
                    exlist.push(randomItem);
                }
                break;
        }
        break;
    case 2:
        switch (mode){
            case "std":
                for(let i=0; i<exercises; i++){
                    exlist.push(two_fingers_list[i % two_fingers_list.length]);
                }
                break;
            case "rnd":
                for (let i = 0; i < exercises; i++) {
                    let randomItem = two_fingers_list[Math.floor(Math.random() * two_fingers_list.length)];
                    exlist.push(randomItem);
                }
                break;
        }
        break;
    case 5:
        switch (mode){
            case "std":
                for(let i=0; i<exercises; i++){
                    exlist.push(more_fingers_list[i % more_fingers_list.lengths]);
                }
                break;
            case "rnd":
                for (let i = 0; i < exercises; i++) {
                    let randomItem = all_fingers[Math.floor(Math.random() * all_fingers.length)];
                    exlist.push(randomItem);
                }
                break;
        }
        break;
}


function myTimer() {
    const current_time = new Date();
    let ms = (current_time.getTime() - start_time.getTime());
    timer.innerHTML = get_format_time(ms);
}

function get_format_time(ms){
    let h = Math.floor(ms/3600000) % 24;
    let m = Math.floor(ms/60000) % 60;
    let s = Math.floor(ms/1000) % 60;
    return `${~~(h/10) == 0? '0'+h : h}:${~~(m/10) == 0? '0'+m : m}:${~~(s/10) == 0? '0'+s : s}`;
}

outputDivNextval.innerHTML = `Покажите свою ${hand_location=="Left"? 'левую':'правую'} руку как показано на картинке : `;

const imagePath = 'http://127.0.0.1:8000/static/hand_gesture/hands_img/'+exlist[0]+'.jpg';

const imageContainer = document.getElementById('image-container');
const img = document.createElement('img');
img.src = imagePath;
img.id = 'hand_image';
img.style.borderRadius= "6px";
if (hand_location=="Left") {
    img.style.transform = "scale(-1, 1)";
}
imageContainer.appendChild(img);

let iter = 0;

// Обработка результатов
hands.onResults((results) => {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks) {
        results.multiHandLandmarks.forEach((landmarks, index) => {
            // Определение левая или правая рука
            const handedness = results.multiHandedness[index].label;

            // Отрисовка точек руки
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: handedness != hand_location ? '#00FF00' : '#FF0000',
                lineWidth: 2
            });

            drawLandmarks(canvasCtx, landmarks, {
                color: handedness != hand_location ? '#00FF00' : '#FF0000',
                lineWidth: 1
            });

            // Зеркальное распознавание положения рук
            if (handedness != hand_location){
                var isOpenFingers = {
                    16: landmarks[5].y  > landmarks[4].y,    //thumb   10000
                    8:  landmarks[6].y  > landmarks[8].y,    //index   01000
                    4:  landmarks[10].y > landmarks[12].y,   //middle  00100
                    2:  landmarks[14].y > landmarks[16].y,   //ring    00010
                    1:  landmarks[18].y > landmarks[20].y    //pinky   00001
                };

                let sum = get_sum(isOpenFingers);
                if(iter>=exercises){
                    let end_time = get_format_time(Date.now() - start_time.getTime());
                    var result = confirm(`Тренировка окончена!\n Время выполнения упражнения: ${end_time}`);
                    clearInterval(time_interval);
                    timer.innerHTML = end_time;

                    if (result){
                        window.location.href = '/';
                        localStorage.clear();
                    }
                    else{
                        window.location.reload();
                    }
                } else {
                    if(sum == exlist[iter]){
                    iter+=1;
                    let imagePath = 'http://127.0.0.1:8000/static/hand_gesture/hands_img/'+exlist[iter]+'.jpg';
                    outputDiv.innerHTML = `Количество оставшихся упражнений: ${exercises - iter}`;
                    const imageContainer = document.getElementById('image-container');
                    const img = document.createElement('img');
                    img.src = imagePath;
                    img.id = 'hand_image';
                    img.style.animation = "show 2s";
                    const old_img = document.getElementById('hand_image');
                    imageContainer.replaceChild(img, old_img);
                    }
                }
            }
            else {
                show_notification("Смените руку!", type='error');
            }
        });
//        results.multiHandLandmarks.forEach((landmarks, index) => {
//        landmarks.forEach((landmark, i) => {
//          console.log(`  Point ${i}: x = ${landmark.x}, y = ${landmark.y}, z = ${landmark.z}`);
//        });
//      });
    }
});

// ==== Initialize MediaPipe Face Mesh ====
function get_mood(){
    const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const faceLandmarks = results.multiFaceLandmarks[0];

            // Analyze mood based on landmarks
            const mood = analyzeMood(faceLandmarks);

            const moodElement = document.getElementById('mood');
            moodElement.innerHTML(`Mood: ${mood}`);
            // Draw mood label
            //        canvasCtx.font = '24px Arial';
            //        canvasCtx.fillStyle = 'red';
            //        canvasCtx.fillText(`Mood: ${mood}`, 10, 30);
        }

    });
}

// Function to analyze mood based on landmarks
function analyzeMood(landmarks) {
    const leftMouthCorner = landmarks[61];
    const rightMouthCorner = landmarks[291];
    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];

    // Calculate mouth openness
    const mouthOpenness = Math.abs(lowerLip.y - upperLip.y);

    // Calculate smile curvature
    const smileCurvature = Math.abs(leftMouthCorner.y - rightMouthCorner.y);

    if (mouthOpenness > 0.05) {
        return 'Surprised';
    } else if (smileCurvature < 0.01) {
        return 'Neutral';
    } else {
        return 'Happy';
    }
}

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await Promise.all([
                hands.send({ image: videoElement }),
//                get_mood()
            ]);
    },
    width: 640,
    height: 480
});
camera.start();

function get_sum(isOpenFingers){
    let sum = 0;
    for([key, value] of Object.entries(isOpenFingers)){
        if (value){
            sum = sum + Math.round(key);
        }
    }
    return sum;
}

function show_notification(text, type){
    // Уведомление через DOM
    const notification = document.createElement('div');
    notification.textContent = text;
    var time = 500;

    if(type == 'base'){
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: #666370;
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 5px 666370;
        `;
        time = 2000;
    }
    if(type == 'error'){
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: #D33E43;
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 5px D33E43;
        `;
    }

    document.body.appendChild(notification);

    // Автоматическое скрытие через time милисекунд
    setTimeout(() => {
        notification.remove();
    }, time);
}
