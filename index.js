// index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // reemplaza con dominios válidos en producción
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// SOCKETS - Rooms por tenant
io.on('connection', (socket) => {
//   console.log('Cliente conectado:', socket.id);

  // Cliente se une a un room por tenant_id
  socket.on('joinTenant', (tenantId) => {
    console.log(`Socket ${socket.id} se une al tenant ${tenantId}`);
    socket.join(`tenant_${tenantId}`);
  });

  socket.on('disconnect', () => {
    // console.log(`Socket desconectado: ${socket.id}`);
  });
});


app.post('/api/notify/:tenantId', (req, res) => {
  const { tenantId } = req.params;
  const { title, message,funxion } = req.body;


  io.to(`tenant_${tenantId}`).emit('newNotification', {
    title,
    message,
    funxion,
    tenantId
  });

  res.json({ status: true, tenantId });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
//   console.log(`Servidor corriendo en puerto ${PORT}`);
});
