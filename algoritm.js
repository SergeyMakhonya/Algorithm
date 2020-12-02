// Операции
const data = [
    {
        datetime: '2020-11-30 12:21',
        sum: -146,
        category: 'Столовая'
    },
    {
        datetime: '2020-11-24 12:50',
        sum: -103,
        category: 'Столовая'
    },
    {
        datetime: '2020-12-02 12:34',
        sum: -214,
        category: 'Столовая'
    },

    {
        datetime: '2020-12-02 19:12',
        sum: -1538,
        category: 'Продукты'
    },
];

// Категории
const categories = [
    'Столовая',
    'Продукты',
    'Проезд',
    'Заправка',
];

// Массив новых операций (массив только для демонстрации работы алгоритма)
const newOperations = [
    {
        datetime: '2020-12-01 12:43',
        sum: -195,
    },
];

// Получаем подходящую категорию для каждой новой операции
for (const newOper of newOperations) {
    console.log(
        'Операция', newOper,
        'Подходящая категория', getCategory(newOper)
    );
}

//---------

function getCategory(newOperation) {
    // 1 этап: узнаём к какой группе операций относится новая операция (доходы или расходы)
    // и выбираем все операции относящиеся к ней
    const moreZero = newOperation.sum > 0;
    const filteredOperations = data.filter((item) => moreZero ? item.sum > 0 : item.sum < 0);

    // 2 этап: находим критерии для каждой из категорий
    const categoriesCritery = categories.map((categoryName) => {
        const operationsFromCategory = filteredOperations.filter((item) => item.category === categoryName);

        return {
            name: categoryName,
            minSum: getMinSum(operationsFromCategory),
            maxSum: getMaxSum(operationsFromCategory),
            minMinutes: getMinMinutes(operationsFromCategory),
            maxMinutes: getMaxMinutes(operationsFromCategory),
            dayOfWeeks: getDayOfWeeks(operationsFromCategory),
        };
    });

    // 3 этап: назначаем баллы по критериям
    const candidats = [...categories].map((categoryName) => ({
        name: categoryName,
        score:
            getScoreSum(newOperation.sum, categoryName)
            + getScoreMinutes(newOperation.datetime, categoryName)
            + getScoreDayOfWeek(newOperation.datetime, categoryName),
    }));

    // 4 этап: выбираем категорию у которой самый максимальный балл
    let maxScoreCategory = null;

    for (const category of candidats) {
        if (!maxScoreCategory || category.score > maxScoreCategory.score) {
            maxScoreCategory = category;
        }
    }

    console.log('Критерии отбора: ', categoriesCritery);
    console.log('Кандидаты: ', candidats);

    return maxScoreCategory.name;
}

// Возвращаем 1 балл, если сумма входит в диапазон сумм указанной категории
function getScoreSum(sum, categoryName) {
    const result = categoriesCritery
        .filter((category) =>
            category.name === categoryName 
            && sum >= category.minSum 
            && sum <= category.maxSum);
    return result.length ? 1 : 0;
}

// Возвращаем 1 балл, если время входит в диапазон времени указанной категории
function getScoreMinutes(datetimeString, categoryName) {
    const minutes = getMinutesFromDateString(datetimeString);
    const result = categoriesCritery
        .filter((category) =>
            category.name === categoryName 
            && minutes >= category.minMinutes 
            && minutes <= category.maxMinutes);
    return result.length ? 1 : 0;
}

// Возвращаем 1 балл, если день недели входит в диапазон дней недель указанной категории
function getScoreDayOfWeek(datetimeString, categoryName) {
    const dayOfWeek = getDayOfWeekFromDateString(datetimeString);
    const result = categoriesCritery
        .filter((category) =>
            category.name === categoryName 
            && category.dayOfWeeks.includes(dayOfWeek));
    return result.length ? 1 : 0;
}

//---------

// Возвращаем минимальную сумму из операций
function getMinSum(operations) {
    if (!Array.isArray(operations) || !operations.length) {
        return 0;
    }

    let minSum = operations[0].sum;
    
    for (const oper of operations) {
        if (oper.sum < minSum) {
            minSum = oper.sum;
        }
    }

    return minSum;
}

// Возвращаем максимальную сумму из операций
function getMaxSum(operations) {
    if (!Array.isArray(operations) || !operations.length) {
        return 0;
    }

    let maxSum = operations[0].sum;
    
    for (const oper of operations) {
        if (oper.sum > maxSum) {
            maxSum = oper.sum;
        }
    }

    return maxSum;
}

// Возвращаем минимальное время в минутах из операций
function getMinMinutes(operations) {
    if (!Array.isArray(operations) || !operations.length) {
        return 0;
    }

    let minMinutes = getMinutesFromDateString(operations[0].datetime);
    
    for (const oper of operations) {
        const minutes = getMinutesFromDateString(oper.datetime);
        if (minutes < minMinutes) {
            minMinutes = minutes;
        }
    }

    return minMinutes;
}

// Возвращаем максимальное время в минутах из операций
function getMaxMinutes(operations) {
    if (!Array.isArray(operations) || !operations.length) {
        return 0;
    }

    let maxMinutes = getMinutesFromDateString(operations[0].datetime);
    
    for (const oper of operations) {
        const minutes = getMinutesFromDateString(oper.datetime);
        if (minutes > maxMinutes) {
            maxMinutes = minutes;
        }
    }

    return maxMinutes;
}

// Возвращаем массив дней недель из операций
function getDayOfWeeks(operations) {
    if (!Array.isArray(operations) || !operations.length) {
        return [];
    }

    const array = [];
    
    for (const oper of operations) {
        const dayOfWeek = getDayOfWeekFromDateString(oper.datetime);

        if (!array.includes(dayOfWeek)) {
            array.push(dayOfWeek);
        }
    }

    return array;
}

// Возвращаем кол-во минут в указанном дне
// Пример:
// dateString = '2020-12-01 12:45'
// вернёт результат выражения 12 * 60 + 45
function getMinutesFromDateString(dateString) {
    const date = new Date(dateString);
    return date.getHours() * 60 + date.getMinutes();
}

// Возвращаем день недели в виде цифры от 0 до 6 (0 - воскресенье, 1 - понедельник)
function getDayOfWeekFromDateString(dateString) {
    const date = new Date(dateString);
    return date.getDay();
}