//Dependencias
require('colors');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const app = express();
const config = require('./config/settings');
const mongoose = require('mongoose');
// Servidor de socket
let server = http.createServer(app);
// Publico
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
// Mongoose
mongoose.connect(config.Connection, { useNewUrlParser: true },
        (err) => {
            if (err) {
                throw new Error('Exception on connect to database server ', err);
            }
            console.log('La base de datos ha sido conectada en el puerto '.green, config.PORT);
        })
    // IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/socket');





server.listen(config.PORT, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ config.PORT }`);

});