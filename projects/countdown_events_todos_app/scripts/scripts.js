const timeDiv = document.querySelector('.time');
const dateDiv = document.querySelector('.date');
const weekDiv = document.querySelector('.week');
const countdownTimeDiv = document.querySelector('.countdown-time');
const targetDateInput = document.getElementById('targetDate');
const calendarHead = document.getElementById('calendar-head');
const calendarBody = document.getElementById('calendar-body');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const currentMonthSpan = document.getElementById('current-month');

const addEventButton = document.getElementById('add-event-button');

const eventTitleInput = document.getElementById('event-title');

const sortOrderSelect = document.getElementById('sort-order');
const eventListItems = document.getElementById('event-list-items');

const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');

const addTodoButton = document.getElementById('add-todo-button');
const todoTitleInput = document.getElementById('todo-title');
const todoDescriptionInput = document.getElementById('todo-description');
const todoEndDateInput = document.getElementById('todo-end-date');
const todoListItems = document.getElementById('todo-list-items');

const now = new Date();
let currentYear = now.getFullYear();
let currentMonth = now.getMonth();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let events = JSON.parse(localStorage.getItem('events')) || [];
const itemsPerPage = 5;
let currentPage = 1;

const storedTargetDate = localStorage.getItem('targetDate');
if (storedTargetDate) {
    targetDateInput.value = storedTargetDate;
}

// Store to-do items in an array (consider using local storage for persistence)
let todos = loadTodosFromLocalStorage(); // Load from local storage

addTodoButton.addEventListener('click', () => {
    const title = todoTitleInput.value.trim();
    const description = todoDescriptionInput.value.trim();
    const endDate = todoEndDateInput.value;

    if (title === '') {
        alert('Please enter a title for the to-do item.');
        return;
    }

    const newTodo = {
        id: Date.now(), // Unique ID for each to-do item
        title,
        description,
        endDate,
        completed: false,
        addedTime: new Date() // Store the time the to-do item was added
    };
    todos.push(newTodo);
    saveTodosToLocalStorage();
    renderTodoList();

    todoTitleInput.value = '';
    todoDescriptionInput.value = '';
    todoEndDateInput.value = '';
});

