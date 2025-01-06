import os
from ultralytics import YOLO
from config import PICTURES_PATH, PICTURE_NAMES_FILE, SAVE_PREDICTED, \
    PREDICTION_CLASSES, PREDICTION_CONFIDENCE, \
    PREDICTION_DEVICE, PREDICTION_IMAGE_SIZE


class NeuralNetwork:
    """Class for handling neural network."""

    def __init__(self, model):
        self.model = YOLO(model)
        self.path = os.getcwd()
        self.prediction_results = None

    def get_picture_names(self) -> list:
        """Returns list of picture names required for prediction."""
        names_file = open(PICTURES_PATH + PICTURE_NAMES_FILE,
                          encoding="utf-8")
        picture_names: list = [PICTURES_PATH + i.strip() for i in names_file]

        return picture_names

    def get_list_of_passengers_count(self) -> list:
        """Returns list of passengers count on every predicted picture."""
        if self.prediction_results is None:
            raise ValueError('No prediction results')

        list_of_passengers_count: list = []
        for i in self.prediction_results:
            list_of_passengers_count.append(len(i))

        return list_of_passengers_count

    def predict(self) -> None:
        """Predicts people count on each picture using model based on YOLO."""
        pictures_for_prediction: list = self.get_picture_names()

        self.prediction_results = \
            self.model.predict(source=pictures_for_prediction,
                               save=SAVE_PREDICTED,
                               classes=PREDICTION_CLASSES,
                               conf=PREDICTION_CONFIDENCE,
                               device=PREDICTION_DEVICE,
                               project=self.path,
                               imgsz=PREDICTION_IMAGE_SIZE)


if __name__ == '__main__':
    ai = NeuralNetwork('yolo11x.pt')
    ai.predict()
    print(ai.get_list_of_passengers_count())
