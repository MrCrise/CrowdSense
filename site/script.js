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

    // Пример использования для маршрута 70
    const source70 = {
        "name": "Начало маршрута",
        "point": {
            "lat": 56.790929,
            "lon": 60.471937
        }
    };
    const target70 = {
        "name": "Конец маршрута",
        "point": {
            "lat": 56.866538,
            "lon": 60.633667
        }
    };

    // Пример использования для маршрута 50
    const source50 = {
        "name": "Начало маршрута",
        "point": {
            "lat": 56.843089, 
            "lon": 60.646380
        }
    };
    const target50 = {
        "name": "Конец маршрута",
        "point": {
            "lat": 56.792787,
            "lon": 60.502624
        }
    };

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
    ];

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
            document.getElementById('day').textContent = "";
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
            document.getElementById('day').textContent = "";
            updateChart(currentWeekDay);
        }
    });

    showBusRoute70Btn.addEventListener('click', () => {
        getBusRoute("70", source70, target70); // Получить маршрут 70
    });

    showBusRoute50Btn.addEventListener('click', () => {
        getBusRoute("50", source50, target50); // Получить маршрут 50
    });

    function getBusRoute(routeNumber, source, target) {
        const apiKey = "cabd8eda-e8c3-45cf-b75f-70b5ef941ff3"; // API ключ
        const apiUrl = `https://routing.api.2gis.com/public_transport/2.0?key=${apiKey}`;
    
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "locale": "ru",
                "source": source,
                "target": target,
                "transport": ["bus"], // Только автобусы
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
           
            return response.json();
        })
        .then(data => {
            console.log("Ответ API:", data); // Логирование ответа для проверки структуры
            if (data && data.length > 0) {
                // Фильтруем маршруты
                const filteredRoutes = data.filter(route => {
                    const hasRouteNumber = route.waypoints.some(waypoint => 
                        waypoint.routes_names.includes(routeNumber)
                    );
                    const noTransfers = route.transfer_count === 0 && route.crossing_count === 0;

                    return hasRouteNumber && noTransfers; // Только с нужным номером и без пересадок
                });

                if (filteredRoutes.length > 0) {
                    clearMap(map);
                    displayRouteOnMap(filteredRoutes[0], map); // Отобразить первый подходящий маршрут
                } else {
                    console.error("Маршрут не найден или есть пересадки.");
                }
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
    

    function displayRouteOnMap(routeData, map) {
        console.log(routeData);
        if (!routeData || !routeData.movements) {
            console.error("Некорректные данные маршрута.");
            return;
        }

        const lines = [];
    
        // Проходимся по движениям в маршруте
        routeData.movements.forEach(movement => {
            if (movement.alternatives && movement.alternatives.length > 0) {
                movement.alternatives.forEach(alt => {
                    // Добавляем геометрию маршрута
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
    
        // Рисуем линии маршрута
        lines.forEach(line => {
            DG.polyline(line, {
                color: 'blue',
                weight: 5
            }).addTo(map);
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