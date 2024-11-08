def fullnessCalc(seating, capacity, passengers):
    if 0 <= passengers <= seating:
        return 1
    if seating <= passengers < (capacity - seating) // 2:
        return 2
    if seating + ((capacity - seating) // 2) <= passengers < capacity - 1:
        return 3
    if passengers > capacity - 1:
        return 4