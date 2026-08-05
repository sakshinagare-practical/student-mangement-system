var taskCount = 0;
var tasks = [];
var globalId;
var currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.dataset.theme = currentTheme;

function updateThemeButton() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    button.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = currentTheme;
    localStorage.setItem('theme', currentTheme);
    updateThemeButton();
}

updateThemeButton();

function addTask() {
    const topicValue = document.getElementById('topic').value.trim();
    const durationValue = document.getElementById('duration').value.trim();
    const targetDateValue = document.getElementById('targetDate').value;
    const notesValue = document.getElementById('notes').value.trim();

    if (document.querySelector('#submit').innerText === 'Edit Topic') {
        let index = tasks.findIndex((task) => task.ID === globalId);
        if (index === -1) {
            return;
        }

        tasks[index] = {
            ...tasks[index],
            topic: topicValue,
            duration: durationValue,
            targetDate: targetDateValue,
            notes: notesValue
        };

        showTable();
        document.querySelector('#submit').innerText = 'Add Topic';
        resetForm();
        return;
    }

    if (topicValue === '' || durationValue === '' || targetDateValue === '') {
        alert('Topic, duration, and target date are required.');
        return;
    }

    taskCount++;
    tasks.push({
        ID: taskCount,
        topic: topicValue,
        duration: durationValue,
        targetDate: targetDateValue,
        notes: notesValue,
        finished: false
    });

    resetForm();
    showTable();
}

function resetForm() {
    document.getElementById('topic').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('targetDate').value = '';
    document.getElementById('notes').value = '';
}

function showTable() {
    const table = document.getElementById('tbody');
    table.innerHTML = '';

    tasks.forEach((task) => {
        const row = document.createElement('tr');

        const id = document.createElement('td');
        const topic = document.createElement('td');
        const duration = document.createElement('td');
        const targetDate = document.createElement('td');
        const notes = document.createElement('td');
        const status = document.createElement('td');
        const actions = document.createElement('td');

        id.textContent = task.ID;
        topic.textContent = task.topic;
        duration.textContent = task.duration;
        targetDate.textContent = task.targetDate;
        notes.textContent = task.notes || '-';

        status.innerHTML = `<span class="status-pill ${task.finished ? 'finished' : 'pending'}">${task.finished ? 'Finished' : 'Pending'}</span>`;
        actions.innerHTML = `
            <button class="action-button" onclick="editTask(${task.ID})">Edit</button>
            <button class="action-button" onclick="toggleFinished(${task.ID})">${task.finished ? 'Undo' : 'Finish'}</button>
            <button class="action-button danger" onclick="deleteTask(${task.ID})">Delete</button>
        `;

        row.appendChild(id);
        row.appendChild(topic);
        row.appendChild(duration);
        row.appendChild(targetDate);
        row.appendChild(notes);
        row.appendChild(status);
        row.appendChild(actions);

        table.appendChild(row);
    });
}

function search() {
    const input = document.getElementById('search');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('tbody');
    const tr = table.getElementsByTagName('tr');

    for (let i = 0; i < tr.length; i++) {
        const tdTopic = tr[i].getElementsByTagName('td')[1];
        const tdNotes = tr[i].getElementsByTagName('td')[4];
        const tdStatus = tr[i].getElementsByTagName('td')[5];

        if (tdTopic || tdNotes || tdStatus) {
            const txtTopic = tdTopic.textContent || tdTopic.innerText;
            const txtNotes = tdNotes.textContent || tdNotes.innerText;
            const txtStatus = tdStatus.textContent || tdStatus.innerText;

            if (
                txtTopic.toUpperCase().indexOf(filter) > -1 ||
                txtNotes.toUpperCase().indexOf(filter) > -1 ||
                txtStatus.toUpperCase().indexOf(filter) > -1
            ) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }
}

function editTask(id) {
    const task = tasks.find((item) => item.ID === id);
    if (!task) {
        return;
    }

    document.querySelector('#topic').value = task.topic;
    document.querySelector('#duration').value = task.duration;
    document.querySelector('#targetDate').value = task.targetDate;
    document.querySelector('#notes').value = task.notes;

    document.getElementById('submit').innerText = 'Edit Topic';
    globalId = id;
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.ID !== id);
    showTable();
}

function toggleFinished(id) {
    const index = tasks.findIndex((task) => task.ID === id);
    if (index === -1) {
        return;
    }

    tasks[index].finished = !tasks[index].finished;
    showTable();
}
