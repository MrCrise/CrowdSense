// Инициализация карты и обработчики событий
DG.then(function () {
    const map = DG.map('map', {
        center: [56.838011, 60.597465],
        zoom: 13
    });

    // Элементы для работы с панелями
    const loadPanel = document.getElementById('load-panel');
    const schedulePanel = document.getElementById('schedule-panel');
    const openScheduleBtn = document.getElementById('open-schedule-btn');
    const openLoadPanelIcons = document.querySelectorAll('#open-load-panel');
    const backToScheduleBtn = document.getElementById('back-to-schedule-btn');
    const showBusRoute70Btn = document.getElementById('show-bus-route-70');
    const showBusRoute50Btn = document.getElementById('show-bus-route-50');

    // Данные загруженности по дням
    const loadData = {
        "понедельник": [30, 40, 50, 60, 70, 80, 90, 60, 40, 20, 10],
        "вторник": [20, 30, 50, 70, 60, 50, 40, 80, 90, 30, 20],
        "среда": [15, 25, 45, 65, 55, 45, 35, 75, 85, 25, 15],
        "четверг": [35, 45, 55, 75, 65, 55, 45, 85, 95, 35, 25],
        "пятница": [45, 55, 65, 85, 75, 65, 55, 95, 100, 45, 35],
        "суббота": [50, 60, 70, 90, 80, 70, 60, 100, 90, 50, 40],
        "воскресенье": [40, 50, 60, 80, 70, 60, 50, 90, 80, 40, 30]
    };

    const weekDays = [
        'воскресенье',
        'понедельник',
        'вторник',
        'среда',
        'четверг',
        'пятница',
        'суббота'
    ]

    // Переключение активного дня и обновление графика
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс со всех кнопок
            dayButtons.forEach(btn => btn.classList.remove('active-day'));
            
            // Добавляем активный класс выбранной кнопке
            button.classList.add('active-day');
            
            // Обновляем загруженность и отображаем выбранный день
            const selectedDay = button.getAttribute('data-day').toLowerCase();
            document.getElementById('day').textContent = selectedDay;
            updateChart(selectedDay);
        });
    });

    // Открытие и закрытие панелей
    function closeAllPanels() {
        loadPanel.style.display = 'none';
        schedulePanel.style.display = 'none';
    }

    openScheduleBtn.addEventListener('click', () => {
        closeAllPanels();
        schedulePanel.style.display = 'block';
    });

    backToScheduleBtn.addEventListener('click', () => {
        closeAllPanels();
        schedulePanel.style.display = 'block';
    });

    openLoadPanelIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            closeAllPanels();
            loadPanel.style.display = 'block';
        });
    });

    document.getElementById('close-load-panel').addEventListener('click', () => {
        loadPanel.style.display = 'none';
    });

    document.getElementById('close-schedule-panel').addEventListener('click', () => {
        schedulePanel.style.display = 'none';
    });

    // Функция для обновления графика
    function updateChart(day) {
        const data = loadData[day]; // Получаем данные для выбранного дня
        const bars = document.querySelectorAll('.bar');

        bars.forEach((bar, index) => {
            bar.style.height = `${data[index]}%`; // Устанавливаем высоту каждого столбца
        });
    }

    dayButtons.forEach(button => {
        const currentDate = new Date();
        const currentWeekDay = weekDays[currentDate.getDay()];
        if (button.getAttribute('data-day').toLowerCase() === currentWeekDay) {
            button.classList.add('active-day');
            document.getElementById('day').textContent = currentWeekDay;
            updateChart(currentWeekDay);
        }
    });

    showBusRoute70Btn.addEventListener('click', () => {
        getBusRoute70();
    });

    showBusRoute50Btn.addEventListener('click', () => {
        getBusRoute50();
    });





