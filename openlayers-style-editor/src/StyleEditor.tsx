import {PrimeReactProvider} from "primereact/api";
import StyleEditorComponent from "./StyleEditorComponent.tsx";
import {Dispatch, SetStateAction} from "react";
import {PreDefinedRenderer, Render} from "./RendererObjects.ts";
import VectorSource from "ol/source/Vector";
import {Feature} from "ol";
import {ColorRamp} from "./components/rampColors.ts";
import 'primereact/resources/primereact.min.css';
import {I18nextProvider} from "react-i18next";
import i18n from "../i18n.ts";

// import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';

interface Props {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    vectorSource: VectorSource | Feature[]
    showPreDefinedRamps: boolean,
    moreRamps: ColorRamp[]
    preDefinedStyles: PreDefinedRenderer[]
    addingToHeader?: string
    primeReactTheme?: string
    numbersLocale?: string
}

function StyleEditor(props: Props) {

    const {
        visible, setVisible, layerDefaultRenderer, layerCurrentRenderer, addingToHeader,
        applyRenderer, vectorSource, showPreDefinedRamps, moreRamps, preDefinedStyles,
        primeReactTheme, numbersLocale
    } = props;


    const addLink = (href: string) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'theme-link';
        link.href = href;
        document.head.appendChild(link);
    };

    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = dirname(__filename);
    if (import.meta.env.DEV)
        import('primereact/resources/themes/lara-light-green/theme.css')
    else if (document.getElementById('primeTheme') == null)
        if (primeReactTheme == undefined)
            // addLink("themes/lara-light-green/theme.css");
            addLink("https://land-it.github.io/openlayers-style-editor/themes/lara-light-green/theme.css");
        else {
            // addLink(path.resolve(__dirname, 'themes', primeReactTheme!, 'theme.css'))
            addLink("https://land-it.github.io/openlayers-style-editor/themes/" + primeReactTheme + "/theme.css");
        }

    return <>
        <I18nextProvider i18n={i18n}>
            <PrimeReactProvider>
                <StyleEditorComponent visible={visible} setVisible={setVisible}
                                      layerDefaultRenderer={layerDefaultRenderer}
                                      moreRamps={moreRamps} preDefinedStyles={preDefinedStyles}
                                      showPreDefinedRamps={showPreDefinedRamps}
                                      applyRenderer={applyRenderer} vectorSource={vectorSource}
                                      layerCurrentRenderer={layerCurrentRenderer}
                                      addingToHeader={addingToHeader}
                                      numbersLocale={numbersLocale ? numbersLocale : "en-US"}/>
            </PrimeReactProvider>
        </I18nextProvider>
    </>
}

export default StyleEditor;