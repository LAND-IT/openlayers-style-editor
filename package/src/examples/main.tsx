import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import {Test} from "./Test";
import 'ol/ol.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Test/>
    </StrictMode>,
)