// Функция для получения маршрута 70
function getBusRoute70() {
    const apiKey = "9b2a670a-6312-4ab4-a709-d2594acd146f"; // API ключ
    const apiUrl = `https://routing.api.2gis.com/public_transport/2.0?key=${apiKey}`;

    const source = {
        "name": "Начало маршрута",
        "point": {
            "lat": 56.866546,
            "lon": 60.633671
        }
    };
    const target = {
        "name": "Конец маршрута",
        "point": {
            "lat": 56.791940,
            "lon": 60.462883
        }
    };

    // ... (fetch и обработка ответа - без изменений)
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "locale": "ru",
            "source": source,
            "target": target,
            "transport": ["bus"],
            "waypoints": [
                {
                    "routes_names": ["70"],
                    "subtype": "bus"
                }
            ]
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.length > 0) {
            clearMap(map);
            displayRouteOnMap(data[0], map);
        } else if (data && data.error) {
            console.error("Ошибка от API:", data.error.message);
        } else {
            console.error("Маршрут не найден.");
        }
    })
    .catch(error => {
        console.error("Ошибка при получении маршрута:", error);
    });
}


    // Функция для получения маршрута 50
    function getBusRoute50() {
        const apiKey = "9b2a670a-6312-4ab4-a709-d2594acd146f";
        const apiUrl = `https://routing.api.2gis.com/public_transport/2.0?key=${apiKey}`;

        // Исправленные координаты - ПОМЕНЯНЫ МЕСТАМИ
        const target = { // Теперь это начало маршрута
            "name": "Начало маршрута",
            "point": {
                "lat": 56.792787,
                "lon": 60.502624
            }, 
        };
        const source = { // Теперь это конец маршрута
            "name": "Конец маршрута",
            "point": {
                "lat": 56.843089, 
                "lon": 60.646380
            }
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "locale": "ru",
                "source": source,
                "target": target,
                "transport": ["bus"],
                "waypoints": [
                    {
                        "routes_names": ["50"],
                        "subtype": "bus"
                    }
                ]
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                clearMap(map);
                displayRouteOnMap(data[0], map);
            } else if (data && data.error) {
                console.error("Ошибка от API:", data.error.message);
            } else {
                console.error("Маршрут не найден.");
            }
        })
        .catch(error => {
            console.error("Ошибка при получении маршрута:", error);
        });
    }

    // Функция для отображения маршрута на карте
    function displayRouteOnMap(routeData, map) {
        // ... (без изменений)
        if (!routeData || !routeData.movements) {
            console.error("Некорректные данные маршрута.");
            return;
        }

        const lines = [];

        routeData.movements.forEach(movement => {
            if (movement.alternatives && movement.alternatives.length > 0) {
                movement.alternatives.forEach(alt => {
                    if (alt.geometry && alt.geometry.length > 0) {
                        alt.geometry.forEach(geo => {
                            const wkt = geo.selection;
                            const coordinates = wkt.replace("LINESTRING(", "").replace(")", "").split(",").map(pair => {
                                const [lon, lat] = pair.trim().split(" ");
                                return [parseFloat(lat), parseFloat(lon)];
                            });
                            lines.push(coordinates);
                        });
                    }
                });
            }
        });

        lines.forEach(line => {
            DG.polyline(line, {
                color: 'blue',
                weight: 5
            }).addTo(map);
        });

        routeData.movements.forEach(movement => {
            if (movement.platforms && movement.platforms.names) {
                if (movement.alternatives && movement.alternatives[0] && movement.alternatives[0].platforms) {
                    movement.alternatives[0].platforms.forEach((platform, index) => {
                        if (platform.geometry) {
                            const wkt = platform.geometry;
                            const [lon, lat] = wkt.replace("POINT(", "").replace(")", "").split(" ").map(parseFloat);
                            const stopName = movement.platforms.names[index];
                            DG.marker([lat, lon]).bindPopup(stopName).addTo(map);
                        }
                    });
                }
            }
        });
    }

    // Функция для очистки карты
    function clearMap(map) {
        // ... (без изменений)
        for (let i in map._layers) {
            if (map._layers[i]._path != undefined) {
                try {
                    map.removeLayer(map._layers[i]);
                } catch (e) {
                    console.error("Ошибка при удалении слоя:", e);
                }
            }
        }
        for (let i in map._layers) {
            if (map._layers[i]._popup != undefined) {
                try {
                    map.removeLayer(map._layers[i]);
                } catch (e) {
                    console.error("Ошибка при удалении слоя:", e);
                }
            }
        }
    }

});