import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { useApi } from '../Context/ApiContext';

export const useRetriever = () => {
  const { openAiApiKey, supabaseApiKey, supabaseUrl, isLoading } = useApi(); // Get API keys from context
  const [retriever, setRetriever] = useState(null);

  useEffect(() => {
    if (!isLoading && openAiApiKey && supabaseApiKey && supabaseUrl) {
      // Log values to ensure they are correct
      console.log("Initializing embeddings with OpenAI API Key:", openAiApiKey);
  
      try {
        // Create OpenAIEmbeddings with the API key from context
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: openAiApiKey // Use correct key format
        });
        // Create Supabase client with the keys from context
        const client = createClient(supabaseUrl, supabaseApiKey);
  
        // Initialize the vector store
        const vectorStore = new SupabaseVectorStore(embeddings, {
          client,
          tableName: 'cyberify_knowledgebase',
          queryName: 'get_knowledgebase_documents'
        });
  
        // Set the retriever state
        setRetriever(vectorStore.asRetriever());
      } catch (error) {
        console.error("Error initializing retriever:", error);
      }
    }
  }, [isLoading, openAiApiKey, supabaseApiKey, supabaseUrl]);
  

  return retriever; // Return the initialized retriever
};
