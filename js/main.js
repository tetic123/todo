//находим элементы на странице

const form = document.querySelector('#form'); // ищет элемент по селектору как в css
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = []; // тут будут хранится объекты задач с их данными

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task))
}

checkEmptyList()

//добавление задачи
form.addEventListener('submit',addTask) // передаем без вызова, иначе она будет запущена сразу,
                                        //а так после submit

//удаление задачи

//Мы не можем сразу найти кнопку, потому что ее еще нет
//тк мы создаем новые задачи, их не было на странице. Поэтому отслеживаем
//клик по самому списку
tasksList.addEventListener('click', deleteTask)

//отмечаем задачу выполненной
tasksList.addEventListener('click', doneTask)

//Functions
function addTask(event){ // 2 аргумента (событие, колбэк)
    //функции должны называться глаголом, просто переменные - существ
    //чтобы можно было вызывать до объявления - function declaration
    event.preventDefault() // отменяет стандартное поведение при отправке формы
    // например, перезагрузку страницы

    // достаем текст из input
    const taskText = taskInput.value

    //Опис ываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    //Добавляем задачу в массив с задачами
    tasks.push(newTask);

    //рендерим задачу на страницу
    renderTask(newTask);

    //очищаем инпут и оставляем фокус
    taskInput.value = '';
    taskInput.focus();
    
    //скрываем empty list если есть задачи
    checkEmptyList()
    saveToLocalStorage()
}
function deleteTask(event){
    //проверяем если клик был не по кнопке удалить
    if(event.target.dataset.action !== 'delete') return // функция завершит работу

    // чтобы удалить, находим тег li, в коготорый она вложена и удалим его
    const parentNode = event.target.closest('.list-group-item') //ищет среди родителей по селектору
    
    //определяем ID
    const id = Number(parentNode.id);

    //удаляем из массива
    tasks = tasks.filter((task) => task.id !== id);

    //удаляем из разметки
    parentNode.remove()

    // удалить "список дел пуст" если нет задач
    checkEmptyList()
    saveToLocalStorage()
}
function doneTask(event){
    //проверяем, что клик не по кнопке done
    if(event.target.dataset.action !== 'done') return

    // чтобы удалить, находим тег li, в коготорый она вложена и удалим его
    const parentNode = event.target.closest('.list-group-item')
    const taskTitle = parentNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done'); //добавит класс если его там нет, если есть - уберет
    
    //Определяем ID
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;
    saveToLocalStorage()
}
function checkEmptyList(){
    if (tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if(tasks.length > 0){
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null; // это делается, чтобы проверить есть ли он на странице
                                                   // иначе будет ошибка. Если не найдем, emptyListEl будет null, т.е false
    }
}
function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}
function renderTask(task){
    //формируем css класс
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    const taskHTML = `
        <li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
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
    
    //добавляем на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML); //2 агумента (куда, кусок разметки)
}