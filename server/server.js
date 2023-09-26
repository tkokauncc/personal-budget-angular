// Budget API

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());




const json = fs.readFileSync('Categories.json', 'utf8');
const Data = JSON.parse(json);
app.get('/budget', (req, res) => {
    res.json(Data);
});


app.listen(port, () => {
    console.log('API served at http://localhost:${port}');
});