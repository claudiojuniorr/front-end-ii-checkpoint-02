const signupNomeRef = document.querySelector('#inputNome')
const signupSobrenomeRef = document.querySelector('#inputSobrenome')
const signupEmailRef = document.querySelector('#inputEmail')
const signupPasswordRef = document.querySelector('#inputPassword')
const signupRepPasswordRef = document.querySelector('#inputRepPassword')
const signupCreateButtonRef = document.querySelector('#createButton')
const valueProgressRef = document.querySelector('progress')


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

var inputValid

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

function checkPassword(elementFatherRef, special, numeral, uppercase,lowercase, password){
    
    if (special && numeral && uppercase && lowercase && password.length > 7){
        elementFatherRef.classList.remove('error')
        elementFatherRef.classList.add('sucesso')
        valueProgressRef.classList.add('progress')
        valueProgressRef.value = 100
        inputValid = true
    }else if (special && numeral && uppercase || special && numeral && lowercase || special && numeral && password.length > 7 || numeral && password.length > 7 && uppercase){
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
        valueProgressRef.value = 75
        inputValid = false
    }else if (special && uppercase && lowercase || special && uppercase && password.length > 7 || special && password.length > 7 && lowercase){
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
        valueProgressRef.value = 75
        inputValid = false
    }else if (numeral && uppercase && lowercase || numeral && lowercase && password.length > 7 || uppercase && lowercase && password.length > 7){
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
        valueProgressRef.value = 75
        inputValid = false
    }else if (special && password.length > 7 || numeral && lowercase || special && numeral){
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
        valueProgressRef.value = 50
        inputValid = false
    }else if (special && uppercase || numeral && uppercase || uppercase && lowercase || special && lowercase){
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
        valueProgressRef.value = 50
        inputValid = false
    }else if (numeral && password.length > 7 || uppercase && password.length > 7 || lowercase && password.length > 7){
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
        valueProgressRef.value = 50
        inputValid = false
    }else if (special || numeral || uppercase || lowercase || password.length > 7){
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
        valueProgressRef.value = 25
        inputValid = false
    }else{
        elementFatherRef.classList.remove('sucesso')
        elementFatherRef.classList.add('error')
        valueProgressRef.value = 0
        inputValid = false
    }
}

function passwordRequirements(password, elementRef){
    inputPassword(password)
    let specialCharacter = /[^a-zA-Z 0-9]+/g.test(password)
    let numeral = /[0-9]/.test(password)
    let uppercase = /[A-Z]/.test(password)
    let lowercase = /[a-z]/.test(password)
    
    const elementFatherRef = elementRef.parentElement 
    checkPassword(elementFatherRef, specialCharacter, numeral, uppercase, lowercase, password)
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
signupPasswordRef.addEventListener('keyup', (event) => passwordRequirements(event.target.value, signupPasswordRef))

//Repetir Password
signupRepPasswordRef.addEventListener('keyup', (event) => passwordConfirmation(event.target.value, signupRepPasswordRef, signupPasswordRef))

//Botão
signupCreateButtonRef.addEventListener('click', (event) =>createLogin(event))

