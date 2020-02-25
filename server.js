// Configurando o servidor
const express = require("express")
const server = express()

// Configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

// Configurar a apresentação da página
server.get("/", function (req, res) {

    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

})

server.post("/", function (req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // coloco valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    db.query(query, [name, email, blood], function(err) {
        if(err) return res.send("erro no banco de dados.")

        return res.redirect("/")
    })

})

// Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("iniciei o servidor.")
})