import React, { useState } from 'react';
import axios from 'axios';
import './StudyAids.css';

function StudyAids() {
  console.log(process.env.REACT_APP_OPENROUTER_API_KEY);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState([]); // Store conversations list
  const [conversationCount, setConversationCount] = useState(0); // To keep track of the number of conversations
  const [currentConversation, setCurrentConversation] = useState(null); // To track the current conversation
  const [conversationsMessages, setConversationsMessages] = useState({}); // Store messages for each conversation

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'patient' };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      const systemMessage =
        'You are a smart and friendly study assistant designed to help users learn more effectively. ' +
        'You help users by creating mind maps, summarizing notes, and providing useful, personalized study insights. ' +
        'Before giving advice or generating study materials, ask at least 3 clarifying questions—one at a time—about the topic, the user’s goals, and their preferred study style. ' +
        'Each question can build on the previous one or explore related areas of the topic. ' +
        'Once you have enough information, offer organized, helpful study content based on their answers.';

      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',  // OpenRouter API endpoint
          {
            model: "deepseek/deepseek-chat",  // OpenRouter model
            messages: [
              { role: 'system', content: systemMessage },
              ...messages.map((msg) => ({
                role: msg.sender === 'patient' ? 'user' : 'assistant',
                content: msg.text,
              })),
              { role: 'user', content: `Study context: ${input}` },
            ],
          },
          {
            headers: {
              Authorization: `Bearer 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`,
              'Content-Type': 'application/json',
            },
          }
        );

        const botMessage = {
          text: response.data.choices[0].message.content,
          sender: 'bot',
        };

        const newMessages = [...messages, botMessage];

        // Update the messages for the current conversation
        setConversationsMessages((prevMessages) => ({
          ...prevMessages,
          [currentConversation]: newMessages,
        }));

        setMessages(newMessages);
      } catch (error) {
        console.error('Error calling OpenRouter API:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'Error: Unable to get a response from the chatbot.',
            sender: 'bot',
          },
        ]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewConversation = () => {
    setMessages([]);  // Clear the messages for a new conversation
    setInput('');  // Optionally clear the input field as well

    // Increment conversation count and add a new conversation to the list
    setConversationCount((prev) => prev + 1);
    const newConversation = `Conversation ${conversationCount + 1}`;
    setConversations((prevConvs) => [
      ...prevConvs,
      newConversation,
    ]);
    setCurrentConversation(newConversation); // Set the new conversation as current
  };

  // Function to load a specific conversation
  const loadConversation = (conversationName) => {
    setCurrentConversation(conversationName); // Set the conversation number
    // Load the messages for the selected conversation
    const loadedMessages = conversationsMessages[conversationName] || [];
    setMessages(loadedMessages);
  };

  return (
    <div className="chatbot-page">
      <div className="container">
        <div className="conversations-list">
          <h3>Previous Conversations</h3>
          <ul>
            {conversations.length > 0 ? (
              conversations.map((conv, index) => (
                <li key={index} onClick={() => loadConversation(conv)}>
                  {conv}
                </li>
              ))
            ) : (
              <p>No conversations yet. Start a new one!</p>
            )}
          </ul>
          <button className="new-conversation-btn" onClick={startNewConversation}>
            Start New Conversation
          </button>
        </div>

        <div className="chatbox">
          <div className="chatbox-messages">
            {messages.length === 0 && (
              <p>No conversations yet. Start by typing a message below.</p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'patient' ? 'sent' : 'received'}`}
              >
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="chatbox-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyAids;
