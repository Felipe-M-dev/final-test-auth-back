const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const { db } = require("../config/config")

const pool = new Pool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    allowExitOnIdle: true,
});

const registrarUsuario = async (usuario) => {
    let { email, name, company, password, avatar_url } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, name, company, password, avatar_url];
    const consulta = "INSERT INTO users values (DEFAULT, $1, $2, $3, $4, $5)";
    await pool.query(consulta, values);
};

const actualizaUsuario = async (usuario, id) => {
    let { password } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [ passwordEncriptada, id];
    const consulta =
        "UPDATE users SET password = $1 WHERE id = $2";
    await pool.query(consulta, values);
};

const obtenerDatosDeUsuario = async (email) => {
    const values = [email];
    const consulta = "SELECT * FROM users WHERE email = $1";

    const {
        rows: [usuario],
        rowCount,
    } = await pool.query(consulta, values);

    if (!rowCount) {
        throw {
            code: 404,
            message: "No se encontró ningún usuario con este email",
        };
    }

    delete usuario.password;
    return usuario;
};

const verificarCredenciales = async (email, password) => {
    const values = [email];
    const consulta = "SELECT * FROM users WHERE email = $1";

    const {
        rows: [usuario],
        rowCount,
    } = await pool.query(consulta, values);

    if (!rowCount)
        throw {
            code: 404,
            message: "No se encontró ningún usuario con estas credenciales",
        };

    const passwordEncriptada = usuario?.password;
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordEsCorrecta)
        throw { code: 401, message: "Contraseña incorrecta" };
};

module.exports = {
    registrarUsuario,
    verificarCredenciales,
    obtenerDatosDeUsuario,
    actualizaUsuario,
};
