import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
// import { processMessage } from './utils/processMessage.utils.js';
import router from './config/routeConfig.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Define the server port
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

// Socket.IO connection event handler
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    },
});
const processInitialMessage = async () => {
    const _getInitialMessageURL = '/api/v1/yochat/getinitialmessage/';
    try {
        // const response = await router.get(_getInitialMessageURL, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-Secure-Token': process.env.SECURE_X
        //     },
        //     withCredentials: true
        // });
        // return response.data.result;
        return `Yo! What's up?`;
    } catch (error) {
        console.error('Error processing initial message:', error);
        throw error;
    }
}
const processMessage = async (data) => {
    const _getAnswerURL = '/api/v1/yochat/getanswer/';
    const requestData = {
        client_referance: data.YoBotAccountKey,
        customer_query: data.userInput
    };
    console.log('requestData', requestData);
    try {
        // Call the API to get the response based on the customer's query
        const response = await router.post(_getAnswerURL, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Secure-Token': process.env.SECURE_X
            },
            withCredentials: true
        });

        return response.data.result;
    } catch (error) {
        console.error('Error processing message:', error);
        throw error;
    }
}

io.on('connection', async (socket) => {
    console.log('New user connected', socket.id);
    try {
        const conversationCookie = socket.handshake.headers.cookie?.split(';')
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith('conversation='));

        // Process the initial message and generate a response only if conversation cookie is not set
        if (!conversationCookie) {
            const initialResponse = await processInitialMessage();

            // Emit the initial response to the client
            socket.emit('serverResponse', initialResponse);
        }
    } catch (error) {
        console.error('Error processing initial message:', error);
    }

    // Event handler for receiving user messages
    socket.on('userMessage', async (data) => {
        try {
            // Process the message and generate a response
            const response = await processMessage(data);

            // Send the response back to the client after a delay of 2 seconds
            setTimeout(() => {
                socket.emit('serverResponse', response);
            }, 2000);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Event handler for socket disconnection
    socket.on('disconnect', () => {
        console.log(`Socket disconnected 🔌 : ${socket.id}`);
    });
});