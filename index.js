const express = require('express');
const concertsData = require('./data/concerts');
const ticketsData = require('./data/tickets');
const bodyParser = require('body-parser');

const app = express();
// middleware for parsing json
app.use(bodyParser.json());
const PORT = 5000;

app.get('/concerts', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.status(200).json({
        "status": "success",
        "concerts": concertsData,
    });
});

app.post('/concerts/:concertId/ticket', (req, res) => {
    res.set('Content-Type', 'application/json');

    // get concert if for the ticket user want to buy from URL params
    const { concertId } = req.params;
    
    // check if the concert with given Id is in the database
    const isConcertValid = concertsData.some(concert => concert.id == concertId);
    if (isConcertValid == false) {
        res.status(404).json({
            "status": "failed",
            "message": "Concert with given id is not found in the database."
        });
        return;
    }


    // get buying orders data
    const { name, ticketsAmount } = req.body;

    // add tickets data
    ticketsData.push({
        // generate id based on ticketsData length
        "id": ticketsData.length + 1,
        "concertId": concertId,
        "name": name,
        "ticketsAmount": ticketsAmount,
    });

    res.status(201).json({
        "status": "success",
        "message": "Success membeli tiket",
    })    
});

app.get('/tickets', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.status(200).json({
        "status": "success",
        "tickets": ticketsData,
    });
});

app.put('/concerts/:concertId/tickets/:ticketId', (req, res) => {
    res.set('Content-Type', 'application/json');

    // get concert if for the ticket user want to buy from URL params
    const { concertId } = req.params;
    
    // check if the concert with given Id is in the database
    const isConcertValid = concertsData.some(concert => concert.id == concertId);
    if (isConcertValid == false) {
        res.status(404).json({
            "status": "failed",
            "message": "Concert with given id is not found in the database."
        });
        return;
    }

    // get concert if for the ticket user want to buy from URL params
    const { ticketId } = req.params;
    
    // check if the concert with given Id is in the database
    const isTicketValid = ticketsData.some(ticket => ticket.id == ticketId);
    if (isTicketValid == false) {
        res.status(404).json({
            "status": "failed",
            "message": "Ticket with given id is not found in the database."
        });
        return;
    }

    // get new amount from request body
    const { ticketsAmount } = req.body;

    // get index of the given ticket id
    const ticketToUpdateIndex = ticketsData.findIndex(ticket => ticket.id == ticketId);

    // update ticket amount data for the given tiket id
    ticketsData[ticketToUpdateIndex].ticketsAmount = ticketsAmount;

    res.status(200).json({
        "status": "success",
        "message": "Update ticket success."
    })
});

app.delete('/concerts/:concertId/tickets/:ticketId', (req, res) => {
    res.set('Content-Type', 'application/json');

    // get concert if for the ticket user want to buy from URL params
    const { concertId } = req.params;
    
    // check if the concert with given Id is in the database
    const isConcertValid = concertsData.some(concert => concert.id == concertId);
    if (isConcertValid == false) {
        res.status(404).json({
            "status": "failed",
            "message": "Concert with given id is not found in the database."
        });
        return;
    }

    const { ticketId } = req.params;
    
    // check if the ticket with given Id is in the database
    const isTicketValid = ticketsData.some(ticket => ticket.id == ticketId);
    if (isTicketValid == false) {
        res.status(404).json({
            "status": "failed",
            "message": "Ticket with given id is not found in the database."
        });
        return;
    }

    // get index of the given ticket id
    const ticketToDeleteIndex = ticketsData.findIndex(ticket => ticket.id == ticketId);

    // delete ticket from database
    ticketsData.splice(ticketToDeleteIndex, 1);

    res.status(200).json({
        "status": "success",
        "message": "Delete ticket success."
    })
});


app.listen(PORT, (error) => {
    if (!error) {
        console.log('Server is Succesfully Running, and App is listening on port ' + PORT);
    } else {
        console.log("Error occurred, server can't start", error);
    } 
});