const signupNomeRef = document.querySelector('#inputNome')
const signupSobrenomeRef = document.querySelector('#inputSobrenome')
const signupEmailRef = document.querySelector('#inputEmail')
const signupPasswordRef = document.querySelector('#inputPassword')
const signupRepPasswordRef = document.querySelector('#inputRepPassword')
const signupCreateButtonRef = document.querySelector('#createButton')

var conta = {
    nome: '',
    sobrenome: '',
    email: '',
    password: '',
    repPassword: ''
}

var validityFormError = {
    inputNome: true,
    inputSobrenome: true,
    inputEmail: true,
    inputPassword: true,
    inputRepPassword: true,
}

function inputNome(nome){
    conta.nome = nome
}

function inputSobrenome(sobrenome){
    conta.sobrenome = sobrenome
}

function inputEmail(email){
    conta.email = email
}

function inputPassword(password){
    conta.password = password
}

function inputRepPassword(password){
    conta.repPassword = password
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
    let strongPassword = /[^a-zA-Z 0-9]+/g.test(password)
    const inputValid = elementRef.checkValidity()
    const elementFatherRef = elementRef.parentElement 
    if (strongPassword){
        elementFatherRef.classList.remove('error')
    }else{
        elementFatherRef.classList.add('error')
    }
    validityFormError[elementRef.id] = !inputValid
    checkForm()
}

function passwordConfirmation(password, elementRef){
    inputRepPassword(password)
    const inputValid = elementRef.checkValidity()
    const elementFatherRef = elementRef.parentElement 
    if (password === conta.password){
        elementFatherRef.classList.remove('error')
    }else{
        elementFatherRef.classList.add('error')
    }
    validityFormError[elementRef.id] = !inputValid
    checkForm()
}

function createLogin(event){
    event.preventDefault()
}

signupNomeRef.addEventListener('keyup', (event) => inputNome(event.target.value))
signupNomeRef.addEventListener('keyup', () => validityInput(signupNomeRef))

signupSobrenomeRef.addEventListener('keyup', (event) => inputSobrenome(event.target.value))
signupSobrenomeRef.addEventListener('keyup', () => validityInput(signupSobrenomeRef))

signupEmailRef.addEventListener('keyup', (event) => inputEmail(event.target.value))
signupEmailRef.addEventListener('keyup', () => validityInput(signupEmailRef))

signupPasswordRef.addEventListener('keyup', (event) => passwordRequirements(event.target.value, signupPasswordRef))

signupRepPasswordRef.addEventListener('keyup', (event) => passwordConfirmation(event.target.value, signupRepPasswordRef))

signupCreateButtonRef.addEventListener('click', (event) =>createLogin(event))