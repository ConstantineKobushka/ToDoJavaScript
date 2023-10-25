// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const fullList = document.querySelector('#fullList');
const removeDoneTasks = document.querySelector('#removeDoneTasks');
const removeEveryTasks = document.querySelector('#removeEveryTasks');

let tasks = [];

// Проверяем есть ли данные в localStorage
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  // Отображаем данные из localStorage на странице
  tasks.forEach(function (task) {
    renderTask(task);
  });
}

// Проверка. Если список задач пуст показываем блок "Список дел пуст"
checkEmptyList();

form.addEventListener('submit', addTask); // Добавляем задачи на страницу
tasksList.addEventListener('click', deleteTask); // Удаляем задачи со страницы
tasksList.addEventListener('click', doneTask); // Отмечаем задачу завершонной
removeDoneTasks.addEventListener('click', deleteEveryDoneTask); // Удаляем все выполненые задачи
removeEveryTasks.addEventListener('click', deleteEveryTasks); // Удаляем все выполненые задачи

// Функции
function addTask(event) {
  // Отменяем отправку формы
  event.preventDefault();
  // Достаём текст задачи из поля ввода
  const taskText = taskInput.value.trim();
  if (taskText.length === 0) {
    taskInput.value = '';
    taskInput.focus();
    return;
  }
  // Создаём объект для хранения свойств задачи
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  // Добавляем задачу в масив с задачами
  tasks.push(newTask);
  // Добавляем данные в LocalStorage
  saveToLocalStorage();
  // Рендерим задачу на странице
  renderTask(newTask);
  // Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = '';
  taskInput.focus();
  checkEmptyList();
}

function deleteTask(event) {
  // Проверяем если клик был НЕ по кнопке "удалить задачу"
  if (event.target.dataset.action !== 'delete') return;
  const parenNode = event.target.closest('.list-group__item');
  // Определяем id задачи
  const id = Number(parenNode.id);

  //! Удаляем задачу из масива по индексу
  // Находим индекс задачи в массиве
  // const index = tasks.findIndex(function (task) {
  //   return task.id === id;
  // });
  // Удаляем задачу из масива
  // tasks.splice(index, 1);

  //! Удаляем задачу из масива через метод filter
  tasks = tasks.filter((task) => task.id !== id);

  // Добавляем данные в LocalStorage
  saveToLocalStorage();
  // Удаляем задачу из разметки
  parenNode.remove();
  checkEmptyList();
}

function doneTask(event) {
  // Проверяем что клик был НЕ по кнопке "задача выполнена"
  if (event.target.dataset.action !== 'done') return;
  const parenNode = event.target.closest('.list-group__item');
  // Определяем id задачи
  const id = Number(parenNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;
  // Добавляем данные в LocalStorage
  saveToLocalStorage();

  const taskTtile = parenNode.querySelector('.task-item__title');
  taskTtile.classList.toggle('task-item__title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    fullList.classList.add('list-state__hidden');
    emptyList.classList.remove('list-state__hidden');
  } else if (tasks.length > 0) {
    fullList.classList.remove('list-state__hidden');
    emptyList.classList.add('list-state__hidden');
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  // Формируем CSS класс
  const cssClass = task.done
    ? 'task-item__title task-item__title--done'
    : 'task-item__title';
  // Формируем разметку для новой задачи
  const taskHTML = `
        <li id="${task.id}" class="list-group__item task-item">
          <span class="${cssClass}">${task.text}</span>
          <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
              <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
              <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
          </div>
        </li>`;
  // Добавление задачи на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

function deleteEveryDoneTask() {
  if (tasks.length === 0) return;
  tasks.forEach(function (task) {
    if (task.done === true) {
      const elementsById = document.querySelectorAll(`[id="${task.id}"]`);
      elementsById.forEach(function (element) {
        element.remove();
        tasks = tasks.filter(function (task) {
          return task.done !== true;
        });
      });
    }
  });
  saveToLocalStorage();
  checkEmptyList();
}

function deleteEveryTasks() {
  if (tasks.length === 0) return;
  tasks.forEach(function (task) {
    const elementsById = document.querySelectorAll(`[id="${task.id}"]`);
    elementsById.forEach(function (element) {
      element.remove();
    });
    tasks = tasks.filter(function (task) {
      return task === true;
    });
  });
  saveToLocalStorage();
  checkEmptyList();
}
