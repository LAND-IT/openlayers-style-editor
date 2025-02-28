'use client'
import {PrimeReactProvider} from "primereact/api";
import StyleEditorComponent from "./StyleEditorComponent.tsx";
import {Dispatch, SetStateAction, useEffect} from "react";
import {PredefinedRenderer, Render} from "../../rendererUtils.ts";
import {Feature} from "ol";
import {ColorRamp} from "../rampColors.ts";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {I18nextProvider} from "react-i18next";
import i18n from "../../i18n.ts";

// import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';

interface Props {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    features: Feature[]
    showPreDefinedRamps: boolean,
    moreRamps?: ColorRamp[]
    predefinedStyles?: PredefinedRenderer[]
    addingToHeader?: string
    primeReactTheme?: string
    numbersLocale?: string
    customLocale?: Record<string, any>;
    textLocale?: string;
}

function StyleEditor(props: Props) {

    const {
        visible, setVisible, layerDefaultRenderer, layerCurrentRenderer, addingToHeader,
        applyRenderer, features, showPreDefinedRamps, moreRamps, predefinedStyles,
        primeReactTheme, numbersLocale, textLocale, customLocale
    } = props;


    const addLink = (href: string) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'theme-link';
        link.href = href;
        document.head.appendChild(link);
    };


    if (import.meta.env.DEV)
        import('primereact/resources/themes/lara-light-green/theme.css')
    else if (document.getElementById('primeTheme') == null)
        if (primeReactTheme == undefined)
            addLink("https://land-it.github.io/openlayers-style-editor/themes/lara-light-green/theme.css");
        else {
            addLink("https://land-it.github.io/openlayers-style-editor/themes/" + primeReactTheme + "/theme.css");
        }


    useEffect(() => {
        if (textLocale == "custom" && customLocale) {
            i18n.addResourceBundle("custom", "translation", customLocale, true, true);
            i18n.changeLanguage("custom");
        } else
            i18n.changeLanguage(textLocale ? textLocale : "en");
    }, []);

    return <>
        <I18nextProvider i18n={i18n}>
            <PrimeReactProvider>
                <StyleEditorComponent visible={visible} setVisible={setVisible}
                                      layerDefaultRenderer={layerDefaultRenderer}
                                      moreRamps={moreRamps} predefinedStyles={predefinedStyles}
                                      showPreDefinedRamps={showPreDefinedRamps}
                                      applyRenderer={applyRenderer} features={features}
                                      layerCurrentRenderer={layerCurrentRenderer}
                                      addingToHeader={addingToHeader}
                                      numbersLocale={numbersLocale ? numbersLocale : "en-US"}/>
            </PrimeReactProvider>
        </I18nextProvider>
    </>
}

export default StyleEditor;