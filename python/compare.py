import sys
import cv2
import matplotlib.pyplot as plt
import numpy as np
import base64
from PIL import Image
import io
import json
import os
import math

np.set_printoptions(threshold=sys.maxsize)


def hog_procedure(i, j, smer_gradienta, amplituda_gradienta):
    # HOG histogram z bins=10, velikost_celice/regije=10x10, velikost_bloka=2x2(celici/regiji),
    histogram = np.full(10, 0)
    histogram_bloka = np.array([])
    lower_edge_y = 0
    upper_edge_y = 0
    lower_edge_x = 0
    upper_edge_x = 0
    for k_regions in range(0, 4):
        if (k_regions == 0):
            lower_edge_y = 0
            upper_edge_y = 10
            lower_edge_x = 0
            upper_edge_x = 10
        elif (k_regions == 1):
            lower_edge_y = 0
            upper_edge_y = 10
            lower_edge_x = 10
            upper_edge_x = 20
        elif (k_regions == 2):
            lower_edge_y = 10
            upper_edge_y = 20
            lower_edge_x = 0
            upper_edge_x = 10
        elif (k_regions == 3):
            lower_edge_y = 10
            upper_edge_y = 20
            lower_edge_x = 10
            upper_edge_x = 20
        for y in range(i + lower_edge_y, i + upper_edge_y):
            for x in range(j + lower_edge_x, j + upper_edge_x):
                if (smer_gradienta[y, x] % 36 == 0 and smer_gradienta[y, x] != 360):
                    histogram[smer_gradienta[y, x] % 36] += amplituda_gradienta[y, x]
                else:
                    if (smer_gradienta[y, x] > 0 and smer_gradienta[y, x] < 36):
                        histogram[0] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 0) / 36))
                        histogram[1] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 0) / 36)
                    elif (smer_gradienta[y, x] > 36 and smer_gradienta[y, x] < 72):
                        histogram[1] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 36) / 36))
                        histogram[2] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 36) / 36)
                    elif (smer_gradienta[y, x] > 72 and smer_gradienta[y, x] < 108):
                        histogram[2] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 72) / 36))
                        histogram[3] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 72) / 36)
                    elif (smer_gradienta[y, x] > 108 and smer_gradienta[y, x] < 144):
                        histogram[3] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 108) / 36))
                        histogram[4] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 108) / 36)
                    elif (smer_gradienta[y, x] > 144 and smer_gradienta[y, x] < 180):
                        histogram[4] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 144) / 36))
                        histogram[5] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 144) / 36)
                    elif (smer_gradienta[y, x] > 180 and smer_gradienta[y, x] < 216):
                        histogram[5] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 180) / 36))
                        histogram[6] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 180) / 36)
                    elif (smer_gradienta[y, x] > 216 and smer_gradienta[y, x] < 252):
                        histogram[6] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 216) / 36))
                        histogram[7] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 216) / 36)
                    elif (smer_gradienta[y, x] > 252 and smer_gradienta[y, x] < 288):
                        histogram[7] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 252) / 36))
                        histogram[8] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 252) / 36)
                    elif (smer_gradienta[y, x] > 288 and smer_gradienta[y, x] < 324):
                        histogram[8] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 288) / 36))
                        histogram[9] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 288) / 36)
                    elif (smer_gradienta[y, x] > 324 and smer_gradienta[y, x] < 360):
                        histogram[9] += amplituda_gradienta[y, x] * (1 - ((smer_gradienta[y, x] - 324) / 36))
                        histogram[0] += amplituda_gradienta[y, x] * ((smer_gradienta[y, x] - 324) / 36)
                        # dodamo histogram prve regije
        histogram_bloka = np.concatenate((histogram, histogram_bloka))
        # ponastavimo histogram
        histogram[0:10] = 0
    L2norm = 0.00000000000001
    # izracun normale histograma bloka
    for k in range(0, 40):
        L2norm += math.pow(histogram_bloka[k], 2)
    L2norm = math.sqrt(L2norm)
    # normalizacija histograma
    for k in range(0, 40):
        histogram_bloka[k] = histogram_bloka[k] / L2norm
    return histogram_bloka


def getHOG(image):
    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    haar_face_cascade = cv2.CascadeClassifier("python/haarcascade_frontalface_alt.xml")
    faces = haar_face_cascade.detectMultiScale(gray_img)
    for (x, y, w, h) in faces:
        image = gray_img[y:y + h, x:x + w]
        image=cv2.resize(image, (100, 100))
        break

    (h, w) = image.shape
    # Sobelov filter
    # horizontalno konvolucijsko jedro
    H1 = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
    # vertikalno konvolucijsko jedro
    H2 = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]

    Y = 0
    X = 0
    amplituda_gradienta = np.full((h - 2, w - 2), 0)
    smer_gradienta = np.full((h - 2, w - 2), 0)
    for i in range(0, h - 2):
        for j in range(0, w - 2):
            a = 0
            for x in range(i, i + 3):
                b = 0
                for y in range(j, j + 3):
                    # na vsak piksel položimo obe maski in izračunamo vrednost
                    Y += int(H1[a][b] * image[x][y])
                    X += int(H2[a][b] * image[x][y])
                    b += 1
                a += 1
            # izračunamo odvod
            amplituda_gradienta[i][j] = int(math.sqrt(math.pow(Y, 2) + math.pow(X, 2)))
            if X == 0:
                X = 1
            # izračunamo kot roba
            smer_gradienta[i, j] = ((math.atan(Y / X)) * 180.) / np.pi
            if (smer_gradienta[i, j] < 0):
                smer_gradienta[i, j] = 180 + (180 + smer_gradienta[i, j])
            Y = 0
            X = 0

    rezultat = np.array([])
    histogram_bloka = np.array([])

    for i in range(0, h - 2, 10):
        for j in range(0, w - 2, 10):
            if (i + 20 >= h - 2 and j + 20 >= w - 2):
                i = h - 22
                j = w - 22
                histogram_bloka = hog_procedure(i, j, smer_gradienta, amplituda_gradienta)
            elif (i + 20 >= h - 2):
                i = h - 22
                histogram_bloka = hog_procedure(i, j, smer_gradienta, amplituda_gradienta)
            elif (j + 20 >= w - 2):
                j = w - 22
                histogram_bloka = hog_procedure(i, j, smer_gradienta, amplituda_gradienta)
            else:
                histogram_bloka = hog_procedure(i, j, smer_gradienta, amplituda_gradienta)
            rezultat = np.concatenate((rezultat, histogram_bloka))
            histogram_bloka = np.array([])
    return rezultat.astype(np.float32)

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

    if max > 0.6:
        print(index)
    else:
        print("No matching")

try:
    main()
except:
    print("error")