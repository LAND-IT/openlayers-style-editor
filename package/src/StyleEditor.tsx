import {PrimeReactProvider} from "primereact/api";
import StyleEditorComponent from "./StyleEditorComponent.tsx";
import {Dispatch, SetStateAction} from "react";
import {PreDefinedRenderer, Render} from "./RendererObjects.ts";
import VectorSource from "ol/source/Vector";
import {Feature} from "ol";
import {ColorRamp} from "./components/rampColors.ts";
import 'primereact/resources/primereact.min.css';

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
}

function StyleEditor(props: Props) {

    const {
        visible, setVisible, layerDefaultRenderer, layerCurrentRenderer, addingToHeader,
        applyRenderer, vectorSource, showPreDefinedRamps, moreRamps, preDefinedStyles,
        primeReactTheme
    } = props;


    const addLink = (href: string) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'primeTheme';
        link.href = href;
        document.head.appendChild(link);
    };

    if (document.getElementById('primeTheme') == null)
        if (primeReactTheme == undefined)
            addLink("themes/lara-light-green/theme.css");
        else
            addLink("themes/" + primeReactTheme + "/theme.css");

    return <>
        <PrimeReactProvider>
            <StyleEditorComponent visible={visible} setVisible={setVisible} layerDefaultRenderer={layerDefaultRenderer}
                                  moreRamps={moreRamps} preDefinedStyles={preDefinedStyles}
                                  showPreDefinedRamps={showPreDefinedRamps}
                                  applyRenderer={applyRenderer} vectorSource={vectorSource}
                                  layerCurrentRenderer={layerCurrentRenderer}
                                  addingToHeader={addingToHeader}
            />
        </PrimeReactProvider>
    </>
}

export default StyleEditor;