DG.then(function () {
    const map = DG.map('map', {
        center: [56.838011, 60.597465],
        zoom: 13
    });

    // References to UI elements for panel interactions
    const loadPanel = document.getElementById('load-panel');
    const schedulePanel = document.getElementById('schedule-panel');
    const openScheduleBtn = document.getElementById('open-schedule-btn');
    const openLoadPanelIcons = document.querySelectorAll('#open-load-panel');
    const backToScheduleBtn = document.getElementById('back-to-schedule-btn');
    const showBusRoute37Btn = document.getElementById('show-bus-route-37');
    const weekDays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const dayButtons = document.querySelectorAll('.day-btn');

    // Attach click event listeners to day buttons to update the chart
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            dayButtons.forEach(btn => btn.classList.remove('active-day'));
            button.classList.add('active-day');
            const selectedDay = button.getAttribute('data-day').toLowerCase();
            updateChart(selectedDay);
        });
    });

    // Fetch and update the chart with bus load data for the selected day
    function updateChart(day) {
        fetch('/static/site/bus_data/bus_load_data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const load_data = data["37"][day];
                const bars = document.querySelectorAll('.bar');
                bars.forEach((bar, index) => {
                    bar.style.height = `${load_data[index]}%`;
                    bar.title = `${load_data[index]}%`;
                });
            })
            .catch(error => console.error('Data processing error:', error));
    }

    // Automatically display chart for the current day of the week
    const currentDay = weekDays[new Date().getDay()];
    document.querySelector(`[data-day="${currentDay}"]`).classList.add('active-day');
    updateChart(currentDay);

    // Add event listeners to manage panel visibility
    openScheduleBtn.addEventListener('click', () => { closeAllPanels(); schedulePanel.style.display = 'block'; });
    backToScheduleBtn.addEventListener('click', () => { closeAllPanels(); schedulePanel.style.display = 'block'; });
    openLoadPanelIcons.forEach(icon => icon.addEventListener('click', () => { closeAllPanels(); loadPanel.style.display = 'block'; }));
    document.getElementById('close-load-panel').addEventListener('click', () => loadPanel.style.display = 'none');
    document.getElementById('close-schedule-panel').addEventListener('click', () => schedulePanel.style.display = 'none');

    // Hide all panels
    function closeAllPanels() {
        loadPanel.style.display = 'none';
        schedulePanel.style.display = 'none';
    }

    // Fetch and display route 37 data on the map
    showBusRoute37Btn.addEventListener('click', () => {
        fetch('/static/site/bus_data/37.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const routeGeometry = data.route_geometry;
                const platforms = data.platforms;
                const platformNames = data.platform_names;

                clearMap();
                displayRouteOnMap(routeGeometry);
                placeStopsOnMap(platforms, platformNames);
            })
            .catch(error => console.error('Data processing error:', error));
    });

    // Render bus routes on the map
    function displayRouteOnMap(geometryList) {
        geometryList.forEach(geometry => {
            const coordinates = geometry
                .replace("LINESTRING(", "")
                .replace(")", "")
                .split(",")
                .map(pair => {
                    const [lon, lat] = pair.trim().split(" ");
                    return [parseFloat(lat), parseFloat(lon)];
                });

            if (coordinates.length > 1) {
                DG.polyline(coordinates, {
                    color: 'red',
                    weight: 4,
                    dashArray: '10, 5',
                    opacity: 0.9
                }).addTo(map);
            }
        });
    }

    // Render bus stops on the map
    function placeStopsOnMap(platforms, platformNames) {
        const stopIcon = DG.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, 0]
        });

        platforms.forEach((platform, index) => {
            const [lon, lat] = platform.geometry.replace("POINT(", "").replace(")", "").split(" ");
            DG.marker([parseFloat(lat), parseFloat(lon)], { icon: stopIcon })
                .addTo(map)
                .bindPopup(`<div style="font-size: 14px; font-weight: bold; text-align: center;">
                    ${platformNames[index] || 'Unnamed Stop'}
                </div>`);
        });
    }

    // Remove all layers from the map
    function clearMap() {
        map.eachLayer(layer => {
            if (layer instanceof DG.Polyline || layer instanceof DG.Marker) {
                map.removeLayer(layer);
            }
        });
    }
});

/*
    // Trolleybus route request
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
        */