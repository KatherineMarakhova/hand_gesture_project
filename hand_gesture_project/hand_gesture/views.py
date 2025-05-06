import cv2
import mediapipe as mp
from django.http import StreamingHttpResponse
from django.shortcuts import render


mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()


def gen_frames():
    cap = cv2.VideoCapture(0)

    while True:
        success, frame = cap.read()
        frame = cv2.flip(frame, 1)
        if not success:
            break
        else:
            # Обработка изображения с помощью MediaPipe
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(frame_rgb)

            # Рисуем скелет руки
            if results.multi_hand_landmarks:
                for idx, handLms in enumerate(results.multi_hand_landmarks):

                    lbl = results.multi_handedness[idx].classification[0].label
                    print(lbl)
                for hand_landmarks in results.multi_hand_landmarks:
                    handness = results.multi_handedness[idx].classification[0].label

                    drawing_spec = mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=3, circle_radius=3)
                    # mp.solutions.drawing_utils.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                    mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS, drawing_spec,
                                              drawing_spec)

            # Кодируем изображение в JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def video_feed(request):
    return StreamingHttpResponse(gen_frames(), content_type='multipart/x-mixed-replace; boundary=frame')


def index(request):
    return render(request, 'hand_gesture/index.html')


def getting_data(request):
    hands = request.session.get('hands')
    print(hands)
    return render(request, 'hand_gesture/index.html', {'hands': hands})
