const jwt = require("jsonwebtoken")
const { secretKey } = require("../../secretKey")


const checkCredentialsExists = (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        res
            .status(401)
            .send({ message: "No se recibieron las credenciales en esta consulta" })
    }
    next()
}

const tokenVerification = (req, res, next) => {
    const token = req.header("Authorization")
    if (!token) throw { code: 401, message: "Debe incluir el token en las cabeceras (Authorization)" }

    const tokenValido = jwt.verify(token, secretKey)
    if (!tokenValido) throw { code: 401, message: "El token es inválido" }
    next()
}

module.exports = { checkCredentialsExists, tokenVerification }