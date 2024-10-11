import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Helpers from '../Config/Helper.js';

// Create the ApiContext
const ApiContext = createContext();

// ApiProvider component to wrap the application
export const ApiProvider = ({ children }) => {
    const [openAiApiKey, setOpenAiApiKey] = useState("DEFAULT_API_KEY");
    const [supabaseApiKey, setSupabaseApiKey] = useState("");
    const [supabaseUrl, setSupabaseUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Function to fetch the API keys from the backend
    const fetchApiKeys = async () => {
        setIsLoading(true);
        let retries = 0;
        const maxRetries = 3;

        const fetchKeys = async () => {
            try {
                // Fetch API keys from the settings endpoint
                const response = await axios.get(`${Helpers.apiUrl}settings`, Helpers.authHeaders);

                // Set API keys in state
                setOpenAiApiKey(response.data.openaikey || "DEFAULT_API_KEY");
                setSupabaseApiKey(response.data.supabasekey || "");
                setSupabaseUrl(response.data.supabaseurl || "");
            } catch (error) {
                console.error("Error fetching API keys: ", error);
                if (retries < maxRetries) {
                    retries++;
                    await fetchKeys();
                } else {
                    setOpenAiApiKey("DEFAULT_API_KEY"); // Set a default value
                }
            }
        };

        await fetchKeys();
        setIsLoading(false);
    };

    // Fetch API keys when the component mounts
    useEffect(() => {
        fetchApiKeys();
    }, []);

    // Provide the API keys and fetch function throughout the app
    return (
        <ApiContext.Provider value={{ openAiApiKey, supabaseApiKey, supabaseUrl, isLoading, fetchApiKeys }}>
            {children}
        </ApiContext.Provider>
    );
};

export { ApiContext };

// Create a new hook that wraps the useContext hook
export const useApi = () => {
  const context = useContext(ApiContext);
  return context;
};  