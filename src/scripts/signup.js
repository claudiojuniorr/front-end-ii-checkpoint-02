const signupNomeRef = document.querySelector('#inputNome')
const signupSobrenomeRef = document.querySelector('#inputSobrenome')
const signupEmailRef = document.querySelector('#inputEmail')
const signupPasswordRef = document.querySelector('#inputPassword')
const signupRepPasswordRef = document.querySelector('#inputRepPassword')
const signupCreateButtonRef = document.querySelector('#createButton')

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
        elementFatherRef.classList.remove('error')
    }else {
        elementFatherRef.classList.add('error')
    }
    validityFormError[inputRef.id] = !inputValid
    checkForm()
    
}

function passwordRequirements(password, elementRef){
    inputPassword(password)
    let specialCharacter = /[^a-zA-Z 0-9]+/g.test(password)
    let numeral = /[0-9]/.test(password)
    let uppercase = /[A-Z]/.test(password)
    let lowercase = /[a-z]/.test(password)
    let inputValid
    const elementFatherRef = elementRef.parentElement 
    if (specialCharacter && numeral && uppercase && lowercase && password.length > 7){
        elementFatherRef.classList.remove('error')
        inputValid = true
    }else{
        elementFatherRef.classList.add('error')
        inputValid = false
    }
    validityFormError[elementRef.id] = !inputValid
    checkForm()
}

function passwordConfirmation(password, elementRef, elementRepPassword){
    inputRepPassword(password)
    let inputValid
    if(password === elementRepPassword.value){
        inputValid = true
    }else{
        inputValid = false
    }
    const elementFatherRef = elementRef.parentElement 
    if (password === user.password){
        elementFatherRef.classList.remove('error')
    }else{
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
                swal("Você foi cadastrado com sucesso!", "Clique no botão para voltar para tela de login!", "success", {
                    buttons: {
                        catch: {
                            text: "Voltar para tela de login!",
                            value: "msg",
                        }
                    }
                }).then((value) => {
                    switch (value) {
                        case "msg":
                            window.location.href = '../../index.html'
                            break
                    }
                }) 
            } else {
                swal("O usuário ja foi cadastrado!", "Clique no botão para tentar novamente!", "error")
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
signupPasswordRef.addEventListener('keyup', (event) => passwordRequirements(event.target.value, signupPasswordRef))

//Repetir Password
signupRepPasswordRef.addEventListener('keyup', (event) => passwordConfirmation(event.target.value, signupRepPasswordRef, signupPasswordRef))

//Botão
signupCreateButtonRef.addEventListener('click', (event) =>createLogin(event))