function renderTodoList() {
    todoListItems.innerHTML = '';

    // Sort to-do items
    sortTodos();

    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
            <h4>${todo.title}</h4>
            <p>${todo.description}</p>
            <p>End Date: ${todo.endDate ? todo.endDate : 'N/A'}</p>
        `;

        // Add edit and delete buttons
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => {
            editTodo(todo.id);
        });
        listItem.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'x';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            deleteTodo(todo.id);
        });
        listItem.appendChild(deleteButton);

        todoListItems.appendChild(listItem);
    });

    // Add event listeners to checkboxes
    const checkboxes = document.querySelectorAll('.todo-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const todoId = parseInt(checkbox.dataset.id);
            toggleTodoCompleted(todoId);
        });
    });
}

function sortTodos() {
    todos.sort((a, b) => {
        // Sort completed items to the bottom
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        // Sort by deadline date (ascending)
        const dateA = a.endDate ? new Date(a.endDate) : new Date(8640000000000000); // Max date if no deadline
        const dateB = b.endDate ? new Date(b.endDate) : new Date(8640000000000000);
        if (dateA !== dateB) {
            return dateA - dateB;
        }

        // If deadlines are the same, sort by added time (ascending)
        return a.addedTime - b.addedTime;
    });
}

function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        const newTitle = prompt("Enter new title:", todo.title);
        if (newTitle !== null && newTitle.trim() !== '') {
            todo.title = newTitle.trim();
            saveTodosToLocalStorage();
            renderTodoList();
        }
    }
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToLocalStorage();
    renderTodoList();
}

function toggleTodoCompleted(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodosToLocalStorage();
        renderTodoList();
    }
}

function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}

prevMonthButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;

    }
    updateCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();

});

function getSelectedDate() {
    const selectedCell = document.querySelector('#calendar-body td.selected');
    if (selectedCell) {
        const day = selectedCell.innerHTML;
        return new Date(currentYear, currentMonth, day);
    } else {
        return null
    }
}

function updateCalendar() {
    // Get the first day of the month and the number of days in the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create table header with day names
    calendarHead.innerHTML = ''; // Clear previous header
    const tr = document.createElement('tr');
    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        tr.appendChild(th);
    });
    calendarHead.appendChild(tr);

    // Create table body with calendar days
    calendarBody.innerHTML = ''; // Clear previous calendar body
    let date = 1;
    for (let i = 0; i < 6; i++) { // Max 6 weeks per month
        const tr = document.createElement('tr'); // create TR of the calendar body

        for (let j = 0; j < 7; j++) { // Max 7 days per week
            const td = document.createElement('td');

            if (i === 0 && j < firstDayOfMonth.getDay()) {
                td.innerHTML = ''; // Empty cells for days before the 1st of the month
            } else if (date > daysInMonth) {
                td.innerHTML = ''; // Empty cells for days after the last day of the month
            } else {
                td.innerHTML = date;

                // Check if this cell represents the currently selected date
                const selectedDate = getSelectedDate();
                if (selectedDate &&
                    date === selectedDate.getDate() &&
                    currentMonth === selectedDate.getMonth() &&
                    currentYear === selectedDate.getFullYear()
                ) {
                    td.classList.add('selected');
                    eventTitleInput.focus();
                }

                // Highlight today's date only if no other date is selected
                if (!selectedDate && // Only highlight today if no other date is selected
                    date === now.getDate() &&
                    currentMonth === now.getMonth() &&
                    currentYear === now.getFullYear()
                ) {
                    td.classList.add('today');
                }

                date++;

                td.addEventListener('click', () => {
                    if (td.textContent !== '') {
                        // Deselect any currently selected cell
                        const currentlySelected = document.querySelector('#calendar-body td.selected');
                        if (currentlySelected) {
                            currentlySelected.classList.remove('selected');
                        }

                        // Select the clicked cell
                        td.classList.add('selected');
                        eventTitleInput.focus();
                    } else {
                        alert('Please select an available day.')
                    }
                });
            }
            tr.appendChild(td);
        }
        calendarBody.appendChild(tr);
    }

    // Update the current month display
    currentMonthSpan.textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

function saveEventsToLocalStorage() {
    localStorage.setItem('events', JSON.stringify(events));
}

function sortEvents() {
    const order = sortOrderSelect.value;
    events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (order === 'asc') {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });
}

function editEvent(index) {
    const event = events[index];
    const newTitle = prompt("Enter new title:", event.title); // Use a prompt for simplicity

    if (newTitle !== null && newTitle.trim() !== '') {
        event.title = newTitle.trim();
        saveEventsToLocalStorage();
        renderEventList();
    } else {
        alert('Please enter new event title');
    }
}

function deleteEvent(index) {
    events.splice(index, 1); // Remove the event from the array
    saveEventsToLocalStorage();
    renderEventList(); // Re-render the list to reflect the changes
}

function renderEventList() {
    sortEvents();
    eventListItems.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const eventsToDisplay = events.slice(startIndex, endIndex);

    eventsToDisplay.forEach((event, index) => {
        const tr = document.createElement('tr');
        const tdDate = document.createElement('td');
        const tdTitle = document.createElement('td');
        const tdActions = document.createElement('td');

        // Add event date
        const eventDate = new Date(event.date);
        tdDate.textContent = eventDate.toDateString();
        tr.appendChild(tdDate);

        // Add event title
        tdTitle.textContent = event.title;
        tr.appendChild(tdTitle);

        // Add the `Edit` button
        const editBtn = document.createElement('button');
        editBtn.innerHTML = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => {
            editEvent(startIndex + index);
        });
        tdActions.appendChild(editBtn);

        // Add the `Delete` button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteEvent(startIndex + index);
        });
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);

        eventListItems.appendChild(tr);
    });

    // Update pagination controls
    const totalPages = Math.ceil(events.length / itemsPerPage);
    currentPageSpan.textContent = currentPage;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;

        renderEventList();
    }
});

nextPageButton.addEventListener('click', () => {
    const totalPages = Math.ceil(events.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderEventList();
    }
});

addEventButton.addEventListener('click', () => {
    const selectedDate = getSelectedDate(); // Get the selected date from the calendar
    if (selectedDate && eventTitleInput.value.trim() !== '') {
        const newEvent = {
            date: selectedDate,
            title: eventTitleInput.value.trim()
        };
        events.push(newEvent);
        saveEventsToLocalStorage(); // Save events to local storage
        renderEventList();
        eventTitleInput.value = ''; // Clear the input
    } else {
        alert('Please select a day and enter the event title.');
    }
});

function updateAnalogClock() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours * 30) + (minutes / 2); // 360/12 = 30 degrees per hour, plus minute adjustment
    const minuteDeg = minutes * 6; // 360/60 = 6 degrees per minute
    const secondDeg = seconds * 6; // 360/60 = 6 degrees per second

    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;
}

function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds
        : seconds;

    const timeString = `${hours}:${minutes}:${seconds}`;

    timeDiv.textContent = timeString;

    // Format the date as yyyy-mm-dd
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    dateDiv.textContent = dateString;

    // Calculate and display the week number
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - firstDayOfYear) / (24 * 60 * 60 * 1000);
    const weekNo = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    weekDiv.textContent = `Week ${weekNo}`;
}

function updateCountdown() {
    const targetDate = new Date(targetDateInput.value);
    const now = new Date();

    // Prevent selecting past dates
    targetDateInput.min = now.toISOString().split('T')[0];

    if (targetDate > now) {
        const timeDiff = targetDate - now;

        const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000
            * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);


        // Dynamic plurals and handling zeros
        const weekPart = weeks > 0 ? `${weeks} ${weeks === 1 ? 'week' : 'weeks'}` : '';
        const dayPart = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '';
        const hourPart = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';
        const minutePart = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '';
        const secondPart = seconds > 0 ? `${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : '';

        // Join the parts with spaces, filtering out empty parts
        const countdownString = [weekPart, dayPart, hourPart, minutePart, secondPart]
            .filter(part => part !== '')
            .join('<br>');
        countdownTimeDiv.innerHTML = countdownString;
    } else {
        countdownTimeDiv.innerHTML = "Countdown Expired!";
    }
}

// Update countdown when target date is changed
targetDateInput.addEventListener('change', () => {
    updateCountdown();
    localStorage.setItem('targetDate', targetDateInput.value);
});
// Add event listener to the sort order select
sortOrderSelect.addEventListener('change', () => {
    renderEventList(); // Re-render the list when sort order changes
});

// Update the time and countdown initially
updateTime();
// Call updateCountdown() initially and in your interval
updateCountdown();
// Call updateAnalogClock() initially and in your interval
updateAnalogClock();
// Call updateCalendar() initially and in your interval
updateCalendar();
// Call renderEventList() initially to display any existing events
renderEventList();
// Call renderTodoList() initially to display any existing to-do items
renderTodoList();

// Update the time and countdown every second
setInterval(() => {
    updateTime(); // Update digital clock
    updateCountdown(); // Update countdown
    updateAnalogClock(); // Update analog clock
}, 1000);
