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

        taskList.appendChild(newTaskItem);
        newTaskInput.value = '';
        updateToDoTaskCount();
        deleteTask();
        moveTasks();
    }
}

function setupEventListeners() {
    const addNewTaskButton = document.getElementById('add__new-task');
    const newTaskInput = document.getElementById('new-task');

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
}

document.addEventListener('DOMContentLoaded', function () {
    updateToDoTaskCount();
    updateDoneTaskCount();
    deleteTask();
    moveTasks();
    setupEventListeners();
});