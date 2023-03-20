const express = require("express")
const jwt = require("jsonwebtoken")
const { Pool } = require('pg')
const { secretKey } = require("./secretKey")
const cors = require("cors")
const app = express()

const { port } = require("./src/config/config")

const { db } = require("./src/config/config")

const pool = new Pool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    allowExitOnIdle: true,
});

const { registrarUsuario, verificarCredenciales, obtenerDatosDeUsuario, actualizaUsuario, obtenerUsuarios } = require("./src/controllers/server.controller")
const { checkCredentialsExists, tokenVerification } = require("./src/middleware/middlewares")

app.listen(port, console.log(`SERVER START ON PORT ${port}`))
app.use(cors())
app.use(express.json())

app.get("/users", async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users WHERE email NOT IN ('admin')")
        res.send(users.rows)
    } catch (error) {
        res.status(500).send(error)
    }

})

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

app.delete("/users/:id", async(req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(`DELETE FROM users WHERE id=${id}`)

        if (result.rowCount === 0) return res.status(404).json({
            message: 'Server no encontrado'
        })

        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})