from ultralytics import YOLO
import os


def get_picture_names():
    names_file = open("pictures for test/picture_names.txt")
    list_of_names = ["pictures for test\\" + i.strip() for i in names_file]


    return list_of_names


def get_list_of_passengers_count():
    list_of_passengers_count = []
    for i in results:
        list_of_passengers_count.append(len(i))
    
    
    return list_of_passengers_count



path = os.getcwd()


model = YOLO("yolo11x.pt")


list_of_picture_names_for_prediction = get_picture_names()


results = model.predict(source=list_of_picture_names_for_prediction, save=False, classes=[0], conf=0.3, device="cuda:0", project=path, imgsz=1280)