import axios from 'axios';

export const sendMessageToBackend = async (question: string) => {
  try {
    const response = await axios.post('http://localhost:8000/chat', {
      question
    });

    // Axios automatically parses JSON, so you can directly access response.data
    return response.data.answer;
  } catch (error) {
    console.error('Error sending message to API:', error);
    throw error;
  }
};
