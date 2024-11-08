from ultralytics import YOLO
import os


path = os.getcwd()


model = YOLO("yolo11x.pt")


results = model.predict(source="pictures for test/bus.png", save=True, classes=[0], conf=0.3, device="cuda:0", project=path)


results[0].show