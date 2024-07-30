const ChatGPTFormatter = ({ response }) => {
    // Function to format response
    const formatResponse = (text) => {
      // Replace Markdown bold and italic formatting
      let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
      // Replace --- with a horizontal rule
      formattedText = formattedText.replace(/---/g, '<hr>');
    
      // Replace newlines with HTML break
      return formattedText.replace(/\n/g, '<br/>');
    };    
  
    return (
      <div className="chat-gpt-formatter">
        <span dangerouslySetInnerHTML={{ __html: formatResponse(response) }} />
      </div>
    );
  };
  
export default ChatGPTFormatter;