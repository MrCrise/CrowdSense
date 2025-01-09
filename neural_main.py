import json
from neural_network import NeuralNetwork
from transport_data import TRANSPORT_DATA
from config import CURRENT_TRANSPORT_NUMBER, CURRENT_DAY, CURRENT_TIME


# Used as a placeholder if selected transport number has no data.
FULLNESS_TEMPLATE: list = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
DATA_TEMPLATE: dict = {
    'понедельник': FULLNESS_TEMPLATE,
    'вторник': FULLNESS_TEMPLATE,
    'среда': FULLNESS_TEMPLATE,
    'четверг': FULLNESS_TEMPLATE,
    'пятница': FULLNESS_TEMPLATE,
    'суббота': FULLNESS_TEMPLATE,
    'воскресенье': FULLNESS_TEMPLATE
}


TIME_TO_INDEX: dict = {
    '04': 0,
    '06': 1,
    '08': 2,
    '10': 3,
    '12': 4,
    '14': 5,
    '16': 6,
    '18': 7,
    '20': 8,
    '22': 9,
    '00': 10
}


def fullness_calc(capacity: int, list_of_passengers_count: list) -> list:
    """Calculate fullness of transport in percents."""
    fullness_list: list = []

    for i in list_of_passengers_count:
        fullness_list.append(round(i / capacity * 100))

    return fullness_list


def get_average_fullness(fullness_list: list) -> int:
    """Calculate average value of fullness."""
    avg_fullness: int = round(sum(fullness_list) / len(fullness_list))
    return avg_fullness


def write_to_json(data):
    """Write average fullness data to json file."""
    with open('static/site/transport_data/transport_load_data.json', 'r',
              encoding='utf-8') as openfile:
        json_data = json.load(openfile)

    current_time_index = TIME_TO_INDEX[CURRENT_TIME]

    if CURRENT_TRANSPORT_NUMBER in json_data:
        json_data[CURRENT_TRANSPORT_NUMBER][CURRENT_DAY][current_time_index] = data
    else:
        json_data[CURRENT_TRANSPORT_NUMBER] = DATA_TEMPLATE
        json_data[CURRENT_TRANSPORT_NUMBER][CURRENT_DAY][current_time_index] = data

    with open("static/site/transport_data/transport_load_data.json", "w",
              encoding='utf-8') as outfile:
        json.dump(json_data, outfile, ensure_ascii=False,
                  sort_keys=True, indent=4)


def main() -> None:
    """Main function."""
    neural_network = NeuralNetwork('yolo11x.pt')
    neural_network.predict()

    list_of_passengers_count: list = \
        neural_network.get_list_of_passengers_count()
    transport_capacity: int = TRANSPORT_DATA[CURRENT_TRANSPORT_NUMBER]

    fullness_list = fullness_calc(transport_capacity, list_of_passengers_count)
    avg_fullness = get_average_fullness(fullness_list)

    write_to_json(avg_fullness)


if __name__ == '__main__':
    main()
