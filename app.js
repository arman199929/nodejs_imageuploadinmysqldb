const express = require('express');
const app = express()
const bodyparser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

app.use(express.static("./public"));

app.use(bodyparser.json);
app.use(bodyparser.urlencoded({
    extended: true
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "img"

});

db.connect(function (err) {
    if (err) return console.error("errors: " + err.message)
    console.log("Connected to the MySQL server.")
})

let storage = multer.diskStorage({
    description: (req, file, callback) => {
        callback(null, "./public/images/")
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({
    storage
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/post", upload.single('image'), (req, res) => {
    if (!req.file)
        console.log("No file upload.")
    else {
        console.log(req.file.filename);
        let imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename;
        let insertData = "INSERT INTO img_uploader(file_src)VALUES (?)";
        db.query(insertData, [imgsrc], (err, result) => {
            if (err) throw err
            console.log("file uploaded")
        })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})