const newTaskInput = document.getElementById('new-task'),
    taskList = document.getElementById('to-do-list'),
    toDoListTitle = document.querySelector('.to-do_container_task-list_title'),
    doneListTitle = document.querySelector('.is-done_container_task-list_title');

function addNewTask() {
    const taskText = newTaskInput.value.trim(),
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
        moveTaskToDone();
    }
}

newTaskInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        addNewTask();
    }
});

const addNewTaskButton = document.getElementById('add__new-task');
addNewTaskButton.addEventListener('click', addNewTask);

function updateToDoTaskCount() {
    const toDoListItems = document.querySelectorAll('.to-do-list_item');
    toDoListTitle.textContent = `Tasks to do - ${toDoListItems.length}`;
}

function updateDoneTaskCount() {
    const doneListItems = document.querySelectorAll('.is-done-list_item');
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

function moveTaskToDone() {
    const addTaskToDoneButtons = document.querySelectorAll('.add_task_to_done');
    addTaskToDoneButtons.forEach(button => {
        button.removeEventListener('click', moveTaskToDoneHandler);
        button.addEventListener('click', moveTaskToDoneHandler);
    });
}

function moveTaskToDoneHandler() {
    const taskItem = this.parentElement.parentElement,
        doneList = document.querySelector('.is-done-list');

    taskItem.classList.remove('to-do-list_item');
    taskItem.classList.add('is-done-list_item');
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
        toDoList = document.getElementById('to-do-list');

    taskItem.classList.remove('is-done-list_item');
    taskItem.classList.add('to-do-list_item');
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
    moveTaskToDone();
});