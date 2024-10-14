import { useEffect, useRef, useState } from "react";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import FullRow from "../Components/FullRow";
import Card from "../Components/Card";
import { PromptTemplate } from "@langchain/core/prompts";
import ChatGPTFormatter from "../Components/ChatGPTFormatter";
import combineDocs from "../Components/combineDocs";
import TypingEffect from "../Components/TypingEffect";
import Helper from "../Config/Helper";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { useApi } from "../Context/ApiContext";
import { useRetriever } from "../Components/retriever";
import { LLM } from "@langchain/core/language_models/llms";


const Settings = () => {
    const [chatId, setChatId] = useState(null); // Store chatId in state
    const navigate = useNavigate();
    const location = useLocation();
    const retriever = useRetriever();
    const { chat_slug } = useParams();
    const { openAiApiKey } = useApi();
    const [isTitleEntered, setIsTitleEntered] = useState(false); // Track if project title is entered
    const [isDescriptionEntered, setIsDescriptionEntered] = useState(false); // Track if description is entered
    const [keywordNames, setKeywordNames] = useState([]);  // To store only the names
    const [generatedKeywords, setGeneratedKeywords] = useState([]); // Store generated keywords
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [isWaitingForBotResponse, setIsWaitingForBotResponse] = useState(false); // Track bot response state
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [description, setDescription] = useState(""); // To store project description
    const [productTitle, setProductTitle] = useState(""); // State for product title
    const [keywords, setKeywords] = useState(""); // State for 
    const [extraKeywords, setExtraKeywords] = useState(""); // State for 
    const [responseMessage, setResponseMessage] = useState(false);
    const [isDescriptionSubmitted, setIsDescriptionSubmitted] = useState(false); // Track description submission
    const [chatMessages, setChatMessages] = useState([]); // Array to store chat messages
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
    const [currentAnswer, setCurrentAnswer] = useState(""); // Store the current input answer
    const [isChatHistoryAvailable, setIsChatHistoryAvailable] = useState(true); // Show chat history from the start
    const [chatStatus, setChatStatus] = useState("Pending"); // Initial chat status
    const [isIntroVisible, setIsIntroVisible] = useState(true); // Control visibility of "Fill in the details" heading
    const [selectedOption, setSelectedOption] = useState("Cover Letter"); // Store selected dropdown option
    const [chatHistory, setChatHistory] = useState([]);
    const chatMessagesContainerRef = useRef(null);
    const API_KEY = openAiApiKey ?? " ";
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredChats, setFilteredChats] = useState(chatHistory);
    const [coverLetterTemplates, setCoverLetterTemplates] = useState([]);
    const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [showCoverLetterContent, setShowCoverLetterContent] = useState(false);


    useEffect(() => {
        if (searchTerm === '') {
            setFilteredChats(chatHistory);
        } else {
            const filtered = chatHistory.filter(chat =>
                chat.chat_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredChats(filtered);
        }
    }, [searchTerm, chatHistory]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    useEffect(() => {
        fetchCoverLetterTemplates();
    }, []);


    useEffect(() => {
        if (location.state?.resultResponse) {
            setResponseMessage(true);
        }
    }, [location.state]);

    const fetchCoverLetterTemplates = async () => {
        try {
            const response = await axios.get(`${Helper.apiUrl}cover-letter/all`, Helper.authHeaders);
            setCoverLetterTemplates(response.data);
            if (response.data.length > 0) {
                setSelectedTemplateId(response.data[0].id);
                setSelectedCoverLetter(response.data[0]); // Set first template as selected
            }
        } catch (error) {
            console.error("Error fetching cover letter templates:", error);
        }
    };

    const openai = axios.create({
        baseURL: 'https://api.openai.com/v1',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
    });

    const model = new ChatOpenAI({
        openAIApiKey: openAiApiKey,
        model: "gpt-4o-mini",  // Ensure the model name is correct
        temperature: 0.3,
    });

    const getKeywords = async () => {
        try {
            const result = await axios.get(`${Helper.apiUrl}keyword/all`, Helper.authHeaders);
            const namesArray = result.data.map(keyword => keyword.name);
            setKeywordNames(namesArray);
        } catch (error) {
            console.error("Error fetching keywords:", error);
        }
    };

    useEffect(() => {
        getKeywords();
    }, []);

    const handleGenerateKeywords = async () => {
        console.log(keywordNames)
        if (productTitle.trim() && description.trim()) {
            try {
                setIsWaitingForBotResponse(true);
                const openAiResponse = await model.invoke(`Generate a maximum of 6 short and highly targeted domain-specific keywords based solely on the project title and description. The keywords should focus on the overall domain of the project, avoiding specific product features or descriptions.

Project Title: ${productTitle}
Project Description: ${description}
Context Keywords: ${keywordNames}

Instructions:
- Focus **only on domain-specific** keywords, reflecting the overall business area, industry, or service model (e.g., "Open AI," "SaaS Platform," "Generative AI").
- Avoid using any specific product features, descriptions, or content from the title or description.
- Include **at most 1 or 2 keywords** related to the relevant technologies or platforms that are crucial for the domain.
- The keywords should be concise and specific to the domain, not general terms or broad categories (e.g., "AI solutions" is too broad, but "Generative AI" is acceptable if it's part of the core tech stack).
- Limit the keywords to a maximum of 6, with at least 80% focused on domain-specific terms and at most 20% on the tech stack.
- Return the keywords as an array: ["keyword1", "keyword2", "keyword3", ...]
- The Keywords must only be generated from the context keywords given or strictly related to keywords found in content keywords.

Note: Do not include any features or product requirements in the keywords. Focus on high-level domain-related terms and minimal relevant technologies.
`);
                console.log(openAiResponse)
                const responseContent = openAiResponse.content;
                const parsedKeywords = JSON.parse(responseContent);
                setGeneratedKeywords(parsedKeywords);
                setIsWaitingForBotResponse(false);
            } catch (error) {
                setIsWaitingForBotResponse(false);
                console.error("Error generating keywords:", error);
            }
        }
    };

    const regenerateKeywords = async () => {
        try {
            setIsWaitingForBotResponse(true);
            // Call the OpenAI model with the context, excluding already generated keywords
            const openAiResponse = await model.invoke(`Generate a maximum of 6 short and highly targeted domain-specific keywords based solely on the project title and description. The keywords should focus on the overall domain of the project, avoiding specific product features or descriptions.
    
    Project Title: ${productTitle}
    Project Description: ${description}
    Previous Keywords: ${generatedKeywords.join(', ')}  // Exclude previously generated keywords
    Context Keywords: ${keywordNames}  // Add context keywords here
    
    Instructions:
    - Only generate **new keywords** that are not already included in the list of previous keywords.
    - Include new keywords that reflect the domain of the project, relevant technologies, or industry-specific terms.
    - Focus on generating fresh, domain-relevant keywords, and exclude previously used keywords.
    - Return a maximum of 6 new keywords.
    - There should be no numbering rather direct format like this ["keyword1", "keyword2", "keyword3", ...]
    
    New Keywords:
    `);
    console.log(openAiResponse)
            const responseContent = openAiResponse.content;
            const newKeywords = JSON.parse(responseContent);

            // Update the state with only the newly generated keywords (no duplicates)
            setGeneratedKeywords([...newKeywords]);  // Store only the new keywords

            // Optionally update the `keywords` state for display
            setKeywords(newKeywords.join(', '));  // Update the keywords state with the new ones
            setIsWaitingForBotResponse(false);
            setSelectedKeywords([])
        } catch (error) {
            setIsWaitingForBotResponse(false);
            console.error("Error generating new keywords:", error);
        }
    };



    const getOpenAIResponse = async (selectedOption, description, messages, keywords, selectedCoverLetter) => {

        try {
            // Define the standalone question template with interpolation
            const standAloneTemplate = `Given a description, convert the description to a standalone description. 
            Description: ${description}
            Standalone description:`;
            console.log("Standalone Template:", standAloneTemplate);

            // Generate the standalone prompt
            const standAlonePrompt = PromptTemplate.fromTemplate(standAloneTemplate);
            console.log("Standalone Prompt:", standAlonePrompt);

            // Define the answer template with interpolation
            const answerTemplate = `
            You are a professional copywriter. Based on the context and responses, 
            generate a concise response suitable for a ${selectedOption}.
            Incorporate the following keywords effectively: ${keywords}.
            The Cover Letter Structure Should Be Like: ${selectedCoverLetter.content}.
            
            Follow these instructions for the content:
            - You will use product names and links retrieved from context.
            - For the matching products, provide a list formatted like this:
                1. [Matching Product Name]: [Loom Link]
                2. [Matching Product Name]: [Loom Link]
            - For the description, use relevant context from retrieved documents to fill in the section provided for the project description.
            - Based on the retrieved documents, generate specific questions related to the product, ensuring that they are relevant to the client's needs.
            
            If any questions are skipped from the six questions (client name, product title, budget, date joining, keywords, and job link), skip at the place where the answer was supposed to be.
            Maintain a professional tone suitable for a freelancing client. Distinguish whether the recipient is a company or an individual based on the context and responses, and tailor your response accordingly.
            
            **User Responses:**  
            ${messages.map(msg => msg.is_bot === 1 ? `**Assistant:** ${msg.text}` : `**User:** ${msg.text === "Skipped" ? " " : msg.text}`).join('\n')}
            
            **Instructions:**  
            - Don't start with "Dear," "Mr," "Mrs," or "Ms." Rather say "Hello," "Hi," or "Hey" and the first name of the client.
            - Structure the response with distinct sections without excessive spacing.
            - Ensure each section is brief but informative, highlighting important points without overwhelming the client.
            - Also Consider The keywords that are provided in User Response (If Any), if none or skipped, then continue with the flow.
            - Now that you're provided with the cover letter structure, you'll follow the structure of the provided cover letter to generate a response. You'll leave space for links of matching products (e.g., [Loom Link]) but you'll give names of products matched from context data and you'll fill in the description of the cover letter according to the matching content from context data.
            - Don't tell how excited you are for the project; keep it simple as if talking to a real person.
            - Use bullet points for clarity where applicable, but keep lists concise.
            - Avoid including personal contact information as per freelance platform policies.
            - Do not repeat the questions that were answered by the client, such as budget, project started, or job link.
            
            **Response Format:**  
            - Use **bold** for important points. 
            - Use *italics* for emphasis. 
            - Maintain paragraphs with line breaks (\\n), but limit the length of each section to keep the overall response concise.
            
            Context: ${description}
            Response:
            `;



            console.log("Answer Template:", answerTemplate);

            // Assume instantiation of model and retriever here (add your own methods to initialize these)
            const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

            const retrieverChain = RunnableSequence.from([
                async (prevResult) => {
                    return { standalone_question: prevResult.standalone_question };
                },
                async ({ standalone_question }) => {
                    const retrievedDocs = await retriever.getRelevantDocuments(standalone_question);
                    console.log("Retrieved Docs:", retrievedDocs);
                    const retrievedTexts = retrievedDocs.map(doc => doc.pageContent);
                    console.log("Retrieved Texts:", retrievedTexts);
                    return retrievedTexts
                },
                async (retrievedTexts) => {
                    const combinedContext = combineDocs(retrievedTexts);
                    console.log("Combined Context:", combinedContext);
                    return { context: combinedContext };
                }
            ]);

            const standaloneQuestionResult = await standAlonePrompt.pipe(model).pipe(new StringOutputParser()).invoke({ description });
            console.log("Standalone Question Result:", standaloneQuestionResult);

            const contextResult = await retrieverChain.invoke({ standalone_question: standaloneQuestionResult });
            if (!contextResult.context) {
                throw new Error("Context is undefined");
            }

            const finalPromptData = {
                context: `${contextResult.context}`,
                description,
            };
            console.log("Final Prompt Data:", finalPromptData);
            console.log("KeyWords:", keywords);

            const finalResponse = await answerPrompt.pipe(model).pipe(new StringOutputParser()).invoke(finalPromptData);
            console.log("Final Response:", finalResponse);

            return finalResponse;
        } catch (e) {
            console.error("Error in getOpenAIResponse:", e);
            return "An error occurred while generating the response.";
        }
    };

    const scrollToBottom = () => {
        if (chatMessagesContainerRef.current) {
            // Adding a small timeout to ensure content is fully rendered before scrolling
            setTimeout(() => {
                // Scroll the chat messages container to the bottom
                chatMessagesContainerRef.current.scrollTo({
                    top: chatMessagesContainerRef.current.scrollHeight,
                    behavior: 'smooth'
                });

                // Scroll the window down by 10% of the viewport height (10vh)
                window.scrollBy({
                    top: window.innerHeight * 0.2, // Change the multiplier as needed
                    behavior: 'smooth'
                });
            }, 100); // Adjust delay as needed, 100ms usually works well
        }
    };



    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);



    const scrollToTop = () => {
        if (chatMessagesContainerRef.current) {
            chatMessagesContainerRef.current.scrollTo({
                top: 0,
                // behavior: 'smooth'
            });
        }
    };
    const fetchChatBySlug = (slug) => {
        scrollToTop();
        // chatMessagesContainerRef.current.scrollTop = 0;
        axios.get(`${Helper.apiUrl}proposal_chats/chat/${slug}`, Helper.authHeaders)
            .then(response => {
                const chatData = response.data;
                if (chatData) {
                    setChatId(chatData.chat.id)
                    setIsDescriptionSubmitted(true);
                    setIsWaitingForBotResponse(false);
                    setChatMessages(chatData.messages || []); // Set messages if present
                    console.log(chatMessages);
                    setTimeout(() => {
                        scrollToBottom();
                    }, 500);
                }
            })
            .catch(error => {
                console.error("Error fetching chat by slug:", error);
            });
    };

    useEffect(() => {
        console.log("Updated chatId:", chatId);
    }, [chatId]);

    useEffect(() => {
        if (chat_slug) {
            fetchChatBySlug(chat_slug);
        }
    }, [chat_slug]);

    const questions = [
        "What is the client's full name?",
        // "Please provide the title of the product.",
        // "Can you share the job link for this project?",
        // "What is the expected spending or budget for this project?",
        // "What is the date the client joined the project?",
        "Would you like to give some More keywords to consider while generating response?"
    ];

    const handleDescriptionSubmit = () => {
        if (description.trim() && productTitle.trim()) {
            setIsDescriptionSubmitted(true); // Return to the chat interface
            setShowCoverLetterContent(false);
            if (generatedKeywords.length > 0) {
                setKeywords(selectedKeywords.join(", ")); // Join the selected keywords into a string
            }
            // Do not reset the chat messages, continue from where the user left off
            if (chatMessages.length === 0) {
                setChatMessages([{ type: 'bot', text: questions[currentQuestionIndex] }]);
            }
            setIsIntroVisible(false); // Hide "Fill in the details" when the first question is shown
        } else {
            alert("Please enter a project description.");
        }
    };

    const toggleKeywordSelection = (keyword) => {
        if (selectedKeywords.includes(keyword)) {
            // Remove the keyword
            setSelectedKeywords(prev => prev.filter(kw => kw !== keyword));
        } else {
            // Add the keyword
            setSelectedKeywords(prev => [...prev, keyword]);
        }
        console.log(selectedKeywords)
    };

    const handleToggleCoverLetter = () => {
        const selectedTemplate = coverLetterTemplates.find(template => template.id === selectedTemplateId);
        setSelectedCoverLetter(selectedTemplate); // Assign the selected cover letter
        setShowCoverLetterContent((prev) => !prev); // Toggle visibility
    };

    const storeMessage = async (message, chatId, isBot) => {
        const messageData = {
            chat_id: chatId,
            message: message.text,
            is_bot: isBot ? 1 : 0, // 1 for bot, 0 for user
            user_id: Helper.authUser.id,
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await axios.post(`${Helper.apiUrl}proposal_chats/messages/store`, { messages: [messageData] }, Helper.authHeaders);
            console.log("Message saved:", response.data);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    };


    const handleAskQuestionSubmit = async (question) => {
        try {

            if (!question.trim()) {
                alert("Please enter a question.");
                return;
            }

            setIsWaitingForBotResponse(true); // Disable the input during the bot's response
            setResponseMessage(true);
            // Add the user's question to the chatMessages array
            const updatedMessages = [...chatMessages, { type: 'user', text: question }];
            setChatMessages(updatedMessages); // Update the chatMessages with the user's question
            setCurrentAnswer("");
            // Get the chat ID (assuming you have it from somewhere in the state or props)

            // Store the user's message immediately
            await storeMessage({ text: question }, chatId, false); // `false` indicates it's a user message

            // Get the first 10 messages and the last 10 messages
            const first10Messages = updatedMessages.slice(0, 4);
            const last10Messages = updatedMessages.slice(-10);

            // Prepare the chat history for the context
            const promptMessages = [...first10Messages, ...last10Messages];

            // Create conversational prompt
            const conversationPrompt = `
            You are an AI assistant helping a user with their ongoing project discussions. 
            Use the following conversation history to generate a concise, ready-to-send response for the user's latest question or input. The response should be suitable for a client and should not include any extraneous details like introduction phrases, such as "here's your adjusted response," or follow-up offers like "feel free to ask anything else."
        
            **Conversation History:**  
            ${promptMessages.map(msg =>
                msg.type === 'bot'
                    ? `Assistant: ${msg.text}`
                    : `User: ${msg.text === "Skipped" ? " " : msg.text}`
            ).join('\n')}
            
            **Latest User Question:**  
            ${question}
            
            **Instructions:**  
            - Answer in a clear, concise, and professional manner.
            - Do not add meta comments such as "here's your adjusted response" or "feel free to ask anything else."
            - Refer back to previous points in the conversation when relevant.
            - Keep the response within context and ensure it fits into the ongoing conversation.
            - If any previous messages contain skipped or missing information, acknowledge that briefly and continue.
            - Do not repeat entire previous responses unless necessary, focus on new information.
            - Keep the response natural and conversational, as if you are directly talking to the client.
            - Use bullet points for clarity where applicable, but keep lists concise.
            - Avoid including personal contact information as per freelance platform policies.
            - Do not mention the questions that were already answered like budget, project start date, job link, etc.
        
            **Response Format:**  
            - Use **bold** for important points. 
            - Use *italics* for emphasis. 
            - Maintain paragraphs with line breaks (\\n) but limit the length of each section to keep the overall response concise.
            
            The response should be ready to send to the client, without additional instructions or unnecessary commentary.
        `;



            // const conversationPrompt = `
            //     You are an AI assistant helping a user with their ongoing project discussions. 
            //     Use the following conversation history to generate a helpful and relevant response to the user's latest question or input.

            //     **Conversation History:**  
            //     ${promptMessages.map(msg =>
            //     msg.type === 'bot'
            //         ? `Assistant: ${msg.text}`
            //         : `User: ${msg.text === "Skipped" ? " " : msg.text}`
            // ).join('\n')}

            //     **Latest User Question:**  
            //     ${question}

            //     **Instructions:**  
            //     - Answer in a clear, concise, and conversational manner.
            //     - Refer back to previous points in the conversation when relevant.
            //     - Keep the response within context and ensure it fits into the ongoing conversation.
            //     - If any previous messages contain skipped or missing information, acknowledge that briefly and continue.
            //     - Do not repeat entire previous responses unless necessary, focus on new information.
            //     - Ensure the response is seamlessly integrated into the ongoing conversation, without adding phrases like 'Here’s your adjusted requirement e.g your expanded response etc.' or 'Let me know if you need anything else.' The response should feel like a natural continuation of the dialogue.
            //     - Keep in mind the keywords provided at start of conversation.

            //                 **Response Format:**  
            // - Use **bold** for important points. 
            // - Use *italics* for emphasis. 
            // - Maintain paragraphs with line breaks (\\n) but limit the length of each section to keep the overall response concise.

            //     Respond in a way that continues the conversation smoothly.
            //     `;

            const conversationPromptTemplate = PromptTemplate.fromTemplate(conversationPrompt);

            // Perform the same retrieval and context generation as before
            const retrieverChain = RunnableSequence.from([
                async (prevResult) => {
                    return { standalone_question: question };  // Use the question as the standalone question
                },
                async ({ standalone_question }) => {
                    const retrievedDocs = await retriever.getRelevantDocuments(standalone_question);
                    const retrievedTexts = retrievedDocs.map(doc => doc.pageContent);
                    console.log("Retrieved Texts:", retrievedTexts);
                    return retrievedTexts
                },
                async (retrievedTexts) => {
                    const filteredTexts = retrievedTexts.filter(text => text !== null && text !== undefined);
                    const combinedContext = combineDocs(filteredTexts);
                    return { context: combinedContext };
                }
            ]);

            const answerChain = conversationPromptTemplate.pipe(model).pipe(new StringOutputParser());

            // Generate context from retriever
            const contextResult = await retrieverChain.invoke({ standalone_question: question });

            if (!contextResult.context) {
                throw new Error("Context is undefined");
            }

            // Generate the response from OpenAI
            const finalPromptData = {
                context: `${contextResult.context}`,
                question,
            };

            const openAIResponse = await answerChain.invoke(finalPromptData);

            // Add the bot's response to the chat messages
            const updatedWithBotMessages = [...updatedMessages, { type: 'bot', text: openAIResponse }];
            setChatMessages(updatedWithBotMessages); // Update the chat messages with the bot response
            setTimeout(scrollToBottom, 100);

            // Store the bot's message immediately
            await storeMessage({ text: openAIResponse }, chatId, true); // `true` indicates it's a bot message

            const delayDuration = Math.max(openAIResponse.length * 50, 2000); // Calculate delay based on response length or set a minimum
            setIsWaitingForBotResponse(false); // Re-enable input after bot responds
            setTimeout(() => {
                setResponseMessage(false); // Hide typing effect
            }, delayDuration); // Adjust this delay as needed (e.g., based on text length)
        } catch (error) {
            console.error("Error handling the question:", error);
            setIsWaitingForBotResponse(false); // Re-enable input even if error occurs
            setResponseMessage(false);
        }
    };

    const getPlanData = async (description) => {
        try {
            setIsWaitingForBotResponse(true);
            // Add product description to the messages array
            const updatedMessages = [...chatMessages];

            // Get the first 10 messages and the last 10 messages
            const first10Messages = updatedMessages.slice(0, 4);
            const last10Messages = updatedMessages.slice(-10);

            // Prepare the chat history for the context
            const promptMessages = [...first10Messages, ...last10Messages];

            // Create prompt for gathering details about pricing and plan
            // const planPrompt = `
            // You are an AI assistant helping a user understand the pricing and plan details of a product.
            // Use the conversation history to generate a precise and professional response about the pricing and plan options of the product.

            // **Conversation History:**  
            // ${promptMessages.map(msg =>
            //   msg.type === 'bot'
            //       ? `Assistant: ${msg.text}`
            //       : `User: ${msg.text === "Skipped" ? " " : msg.text}`
            // ).join('\n')}

            // **Instructions:**  
            // - Clearly state the pricing options available, including any subscription models, one-time purchases, or different pricing tiers.
            // - Provide an estimated price if no pricing is mentioned based on common industry practices.
            // - Mention if there are any discounts, offers, or flexible payment options, making sure the client understands all possible choices.
            // - Do not use vague language; ensure that the pricing information is specific and actionable.
            // - Avoid suggesting hypothetical scenarios, and provide a complete message that can be directly forwarded to the client.
            // - Keep in mind the keywords provided at start of conversation.

            // Respond with a clear and professional message, free of any ambiguities, focusing solely on pricing and plan details.
            // `;

            const planPrompt = `
            You are an AI assistant tasked with providing an estimation of costs for developing a technology solution based on historical data and industry standards. Utilize available vectorized data to provide a pricing estimate for a similar project. If no specific data is available, estimate the project cost based on common industry practices for similar technology solutions. You're also given data from the conversation history.
        
            **Conversation History:**  
            ${promptMessages.map(msg =>
                msg.type === 'bot'
                    ? `Assistant: ${msg.text}`
                    : `User: ${msg.text === "Skipped" ? " " : msg.text}`
            ).join('\n')}
            
        
            **Response Format:**  
            - Use **bold** for important points. 
            - Use *italics* for emphasis. 
            - Maintain paragraphs with line breaks (\\n) but limit the length of each section to keep the overall response concise.
        
            **Instructions:**  
            - Refer to vectorized data to find pricing information for similar project implementations if available.
            - In the absence of specific historical data, provide an estimated cost using common industry practices for technology projects.
            - Clearly outline the expected costs involved, including development, implementation, and any additional features or services.
            - Mention any potential for discounts or flexible payment options that could be negotiated in a client-freelancer setup.
            - Ensure all pricing information is specific, actionable, and suitable for being forwarded to potential clients.
            - Maintain a clear and professional tone, avoiding vague language and hypothetical scenarios.
            - Focus on providing data-driven insights and cost estimation methodologies relevant to the technology sector.
            
        
            Generate a precise and professional response focused on the cost estimation of developing a technology solution, suitable for direct client communication.
            `;


            const planPromptTemplate = PromptTemplate.fromTemplate(planPrompt);

            // Perform the same retrieval process
            const retrieverChain = RunnableSequence.from([
                async (prevResult) => {
                    return { standalone_question: description };  // Use the question as the standalone question
                },
                async ({ standalone_question }) => {
                    const retrievedDocs = await retriever.getRelevantDocuments(standalone_question);
                    const retrievedTexts = retrievedDocs.map(doc => doc.pageContent);
                    console.log("Retrieved Texts:", retrievedTexts);
                    return retrievedTexts
                },
                async (retrievedTexts) => {
                    const filteredTexts = retrievedTexts.filter(text => text !== null && text !== undefined);
                    const combinedContext = combineDocs(filteredTexts);
                    return { context: combinedContext };
                }
            ]);

            const answerChain = planPromptTemplate.pipe(model).pipe(new StringOutputParser());

            // Generate context from retriever
            const contextResult = await retrieverChain.invoke({ standalone_question: description });

            if (!contextResult.context) {
                throw new Error("Context is undefined");
            }

            // Generate the response from OpenAI
            const finalPromptData = {
                context: `${contextResult.context}`,
                description,
            };

            const openAIResponse = await answerChain.invoke(finalPromptData);

            console.log("Plan Details Response:", openAIResponse);

            // Store the bot's response in the database
            await storeMessage({ text: openAIResponse }, chatId, true); // `true` indicates it's a bot message

            const updatedWithBotMessages = [...updatedMessages, { type: 'bot', text: openAIResponse }];
            setChatMessages(updatedWithBotMessages); // Update the chat messages with the bot response
            setTimeout(scrollToBottom, 100);
            // Return or display the response as needed
            setIsWaitingForBotResponse(false);
            return openAIResponse;

        } catch (error) {
            console.error("Error fetching plan data:", error);
            setIsWaitingForBotResponse(false);
        }
    };


    const handleAnswerSubmit = (answer = currentAnswer || null) => {
        setIsWaitingForBotResponse(true); // Disable buttons when the user submits

        // Add user answer to chat (even if skipped, it's set to null)

        const updatedMessages = [...chatMessages, { type: 'user', text: answer || "Skipped" }];
        setChatMessages(updatedMessages); // Update chat messages
        setCurrentAnswer(""); // Clear input field

        // Save the product title on the second question
        if (currentQuestionIndex === 1) {
            setProductTitle(answer || ""); // Save the answer as product title
        }

        if (questions[currentQuestionIndex] === "Would you like to give some More keywords to consider while generating response?") {

            setExtraKeywords(answer);
        }


        // Move to the next question if any are left
        if (currentQuestionIndex < questions.length - 1) {
            const nextQuestion = questions[currentQuestionIndex + 1];
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeout(() => {
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'bot', text: nextQuestion }
                ]);
                setIsWaitingForBotResponse(false); // Re-enable buttons after bot responds
            }, 800); // Simulate delay for next question

        } else {
            // All questions have been answered
            setTimeout(() => {
                // Add thank you message and generating response message
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'bot', text: "Thank you for answering all the questions!" },
                    { type: 'bot', text: "Generating response..." }
                ]);

                // Save chat data including questions and answers in the correct sequence
                saveChatData(updatedMessages); // Call the function to save data
                // setIsWaitingForBotResponse(false); // Re-enable buttons after processing
            }, 1600); // Simulate delay for generating response
        }
    };

    const saveChatData = async (messages) => {
        const chatData = {
            user_id: Helper.authUser.id,
            timestamp: new Date().toISOString(),
            chat_name: `${productTitle} / ${selectedOption}`,
            description: description
        };

        try {
            // Get OpenAI response
            const openAIResponse = await getOpenAIResponse(selectedOption, description, messages, keywords, selectedCoverLetter);
            console.log("OpenAI response:", openAIResponse);

            // Save chat data
            const chatResponse = await axios.post(`${Helper.apiUrl}proposal_chats/store`, chatData, Helper.authHeaders);
            console.log("Chat saved:", chatResponse.data.chat.id);
            const chatId = chatResponse.data.chat.id; // Assuming the response contains the chat ID

            // Prepare an array of messages with questions and answers
            const messagesData = messages.map((msg, index) => {
                const isQuestion = index % 2 === 0; // Assuming even indexes are questions
                return {
                    chat_id: chatId,
                    message: isQuestion ? questions[index / 2] : msg.text,
                    is_bot: isQuestion ? 1 : 0, // 1 for bot (question), 0 for user (answer)
                    user_id: Helper.authUser.id,
                    timestamp: new Date().toISOString(),
                };
            });

            // Add the OpenAI response to the messagesData
            messagesData.push({
                chat_id: chatId,
                message: openAIResponse,
                is_bot: 1, // This is a response from the bot
                user_id: Helper.authUser.id,
                timestamp: new Date().toISOString(),
            });

            console.log(messagesData);

            // Save all messages in one go
            const messagesResponse = await axios.post(`${Helper.apiUrl}proposal_chats/messages/store`, { messages: messagesData }, Helper.authHeaders);
            console.log("All messages saved:", messagesResponse);
            navigate(`/user/settings/${chatResponse.data.chat.slug}`, {
                state: { resultResponse: true },
            });
            fetchChatHistory();
        } catch (error) {
            console.error("Error saving chat data:", error);
        }
    };

    const handleEditDescription = () => {
        setIsDescriptionSubmitted(false); // Allow editing the description
    };

    // Function to change chat status
    const handleChangeStatus = (status) => {
        setChatStatus(status); // Update the chat status
    };

    // Handle option selection
    const handleOptionSelect = (option) => {
        setSelectedOption(option); // Set the selected option
        setShowOptionsDropdown(false); // Close the dropdown after selection

    };

    useEffect(() => {
        fetchChatHistory();
    }, []);
    useEffect(() => {
        console.log(extraKeywords);
    }, [extraKeywords]);

    const setNewChat = () => {
        setIsTitleEntered(false)
        setIsDescriptionEntered(false)
        setDescription(""); // Clear description
        setProductTitle(""); // Clear product title
        setIsDescriptionSubmitted(false); // Reset description submission state
        setChatMessages([]); // Clear chat messages
        setCurrentQuestionIndex(0); // Reset question index
        setSelectedKeywords([])
        setGeneratedKeywords([])
        setKeywords("")
        setExtraKeywords("")
        setCurrentAnswer(""); // Clear current answer
        setIsIntroVisible(true); // Show intro message
        navigate('/user/settings')

    };
    const fetchChatHistory = () => {
        axios.get(`${Helper.apiUrl}proposal_chats/chats`, Helper.authHeaders)
            .then(response => {
                setChatHistory(response.data.chats); // Store the chat history in state
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error fetching chat history:", error);
            });
    };

    if (!openAiApiKey) {
        return (
            <div>Loading Open AI</div>
        )
    }

    return (
        <div className="d-flex flex-column flex-column-fluid">
            {/* Toolbar with a Settings title */}
            {/* <Toolbar title={"Settings"} /> */}

            {/* Main content area */}
            <MainContent>
                <FullRow>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "margin": "15px 05px" }}>
                        <h2>Chat History</h2>
                        <button class="btn btn-primary btn-sm" onClick={() => setNewChat()} style={{}}>New Chat</button>
                    </div>
                    <div className="d-flex" style={{ height: 'auto' }}>
                        {/* Left - Chat History Box */}
                        {/* <div className="chat-history-box">
                            <ul className="history-list">
                                {chatHistory.length > 0 ? chatHistory.map((chat, index) => (
                                    <Link to={`/user/settings/${chat.slug}`}><li className={`p-2 my-2 ${chat_slug == chat.slug ? 'history_li_active' : 'history_li'} rounded cursor-pointer bg-gray-200 transition duration-150`} key={index}>{chat.chat_name}</li></Link>
                                )) : (
                                    <li>No Data Yet</li>
                                )}
                            </ul>
                        </div> */}
                        <div className="chat-history-box">
                            <input
                                type="text"
                                className=" p-2 mb-2 rounded border border-gray-300"
                                placeholder="Search chats..."
                                style={{ "width": "100%" }}
                                onChange={handleSearchChange}
                            />
                            <ul className="history-list">
                                {filteredChats.length > 0 ? filteredChats.map((chat, index) => (
                                    <Link to={`/user/settings/${chat.slug}`} key={index}>
                                        <li className={`p-2 my-2 ${chat_slug === chat.slug ? 'history_li_active' : 'history_li'} rounded cursor-pointer bg-gray-200 transition duration-150`}>
                                            {chat.chat_name}
                                        </li>
                                    </Link>
                                )) : (
                                    <li className="text-center mt-2">No Chats Yet</li>
                                )}
                            </ul>
                        </div>

                        {/* Right - Chat Interface */}
                        <div className="chat-interface">
                            {/* If the description is not yet submitted, show the description box */}
                            {!isDescriptionSubmitted ? (
                                <div>
                                    <div>
                                        <h4 className="mt-2">Project Title</h4>
                                        <input
                                            type="text"
                                            className="form-control mb-3"
                                            placeholder="Enter the project title"
                                            value={productTitle}
                                            onChange={(e) => {
                                                setProductTitle(e.target.value);
                                                setIsTitleEntered(e.target.value.trim() !== ""); // Enable description field if title is entered
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <h4 className="mt-2">Project Description</h4>
                                        {/* <div className="dropdown-options">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                                            >
                                                {selectedOption}
                                            </button>
                                            {showOptionsDropdown && (
                                                <ul className="options-dropdown-menu">
                                                    <li onClick={() => handleOptionSelect("Cover Letter")}>
                                                        Cover Letter
                                                    </li>
                                                    <li onClick={() => handleOptionSelect("Name")}>Name</li>
                                                    <li onClick={() => handleOptionSelect("System")}>System</li>
                                                </ul>
                                            )}
                                        </div> */}
                                        <textarea
                                            className="form-control mb-3"
                                            placeholder="Describe your client's project requirements..."
                                            rows="10"
                                            value={description}
                                            disabled={!isTitleEntered} // Description enabled only after title is entered
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                                setIsDescriptionEntered(e.target.value.trim() !== ""); // Enable 'Generate Keywords' button when description is entered
                                            }}
                                        />
                                    </div>

                                    {/* Show the 'Generate Keywords' button after the description is entered */}
                                    {isDescriptionEntered && (
                                        <button
                                            className="btn btn-primary btn-sm flex-end mb-3"
                                            onClick={generatedKeywords.length > 0 ? regenerateKeywords : handleGenerateKeywords}  // Call regenerate if there are existing keywords
                                            disabled ={isWaitingForBotResponse}
                                        >
                                            {generatedKeywords.length > 0 ? 'Regenerate Keywords' : 'Generate Keywords'}
                                        </button>
                                    )}

                                    {generatedKeywords.length > 0 && (
                                        <div className="mt-4">
                                            <h4>Generated Keywords</h4>
                                            <div className="d-flex flex-wrap gap-2">
                                                {generatedKeywords.map((keyword, index) => {
                                                    const isSelected = selectedKeywords.includes(keyword);
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={`keyword-chip ${isSelected ? 'selected' : ''}`}
                                                            onClick={() => toggleKeywordSelection(keyword)}
                                                        >
                                                            {isSelected ? '-' : '+'} {keyword}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* <div className="d-flex justify-between my-2 align-items-center">
                                        <h4 className="mt-2">Project Description</h4>
                                        
                                    </div>
                                    <textarea
                                        className="form-control mb-3"
                                        placeholder="Describe your client's project requirements..."
                                        rows="10"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    /> */}
                                    {selectedTemplateId && (
                                        <div className="my-4">
                                            <label htmlFor="coverLetterDropdown" className="form-label">Select a Cover Letter Template:</label>

                                            <div className="dropdown-button-container">
                                                <select
                                                    id="coverLetterDropdown"
                                                    className="form-select mb-3"
                                                    value={selectedTemplateId}
                                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                                >
                                                    {coverLetterTemplates.map((template) => (
                                                        <option key={template.id} value={template.id}>
                                                            {template.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={handleToggleCoverLetter}
                                                >
                                                    {showCoverLetterContent ? "Hide" : "View"}
                                                </button>
                                            </div>
                                            {showCoverLetterContent && selectedCoverLetter && (
                                                <div className="selected-cover-letter mt-3">
                                                    <h5>Cover Letter: {selectedCoverLetter.name}</h5>
                                                    <p>{selectedCoverLetter.content}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}


                                    <button disabled={isWaitingForBotResponse} className="btn btn-primary btn-sm" onClick={handleDescriptionSubmit}>
                                        Submit Description
                                    </button>

                                    {/* Dropdown for selecting an option */}

                                </div>
                            ) : (
                                <div>
                                    {/* Show the selected option in the chat interface */}
                                    {!chat_slug && (
                                        <div className="selected-option-display">
                                            <h5>Selected Option: {selectedOption}</h5>
                                        </div>
                                    )}

                                    <div className="top-buttons d-flex align-items-center">
                                        {/* Custom Settings button with hover dropdown */}
                                        <div className={`dropdown-custom ${chat_slug ? 'a' : 'no-pointer'}`}>
                                            <button className="btn btn-primary btn-sm">
                                                Settings
                                            </button>
                                            <ul className="custom-dropdown-menu">
                                                <li
                                                    className="dropdown-item"
                                                    onClick={() => handleChangeStatus("Pending")}
                                                >
                                                    Mark Pending
                                                </li>
                                                <li
                                                    className="dropdown-item"
                                                    onClick={() => handleChangeStatus("Incomplete")}
                                                >
                                                    Mark Incomplete
                                                </li>
                                                <li
                                                    className="dropdown-item"
                                                    onClick={() => handleChangeStatus("Complete")}
                                                >
                                                    Mark Complete
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Plan button */}
                                        <button
                                            className="btn btn-primary btn-sm"
                                            disabled={!chat_slug || isWaitingForBotResponse}
                                            onClick={() => getPlanData(description)}
                                        >
                                            Plan
                                        </button>

                                        {!chat_slug && (
                                            <button className="btn btn-primary btn-sm" onClick={handleEditDescription}>
                                                Data
                                            </button>
                                        )}
                                    </div>

                                    {/* Show the "Fill in the details" inside the chatbox */}
                                    {isIntroVisible && chatMessages.length === 0 && (
                                        <div className="centered-heading-chatbox">
                                            <h2>Fill in the details</h2>
                                        </div>
                                    )}

                                    {/* Chat interface with message bubbles */}
                                    <div className="chat-messages-container" ref={chatMessagesContainerRef}>
                                        <div className="chat-messages">
                                            {chatMessages.map((message, index) => {
                                                const isLastMessage = index === chatMessages.length - 1; // Check if it's the last message
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`message-bubble ${message.type === 'bot' ? 'bot-message' : 'user-message'}`}
                                                    >
                                                        {message.type === 'bot' ? (
                                                            <>
                                                                <TypingEffect
                                                                    scrollToBottom={scrollToBottom}
                                                                    text={message.text} // Pass the bot's message to TypingEffect
                                                                    isResponseMessage={responseMessage} // Adjust this prop as needed
                                                                    isLastMessage={isLastMessage} // Check if it's the last message
                                                                />
                                                                {/* <ChatGPTFormatter response={message.text} /> Use ChatGPTFormatter here */}
                                                            </>
                                                        ) : (
                                                            <ChatGPTFormatter response={message.text} /> // For user messages
                                                        )}
                                                    </div>
                                                );
                                            })}

                                        </div>
                                    </div>

                                    {/* Input field for user's answer */}
                                    {currentQuestionIndex < questions.length && !chat_slug ? (
                                        <div className="answer-input">
                                            <input
                                                type="text"
                                                className="form-control mb-3"
                                                placeholder="Enter your answer (optional)..."
                                                value={currentAnswer}
                                                disabled={isWaitingForBotResponse}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                            />
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleAnswerSubmit(currentAnswer)}
                                                    disabled={isWaitingForBotResponse}
                                                >
                                                    Submit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleAnswerSubmit(null)}
                                                    disabled={isWaitingForBotResponse}
                                                >
                                                    Skip
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="answer-input">
                                            <input
                                                type="text"
                                                className="form-control "
                                                placeholder="Ask a question..."
                                                value={currentAnswer}
                                                disabled={isWaitingForBotResponse}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                            />
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleAskQuestionSubmit(currentAnswer)}
                                                    disabled={isWaitingForBotResponse}
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </FullRow>
            </MainContent>

            {/* Styles for chat interface, top buttons, and layout */}
            <style jsx="true">{`
                .d-flex {
                    display: flex;
                    gap: 15px;
                }

                .top-buttons {
                    margin-bottom: 15px;
                }

                .chat-history-box {
                    width: 30%;
                    padding: 20px 10px 05px 10px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #f9f9f9;
                    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
                    overflow-y: auto; /* Enable scrolling when content overflows */
                }
                .history-list{
                    margin: 0px 5px;
                    min-height:60vh; 
                    max-height:65vh; 
                }

                .chat-interface {
                    width: 70%;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #f9f9f9;
                    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
                    overflow-y: hidden; /* Enable scrolling when content overflows */
                }

                .chat-messages-container {
                    background-color: #f5f5f5;
                    min-height:50vh;    
                    max-height:58vh;    
                    border-radius: 10px;
                    padding: 10px;
                    overflow-y: auto; /* Allow scrolling for overflow */
                    display: flex; /* Flexbox to control message alignment */
                    flex-direction: column; /* Stack messages vertically */

                }

                .chat-messages {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1; /* Grow to fill available space */
                    justify-content: flex-end; /* Align messages at the bottom */
                    gap: 10px; /* Add some space between messages */
                }
                .message-bubble {
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 10px;
                    max-width: 80%;
                    word-wrap: break-word;
                    opacity: 0; /* Start with hidden */
                    animation: fadeIn 0.5s forwards; /* Animation for fade-in effect */
                }
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(10px); /* Move slightly up */
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0); /* Bring to original position */
                    }
                }


                .bot-message {
                    background-color: #e0e0e0;
                    text-align: left;
                    margin-right: auto;
                }

                .user-message {
                    background-color: #F57C00;
                    color: white;
                    text-align: right;
                    margin-left: auto;
                }

                .answer-input {
                    margin-top: 10px;
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .history-list {
                    list-style: none;
                    padding: 0;
                }

                .dropdown-custom {
                    position: relative;
                }

                .dropdown-custom:hover .custom-dropdown-menu {
                    visibility: visible;
                    opacity: 1;
                    transform: translateY(0);
                }

                .custom-dropdown-menu {
                    visibility: hidden;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: visibility 0.3s ease, opacity 0.3s ease, transform 0.3s ease !important;
                    position: absolute;
                    background-color: white;
                    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
                    padding: 10px;
                    border-radius: 8px;
                    list-style: none;
                    width: 150px;
                    z-index: 1;
                }

                .custom-dropdown-menu li {
                    padding: 8px 10px;
                    cursor: pointer;
                }

                .custom-dropdown-menu li:hover {
                    background-color: #f0f0f0;
                }

                /* Dropdown for additional options */
                .dropdown-options {
                    position: relative;
                    margin-left: 20px;
                }

                .dropdown-options:hover .options-dropdown-menu{
                    visibility: visible;
                    opacity: 1;
                    transform: translateY(0);
                }

                .options-dropdown-menu {
                    visibility: hidden;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: visibility 0.3s ease, opacity 0.3s ease, transform 0.3s ease !important;
                    position: absolute;
                    background-color: white;
                    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
                    padding: 10px;
                    border-radius: 8px;
                    list-style: none;
                    width: 150px;
                    z-index: 1;
                }


                 .keyword-chip {
        padding: 5px 10px;
        background-color: #f0f0f0;
        border: none;
        border-radius: 15px;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }

    .keyword-chip.selected {
        background-color: #F57C00;
        color: white;
    }

    .keyword-chip:hover {
        border: 1px solid #F57C00;
    }

                .options-dropdown-menu li {
                    padding: 8px 10px;
                    cursor: pointer;
                }

                .options-dropdown-menu li:hover {
                    background-color: #f0f0f0;
                }

                /* Larger and vertically spaced "Fill in the details" heading inside the chatbox */
                .centered-heading-chatbox {
                    text-align: center;
                    font-size: 1.5rem;
                    margin-top: 40px;
                    margin-bottom: 40px;
                    color: #555;
                }
                .dropdown-button-container {
        display: flex;
        align-items: center;
        gap: 10px; /* Adjust the gap between the dropdown and the button */
    }

    .form-select {
        flex-grow: 1; /* This will make the select input take available space */
    }

    .btn {
        margin: 0; /* Reset margin to ensure the button is properly aligned */
    }
            `}</style>
        </div>
    );
};

export default Settings;
