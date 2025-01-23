DG.then(function () {
    const map = DG.map('map', {
        center: [56.838011, 60.597465],
        zoom: 13
    });

    // References to UI elements for panel interactions.
    const loadPanel = document.getElementById('load-panel');
    const schedulePanel = document.getElementById('schedule-panel');
    const openScheduleBtn = document.getElementById('open-schedule-btn');
    const openLoadPanelIcons = document.querySelectorAll('.people-icon'); // Changed to select all icons
    const backToScheduleBtn = document.getElementById('back-to-schedule-btn');
    const showTransportRoute37Btn = document.getElementById('show-transport-route-37');
    const showTransportRoute50Btn = document.getElementById('show-transport-route-50');
    const showTransportRoute58Btn = document.getElementById('show-transport-route-58');
    const weekDays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const dayButtons = document.querySelectorAll('.day-btn');
    const dayDisplay = document.getElementById('day');

    // Attach click event listeners to day buttons to update the chart.
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            dayButtons.forEach(btn => btn.classList.remove('active-day'));
            button.classList.add('active-day');
            const selectedDay = button.getAttribute('data-day').toLowerCase();
            updateChart(selectedDay);
        });
    });

    let currentTransportNumber = null; // Store the currently selected transport number

    // Fetch and update the chart with transport load data for the selected day and transport.
    function updateChart(day) {
        if (!currentTransportNumber) return; // No transport selected yet
        fetch('/static/site/transport_data/transport_load_data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data[currentTransportNumber] || !data[currentTransportNumber][day]) {
                    console.warn(`Data not found for transport ${currentTransportNumber} on ${day}`);
                    const bars = document.querySelectorAll('.bar');
                     bars.forEach(bar => { bar.style.height = '0%'; bar.title = '0%'; }); // Clear the chart
                    return;
                }

                const load_data = data[currentTransportNumber][day];
                const bars = document.querySelectorAll('.bar');
                bars.forEach((bar, index) => {
                    bar.style.height = `${load_data[index]}%`;
                    bar.title = `${load_data[index]}%`;
                });
            })
            .catch(error => {
                console.error('Data processing error:', error)
                dayDisplay.textContent = `Ошибка загрузки данных`;
            });
    }

    // Automatically display chart for the current day of the week.
    const currentDay = weekDays[new Date().getDay()];
    document.querySelector(`[data-day="${currentDay}"]`).classList.add('active-day');


    // Add event listeners to manage panel visibility.
    openScheduleBtn.addEventListener('click', () => { closeAllPanels(); schedulePanel.style.display = 'block'; });
    backToScheduleBtn.addEventListener('click', () => { closeAllPanels(); schedulePanel.style.display = 'block'; });
    openLoadPanelIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const transportNumber = icon.getAttribute('value');
            currentTransportNumber = transportNumber; // Set the current transport number
            closeAllPanels();
            loadPanel.style.display = 'block';
            updateChart(currentDay); // Update chart when opening the load panel
        });
    });

    document.getElementById('close-load-panel').addEventListener('click', () => loadPanel.style.display = 'none');
    document.getElementById('close-schedule-panel').addEventListener('click', () => schedulePanel.style.display = 'none');

    // Hide all panels.
    function closeAllPanels() {
        loadPanel.style.display = 'none';
        schedulePanel.style.display = 'none';
    }


    showTransportRoute50Btn.addEventListener('click', () => {
        showTransportRoute("50");
    });

    showTransportRoute58Btn.addEventListener('click', () => {
        showTransportRoute("58");
    });
    // Fetch and display route 37 data on the map.
    showTransportRoute37Btn.addEventListener('click', () => {
        showTransportRoute("37");
    });

    function showTransportRoute(route) {
        fetch('/static/site/transport_data/route_data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load data: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const routeGeometry = data[route].route_geometry;
                const platforms = data[route].platforms;
                const platformNames = data[route].platform_names;

                clearMap();
                displayRouteOnMap(routeGeometry);
                placeStopsOnMap(platforms, platformNames);
            })
            .catch(error => console.error('Data processing error:', error));
    }

    // Render transport routes on the map.
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

    function placeStopsOnMap(platforms, platformNames) {
        const stopIcon = DG.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, 0]
        });

        // Создаем объект для быстрого поиска названий по id
        const platformNameMap = {};
        platformNames.forEach((name, index) => {
            platformNameMap[platforms[index]?.id] = name;
        });

        // Расставляем маркеры
        platforms.forEach(platform => {
            const [lon, lat] = platform.geometry.replace("POINT(", "").replace(")", "").split(" ");
            const name = platformNameMap[platform.id] || 'Unnamed Stop';

            DG.marker([parseFloat(lat), parseFloat(lon)], { icon: stopIcon })
                .addTo(map)
                .bindPopup(`<div style="font-size: 14px; font-weight: bold; text-align: center;">
                    ${name}
                </div>`);
        });
    }


    // Remove all layers from the map.
    function clearMap() {
        map.eachLayer(layer => {
            if (layer instanceof DG.Polyline || layer instanceof DG.Marker) {
                map.removeLayer(layer);
            }
        });
    }

});