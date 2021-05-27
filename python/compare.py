import sys
import cv2
import matplotlib.pyplot as plt
import numpy as np
import base64
from PIL import Image
import io
import json
import os

np.set_printoptions(threshold=sys.maxsize)

def getHOG(img):
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    haar_face_cascade = cv2.CascadeClassifier("python/haarcascade_frontalface_alt.xml")
    faces = haar_face_cascade.detectMultiScale(gray_img)

    for (x, y, w, h) in faces:
        obraz = gray_img[y:y + h, x:x + w]
        obraz = cv2.resize(obraz, (200, 200))
        obrazHog = cv2.HOGDescriptor().compute(obraz)
        return obrazHog

def stringToImage(base64_string):
    imgdata = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(imgdata))


def toRGB(image):
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)


def main():
    f = open(sys.argv[1],"r")
    photo=f.read()
    image2 = toRGB(stringToImage(photo))
    hog = getHOG(image2)
    max=0
    str=sys.argv[2]
    arr=str.split(',')
    index=-1
    for i in np.arange(0,len(arr)):
        f2 = open(arr[i])
        a=f2.read()
        input = np.frombuffer(bytes.fromhex(a), dtype=np.float32)
        if cv2.compareHist(hog, input, 0)>max:
            max=cv2.compareHist(hog, input, 0)
            index=i

    if max > 0.4:
        print(index)
    else:
        print("No matching")

try:
    main()
except:
    print("error")