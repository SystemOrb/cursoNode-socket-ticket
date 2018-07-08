// Clase que tendrá el control de tickets
const express = require('express');
const app = express();
const ticketSchema = require('../model/ticket');
class TicketControl {
    constructor() {}
    async newTicket(ticketData) {
        // Crear un nuevo ticket
        return new Promise((resolve, reject) => {
            let ticket = new ticketSchema({
                client: ticketData.client,
                date: new Date().getDate(),
            });
            ticket.save((err, ticketDB) => {
                if (err) {
                    reject(false);
                }
                resolve(ticketDB);
            });
        });
    }

    getTicketClient(tickets) {
        return new Promise((resolve, reject) => {
            // Devolvemos el ultimo elemento de la cola
            // Es decir el cliente actual que esta registrando la cola
            resolve(tickets[tickets.length - 1]);
        });
    }
    getTicketsForPresent(tickets) {
        return new Promise((resolve, reject) => {
            // Devolvemos los primeros 4 tickets
            let fourTickets = new Array();
            fourTickets.push(tickets[0]);
            fourTickets.push(tickets[1]);
            fourTickets.push(tickets[2]);
            fourTickets.push(tickets[3]);
            resolve(fourTickets);
        });
    }
    getTicketsArray() {
        return new Promise((resolve, reject) => {
            // Buscamos todos los tickets de la fecha actual
            ticketSchema.find({ date: new Date().getDate(), status: false })
                .exec((err, todayTickets) => {
                    // Reject si devuelve un error
                    if (err) {
                        reject(false);
                    }
                    // Creamos una cola de items
                    let queque = new Array();
                    let flag = 1; // Contador de tickets de cada usuario
                    for (let objectTicket of todayTickets) {
                        // Por cada vuelta del bucle, asignamos un ticket a una data respectiva
                        queque.push({
                            data: objectTicket,
                            ticket: flag
                        });
                        flag++ // Increntamos el ticket
                    }
                    resolve(queque); // Devolvemos la cola de tickets
                });
        });
    }
    finishTicket(ticket) { // funcion que va actualizar el ticket
        return new Promise((resolve, reject) => {
            ticketSchema.findByIdAndRemove(ticket.data._id, (err, finished) => {
                if (err) { reject(false); }
                resolve(finished);
            });
        });
    }
}
module.exports = {
    app,
    TicketControl
}