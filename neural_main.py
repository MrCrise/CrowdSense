from neural_network import get_list_of_passengers_count


def get_bus_data():
    data_file = open("bus_data.txt")
    bus_data_list = [i.strip().split()[1:] for i in data_file]
    return bus_data_list


def fullness_calc(seating, capacity, passengers):
    if 0 <= passengers <= seating:
        return 1
    if seating <= passengers < (capacity - seating) // 2:
        return 2
    if seating + ((capacity - seating) // 2) <= passengers < capacity - 1:
        return 3
    if passengers > capacity - 1:
        return 4


def bus_data_and_passengers_count_merge(bus_data, list_of_passengers_count):
    merged_list = []


    for i in list_of_passengers_count:
        merged_list.append([int(bus_data[0][0]), int(bus_data[0][1]), i])
    

    return merged_list


list_of_passengers_count = get_list_of_passengers_count()
bus_data = get_bus_data()
merged_bus_data_and_passengers_count_list = bus_data_and_passengers_count_merge(bus_data, list_of_passengers_count)


fullness_list = []
for i in merged_bus_data_and_passengers_count_list:
    current_fullnes = fullness_calc(i[0], i[1], i[2])
    fullness_list.append(current_fullnes)
print(fullness_list)