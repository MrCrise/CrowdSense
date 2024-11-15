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
        const currentDate = new Date()
        const currentWeekDay = weekDays[currentDate.getDay()]
        if (button.getAttribute('data-day').toLowerCase() === currentWeekDay) {
            button.classList.add('active-day');
            document.getElementById('day').textContent = currentWeekDay;
            updateChart(currentWeekDay);
        }
    });
});