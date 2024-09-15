import TicketManager from '../dao/db/ticket-manager-db.js';
import TicketDTO from '../dto/ticket.dto.js';

class TicketRepository {
    async createTicket(ticketData) {
        const ticket = await TicketManager.createTicket(ticketData);
        return new TicketDTO(ticket);
    }
}

export default new TicketRepository();
