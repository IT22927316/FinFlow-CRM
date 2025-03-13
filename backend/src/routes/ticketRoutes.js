const express = require('express');
const ticketController = require('../controllers/ticketController');
const router = express.Router();

// Ticket Management Routes
router.post('/tickets', ticketController.createTicket); // Create a ticket
router.get('/tickets', ticketController.getAllTickets); // Get all tickets
router.put('/tickets/:id', ticketController.updateTicketStatus); // Approve/Reject ticket

module.exports = router;
