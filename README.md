# ChatApp
ChatApp is a web-based application built using nodeJS, expressJS, and WebSockets. The app allows you to join a global chat with other people and you can send messages and delete them.
It also supports role-based deletion so a user with an admin role can delete other people's messages.

![](https://github.com/Maged-Zaki/ChatApp/blob/main/GitHubReadMe.png)

## Technologies and Libraries used
- **MongoDB Atlas** Used as a cloud-based database engine.
- **Mongoose** Used for database management.
- **ExpresJS:** Used for building the RestfulAPI.
- **cookie-parse:** Used for cookie parsing.
- **socket.io:** Used for making connections between the users and the server and handling real-time communication and updates.
- **dotenv:** Used for loading the environment variables.
- **bcryptjs:** Used for generating a salt and hashing the password before saving it into the database.
- **jsonwebtoken:** Used for implementing token-based authentication and authorization.
- **socket.io:** Used for making connections between the users and the server and handling real-time communication and updates.


# Getting started
```
git clone https://github.com/Maged-Zaki/ChatApp.git
```

```
cd ChatApp

```

```
npm install

```
**Now we need to set up the environment variables before starting the server**
1. Create .env file
2. add the following to your .env file
```
PORT = 3000
MONGODB_URL = your-mongo-atlas-url
SECRET_KEY = your-secret-key
```

**Lastly to start the server**
```
npm start
```
**That's it, we are done, we can now create an account and send messages.**
