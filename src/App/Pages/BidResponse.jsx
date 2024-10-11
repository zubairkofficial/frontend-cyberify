import { Link } from "react-router-dom";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import Row from "../Components/Row";
import Column from "../Components/Column";
import FullRow from "../Components/FullRow";
import Card from "../Components/Card";
import TextInput from "../Components/TextInput";
import { useEffect, useState } from "react";
import Spinner from "../Components/Spinner";
import axios from "axios";
import Helper from "../Config/Helper";
import ChatGPTFormatter from "../Components/ChatGPTFormatter";

const BidResponse = () => {
    const defaultParams = {
        proposal: "", 
        bidding: "",
        message: "",
    }

    const [params, setParams] = useState(defaultParams);
    const [loading, setloading] = useState();
    const [profileInfo, setProfileInfo] = useState({});
    const [response, setResponse] = useState("");

    const getProfileInfo = () => {
        axios.get(`${Helper.apiUrl}upwork/profile-info`, Helper.authHeaders).then(response => {
            setProfileInfo(response.data);
        });
    }

    const generateResponse = () => {
        setloading(true);
        let user_content = `**Upwork Profile Information**\n`;
        user_content += `Title: ${profileInfo.title}\n`;
        user_content += `Description: ${profileInfo.description}\n`;
        user_content += `Hourly Rate: ${profileInfo.hourly_rate}\n`;
        user_content += `Agency: Cyberify\n`;
        user_content += `**JOB POST (FROM CLIENT)**\n`;
        user_content += `${params.proposal}\n`;
        user_content += `**PROPOSAL (SENT TO CLIENT BY ME)**\n`;
        user_content += `${params.bidding}\n`;
        user_content += `**MESSAGE (Initial message from client)**\n`;
        user_content += `${params.message}\n`;
        user_content += `\n\nINSTRUCTIONS\n`;
        user_content += `Generate a response based on client's message which is related to job post and proposal submitted and if any information required for experience which is in upwork profile.\n`;
        user_content += `1- The response should be professional tone\n`;
        user_content += `2- The response should be strictly answering only about the message. Nothing extra to add\n`;
        user_content += `3- Don't add anything which is not related to client's message\n`;
        user_content += `4- If client has sent any links to check or any files to check. Response client appropriately to take some time to check and then come back after check.\n`;
        user_content += `5- Don't try to respond inappropriate answer if there is anything which requires some link or file checking\n`;
        user_content += `6- If client wants to schedule a meeting or meet share this link (https://calendly.com/mzubairkhan-official) (don't create this any hyperlink just add add it in the response as text) to client to book a meeting according to their availability \n`;
        user_content += `7- If the client is looking for agency then mention the agency otherwise majorly keep it as a freelancer`;
        user_content += `8- The response should completely in a text only without any formatting done like bold or italic or anything (Even if there are links add the links in the text response instead of creating links) - STRICTLY NO FORMATTING.`;

        let openai_settings = JSON.stringify({
            model: "gpt-4o",
            messages: [
                {
                    "role": "system",
                    "content": "You're a Upwork Professional and based on your profile and job details you need to properly respond to the message"
                },
                {
                    "role": "user",
                    "content": user_content
                }
            ],
            temperature: 0,
        });
          
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.openai.com/v1/chat/completions',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${Helper.openaiAPI}`, 
            },
            data : openai_settings
        };
          
        axios.request(config).then((response) => {
            console.log(response.data);
            setResponse(response.data.choices[0].message.content);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setloading(false);
        });
    }

    const copyResponse = () => {
        navigator.clipboard.writeText(response);
        Helper.toast("success", "Copied");
    }

    useEffect(() => {
        getProfileInfo();
    }, []);

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Generate Response"}></Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        <FullRow>
                            <TextInput label="Project Proposal" placeholder="Client's proposal" required={true} isTextArea={true} value={params.proposal} onChange={e => setParams({...params, proposal: e.target.value})} />
                        </FullRow>
                        <FullRow>
                            <TextInput label="Bidding Proposal" placeholder="Proposal sent to client" required={true} isTextArea={true} value={params.bidding} onChange={e => setParams({...params, bidding: e.target.value})} />
                        </FullRow>
                        <FullRow>
                            <TextInput label="Client's Message" placeholder="Message from Client" required={true} isTextArea={true} value={params.message} onChange={e => setParams({...params, message: e.target.value})} />
                        </FullRow>
                        <FullRow>
                            <button className="btn btn-primary btn-loading" onClick={generateResponse} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Generate Response"}</button>
                        </FullRow>
                        <br />
                        {response && <FullRow>
                            <p><ChatGPTFormatter response={response} /></p>
                            <button className="btn btn-add-task btn-sm" onClick={copyResponse}>Copy</button>
                        </FullRow>}
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
}

export default BidResponse;