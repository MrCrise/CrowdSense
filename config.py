BOT_TOKEN: str = "8151127954:AAFPMLTgJ20VK-ulxXb3MBzz9H1WyoGxiDA"

CURRENT_TRANSPORT_NUMBER: str = '37'
CURRENT_DAY: str = 'понедельник'  # понедельник, вторник, среда, четверг, пятница, суббота, воскресенье.
CURRENT_TIME: str = '04'  # 04, 06, 08, 10, 12, 14, 16, 18, 20, 22, 00.

# Picture path constants.
PICTURES_PATH: str = 'Transport pictures/'
PICTURE_NAMES_FILE: str = 'photo_names.txt'

# Prediction constants.
SAVE_PREDICTED: bool = False
PREDICTION_CLASSES: list = [0]  # [0] is for people only.
PREDICTION_CONFIDENCE: float = 0.3
PREDICTION_DEVICE: str = 'cpu'  # 'cuda:0' or 'cpu'.
PREDICTION_IMAGE_SIZE: int = 640
