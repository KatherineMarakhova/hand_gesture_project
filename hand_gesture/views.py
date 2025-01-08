from django.shortcuts import render
from django.http import StreamingHttpResponse
from hsemotion_onnx.facial_emotions import HSEmotionRecognizer
import os
import sys
import cv2
import numpy
from datetime import datetime, timedelta
import platformdirs
from lib.centerface import CenterFace
from lib.i18n import _
from lib.config import *
from lib.cam import *


def ex_gesture(request):
    return render(request, 'hand_gesture/ex_gesture.html')


# def analyze_emotion(request):
#     MODEL_NAME = 'enet_b0_8_best_vgaf'
#     cfg = readcfg()
#     cam = cam_class(cfg)
#     wws = False                                             # Warning condition was set
#     wwact = False                                           # Warning windows was shown flag
#     wstime = datetime.now()                                 # Warning condition set time
#
#     # Set neural networks
#     centerface = CenterFace()
#     fer = HSEmotionRecognizer(MODEL_NAME)
#
#     ret, cap = cam.find_camera()
#     if ret is False:
#         return -1
#     # TODO: нужно останавливать распознавалку после перехода на другую страницу!
#     while True:
#         ret, image_bgr = cam.get_next_frame()
#         if not ret:
#             print(_("Can't read camera image"))
#             return -1
#         image = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
#         bounding_boxes, ign = centerface(image_bgr, image_bgr.shape[0], image_bgr.shape[1], threshold=0.35)
#
#         for i in range(len(bounding_boxes)):
#             bbox = bounding_boxes[i]
#             x1, y1, x2, y2 = [round(b) for b in bbox[0:4]]
#             if (x1 <= 0): x1 = 0
#             if (y1 <= 0): y1 = 0
#             if (x2 >= image_bgr.shape[1]): x2 = image_bgr.shape[1] - 1
#             if (y2 >= image_bgr.shape[0]): y2 = image_bgr.shape[0] - 1
#
#             face_img = image[y1:y2, x1:x2]
#             emotion, scores = fer.predict_emotions(face_img, logits=True)
#
#             wws, wwact, wstime = warn_actions(cfg, scores, wws, wwact, wstime)
#             writestat(cfg, i, scores)
