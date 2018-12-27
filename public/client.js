const socket = io.connect('http://localhost:3000')
socket.on('connect', (data) => {
    socket.emit('join', 'Hello server from client!')
})

socket.on('thread', (data) => {
    if (data.mimetype === 'video') {
        $('#thread').append(`
        <video width="320" height="240" controls>
            <source src="${data.link}" type="video/mp4">
           <h6>${data.message}</h6>
        </video> `)
    }

    if (data.mimetype === 'image') {
        $('#thread').append(`<div><img src="${data.link}"/><h6>${data.message}</h6></div>`)
    }

    if(!data.url){
        $('#thread').append('<li>' + data.message + '</li>')
    }

})

var instance = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
})

var formData

$('#attach').on('change', () => {
    formData = new FormData()
    formData.append('file', document.getElementById('attach').files[0])
})

$('#send').click(function () {
    axios.post(
        'http://localhost:3000/saveFile',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}})
        .then(function (data) {
            socket.emit('messages', {link: data.data.url, mimetype: data.data.mimetype, message: $('#message').val()})
        })
        .catch(function () {
            console.log('FAILURE!!')
        })

})