var token = localStorage.getItem('token')
const tarefasRef = document.querySelector('.nova-tarefa')
const buttonCreateTaskRef = document.querySelector('#createTask')
const pendingTasksRef = document.querySelector('.tarefas-pendentes')
const finishedTasksRef = document.querySelector('.tarefas-terminadas')
const inputNewTaskRef = document.querySelector('#novaTarefa')


var tarefa = {
    description: '',
    completed: false,
}

var finishedTasks = []

var unfinishedTasks = []


function inputTask(task){
    tarefa.description = task
}

// Mostra as tarefas
function taskView(array, element){
    element.innerHTML = ''
    for (let taskValue of array){
        let date = new Date(taskValue.createdAt)
        element.innerHTML += `
        <li class="tarefa">
            <div class="not-done"></div>
            <div class="descricao">
                <p class="nome">${taskValue.description}</p>
                <p class="timestamp"><span class="material-symbols-outlined">calendar_month</span>
                ${new Intl.DateTimeFormat('pt-BR').format(date)}</p>
            </div>
        </li>
        `
    }    
}

// Ordena o array de objetos
function sortArray(array){
    array.sort( (a, b) => {
        if(a.id > b.id){
            return 1
        }else if(a.id < b.id){
            return -1
        } 
        return 0
    })
}

function addEventListenerTask(){
    const taskUnfinishRef = document.querySelectorAll('.tarefas-pendentes .tarefa')
    const taskFinishRef = document.querySelectorAll('.tarefas-terminadas .tarefa')

    const arrayTaskUnfinishRef = Array.from(taskUnfinishRef)
    arrayTaskUnfinishRef.forEach((item, index) => {
        const taskRef = item.children[0]
        taskRef.addEventListener('click', () => editTask(unfinishedTasks[index].id))
    })
    
    const arrayTaskFinishRef = Array.from(taskFinishRef)
    arrayTaskFinishRef.forEach((item, index) => {
        const taskRef = item.children[0]
        taskRef.addEventListener('click', () => deleteTask(finishedTasks[index].id))
    })
}

// Solicita as tarefas
function getTarefas(){
    finishedTasks = []
    unfinishedTasks = []
    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    }
    var requestConfig = {
        method: 'GET',
        headers: requestHeaders
    }
    fetch('https://todo-api.ctd.academy/v1/tasks', requestConfig).then(
        response => {
                response.json().then(
                    tarefas => {
                        for (let task of tarefas) {
                            if(task.completed){
                                finishedTasks.push(task)
                            }else{
                                unfinishedTasks.push(task)
                            }
                        }
                        sortArray(unfinishedTasks)
                        sortArray(finishedTasks)
                        taskView(unfinishedTasks, pendingTasksRef)
                        taskView(finishedTasks, finishedTasksRef)
                        addEventListenerTask()
                    }
                )
        }
    )
}

// Botão para criar uma tarefa
function buttonCreateTask(event){
    event.preventDefault()
    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    }
    var requestConfig = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(tarefa)
    }
    fetch('https://todo-api.ctd.academy/v1/tasks', requestConfig).then(response => {
        if(response.ok){
            getTarefas()
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocorreu um erro, tente novamente!',
            })
        }
    })
    inputNewTaskRef.value = ''
}

// Modifica os status da tarefa para terminado
function editTask(id){
    const tarefaCompletada = {
        description: '',
        completed: true,
    }
    for (let task of unfinishedTasks){
        if(task.id === id){
            tarefaCompletada.description = task.description
            tarefaCompletada.completed = true
        }
    }
    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    }
    var requestConfig = {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify(tarefaCompletada)
    }
    fetch(`https://todo-api.ctd.academy/v1/tasks/${id}`, requestConfig).then(response => {
        if(response.ok){
            getTarefas()
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocorreu um erro, tente novamente!',
            })
        }
    })
}

// Apaga uma tarefa
function deleteTask(id){
    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    }
    var requestConfig = {
        method: 'DELETE',
        headers: requestHeaders
    }
    fetch(`https://todo-api.ctd.academy/v1/tasks/${id}`, requestConfig).then(response => {
        if(response.ok){
            getTarefas()
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocorreu um erro, tente novamente!',
            })
        }
    })
}

// valida o input
function validarInputTask(event){
    event.preventDefault()
    const inputTask = inputNewTaskRef.value
    if(inputTask.length >= 5){
        buttonCreateTask(event)
    }else{
        Swal.fire({
            icon: 'info',
            title: 'Atenção!',
            text: 'Para criar uma nova tarefa, é necessário que tenha pelo menos 5 caracteres!',
        })
    }
}

getTarefas()

// Tarefa
tarefasRef.addEventListener('keyup', (event) => inputTask(event.target.value))

// Referência do botão para criar uma tarefa
buttonCreateTaskRef.addEventListener('click', (event) => validarInputTask(event))