const { io } = require('../server');
const ticket = require('../model/ticket');
const classTicket = require('../class/ticket.class').TicketControl;
io.on('connection', (client) => {

    console.log('Usuario conectado');
    // TicketControl
    client.on('ticketControl', (data, callback) => {
        if (!data.client) {
            return callback({
                status: false,
                message: 'Debes registrar el ticket con tu nombre'
            });
        } else {
            // Logic here
            let Ticket = new ticket({
                client: data.client,
                date: new Date().getDate()
            });
            let TicketData = new classTicket();
            TicketData.newTicket(Ticket).then(
                (client_ticket) => {
                    TicketData.getTicketsArray().then(
                        (arrayTickets) => {
                            TicketData.getTicketClient(arrayTickets)
                                .then(
                                    (resp) => {
                                        callback({
                                            status: true,
                                            message: 'Ticket cargado con éxito',
                                            resp
                                        });
                                    }
                                );
                        }
                    );
                }
            ).catch(
                (err) => {
                    return callback({
                        status: false,
                        message: 'No pudo crear el nuevo ticket',
                        err
                    });
                }
            );

        }
    });
    // Atender un ticket
    client.on('nextTicket', (ticket, callback) => {
        let TicketData = new classTicket();
        TicketData.getTicketsArray().then(
            // Entonces verificamos los primeros 4 tickets
            (tickets) => {
                TicketData.getTicketsForPresent(tickets).then(
                    (ticketControl) => {
                        // Finalizamos el ticket actual y pasamos al otro
                        TicketData.finishTicket(ticketControl[0]).then(
                            () => {
                                callback({
                                    status: true,
                                    data: ticketControl[1]
                                });
                            }
                        );
                    }
                );
            }
        ).catch(
            (err) => {
                callback({
                    status: false,
                    message: 'No hay tickets por atender',
                    err
                });
            }
        );
    });
});