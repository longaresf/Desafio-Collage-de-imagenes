const express = require("express");
const app = express();
let bodyParser = require("body-parser");
const fs = require("fs");
const expressFileUpload = require("express-fileupload");

app.use(bodyParser.urlencoded({ extended: false}));

app.use(expressFileUpload({
    limits: { fileSize: 5000000},
    abortOnLimit: true,
    responseOnLimit:
    "El peso de la imagen que intentas subir supera el limite permitido de 5 Mb",
})
);

const puerto = process.env.PUERTO || 3000;
const servidor = process.env.HOST || 'localhost';

app.listen(puerto, () => {
    console.info(`Servidor disponible en http://${servidor}:${puerto}`);
    });

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/formulario.html")
});

app.get("/collage", (req, res) => {
    res.sendFile(__dirname + "/public/collage.html")
});

app.post("/imagen", (req, res) => {
    let targetFile = req.files.target_file;
    const { posicion } = req.body;
    targetFile.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (err) => {
        if(err) throw err;
        res.redirect("/collage")
    })
});

app.get("/deleteImg/:imagen", (req, res) => {
    let imagen = req.params.imagen;
    fs.unlink(`public/imgs/${imagen}`, (err) => {
        if(err) throw err;
        res.send(`${imagen} fue borrada. <a href="/"> subir otra imagen</a>`)
    })
});
