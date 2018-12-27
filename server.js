const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const multer  = require('multer')
const storage = require('./config/multerStorage')
const upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 }
})
const cors = require('cors')

app.use(cors())

app.use('/home/cubex/work/learn/node/node_chat/uploads', express.static('uploads'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});


app.post('/saveFile', upload.fields([ { name: 'file', maxCount: 1 },]), (req,res)=>{

    let mimetype = ''
    let filelink = ''

    if(req.files) {
        mimetype = req.files.file[0].mimetype.split('/')[0]
        filelink = 'http://192.168.88.157:3000/home/cubex/work/learn/node/node_chat/uploads/' + req.files.file[0].filename
    }

    res.status(200).json({ status: 200, message: 'File uploaded', mimetype: mimetype, url: filelink})
})

app.use(express.static('public'));

io.on('connection', (client)=>{
    console.log('Client connected...');

    client.on('join', (data)=>{
        console.log(data);
    });

    client.on('messages', (data)=> {
        client.emit('thread', data);
        client.broadcast.emit('thread', data);
    });
});

server.listen(3000);