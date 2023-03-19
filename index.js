const express = require("express")
const jwt = require("jsonwebtoken")

const { secretKey } = require("./secretKey")
const cors = require("cors")
const app = express()

const { port } = require("./src/config/config")

const { registrarUsuario, verificarCredenciales, obtenerDatosDeUsuario, actualizaUsuario } = require("./src/controllers/server.controller")
const { checkCredentialsExists, tokenVerification } = require("./src/middleware/middlewares")

app.listen(port, console.log(`SERVER START ON PORT ${port}`))
app.use(cors())
app.use(express.json())

app.post("/users", checkCredentialsExists, async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.status(201).send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, secretKey)
        const user = await obtenerDatosDeUsuario(email)
        res.send({ token, user })
    } catch ({ code, message }) {
        res.status(code).send(message)
    }

})

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params
        const usuario = req.body
        await actualizaUsuario(usuario, id)
        res.status(201).send("Datos de Usuario actualizados con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get("/users/:email", async (req, res) => {
    try {
        const { email } = req.params
        const token = jwt.sign({ email }, secretKey)
        const user = await obtenerDatosDeUsuario(email)
        res.status(201).send({ user })

    } catch (error) {
        res.status(500).send(error)
    }
})