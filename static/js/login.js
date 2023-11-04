const urlOrigin = window.location.origin


const loginButton = document.getElementById("login-button")
const loginFormElement = document.getElementById("login-form")
const loginEmailElement = document.getElementById("login-email")
const loginPasswordElement = document.getElementById("login-password")

const signupButton = document.getElementById("signup-button")
const signupFormElement = document.getElementById("signup-form")
const firstNameElement = document.getElementById("signup-first-name")
const lastNameElement = document.getElementById("signup-last-name")
const signupEmailElement = document.getElementById("signup-email")
const signupPasswordElement = document.getElementById("signup-password")



// listen to user input and session storage the input
loginEmailElement.addEventListener("input", () => {
    window.sessionStorage.setItem("loginEmail", loginEmailElement.value)

})
// signup details
firstNameElement.addEventListener("input", () => {
    window.sessionStorage.setItem("firstName", firstNameElement.value)
})
lastNameElement.addEventListener("input", () => {
    window.sessionStorage.setItem("lastName", lastNameElement.value)
})
signupEmailElement.addEventListener("input", () => {
    window.sessionStorage.setItem("signupEmail", signupEmailElement.value)
})

// check if there's already available session storage and write the fields
const loginEmailSession = window.sessionStorage.getItem("loginEmail")
// set login details
loginEmailElement.value = loginEmailSession

const firstNameSession = window.sessionStorage.getItem("firstName")
const lastNameSession = window.sessionStorage.getItem("lastName")
const signupEmailSession = window.sessionStorage.getItem("signupEmail")

// set signup details
firstNameElement.value = firstNameSession
lastNameElement.value = lastNameSession
signupEmailElement.value = signupEmailSession



// login form handling
loginButton.addEventListener("click", (event) => {
    event.preventDefault()

    let email = loginEmailElement.value
    let password = loginPasswordElement.value

    if(!email || !password) {
        let errorDiv = document.createElement("div")
        errorDiv.classList = "error"
        errorDiv.innerHTML = "Email and password are required"

        if(!loginFormElement.hasAttribute("error")) {
            loginFormElement.appendChild(errorDiv)
        }

        loginFormElement.setAttribute("error", "Email and password are required")
        return
    }

    login(email, password)
})


// signup form handling
signupButton.addEventListener("click", async (event) => {
    // disable button for 3 secs
    signupButton.disabled = true
    signupButton.style.cursor = "wait"

    setTimeout(() => {
        signupButton.disabled = false
        signupButton.style.cursor = "pointer"
    }, 3000)

    let firstName = firstNameElement.value
    let lastName = lastNameElement.value
    let email = signupEmailElement.value
    let password = signupPasswordElement.value

    if(!firstName || !lastName || !email || !password) {
      let div = document.createElement("div")
      div.innerHTML = "All fields required"
      div.classList = "error"
      
      signupFormElement.appendChild(div)
    } else {
        signup(firstName, lastName, email, password)
    }

    event.preventDefault()
})




// login function
const login = async (email, password) => {

    const url = `${urlOrigin}/api/login`

    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    
        body: JSON.stringify({email, password})
    })

    if (response.status === 200) {
        window.location = urlOrigin
    } else {
        let data = await response.json()

        let errorDiv = document.createElement("div")
        errorDiv.innerHTML = data.message
        errorDiv.className = "error"

        if(!loginFormElement.hasAttribute("invalid")) {
            loginFormElement.setAttribute("invalid", "Invalid login credentials")
            loginFormElement.appendChild(errorDiv)
        }

    }
}


// signup function
const signup = async(firstName, lastName, email, password) => {
    const url = `${urlOrigin}/api/register`

    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },    
        body: JSON.stringify({firstName, lastName, email, password})
    })

    if (response.status === 201) {
        window.location = urlOrigin
    } else {
        let errorDiv = document.createElement("div")
        errorDiv.innerHTML = "Invalid signup "
        errorDiv.className = "error"

        signupFormElement.appendChild(errorDiv)
    }
}



