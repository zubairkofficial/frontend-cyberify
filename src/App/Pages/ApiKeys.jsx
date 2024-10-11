import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import FullRow from "../Components/FullRow";
import Helpers from '../Config/Helper.js';

const ApiKeys = () => {
    const [openAiApiKey, setOpenAiApiKey] = useState('');
    const [supabaseApiKey, setSupabaseApiKey] = useState('');
    const [supabaseUrl, setSupabaseUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoadingOpenAi, setIsLoadingOpenAi] = useState(false);
    const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);

    // Fetch both API keys on page load
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${Helpers.apiUrl}admin/settings`, Helpers.authHeaders);
                setOpenAiApiKey(response.data.openaikey || '');
                setSupabaseApiKey(response.data.supabasekey || '');
                setSupabaseUrl(response.data.supabaseurl || '');
            } catch (error) {
                console.error('Failed to fetch settings', error);
            }
        };

        fetchSettings();
    }, []);

    // Handle OpenAI API submission
    const handleSubmitOpenAi = async (event) => {
        event.preventDefault();
        setIsLoadingOpenAi(true);

        try {
            await axios.post(`${Helpers.apiUrl}admin/settings/openai`, { api_key: openAiApiKey }, Helpers.authHeaders);
            Helpers.toast("success", "OpenAI API Key Updated Successfully");
        } catch (error) {
            console.error('Failed to update OpenAI API key', error);
            setErrors({ openai: 'Failed to update OpenAI API key. Please check your input.' });
        }

        setIsLoadingOpenAi(false);
    };

    // Handle Supabase API submission
    const handleSubmitSupabase = async (event) => {
        event.preventDefault();
        setIsLoadingSupabase(true);

        try {
            await axios.post(`${Helpers.apiUrl}admin/settings/supabase`, { api_key: supabaseApiKey, url: supabaseUrl }, Helpers.authHeaders);
            Helpers.toast("success", "Supabase API and URL Updated Successfully");
        } catch (error) {
            console.error('Failed to update Supabase settings', error);
            setErrors({ supabase: 'Failed to update Supabase settings. Please check your input.' });
        }

        setIsLoadingSupabase(false);
    };

    return (
        <div className="container mt-5 p-5 shadow-lg rounded bg-white">
            <Toolbar title={"API Keys"} />

            <MainContent>
                <FullRow>
                <div className="d-flex" style={{ height: 'auto' }}>
                        {/* OpenAI API Settings */}
                        <div className="col-md-6 shadow-lg p-4 rounded m-3">
                            <form onSubmit={handleSubmitOpenAi} className="p-3">
                                <h2 className="mb-4 text-center">OpenAI Settings</h2>
                                <div className="mb-3">
                                    <label htmlFor="openAiApiKey" className="form-label">OpenAI API Key:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="openAiApiKey"
                                        value={openAiApiKey}
                                        onChange={(event) => setOpenAiApiKey(event.target.value)}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isLoadingOpenAi}>
                                        {isLoadingOpenAi ? 'Saving...' : 'Save OpenAI API Key'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Supabase API Settings */}
                        <div className="col-md-6 shadow-lg p-4 rounded m-3">
                            <form onSubmit={handleSubmitSupabase} className="p-3">
                                <h2 className="mb-4 text-center">Supabase Settings</h2>
                                <div className="mb-3">
                                    <label htmlFor="supabaseApiKey" className="form-label">Supabase API Key:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="supabaseApiKey"
                                        value={supabaseApiKey}
                                        onChange={(event) => setSupabaseApiKey(event.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="supabaseUrl" className="form-label">Supabase URL:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="supabaseUrl"
                                        value={supabaseUrl}
                                        onChange={(event) => setSupabaseUrl(event.target.value)}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isLoadingSupabase}>
                                        {isLoadingSupabase ? 'Saving...' : 'Save Supabase Settings'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </FullRow>
            </MainContent>
        </div>
    );
};

export default ApiKeys;
