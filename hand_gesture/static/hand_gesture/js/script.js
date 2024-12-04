const notivication = document.getElementById('notification');
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
canvasCtx.translate(600, 0);
canvasCtx.scale(-1, 1);
const gestureElement = document.getElementById('gesture');

const hand_location = localStorage.getItem('hands');
const fingers = parseInt(localStorage.getItem('fingers'));
const mode = localStorage.getItem('mode');
const exercises = parseInt(localStorage.getItem('exercises'));

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
                    for(let i=0; i<Math.floor(exercises/10); i++){
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
        break;
    case 2:
        switch (mode){
            case "std":
                exlist.push(...two_fingers_list);
                if (exercises > 10){
                    for(let i=0; i<Math.floor(exercises/10); i++){
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
        break;
    case 5:
        switch (mode){
            case "std":
                exlist.push(...more_fingers_list);
                if (exercises > 10){
                    for(let i=0; i<Math.floor(exercises/10); i++){
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
        break;
}

const outputDiv = document.getElementById('output');
outputDiv.innerHTML = exlist.slice(0, exercises).join(', ');

const outputDivNextval = document.getElementById('nextval');
const outputDivNextimg = document.getElementById('gesture_image');
const outputDivResult = document.getElementById('result');

outputDivNextval.innerHTML = "Первое упражнение : ";

const imagePath = 'http://127.0.0.1:8000/static/hand_gesture/img/'+exlist[0]+'.jpg';
const imageContainer = document.getElementById('image-container');
const img = document.createElement('img');
img.src = imagePath;
img.id = 'hand_image';
imageContainer.appendChild(img);

let iter = 0;

// Обработка результатов
hands.onResults((results) => {
    // Очистка canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка видео на canvas
    canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks) {
        results.multiHandLandmarks.forEach((landmarks, index) => {
            // Определение левая или правая рука
            const handedness = results.multiHandedness[index].label;

            console.log(hand_location)
            // Отрисовка точек руки
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: handedness != hand_location ? '#00FF00' : '#FF0000',
                lineWidth: 2
            });

            drawLandmarks(canvasCtx, landmarks, {
                color: handedness != hand_location ? '#00FF00' : '#FF0000',
                lineWidth: 1
            });

            if (handedness != hand_location){
                // Определение жестов на одной руке
                var isOpenFingers = {
                    16: landmarks[5].y  > landmarks[4].y,    //thumb   10000
                    8:  landmarks[6].y  > landmarks[8].y,    //index   01000
                    4:  landmarks[10].y > landmarks[12].y,   //middle  00100
                    2:  landmarks[14].y > landmarks[16].y,   //ring    00010
                    1:  landmarks[18].y > landmarks[20].y    //pinky   00001
                };

                let sum = get_sum(isOpenFingers);
                if(iter>=exercises){
                    outputDivResult.innerHTML = "Тренировка окончена!";
                    show_notification("Тренировка окончена!", 'base');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                }
                else if(sum == exlist[iter]){
                    iter+=1;
                }
                else{
                    let binn = exlist[iter].toString(2);
                    binn = "00000".substr(binn.length) + binn;
                    let imagePath = 'http://127.0.0.1:8000/static/hand_gesture/img/'+exlist[iter]+'.jpg';
                    const imageContainer = document.getElementById('image-container');
                    const img = document.createElement('img');
                    img.src = imagePath;
                    img.id = 'hand_image';
                    const old_img = document.getElementById('hand_image');
                    imageContainer.replaceChild(img, old_img);
                }
            }
            else{
                show_notification("Смените руку!", type='error');
            }
        });
    }
});

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
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

    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 500);
}
