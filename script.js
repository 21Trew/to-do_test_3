class Task {
    constructor(text) {
        this.text = text;
    }

    add() {
        const li = document.createElement('li'),
            taskSpan = document.createElement('span'),
            buttonsDiv = document.createElement('div'),
            addTaskToDoneButton = document.createElement('button'),
            deleteTaskButton = document.createElement('button');

        li.className = 'to-do-list_item';
        taskSpan.className = 'task-to-do';
        taskSpan.textContent = this.text;
        buttonsDiv.className = 'to-do_buttons';
        addTaskToDoneButton.className = "add_task_to_done";
        deleteTaskButton.className = "delete_task";

        buttonsDiv.appendChild(addTaskToDoneButton);
        buttonsDiv.appendChild(deleteTaskButton);
        li.appendChild(taskSpan);
        li.appendChild(buttonsDiv);

        deleteTaskButton.addEventListener('click', () => {
            this.remove(li);
        });

        addTaskToDoneButton.addEventListener('click', () => {
            taskList.taskIsInToDoList(li) ? this.addTaskToDone(li) : this.returnTaskToToDo(li);
        });

        return li;
    }

    remove(taskElement) {
        taskElement.remove();
        uiManager.updateTaskCounts();
    }

    addTaskToDone(taskElement) {
        const doneList = document.querySelector('.is-done-list'),
            index = taskList.tasks.indexOf(taskElement);

        taskElement.className = 'is-done-list_item';
        taskElement.firstChild.className = 'task-is-done';
        taskElement.lastChild.className = 'is-done_buttons';
        taskElement.lastChild.firstChild.className = 'return_task_to_to-do';

        doneList.appendChild(taskElement);

        if (index > -1) {
            taskList.tasks.splice(index, 1);
        }

        uiManager.updateTaskCounts();
        uiManager.saveTasksToLocalStorage();
    }

    returnTaskToToDo(taskElement) {
        const toDoList = document.querySelector('.to-do-list'),
            doneList = document.querySelector('.is-done-list'),
            index = taskList.tasks.indexOf(taskElement);

        taskElement.className = 'to-do-list_item';
        taskElement.firstChild.className = 'task-to-do';
        taskElement.lastChild.className = 'to-do_buttons';
        taskElement.lastChild.firstChild.className = 'add_task_to_done';

        toDoList.appendChild(taskElement);

        if (index > -1) {
            taskList.tasks.splice(index, 1);
        }

        uiManager.updateTaskCounts();
        uiManager.saveTasksToLocalStorage();
    }
}

class TaskList {
    constructor(listType) {
        this.listType = listType;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    addTaskToDone(taskElement) {
        this.doneList.appendChild(taskElement);
        this.updateTaskCounts();
        this.saveTasksToLocalStorage();
    }

    taskIsInToDoList(taskElement) {
        return taskElement.parentElement.classList.contains('to-do-list');
    }
}

class LocalStorageManager {
    constructor() {
        this.localStorage = window.localStorage;
    }

    setItem(key, value) {
        this.localStorage.setItem(key, value);
    }

    getItem(key) {
        return this.localStorage.getItem(key);
    }
}

class UIManager {
    constructor() {
        this.taskInput = document.getElementById('new-task');
        this.toDoList = document.getElementById('to-do-list');
        this.doneList = document.querySelector('.is-done-list');
        this.toDoCount = document.getElementById('to-do-count');
        this.doneCount = document.getElementById('done-count');
    }

    saveTasksToLocalStorage() {
        const tasksToDo = Array.from(this.toDoList.children).map(li => li.firstChild.textContent).join('|'),
            tasksDone = Array.from(this.doneList.children).map(li => li.firstChild.textContent).join('|');

        localStorageManager.setItem('to-do', tasksToDo);
        localStorageManager.setItem('is-done', tasksDone);
    }

    loadTasksFromLocalStorage() {
        const savedToDoTasks = localStorageManager.getItem('to-do'),
            savedDoneTasks = localStorageManager.getItem('is-done');

        if (savedToDoTasks) {
            savedToDoTasks.split('|').forEach(taskText => {
                const newTask = new Task(taskText);

                this.toDoList.appendChild(newTask.add());
            });
        }

        if (savedDoneTasks) {
            savedDoneTasks.split('|').forEach(taskText => {
                const newTask = new Task(taskText),
                    taskElement = newTask.add();

                taskElement.className = 'is-done-list_item';
                taskElement.firstChild.className = 'task-is-done';
                taskElement.lastChild.className = 'is-done_buttons';
                taskElement.lastChild.firstChild.className = 'return_task_to_to-do';

                this.doneList.appendChild(taskElement);
            });
        }

        this.updateTaskCounts();
    }

    addNewTask() {
        const taskText = this.taskInput.value.trim();

        if (taskText !== '') {
            const newTask = new Task(taskText);
            this.taskInput.value = '';
            this.toDoList.appendChild(newTask.add());
            this.updateTaskCounts();
            this.saveTasksToLocalStorage();
        }
    }

    updateTaskCounts() {
        const tasksToDoCount = this.toDoList.children.length,
            tasksDoneCount = this.doneList.children.length,
            toDoCounter = document.querySelector('.to-do_container_task-list_title'),
            doneCounter = document.querySelector('.is-done_container_task-list_title');
    
        if (toDoCounter && doneCounter) {
            toDoCounter.textContent = `Tasks to do -  ${tasksToDoCount}`;
            doneCounter.textContent = `Done -  ${tasksDoneCount}`;
        }
    }

    setupEventListeners() {
        const addNewTaskButton = document.getElementById('add__new-task'),
            newTaskInput = document.getElementById('new-task'),
            doneButtons = document.querySelectorAll('.to-do_buttons button');

        newTaskInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                this.addNewTask();
                this.addNewTask();
            }
        }.bind(this));

        addNewTaskButton.addEventListener('click', this.addNewTask.bind(this));
    }
}

const localStorageManager = new LocalStorageManager(),
    taskList = new TaskList(),
    uiManager = new UIManager(localStorageManager);

uiManager.loadTasksFromLocalStorage();

if (uiManager.toDoCount && uiManager.doneCount) {
    uiManager.updateTaskCounts();
}

uiManager.setupEventListeners();