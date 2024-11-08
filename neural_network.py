from ultralytics import YOLO
import os


def get_picture_names():
    names_file = open("pictures for test/picture_names.txt")
    list_of_names = ["pictures for test\\" + i.strip() for i in names_file]


    return list_of_names



path = os.getcwd()


model = YOLO("yolo11x.pt")


list_of_picture_names_for_prediction = get_picture_names()


results = model.predict(source=list_of_picture_names_for_prediction, save=True, classes=[0], conf=0.3, device="cuda:0", project=path, imgsz=1280)



for i in results:
    print(len(i))