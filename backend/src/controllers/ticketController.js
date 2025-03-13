const db = require('../utils/db');

//Create a New Ticket (Financial Planner)
exports.createTicket = async (req, res) => {
  const { serial_number, client_name, client_address, client_contact, amount, created_by } = req.body;

  try {
    await db.execute(
      "INSERT INTO tickets (serial_number, client_name, client_address, client_contact, amount, status, created_by) VALUES (?, ?, ?, ?, ?, 'Pending', ?)",
      [serial_number, client_name, client_address, client_contact, amount, created_by]
    );
    res.json({ message: "Ticket created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating ticket" });
  }
};

//Get All Tickets (For Financial Planners & Mortgage Brokers)
exports.getAllTickets = async (req, res) => {
  try {
    const [tickets] = await db.execute("SELECT * FROM tickets");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

//Approve/Reject Ticket (Mortgage Broker)
exports.updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    await db.execute("UPDATE tickets SET status = ? WHERE ticket_id = ?", [status, id]);
    res.json({ message: `Ticket ${status.toLowerCase()} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket status" });
  }
};