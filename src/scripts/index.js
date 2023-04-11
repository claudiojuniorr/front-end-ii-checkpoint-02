const userEmailRef = document.querySelector('#inputEmail')
const userPasswordRef = document.querySelector('#inputPassword')
const buttonRef = document.querySelector('#loginButton')
const olhoRef = document.querySelector('#senhaOlho')

// Signup
var userLogin = {
    email: '',
    password: ''
}

var formErrors = {
    inputEmail: true,
    inputPassword: true,
}

function inputEmailLogin(email){
    userLogin.email = email
}

function inputPasswordLogin(password){
    userLogin.password = password
}

function checkFormValidity(){
    const formErrorsArray = Object.values(formErrors)
    const formValidity = formErrorsArray.every(item => item === false)
    buttonRef.disabled = !formValidity
}

function validarField(inputRef){
    const inputValid = inputRef.checkValidity()
    const div =  inputRef.parentElement.parentElement
    if(inputValid){
        div.classList.remove('error')
    }else{
        div.classList.add('error')
    }
    formErrors[inputRef.id] = !inputValid
    checkFormValidity()

}

function showPassword(event, element, eye) {
    event.preventDefault()
    if (element.type === "password") {
        element.type = "text"
        eye.innerText = 'visibility_off'
    } else {
        element.type = "password"
        eye.innerText = 'visibility'
    }
}


function login(event){
    event.preventDefault()
    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    var requestConfig = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(userLogin)
    }
    fetch('https://todo-api.ctd.academy/v1/users/login', requestConfig).then(
        response => {
            if(response.ok) {
                response.json().then(
                    token => {
                        localStorage.setItem('token', token.jwt)
                        window.location.href = './src/pages/tarefas.html'
                    }
                )
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ops...',
                    text: 'Usuário e/ou senha inválidos',
                })
            }
        }
    )
}

//Email
userEmailRef.addEventListener('keyup', (event) => inputEmailLogin(event.target.value))
userEmailRef.addEventListener('keyup', () => validarField(userEmailRef))

//Password
userPasswordRef.addEventListener('keyup', (event) => inputPasswordLogin(event.target.value))
userPasswordRef.addEventListener('keyup', () => validarField(userPasswordRef))

//Botão
buttonRef.addEventListener('click', (event) => login(event))

olhoRef.addEventListener('click', (event) => showPassword(event, userPasswordRef, olhoRef))