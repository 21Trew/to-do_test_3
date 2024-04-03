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

        return li;
    }

    remove(taskElement) {
        taskElement.remove();
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

    moveTaskToDone(task) {
        this.tasks = this.tasks.filter(t => t !== task);
        this.doneTasks.push(task);
    }
}

class LocalStorageManager {
    constructor() {
        this.localStorage = {};
    }

    setItem(key, value) {
        this.localStorage[key] = value;
    }

    getItem(key) {
        return this.localStorage[key];
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
        const tasksToDo = Array.from(this.toDoList.children).map(li => li.firstChild.textContent).join(','),
            tasksDone = Array.from(this.doneList.children).map(li => li.firstChild.textContent).join(',');

        localStorageManager.setItem('to-do', tasksToDo);
        localStorageManager.setItem('is-done', tasksDone);
    }

    loadTasksFromLocalStorage() {
        const savedToDoTasks = localStorageManager.getItem('to-do'),
            savedDoneTasks = localStorageManager.getItem('is-done');

        if (savedToDoTasks) {
            savedToDoTasks.split(',').forEach(taskText => {
                const newTask = new Task(taskText);
                this.toDoList.appendChild(newTask.add());
            });
        }

        if (savedDoneTasks) {
            savedDoneTasks.split(',').forEach(taskText => {
                const newTask = new Task(taskText);
                this.doneList.appendChild(newTask.add());
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
        if (this.toDoCount && this.doneCount) {
            this.toDoCount.textContent = this.toDoList.children.length;
            this.doneCount.textContent = this.doneList.children.length;
        }
    }

    setupEventListeners() {
        const addNewTaskButton = document.getElementById('add__new-task'),
            newTaskInput = document.getElementById('new-task'),
            doneButtons = document.querySelectorAll('.to-do_buttons button');

        newTaskInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                this.addNewTask();
            }
        }.bind(this));

        addNewTaskButton.addEventListener('click', this.addNewTask.bind(this));
    }
}

// Создание экземпляров классов и инициализация
const localStorageManager = new LocalStorageManager();
const uiManager = new UIManager();

// Инициализация списка задач
uiManager.loadTasksFromLocalStorage();

if (uiManager.toDoCount && uiManager.doneCount) {
    uiManager.updateTaskCounts();
}

uiManager.setupEventListeners();