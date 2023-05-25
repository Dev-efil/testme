import express from 'express';
const app = express();
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

const io = new Server(server, {
    cors: {
        origin: '*'
    },
});
// Function to process the incoming message and generate a response
function processMessage(message) {
    // Your chatbot logic goes here
    // Process the message and generate a response
    const response = `How are doing?`;

    return response;
}
const messages = [];
io.on('connection', (socket) => {
    console.log('New user connected', socket.id);

    // Event handler for receiving messages from clients
    socket.emit('serverResponse', `Yo! What's up?`);

    socket.on('userMessage', (message) => {
        // console.log('Received message:', message);
        messages.push({ sender: 'user', text: message });
        // Process the message and generate a response
        const response = processMessage(message);

        // Send the response back to the client
        // io.to(id).emit('chat-message', message);
        messages.push({ sender: 'server', text: response });
        console.log(messages);
        setTimeout(() => {
            socket.emit('serverResponse', response);
        }, 2000);
    });

    socket.on('disconnect', function () {
        console.log(`Socket disconnected 🔌 : ${socket.id}`);
    });
}); 