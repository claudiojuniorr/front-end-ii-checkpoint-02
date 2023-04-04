var token = localStorage.getItem('token')
const userRef = document.querySelector('.user')
const buttonRef = document.querySelector('#closeApp')

function getUserData(){
    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    }
    var requestConfig = {
        method: 'GET',
        headers: requestHeaders,
    }

    fetch('https://todo-api.ctd.academy/v1/users/getMe', requestConfig).then(
        response => {
            if(response.ok){
                response.json().then(
                    authentication => {
                        userRef.innerHTML += `        
                        <p>${authentication.firstName}</p>
                        <span class="user-icon material-symbols-outlined">account_circle</span>`
                    }
                )
            }else{
                if(response.status === 401){
                    logout()
                } 
            }
        }
    )
}

function logout(){
    window.location.href = '../../index.html'
    localStorage.clear()
}

function checkingTokenAuthenticity(){
    if (token === null){
        logout()
    }else {
        getUserData()
    }
}

checkingTokenAuthenticity()

buttonRef.addEventListener('click', logout)