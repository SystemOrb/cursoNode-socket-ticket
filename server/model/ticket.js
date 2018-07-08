// Modelo de base de datos que tendrá los Tickets
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let TicketModel = new Schema({
    client: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    status: { // Para verificar si fue atendido
        type: Boolean,
        required: false,
        default: false
    }
});
module.exports = mongoose.model('tickets', TicketModel);