const urlOrigin = window.location.origin

const socket = io()

const input = document.getElementById("send-message-input")
const formButton = document.getElementById("send-message-button")
const chat = document.getElementById("chat")

const appendMessagesToMe = document.getElementById("append-message-to-me")

const showMoreButton = document.getElementById("show-more-div")


// login
const loginButtonElement = document.getElementById("login-button")
const logoutButtonElement = document.getElementById("logout-button")


// utils
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  month: 'short',
  day: 'numeric',
});



// on load show all messages
window.addEventListener("load", async () => {
  
  let response = await getMessages(limit=20, page=1)

  // show all messages in   case status code is 200
  if (response.status === 200) {
    // show logout button
    showLogoutButton()

    // parse the data
    let json = await response.json()

    // list messages in the chat
    listMessages(json)

    // scroll to the bottom
    chat.scrollTop = chat.scrollHeight;
  } else {
    showLoginButton()
  }
})




// listen to send message button
formButton.addEventListener("click", async (event) => {
    event.preventDefault()
    let message = input.value

    // dont continue in case no message content
    if (message === "") return

    // check if user logged in and save message to DB
    const url = `${urlOrigin}/api/chat`

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({message})
    })
    // parse the data
    let json = await response.json()

    
    // if user not logged in forward to login page
    if(json.statusCode !== 201) {
      window.location = `${urlOrigin}/login`

    } else {
      const messageDB = json.data

        // emit the event
        socket.emit("send-message", messageDB)      
        // show message to sender
        showMessageToSender(messageDB)
    }
})

// listen to te event show message to users and call the function to do it
socket.on("show-message-to-all-users", (messageDB) => {
  showMessageToAllUsers(messageDB)
  
})



// function to format the message and then show it to sender
const showMessageToSender = (messageDB) => {
  let divMessage = document.createElement("div")
  divMessage.className = "msg right-msg"

  // get current now and format it
  const formattedDate = dateFormatter.format(Date.now());

  divMessage.innerHTML = `
  <!-- <div
  class="msg-img"
  style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"
  ></div> -->

  <div class="msg-bubble">
    <div class="msg-info">
    <i class="fa fa-trash-o right-trash delete-button" message_id="${messageDB._id}" onclick="deleteMessage(event)"></i>

      <div class="msg-info-name">${messageDB.name}</div>
      <div class="msg-info-time">${formattedDate}</div>
    </div>

    <div class="msg-text" message_id="${messageDB._id}">
      ${messageDB.message_content}
    </div>
  </div>
  </div>`

  input.value = ""
  input.focus()
  chat.appendChild(divMessage)
  chat.scrollTop = chat.scrollHeight
}


// function to format the message and then show it to all users
const showMessageToAllUsers = (messageDB) => {
  let divMessage = document.createElement("div")

  // get current now and format it
  const formattedDate = dateFormatter.format(Date.now());

  divMessage.classList = "msg left-msg"

  divMessage.innerHTML = `
      <!-- <div
      class="msg-img"
      style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"
    ></div> -->

      <div class="msg-bubble">
      <div class="msg-info">
          <i class="fa fa-trash-o left-trash delete-button" message_id="${messageDB._id}" onclick="deleteMessage(event)"></i>
          <div class="msg-info-name">${messageDB.name}</div>
          <div class="msg-info-time">${formattedDate}</div>
      </div>

      <div class="msg-text" message_id="${messageDB._id}">
          ${messageDB.message_content}
      </div>
      </div>`
  chat.appendChild(divMessage)
  chat.scrollTop = chat.scrollHeight;
}

// deleteMessage

const deleteMessage = async (event) => {
  let messageId = event.target.getAttribute("message_id")

  const url = `${urlOrigin}/api/chat/delete/${messageId}`

  let response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (response.status === 200) {
    // emit event so we can delete message on all clients as well
    socket.emit("delete-message", messageId)
  }
}


// listen to the event and show delete status to all users 
socket.on("show-delete-message-status", messageId => {
  let msgTxt = document.querySelector(`.msg-text[message_id="${messageId}"]`);

  // if element exists on the clients page edit it --- this is in the case of an element in loaded on someones page and not on the other due to pagination 
  if(msgTxt) {
    msgTxt.innerHTML = "Deleted Message"
    msgTxt.classList.add("deleted-message")
  }
})


// show login button
const showLoginButton = () => {
  loginButtonElement.style.display = "block"
}

// show logout button
const showLogoutButton = () => {
  logoutButtonElement.style.display = "block"
}


// login button listener
loginButtonElement.addEventListener("click", () => {
  window.location = "/login"
})



// logout button listener
logoutButtonElement.addEventListener("click", async () => {
  const url = `${urlOrigin}/api/logout`
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (response.status === 200) {
    window.location.reload()
  }
})


// query the database and returns a promise
const getMessages = async (limit, page) => {

  // fetch all messages and check if user logged in
  const url = `${urlOrigin}/api/chat/?limit=${limit}&page=${page}`
   return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
}

// takes messages in json and list it to the chat
const listMessages = (json) => {

  // the user who requested the messdages
  const user = json.user

  json.data.forEach(message => {
    let divMessage = document.createElement("div")
    
    // format the date
    const messageDate = new Date(message.date);
    const formattedDate = dateFormatter.format(messageDate);

    // variable to hold right or left so we can set the trash
    let right = false

    // if the requester is the message sender add to the chat on the right side
    if (user.userId === message.user_id) {
      divMessage.className = "msg right-msg"
      right = true
    } else {
      divMessage.classList = "msg left-msg"
      right = false
    }
    
    // format the message
    divMessage.innerHTML = `
    <!-- <div
    class="msg-img"
    style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"
   ></div> -->
  
    <div class="msg-bubble">
      <div class="msg-info">
      <i class="fa fa-trash-o ${right ? "right" : "left"}-trash delete-button" message_id="${message._id}" onclick="deleteMessage(event)"></i>

        <div class="msg-info-name">${message.name}</div>
        <div class="msg-info-time">${formattedDate}</div>
      </div>
  
      <div class="msg-text ${message.deleted ? "deleted-message" : ""}" message_id=${message._id}>
        ${message.deleted ? "Deleted message" : message.message_content}
      </div>
    </div>
  </div>`

    // append the message to the chat
    appendMessagesToMe.parentNode.insertBefore(divMessage, appendMessagesToMe.nextSibling);

  })
    // in case 20 messages listed give display flex to the show more button 
    if(json.data.length >= 20) displayShowMoreButton()
    else displayHideMoreButton()
}


//  show the "show more" button
const displayShowMoreButton = () => {
  showMoreButton.style.display = "flex"
}
// hide the "show more" button
const displayHideMoreButton = () => {
  showMoreButton.style.display = "none"
}


showMoreButton.addEventListener("click", async (event) => {
    // get number of current pages from attribute
    let page = Number(event.target.getAttribute("page")) + 1

    // get messages
    let response = await getMessages(limit=20, page=page)
    let json = await response.json()
    // list the messages
    listMessages(json)

    // set the attribute to the new page number
    event.target.setAttribute("page", page)
})
