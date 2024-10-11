import { useEffect, useState, useRef } from "react";
import ChatGPTFormatter from "./ChatGPTFormatter"; // Keep the formatter import

const TypingEffect = ({ text, isResponseMessage, isLastMessage, speed = 12.5, scrollToBottom }) => {
  const [displayedText, setDisplayedText] = useState(""); // State for displayed text
  const intervalRef = useRef(null); // Reference to track interval

  useEffect(() => {
    if (isLastMessage && isResponseMessage) {
      let currentText = "";
      let index = 0;
      setDisplayedText(""); // Reset displayed text initially

      intervalRef.current = setInterval(() => {
        if (index < text.length) {
          currentText += text.charAt(index);
          setDisplayedText(currentText);
          index++;

          // Divisors based on text length to scroll at specific points
          let divisors = [];
          if (text.length >= 600) {
            divisors = [20, 15, 10, 8, 6, 4, 3, 2, 1.5, 1.2]; // Long text: 10 divisors
          } else if (text.length >= 300) {
            divisors = [6, 4, 3, 2, 1.5, 1.2]; // Medium text: 6 divisors
          } else if (text.length >= 100) {
            divisors = [4, 2]; // Short text: 2 divisors
          }

          // Scroll to bottom if the index hits any of the divisors
          if (divisors.some(divisor => index === Math.round(text.length / divisor))) {
            scrollToBottom();
          }
        } else {
          clearInterval(intervalRef.current); // Clear interval when typing is done
          scrollToBottom(); // Final scroll to bottom after typing completes
        }
      }, speed);

      return () => clearInterval(intervalRef.current); // Cleanup interval on unmount
    } else {
      setDisplayedText(text); // Immediately set the full text if not the last message
    }
  }, [text, isLastMessage, speed, isResponseMessage]);

  return <ChatGPTFormatter response={displayedText} />; // Use the formatter to display the typed text
};

export default TypingEffect;
