const express = require("express")
const http = require("http")
const path = require("path")
const fs = require("fs")
const socketIo = require("socket.io")

const app = express()
const PORT = 80

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/chat", (req, res) => {
    res.render("chat_room")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

const server = http.createServer(app)
const io = socketIo(server)

io.on("connection", (socket) => {
    socket.on("chat room connection", ({ username }) => {
        console.log(`${username} joined the chat`)
        io.emit("chat room connection", { username: username })
    })
    
    socket.on("chat message", ({ username, message }) => {
        // Update chatHistory.txt
        fs.appendFile(path.join(__dirname, "public", "chatHistory.txt"), `\n<${username}> ${message}`, (err) => {
            if (err) {
                console.error(err.stack)
            }
        })
        io.emit("chat message")
    })

    socket.on("chat room disconnection", ({ username }) => {
        console.log(`${username} left the chat`)
        io.emit("chat room disconnection", { username: username })
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
