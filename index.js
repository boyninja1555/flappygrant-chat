const express = require("express")
const http = require("http")
const path = require("path")
const socketIo = require("socket.io")

const app = express()
const PORT = 80

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/chat/:chat_id", (req, res) => {
    res.render("chat_room", { chatId: req.params.chat_id })
})

const server = http.createServer(app)
const io = socketIo(server)

io.on("connection", (socket) => {
    console.log("A user has entered the chat")

    socket.on("chat message", ({ username, msg }) => {
        io.emit("chat message", `<${username}> ${msg}`)
    })

    socket.on("disconnect", () => {
        console.log("A user has left the chat")
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
