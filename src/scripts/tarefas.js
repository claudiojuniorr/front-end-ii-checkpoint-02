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

// formatar data
function formatDate(date){
    let dia = date.substring(8, 10)
    let mes = date.substring(5, 7)
    let ano = date.substring(0, 4)
    return `${dia}/${mes}/${ano}`
}

// mostrar tarefas
function taskView(arrayFinish, elementFinish, arrayUnfinish, elementUnfinish){
    
    elementFinish.innerHTML = ''
    for (let taskValue of arrayFinish){
        let dateFinish = taskValue.createdAt
        elementFinish.innerHTML += `
        <li class="tarefa">
            <div class="not-done" onClick="deleteTask(${taskValue.id})"></div>
            <div class="descricao">
                <p class="nome">${taskValue.description}</p>
                <p class="timestamp"><span class="material-symbols-outlined">calendar_month</span>
                ${formatDate(dateFinish)}</p>
            </div>
        </li>
        `
    }    
    elementUnfinish.innerHTML = ''
    for (let taskValue of arrayUnfinish){
        let dateUnfinish = taskValue.createdAt
        elementUnfinish.innerHTML += `
        <li class="tarefa">
            <div class="not-done" onClick="editTask(${taskValue.id})"></div>
            <div class="descricao">
                <p>ID:${taskValue.id}</p>
                <p class="nome">${taskValue.description}</p>
                <p class="timestamp"><span class="material-symbols-outlined">calendar_month</span>
                ${formatDate(dateUnfinish)}</p>
            </div>
        </li>
        `
    }   
}

// coletar tarefas do banco de dados
function getTarefas(){
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
                        taskView(finishedTasks, finishedTasksRef, unfinishedTasks, pendingTasksRef)
                    }
                )
        }
    )
}

// botão para criar uma tarefa
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
    fetch('https://todo-api.ctd.academy/v1/tasks', requestConfig)
    inputNewTaskRef.value = ''
}

// modifica os status da tarefa
function editTask(id){
    for (task of unfinishedTasks){
        if(task.id === id){
            tarefa.description = task.description
            tarefa.completed = true
        }
    }
    finishedTasks.push(tarefa)
    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    }
    var requestConfig = {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify(tarefa)
    }
    fetch(`https://todo-api.ctd.academy/v1/tasks/${id}`, requestConfig)
}

// apaga uma tarefa
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
    fetch(`https://todo-api.ctd.academy/v1/tasks/${id}`, requestConfig) 
}


tarefasRef.addEventListener('keyup', (event) => inputTask(event.target.value))


buttonCreateTaskRef.addEventListener('click', (event) => buttonCreateTask(event), getTarefas())



console.log('terminado', finishedTasks)

console.log('pendente',unfinishedTasks)