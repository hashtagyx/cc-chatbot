'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading animation
  const chatContainerRef = useRef(null);

  const handleInputChange = (e) => setInputValue(e.target.value);

  // async
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim(); // Remove whitespace from both ends of the input value

    if (!trimmedInput || isLoading) {
      // Prevent submission if input is empty or only whitespace, or if it's currently loading
      return;
    }
    // Add user message
    setMessages((prev) => [...prev, { text: inputValue, sender: 'user' }]);
    setIsLoading(true); // Set loading animation to true

    try {
      // Call the API to get the response (using the App Router)
      const data = {
        reply: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
      };
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(3000);

      // Add bot response
      setMessages((prev) => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Set loading animation to false
      setInputValue(''); // Clear the input after sending
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Chatbot</h1>
      <div className={styles.chatContainer} ref={chatContainerRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.messageContainer} ${
              msg.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
            }`}
          >
            <span className={styles.sender}>{msg.sender === 'user' ? 'User' : 'Assistant'}</span>
            <div
              className={`${styles.message} ${
                msg.sender === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <textarea
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className={styles.input}
        />
        <button type="submit" className={styles.sendButton}>
          {isLoading ? <div className={styles.loadingAnimation} /> : 'Send'}
        </button>
      </form>
    </div>
  );
}