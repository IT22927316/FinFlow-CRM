import React, { useEffect, useState } from "react";
import axios from "axios";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    serial_number: "",
    client_name: "",
    client_address: "",
    client_contact: "",
    amount: "",
  });

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tickets", {
        ...formData,
        created_by: username,
      });
      fetchTickets();
      setFormData({
        serial_number: "",
        client_name: "",
        client_address: "",
        client_contact: "",
        amount: "",
      });
    } catch (err) {
      console.error("Error creating ticket:", err);
    }
  };

  const updateTicketStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/tickets/${id}`, { status });
      fetchTickets();
    } catch (err) {
      console.error("Error updating ticket status:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Ticket Management</h2>

      {/* Create Ticket (Only for Financial Planners) */}
      {role === "financial_planner" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="serial_number" placeholder="Serial Number" value={formData.serial_number} onChange={handleChange} required className="border p-2 w-full"/>
          <input type="text" name="client_name" placeholder="Client Name" value={formData.client_name} onChange={handleChange} required className="border p-2 w-full"/>
          <input type="text" name="client_address" placeholder="Client Address" value={formData.client_address} onChange={handleChange} required className="border p-2 w-full"/>
          <input type="email" name="client_contact" placeholder="Client Contact" value={formData.client_contact} onChange={handleChange} required className="border p-2 w-full"/>
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required className="border p-2 w-full"/>
          <button type="submit" className="bg-indigo-500 text-white p-2 w-full">Create Ticket</button>
        </form>
      )}

      {/* Ticket List */}
      <ul className="mt-6">
        {tickets.map(ticket => (
          <li key={ticket.ticket_id} className="flex justify-between p-2 border">
            {ticket.client_name} - {ticket.status}
            {role === "mortgage_broker" && ticket.status === "Pending" && (
              <div>
                <button onClick={() => updateTicketStatus(ticket.ticket_id, "Approved")} className="bg-green-500 p-2 text-white">Approve</button>
                <button onClick={() => updateTicketStatus(ticket.ticket_id, "Rejected")} className="bg-red-500 p-2 text-white ml-2">Reject</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketManagement;
