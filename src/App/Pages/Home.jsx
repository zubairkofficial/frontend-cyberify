import { useState } from "react";
import MainContent from "../Components/MainContent";
import Row from "../Components/Row";
import Toolbar from "../Components/Toolbar";
import Helper from "../Config/Helper";
import axios from 'axios';
import ChatGPTFormatter from "../Components/ChatGPTFormatter";

const Home = () => {

    const [transcription, setTranscription] = useState("");
    const [summary, setSummary] = useState("");

    const checkPrompt = () => {


        let trans = `"Transcription Text: ${transcription} \n"`;

        let mainPrompt = trans + `Ich habe die Transkription des Benutzers beigefügt, aus der ich die Informationen extrahieren und die Ausgabe in einem bestimmten Format in JSON bereitstellen muss. 
Es gibt 2 Fälle, wenn die Transkription genügend Informationen enthält, aus denen der Inhalt extrahiert werden kann, oder die Informationen unzureichend oder ungültig sind. (WENN DIE INFORMATIONEN NICHT AUSREICHEN ODER DER TESTFALL UNGÜLTIG ODER NICHT KORREKT IST. MÜSSEN SIE FÜR DIE ZWEITE OPTION JSON AUSGABE MIT STATUSCODE 422 GEHEN)
Ich brauche es wie
{
'status_code': "200"
'summary': "HIER WIRD DIE KOMPLETTE ZUSAMMENFASSUNG DES TRANSKRIPTIONSTEXTES STEHEN - ICH WERDE AUCH DAS FORMAT DER ZUSAMMENFASSUNG AM ENDE HINZUFÜGEN", 
'date': DATE_HERE,
         'topic': 'TOPIC_HERE',
           'company_number': 'Number_here',
           'participants': 'PARTICIPANTS_HERE',
           'author': 'AUTHOR_HERE',
          'branch_manager': 'BRANCH_MANAGER_HERE'
           'general_information': 'GENERAL_INFORMATION_HERE',
           'sales_topic': 'SALES_TOPIC',
           'tasks': 'AUFGABEN',
           'author_message': 'AUTHOR_MESSAGE',
}

HINWEIS: Wenn Sie die Informationen für ein bestimmtes Feld nicht finden können. Lassen Sie es leer.
            
ZUSAMMENFASSUNG FORMAT

Allgemein (diese Überschrift fett drucken)
[TEXT_HERE]
Verkaufsthemen (diese Überschrift fett drucken)
[TEXT_HERE]
Einkaufsthemen (diese Überschrift fett drucken)
[TEXT_HERE]
Aufgaben (diese Überschrift fett drucken)
[TEXT_HERE]
Eigenmarke (diese Überschrift fett drucken)
[TEXT_HERE]
            
[FÜGEN SIE HIER DIE URSPRÜNGLICHE TRANSKRIPTION EIN]

Falls die Transkription nicht gültig oder unpassend ist, geben Sie das Format in JSON zurück
{
"status_code": "422",
"message": "Der Transkriptionstext ist nicht gültig. Try Again."
}

The Final output must be in JSON format
`;



        let body = {
            "model":"gpt-4o",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": mainPrompt}
            ],
            "response_format": { "type": "json_object" },
            "temperature": 0
        };
        let headers = {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer sk-proj-fsvCwfLeZPgH6de38PT2T3BlbkFJWe2pen5b5gRNpO7o2eiM',
            },
        }
        axios.post('https://api.openai.com/v1/chat/completions', body, headers).then(response => {
            let res = response.data.choices[0].message.content;
            let json_output = JSON.parse(res);
            if(parseInt(json_output.status_code) === 200){
                setSummary(json_output.summary);
            }
            console.log(json_output);
        }).catch(error => {
            console.log(error.response.data);
        });
    }

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Dashboard"}>
                {/* <Link to="/user/projects/create" className="btn btn-sm btn-flex btn-primary fw-bold">
                    Create Project
                </Link> */}
            </Toolbar>
            <MainContent>
                <Row>
                    <textarea value={transcription} onChange={e => setTranscription(e.target.value)}></textarea>
                    <br />
                    <button onClick={checkPrompt}>Test API</button>
                    <br />
                    <br />
                    <ChatGPTFormatter response={summary} />
                </Row>
            </MainContent>
        </div>
    );
}

export default Home;