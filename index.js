const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors')
const fetch = require('cross-fetch');


app.use(cors());
app.use('/admin', express.static(path.join(__dirname, './src/admin/build')))
app.use('/visualization', express.static(path.join(__dirname, './src/visualization/build')))
app.use('/', express.static(path.join(__dirname, './src/visualization/build')))

app.get('admin/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/admin/build/index.html'))
})

app.get('visualization/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/visualization/build/index.html'))
})

app.get('/backend/hello-world', (req, res) => {
    res.send('Hello World!')
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/src/visualization/build/index.html'))
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App listening on http://127.0.0.1:${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
