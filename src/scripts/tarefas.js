var token = localStorage.getItem('token')
const tarefasRef = document.querySelector('.nova-tarefa')
const buttonCreateTaskRef = document.querySelector('#createTask')
const pendingTasksRef = document.querySelector('.tarefas-pendentes')
const finishedTasksRef = document.querySelector('.tarefas-terminadas')
const inputNewTaskRef = document.querySelector('#novaTarefa')
const buttonTask = document.querySelectorAll('.tarefa .not-done')


var tarefa = {
    description: '',
    completed: false,
}

var finishedTasks = []

var unfinishedTasks = []


function inputTask(task){
    tarefa.description = task
}

// Formata a data para DD/MM/AAAA
function formatDate(date){
    let dia = date.substring(8, 10)
    let mes = date.substring(5, 7)
    let ano = date.substring(0, 4)
    return `${dia}/${mes}/${ano}`
}

// Mostra as tarefas
function taskView(array, element){
    element.innerHTML = ''
    for (let taskValue of array){
        element.innerHTML += `
        <li class="tarefa">
            <div class="not-done">${taskValue.id}</div>
            <div class="descricao">
                <p>ID:${taskValue.id}</p>
                <p class="nome">${taskValue.description}</p>
                <p class="timestamp"><span class="material-symbols-outlined">calendar_month</span>
                ${formatDate(taskValue.createdAt)}</p>
            </div>
        </li>
        `
    }    
}

// Ordena o array de objetos
function sortArray(array){
    array.sort( (a, b) => {
        if(a.id > b.id) return 1
        if(a.id < b.id) return -1
        return 0
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
            swal("Ops!", "Ocorreu um erro, tente novamente!", "error")
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
    for (task of unfinishedTasks){
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
            swal("Ops!", "Ocorreu um erro, tente novamente!", "error")
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
            swal("Ops!", "Ocorreu um erro, tente novamente!", "error")
        }
    })
}

getTarefas()

// Tarefa
tarefasRef.addEventListener('keyup', (event) => inputTask(event.target.value))

// Referência do botão para criar uma tarefa
buttonCreateTaskRef.addEventListener('click', (event) => buttonCreateTask(event))

