const signupNomeRef = document.querySelector('#inputNome')
const signupSobrenomeRef = document.querySelector('#inputSobrenome')
const signupEmailRef = document.querySelector('#inputEmail')
const signupPasswordRef = document.querySelector('#inputPassword')
const signupRepPasswordRef = document.querySelector('#inputRepPassword')
const signupCreateButtonRef = document.querySelector('#createButton')
const valueProgressRef = document.querySelector('progress')
const conditionRef = document.querySelectorAll('small #condicao p b')
const olhoRef = document.querySelector('.olho')
const olhoRepRef = document.querySelector('#repetir')

var user = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
}

var validityFormError = {
    inputNome: true,
    inputSobrenome: true,
    inputEmail: true,
    inputPassword: true,
    inputRepPassword: true,
}

var inputValid = false

function inputNome(nome){
    user.firstName = nome
}

function inputSobrenome(sobrenome){
    user.lastName = sobrenome
}

function inputEmail(email){
    user.email = email
}

function inputPassword(password){
    user.password = password
}

function inputRepPassword(password){
    let repPassword = password
}

function checkForm(){
    const validityFormArray = Object.values(validityFormError)
    const formValidity = validityFormArray.every(item => item === false)
    signupCreateButtonRef.disabled = !formValidity
}

function validityInput(inputRef){
    const inputValid = inputRef.checkValidity()
    const elementFatherRef = inputRef.parentElement 
    if(inputValid){
        elementFatherRef.classList.add('sucesso')
    }else {
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
    }
    validityFormError[inputRef.id] = !inputValid
    checkForm()
}

// verifica se tem caractere especial
function specialChar(password) {
    const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    return regex.test(password)
}

// verifica se tem número
function numeral(password) {
    const regex = /[0-9]/
    return regex.test(password)
}

// verifica se tem letra maiúscula
function uppercase(password) {
    const regex = /[A-Z]/
    return regex.test(password)
}

// verifica se tem letra minúscula
function lowercase(password) {
    const regex = /[a-z]/
    return regex.test(password)
}

// calcula a pontuação da senha com base nos requisitos e retorna um valor entre 0 e 5
function getPasswordStrength(password) {
    let score = 0
    if (password.length >= 8) {
        score += 1
    }
    if (specialChar(password)) {
        score += 1
    }
    if (numeral(password)) {
        score += 1
    }
    if (uppercase(password)) {
        score += 1
    }
    if (lowercase(password)) {
        score += 1
    }
    return score
}

// atualiza os requisitos com base na pontuação da senha e retorna um valor booleano indicando se a senha é válida ou não
function passwordStrength(password) {
    const strength = getPasswordStrength(password)
    const elementFatherRef = signupPasswordRef.parentElement.parentElement
    switch (strength) {
        case 5:
            elementFatherRef.classList.remove("error")
            elementFatherRef.classList.add("sucesso")
            valueProgressRef.classList.add("progress")
            valueProgressRef.value = 100
            inputValid = true
            break
        case 4:
            elementFatherRef.classList.remove("sucesso")
            elementFatherRef.classList.add("error")
            valueProgressRef.classList.remove("progress")
            valueProgressRef.value = 80
            break
        case 3:
            elementFatherRef.classList.remove("sucesso")
            elementFatherRef.classList.add("error")
            valueProgressRef.classList.remove("progress")
            valueProgressRef.value = 60
            break
        case 2:
            elementFatherRef.classList.remove("sucesso")
            elementFatherRef.classList.add("error")
            valueProgressRef.classList.remove("progress")
            valueProgressRef.value = 40
            break
        case 1:
            elementFatherRef.classList.remove("sucesso")
            elementFatherRef.classList.add("error")
            valueProgressRef.classList.remove("progress")
            valueProgressRef.value = 20
            break
        default:
            elementFatherRef.classList.remove("sucesso")
            elementFatherRef.classList.add("error")
            valueProgressRef.classList.remove("progress")
            valueProgressRef.value = 0
    }
}

function markedCondition(password){
    const conditionArray = Array.from(conditionRef)
    const conditions = [password.length >= 8, uppercase(password), lowercase(password), numeral(password), specialChar(password)]
    conditions.forEach((condition, index) => {
        if(condition){
            conditionArray[index].classList.add('line')
        }else{
            conditionArray[index].classList.remove('line')
        }
    })
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


function passwordRequirements(password){
    inputPassword(password)
    passwordStrength(password)
    markedCondition(password)
    validityFormError[signupPasswordRef.id] = !inputValid
    checkForm()
}

function passwordConfirmation(password, elementRef, elementRepPassword){
    inputRepPassword(password)
    if(password === elementRepPassword.value){
        inputValid = true
    }else{
        inputValid = false
    }
    const elementFatherRef = elementRef.parentElement.parentElement
    if (password === user.password){
        elementFatherRef.classList.add('sucesso')
    }else{
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
    }
    validityFormError[elementRef.id] = !inputValid
    checkForm() 
}

function createLogin(event){
    event.preventDefault()
    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    var requestConfig = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(user)
    }
    fetch('https://todo-api.ctd.academy/v1/users', requestConfig).then(
        response => {
            if(response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: "Você foi cadastrado com sucesso!",
                    text: "Clique no botão para voltar para tela de login!",
                    confirmButtonText: 'Login'
                }).then((value) => {
                    if(value.isConfirmed){
                        window.location.href = '../../index.html'
                    }
                }) 
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "Ops...",
                    text: "Este usuário já está em uso.",
                    confirmButtonText: 'Tentar Novamente'
                })

            }
        }
    )
}
//Nome
signupNomeRef.addEventListener('keyup', (event) => inputNome(event.target.value))
signupNomeRef.addEventListener('keyup', () => validityInput(signupNomeRef))

//Sobrenome
signupSobrenomeRef.addEventListener('keyup', (event) => inputSobrenome(event.target.value))
signupSobrenomeRef.addEventListener('keyup', () => validityInput(signupSobrenomeRef))

//Email
signupEmailRef.addEventListener('keyup', (event) => inputEmail(event.target.value))
signupEmailRef.addEventListener('keyup', () => validityInput(signupEmailRef))

//Password
signupPasswordRef.addEventListener('keyup', (event) => passwordRequirements(event.target.value))

//Repetir Password
signupRepPasswordRef.addEventListener('keyup', (event) => passwordConfirmation(event.target.value, signupRepPasswordRef, signupPasswordRef))

//Botão
signupCreateButtonRef.addEventListener('click', (event) => createLogin(event))

olhoRef.addEventListener('click', (event) => showPassword(event, signupPasswordRef, olhoRef))
olhoRepRef.addEventListener('click', (event) => showPassword(event, signupRepPasswordRef, olhoRepRef))
