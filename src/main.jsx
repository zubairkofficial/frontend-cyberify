import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApiProvider } from './App/Context/ApiContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <ApiProvider>
        <App />
    </ApiProvider>
)
