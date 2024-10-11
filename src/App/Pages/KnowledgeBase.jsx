import { useEffect, useRef, useState } from "react";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import FullRow from "../Components/FullRow";
import axios from "axios";
import Helpers from "../Config/Helper";
import { useApi } from "../Context/ApiContext";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

const KnowledgeBase = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]); // To store the list of files
    const [selectedFileContent, setSelectedFileContent] = useState(''); // To store the content of the selected file
    const { openAiApiKey, supabaseApiKey, supabaseUrl } = useApi();
    
    const fileInputRef = useRef(null);

    // Fetch all files from the API
    const fetchAllFiles = async () => {
        try {
            const response = await axios.get(`${Helpers.apiUrl}knowledgebase/files`, Helpers.authHeaders);
            setUploadedFiles(response.data.files); // Assuming the API returns a 'files' array
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    // Fetch files on component mount
    useEffect(() => {
        fetchAllFiles();
    }, []);

    const sanitizeText = (text) => {
        return text.replace(/\u0000/g, ''); // Remove NULL characters
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile); 
    };



    const handleUpload = async (file) => {
        if (file) {
            setIsLoading(true);
            try {
                const formData = new FormData();
                formData.append("file", file);

                // Call to knowledgebase/save API
                const response = await axios.post(
                    `${Helpers.apiUrl}knowledgebase/save`,
                    formData,
                    Helpers.authFileHeaders
                );

                let fileContent = response.data.file_content;
                fileContent = sanitizeText(fileContent);

                // Now vectorize the received content
                const splitter = new RecursiveCharacterTextSplitter({
                    chunkSize: 500,
                    chunkOverlap: 50,
                    separators: ["\n\n", "\n", " ", ""],
                });
                const output = await splitter.createDocuments([fileContent]);

                // Supabase vector storage setup
                const client = createClient(supabaseUrl, supabaseApiKey);
                await SupabaseVectorStore.fromDocuments(
                    output,
                    new OpenAIEmbeddings({
                        openAIApiKey: openAiApiKey,
                    }),
                    {
                        client,
                        tableName: "cyberify_knowledgebase",
                    }
                );

                Helpers.toast("success", "File uploaded and vectorized successfully");
                fetchAllFiles(); // Fetch the files again to refresh the list
            } catch (error) {
                if (error.response) {
                    Helpers.toast("error", error.response.data.message);
                } else {
                    Helpers.toast("error", "Unexpected error occurred");
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            Helpers.toast("error", "Can't send without file");
        }
    };


    // Handle when a file is clicked to show its content
    const handleFileClick = (file) => {
        setSelectedFileContent(file.file_content); // Set the selected file content to display
    };

    // Handle direct file upload
    const handleDirectUpload = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        if (file) {
            // This will run whenever 'file' is updated
            console.log("File has been updated:", file);
            handleUpload(file); // Call upload here if needed
        }
    }, [file]);

    return (
        <div className="d-flex flex-column flex-column-fluid">
            {/* Toolbar with a title */}
            <Toolbar title={"Knowledge Base"} />

            {/* Main content area */}
            <MainContent>
                <FullRow>
                    <div className="d-flex" style={{ height: 'auto' }}>
                        {/* Left - File List Box */}
                        <div className="file-list-box">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <h4>File List</h4>
                                <button className="btn btn-primary btn-sm" onClick={handleDirectUpload} disabled={isLoading}>
                                    {isLoading ? 'Uploading...' : 'Upload File'}
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

                            </div>
                            <ul className="file-list">
                                {uploadedFiles.length > 0 ? uploadedFiles.map((file, index) => (
                                    <li className={`p-2 my-2 ${selectedFileContent === file.file_content ? 'file_li_active' : 'file_li'} rounded cursor-pointer bg-gray-200 transition duration-150`} key={index} onClick={() => handleFileClick(file)}>
                                        {file.file_name}
                                    </li>
                                )) : (
                                    <li>No Data Yet</li>
                                )}
                            </ul>
                        </div>

                        {/* Right - File Content */}
                        <div className="file-content">
                            {selectedFileContent ? (
                                <div className="file-content-box">
                                    <h4>File Content</h4>
                                    <p>{selectedFileContent}</p>
                                </div>
                            ) : (
                                <div className="empty-message">
                                    <h4>Click on an item to see data</h4>
                                </div>
                            )}
                        </div>
                    </div>
                </FullRow>
            </MainContent>

            {/* Styles */}
            <style jsx="true">{`
                .d-flex {
                    display: flex;
                    gap: 15px;
                }

                .file-list-box {
                    width: 30%;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #f9f9f9;
                    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
                }

                .file-content {
                    width: 70%;
                    padding: 20px;
                    border: 1px solid #ddd;
                    max-height: 70vh;
                    overflow-y: scroll;
                    border-radius: 10px;
                    background-color: #f9f9f9;
                    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
                }

                .file-list {
                    list-style: none;
                    padding: 0;
                }

                .file_li_active {
                    background-color: #F57C00;
                    color: white;
                }

                .file_li {
                    background-color: #e0e0e0;
                }

                .file-content-box {
                    margin-top: 20px;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                     display: flex;
                     flex-direction:column;
    justify-content: center;
    align-items: center; /* Centers content vertically */
                }
                 .empty-message {
display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    color: #888;
    height: 100%; /* Ensure it takes up the full height of the parent container */
    text-align: center; /* Center th
                }
            `}</style>
        </div>
    );
};

export default KnowledgeBase;
