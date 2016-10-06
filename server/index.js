let express = require('express')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)

app.use(express.static('../build-client'))

let entryRows = null
let usersById = {}

io.on('connect', socket => {
  console.log('User connected:', socket.id)

  if (entryRows !== null) {
    socket.emit('receiveRows', entryRows)
  }

  socket.on('sendUser', user => {
    usersById[socket.id] = user
    io.emit('receiveUsers', usersById)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    delete usersById[socket.id]
    io.emit('receiveUsers', usersById)
  })

  socket.on('sendRows', rows => {
    entryRows = rows
    io.emit('receiveRows', entryRows)
  })
})

server.listen(3000, () => console.log('listening on port 3000'))
