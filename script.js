class Task {
    constructor(value) {
        this.value = value;
        this.isDone = false;
    }

    change(newValue) {
        this.value = newValue;
        editTask();
    }

    done() {
        this.isDone = true;
    }
}

class TaskList {
    constructor() {
        this.tasks = [];
    }

    addTask(value) {
        const newTask = new Task(value);
        this.tasks.push(newTask);
        return newTask;
    }

    deleteTask(task) {
        const taskIndex = this.tasks.indexOf(task);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
        }
    }
}

const taskList = new TaskList();

function addNewTask(taskList) {
    const inputElement = document.querySelector('.new-task'),
        taskListElement = document.querySelector('.task-list.to-do-list'),
        taskText = inputElement.value,
        newTask = taskList.addTask(taskText),
        taskElement = document.createElement('li'),
        taskTextSpan = document.createElement('span'),
        buttonsDiv = document.createElement('div'),
        doneButton = document.createElement('button'),
        deleteButton = document.createElement('button');

    if (taskText.trim() === '') {
        return;
    }

    taskElement.classList.add('to-do-list_item');

    taskTextSpan.classList.add('task-to-do');
    taskTextSpan.textContent = newTask.value;

    buttonsDiv.classList.add('to-do_buttons');

    doneButton.classList.add('add_task_to_done');

    deleteButton.classList.add('delete_task');

    buttonsDiv.appendChild(doneButton);
    buttonsDiv.appendChild(deleteButton);

    taskElement.appendChild(taskTextSpan);
    taskElement.appendChild(buttonsDiv);

    taskListElement.appendChild(taskElement);

    inputElement.value = '';

    taskTextSpan.addEventListener('click', function () {
        taskTextSpan.contentEditable = true;
        taskTextSpan.focus();
    });

    taskTextSpan.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior of adding a new line
            taskTextSpan.blur();
            event.stopPropagation();
        }
    });

    taskTextSpan.addEventListener('blur', function () {
        taskTextSpan.contentEditable = false;
    });
}
function editTask() {
    const taskItems = document.querySelectorAll('.to-do-list_item, .is-done-list_item');

    taskItems.forEach(item => {
        const taskTextSpan = item.querySelector('.task-to-do, .task-is-done');
        if (taskTextSpan) {
            console.log(taskTextSpan);
            taskTextSpan.addEventListener('click', function () {
                taskTextSpan.contentEditable = true;
                taskTextSpan.focus();
            });

            taskTextSpan.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent the default behavior of adding a new line
                    taskTextSpan.blur();
                    event.stopPropagation();
                }
            });

            taskTextSpan.addEventListener('blur', function () {
                taskTextSpan.contentEditable = false;
            });
        }
    });
}

function setupEventListeners() {
    const addNewTaskButton = document.getElementById('add__new-task');
    const newTaskInput = document.getElementById('new-task');

    newTaskInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            addNewTask(taskList);
        }
    });

    addNewTaskButton.addEventListener('click', () => addNewTask(taskList));
}

setupEventListeners();
    editTask();