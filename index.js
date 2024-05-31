const express = require("express")
const http = require("http")
const path = require("path")

const app = express()

let PORT = 80

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.render("index")
})

const server = http.createServer(app)

const io = require("socket.io")(server)

io.on("connection", (socket) => {
    console.log("A user has entered the chat")

    socket.on("chat message", ({username, msg}) => {
        io.emit("chat message", `<${username}> ${msg}`)
    })

    socket.on("disconnect", () => {
        console.log("A user has left the chat")
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
