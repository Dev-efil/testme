import router from '../config/routeConfig.js';

// Function to process the incoming message and generate a response
export const processMessage = async (message) => {
    const _getAnswerURL = '/api/v1/yochat/getanswer/';
    const requestData = {
        client_referance: 'PeShVmYq3t6v9y$B',
        customer_query: message
    };

    // Call the API to get the response based on the customer's query
    const response = await router.post(_getAnswerURL, requestData, {
        headers: {
            'Content-Type': 'application/json',
            'X-Secure-Token': process.env.SECURE_X
        },
        withCredentials: true
    });

    return response.data.result;
}
