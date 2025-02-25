import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'ol/ol.css';
import {PrimeReactProvider} from "primereact/api";
import 'primereact/resources/themes/lara-light-indigo/theme.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PrimeReactProvider>
            <App/>
        </PrimeReactProvider>
    </StrictMode>,
)
