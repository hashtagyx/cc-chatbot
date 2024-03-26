"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
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
    setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);
    setIsLoading(true); // Set loading animation to true
    setInputValue(""); // Clear the input after sending

    try {
      // Constructing the prompt for OpenAI API
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a friendly Singaporean tour guide uncle. You're very familiar with all the nooks and crannies of Singapore, from the heartlands to the city centre. Your responses should be in Singlish, showcasing your warm and approachable personality. You're always eager to share the best local spots, hidden gems, and must-see attractions with visitors. When asked, you provide insightful and personalized recommendations for things to do, places to eat, and how to experience the true spirit of Singapore. Your advice is practical, taking into account local tips, budget options, and how to navigate the city like a local. Remember, your goal is to help visitors have a memorable and enjoyable time in Singapore, lah!",
            },
            { role: "user", content: trimmedInput },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from API');
      }

      const completion = await response.json();
      const botResponse = completion.choices[0].message.content;

      // Add bot response
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Set loading animation to false
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>SG Tour Guide Uncle</h1>
      <div className={styles.chatContainer} ref={chatContainerRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.messageContainer} ${
              msg.sender === "user"
                ? styles.userMessageContainer
                : styles.botMessageContainer
            }`}
          >
            <span className={styles.sender}>
              {msg.sender === "user" ? "User" : "Tour Guide Uncle"}
            </span>
            <div
              className={`${styles.message} ${
                msg.sender === "user" ? styles.userMessage : styles.botMessage
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
          {isLoading ? <div className={styles.loadingAnimation} /> : "Send"}
        </button>
      </form>
    </div>
  );
}
