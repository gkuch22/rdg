
// Add this function before your ChatInterface component
export const sendMessageToBackend = async (question: string) => {
  try {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Fixed typo: "anwer" -> "answer"
    return data.answer;
  } catch (error) {
    console.error('Error sending message to API:', error);
    throw error;
  }
};