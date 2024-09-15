import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String, unique: true, required: true, default: function () {
            const prefix = "TICKET-";
            const timestamp = Date.now().toString(36).toUpperCase().slice(0, 4);
            const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
            return `${prefix}${timestamp}${randomChars}`;
        }
    },
    purchase_datetime: { type: Date, default: Date.now, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;