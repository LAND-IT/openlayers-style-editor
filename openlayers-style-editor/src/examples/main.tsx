import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Test} from "./Test";
import 'ol/ol.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Test/>
    </StrictMode>,
)
