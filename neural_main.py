from neural_network import get_list_of_passengers_count


def get_bus_data():
    data_file = open("bus_data.txt")
    bus_data_list = [i.strip().split()[1:] for i in data_file]
    return bus_data_list


def fullness_calc(capacity, number_of_passengers):
    fraction = number_of_passengers / capacity


    if fraction < 0.2:
        return 1
    elif 0.2 <= fraction <= 0.45:
        return 2
    elif 0.45 <= fraction <= 0.6:
        return 3
    else:
        return 4


def bus_data_and_passengers_count_merge(bus_data, list_of_passengers_count):
    merged_list = []


    for i in list_of_passengers_count:
        merged_list.append([int(bus_data[0][0]), int(bus_data[0][1]), i])
    

    return merged_list


list_of_passengers_count = get_list_of_passengers_count() # [23, 19, 20, 20, 20, 30, 21, 22, 23, 15, 21, 15, 22, 17, 18, 16, 17, 19, 13, 15, 21, 19, 23, 17, 19, 20, 12]
bus_data = get_bus_data()
merged_bus_data_and_passengers_count_list = bus_data_and_passengers_count_merge(bus_data, list_of_passengers_count)


fullness_list = []
for i in merged_bus_data_and_passengers_count_list:
    current_fullnes = fullness_calc(i[1], i[2])
    fullness_list.append(current_fullnes)
print(fullness_list)


print([i / 40 * 100 for i in list_of_passengers_count])