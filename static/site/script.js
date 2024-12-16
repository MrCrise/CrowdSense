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
    const showBusRoute37Btn = document.getElementById('show-bus-route-37');

    // Обновление графика загруженности
    const busLoadData = {
        "37": {
            "понедельник": [2, 40, 80, 60, 65, 55, 85, 95, 50, 30, 2],
            "вторник": [2, 35, 75, 55, 60, 50, 80, 90, 45, 25, 2],
            "среда": [2, 45, 85, 60, 70, 60, 90, 95, 55, 35, 2],
            "четверг": [2, 40, 80, 50, 65, 55, 85, 90, 50, 30, 2],
            "пятница": [2, 50, 85, 65, 75, 65, 95, 100, 60, 40, 2],
            "суббота": [2, 25, 50, 40, 55, 45, 70, 75, 35, 20, 2],
            "воскресенье": [2, 20, 40, 35, 50, 40, 60, 65, 30, 15, 2]
        }
    };

    const weekDays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const dayButtons = document.querySelectorAll('.day-btn');

    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            dayButtons.forEach(btn => btn.classList.remove('active-day'));
            button.classList.add('active-day');
            const selectedDay = button.getAttribute('data-day').toLowerCase();
            updateChart(selectedDay);
        });
    });

    function updateChart(day) {
        const data = busLoadData["37"][day];
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.height = `${data[index]}%`;
            bar.title = `${data[index]}%`;
        });
    }

    // Автоматическое отображение текущего дня недели
    const currentDay = weekDays[new Date().getDay()];
    document.querySelector(`[data-day="${currentDay}"]`).classList.add('active-day');
    updateChart(currentDay);

    // Обработчики панелей
    openScheduleBtn.addEventListener('click', () => { closeAllPanels(); schedulePanel.style.display = 'block'; });
    backToScheduleBtn.addEventListener('click', () => { closeAllPanels(); schedulePanel.style.display = 'block'; });
    openLoadPanelIcons.forEach(icon => icon.addEventListener('click', () => { closeAllPanels(); loadPanel.style.display = 'block'; }));
    document.getElementById('close-load-panel').addEventListener('click', () => loadPanel.style.display = 'none');
    document.getElementById('close-schedule-panel').addEventListener('click', () => schedulePanel.style.display = 'none');

    function closeAllPanels() {
        loadPanel.style.display = 'none';
        schedulePanel.style.display = 'none';
    }

    // Запрос маршрута троллейбуса №37
    showBusRoute37Btn.addEventListener('click', () => getTrolleybusRoute37());

    function getTrolleybusRoute37() {
        const apiUrl = `https://routing.api.2gis.com/public_transport/2.0?key=e9a6a37b-245a-4ad2-918e-c4b9cb8ce618`;

        const requestBody = {
            "locale": "ru",
            "source": { "name": "Площадь 1905 года", "point": { "lat": 56.820856, "lon": 60.575156 } },
            "target": { "name": "ТРЦ Гринвич", "point": { "lat": 56.831789, "lon": 60.656212 } },
            "transport": ["trolleybus"]
        };

        console.log("Отправляем запрос с телом:", JSON.stringify(requestBody));

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Ответ API:", data);

            const route37 = data.find(route =>
                route.movements.some(movement =>
                    movement.routes &&
                    movement.routes.some(r => r.names.includes("37"))
                )
            );

            if (route37) {
                console.log("Маршрут 37 найден:", route37);
                clearMap();
                displayRouteOnMap(route37);
                placeStopsOnMap(route37);
            } else {
                console.warn("Маршрут 37 не найден среди полученных маршрутов.");
            }
        })
        .catch(error => console.error("Ошибка при получении маршрута:", error));
    }

    // Функция для отображения маршрута на карте
    function displayRouteOnMap(routeData) {
        const lines = [];
    
        routeData.movements.forEach(movement => {
            if (movement.alternatives) {
                movement.alternatives.forEach(alt => {
                    if (alt.geometry) {
                        alt.geometry.forEach(geo => {
                            const coordinates = geo.selection
                                .replace("LINESTRING(", "")
                                .replace(")", "")
                                .split(",")
                                .map(pair => {
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
            if (line.length > 1) {
                DG.polyline(line, {
                    color: 'red',       // Цвет маршрута
                    weight: 4,          // Толщина линии
                    dashArray: '10, 5', // Пунктирная линия: 10px линия, 5px пробел
                    opacity: 0.9        // Прозрачность линии
                }).addTo(map);
            }
        });
    }

    function placeStopsOnMap(routeData) {
        const stopNames = [
            "Посадская", "Белореченская", "Гурзуфская", "Репина", "Институт связи",
            "Центральный стадион", "ТЦ Алатырь", "Театр Волхонка", "Храм Большой Златоуст",
            "Гостиница Центральная", "Дом Кино", "Трансагентство", "Генеральская",
            "Гагарина", "Профессорская", "Педагогическая", "Уралобувь"
        ];
    
        // Список платформ с их координатами
        const platforms = [];
        routeData.movements.forEach(movement => {
            if (movement.alternatives) {
                movement.alternatives.forEach(alt => {
                    if (alt.platforms) {
                        alt.platforms.forEach(platform => {
                            const [lon, lat] = platform.geometry.replace("POINT(", "").replace(")", "").split(" ");
                            platforms.push({ lat: parseFloat(lat), lon: parseFloat(lon) });
                        });
                    }
                });
            }
        });
    
        // Начальная точка маршрута (Посадская)
        const startPoint = { lat: 56.820856, lon: 60.575156 };
    
        // Функция для поиска ближайшей точки к текущей точке
        function findClosestPlatform(currentPoint, remainingPlatforms) {
            let closestPlatform = null;
            let minDistance = Infinity;
    
            remainingPlatforms.forEach(platform => {
                const distance = getDistanceInMeters(currentPoint.lat, currentPoint.lon, platform.lat, platform.lon);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPlatform = platform;
                }
            });
    
            return closestPlatform;
        }
    
        // Упорядочиваем платформы по списку остановок
        const sortedPlatforms = [];
        let currentPoint = startPoint;
        const remainingPlatforms = [...platforms];
    
        stopNames.forEach(stopName => {
            const closestPlatform = findClosestPlatform(currentPoint, remainingPlatforms);
            if (closestPlatform) {
                sortedPlatforms.push({ ...closestPlatform, name: stopName });
                remainingPlatforms.splice(remainingPlatforms.indexOf(closestPlatform), 1);
                currentPoint = closestPlatform;
            }
        });
    
    // Кастомная иконка для маркеров
    const stopIcon = DG.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // URL иконки
        iconSize: [30, 30],       // Размер иконки
        iconAnchor: [15, 30],     // Точка привязки иконки (центр внизу)
        popupAnchor: [0, 0]      // Смещение попапа чуть ниже иконки
    });

    // Добавляем маркеры на карту в правильном порядке
    sortedPlatforms.forEach(platform => {
        DG.marker([platform.lat, platform.lon], { icon: stopIcon })
            .addTo(map)
            .bindPopup(`<div style="font-size: 14px; font-weight: bold; text-align: center;">
                ${platform.name}
            </div>`);
    });
    }
    
    // Функция для расчёта расстояния в метрах
    function getDistanceInMeters(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Радиус Земли в метрах
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
    
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Возвращает расстояние в метрах
    }
    // Функция для очистки карты
    function clearMap() {   
        map.eachLayer(layer => {
            if (layer instanceof DG.Polyline || layer instanceof DG.Marker) {
                map.removeLayer(layer);
            }
        });
    }
});
