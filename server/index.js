let express = require('express')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)

app.use(express.static('../build-client'))

io.on('connect', socket => {
  console.log('User connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

server.listen(3000, () => console.log('listening on port 3000'))
