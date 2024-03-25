function saveTasksToLocalStorage(listType) {
    const taskItems = document.querySelectorAll(`.${listType}-list_item`),
        tasks = Array.from(taskItems).map(item => item.textContent).join(',');
    localStorage.setItem(listType, tasks);
}

function savedToDoTasks() {
    const savedToDoTasks = localStorage.getItem('to-do');
    if (savedToDoTasks) {
        const toDoList = document.getElementById('to-do-list');
        savedToDoTasks.split(',').forEach(taskText => {
            const newTaskItem = document.createElement('li');
            newTaskItem.classList.add('to-do-list_item');
            newTaskItem.innerHTML = `
                <span class="task-to-do">${taskText}</span>
                <div class="to-do_buttons">
                    <button class="add_task_to_done"></button>
                    <button class="delete_task"></button>
                </div>
            `;
            toDoList.appendChild(newTaskItem);
        });
    }
}

function savedDoneTasks() {
    const savedDoneTasks = localStorage.getItem('is-done');
    if (savedDoneTasks) {
        const doneList = document.querySelector('.is-done-list');
        savedDoneTasks.split(',').forEach(taskText => {
            const newTaskItem = document.createElement('li');
            newTaskItem.classList.add('is-done-list_item');
            newTaskItem.innerHTML = `
                <span class="task-is-done">${taskText}</span>
                <div class="is-done_buttons">
                    <button class="return_task_to_to-do"></button>
                    <button class="delete_task"></button>
                </div>
            `;
            doneList.appendChild(newTaskItem);
        });
    }
}

function addNewTask() {
    const newTaskInput = document.getElementById('new-task'),
        taskText = newTaskInput.value.trim(),
        taskList = document.getElementById('to-do-list'),
        newTaskItem = document.createElement('li');

    if (taskText !== '') {
        newTaskItem.classList.add('to-do-list_item');
        newTaskItem.innerHTML = `
            <span class="task-to-do">${taskText}</span>
            <div class="to-do_buttons">
                <button class="add_task_to_done"></button>
                <button class="delete_task"></button>
            </div>
        `;

        taskList.insertAdjacentHTML('beforeend', newTaskItem.outerHTML);

        newTaskInput.value = '';
        updateToDoTaskCount();
        deleteTask();
        moveTasks();
        editTask();
        saveTasksToLocalStorage('to-do');
    }
}

function setupEventListeners() {
    const addNewTaskButton = document.getElementById('add__new-task'),
        newTaskInput = document.getElementById('new-task');

    newTaskInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            addNewTask();
        }
    });

    addNewTaskButton.addEventListener('click', addNewTask);
}

function updateToDoTaskCount() {
    const toDoListItems = document.querySelectorAll('.to-do-list_item'),
        toDoListTitle = document.querySelector('.to-do_container_task-list_title');
    toDoListTitle.textContent = `Tasks to do - ${toDoListItems.length}`;
}

function updateDoneTaskCount() {
    const doneListItems = document.querySelectorAll('.is-done-list_item'),
        doneListTitle = document.querySelector('.is-done_container_task-list_title');
    doneListTitle.textContent = `Done - ${doneListItems.length}`;
}

function deleteTask() {
    const deleteTaskButtons = document.querySelectorAll('.delete_task');
    deleteTaskButtons.forEach(button => {
        button.removeEventListener('click', deleteTaskHandler);
        button.addEventListener('click', deleteTaskHandler);
    });
}

function deleteTaskHandler() {
    this.parentElement.parentElement.remove();
    updateToDoTaskCount();
    updateDoneTaskCount();
}

function moveTasks() {
    const addTaskToDoneButtons = document.querySelectorAll('.add_task_to_done'),
        returnTaskToToDoButtons = document.querySelectorAll('.return_task_to_to-do');

    addTaskToDoneButtons.forEach(button => {
        button.removeEventListener('click', moveTaskToDoneHandler);
        button.addEventListener('click', moveTaskToDoneHandler);
    });

    returnTaskToToDoButtons.forEach(button => {
        button.removeEventListener('click', returnTaskToToDoHandler);
        button.addEventListener('click', returnTaskToToDoHandler);
    });
}

function moveTaskToDoneHandler() {
    const taskItem = this.parentElement.parentElement,
        taskTextSpan = taskItem.querySelector('.task-to-do'),
        taskButtonsDiv = taskItem.querySelector('.to-do_buttons'),
        doneList = document.querySelector('.is-done-list');

    taskItem.classList.remove('to-do-list_item');
    taskItem.classList.add('is-done-list_item');

    taskTextSpan.classList.remove('task-to-do');
    taskTextSpan.classList.add('task-is-done');

    taskButtonsDiv.classList.remove('to-do_buttons');
    taskButtonsDiv.classList.add('is-done_buttons');
    
    doneList.appendChild(taskItem);

    this.classList.remove('add_task_to_done');
    this.classList.add('return_task_to_to-do');
    this.removeEventListener('click', moveTaskToDoneHandler);
    this.addEventListener('click', returnTaskToToDoHandler);

    updateToDoTaskCount();
    updateDoneTaskCount();
    saveTasksToLocalStorage('to-do');
    saveTasksToLocalStorage('is-done');
}

function returnTaskToToDoHandler() {
    const taskItem = this.parentElement.parentElement,
        taskTextSpan = taskItem.querySelector('.task-is-done'),
        taskButtonsDiv = taskItem.querySelector('.is-done_buttons'),
        toDoList = document.getElementById('to-do-list');

    taskItem.classList.remove('is-done-list_item');
    taskItem.classList.add('to-do-list_item');

    taskTextSpan.classList.remove('task-is-done');
    taskTextSpan.classList.add('task-to-do');

    taskButtonsDiv.classList.remove('is-done_buttons');
    taskButtonsDiv.classList.add('to-do_buttons');

    toDoList.appendChild(taskItem);

    this.classList.remove('return_task_to_to-do');
    this.classList.add('add_task_to_done');
    this.removeEventListener('click', returnTaskToToDoHandler);
    this.addEventListener('click', moveTaskToDoneHandler);

    updateToDoTaskCount();
    updateDoneTaskCount();
    saveTasksToLocalStorage('to-do');
    saveTasksToLocalStorage('is-done');
}

function editTask() {
    const taskItems = document.querySelectorAll('.to-do-list_item, .is-done-list_item');

    taskItems.forEach(item => {
        const taskTextSpan = item.querySelector('.task-to-do, .task-is-done');
        taskTextSpan.addEventListener('click', function () {
            taskTextSpan.contentEditable = true;
            taskTextSpan.focus();
        });

        taskTextSpan.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                taskTextSpan.blur();
            }
        });

        taskTextSpan.addEventListener('blur', function () {
            taskTextSpan.contentEditable = false;
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    savedToDoTasks();
    savedDoneTasks();
    saveTasksToLocalStorage('to-do');
    saveTasksToLocalStorage('is-done');
    updateToDoTaskCount();
    updateDoneTaskCount();
    deleteTask();
    moveTasks();
    setupEventListeners();
    editTask();
});