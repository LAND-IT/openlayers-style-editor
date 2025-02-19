import { Dispatch, SetStateAction } from 'react';
import { PreDefinedRenderer, Render } from './RendererObjects.ts';
import { default as VectorSource } from 'ol/source/Vector';
import { Feature } from 'ol';
import { ColorRamp } from './components/rampColors.ts';
interface Props {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    vectorSource: VectorSource | Feature[];
    showPreDefinedRamps: boolean;
    moreRamps: ColorRamp[];
    preDefinedStyles: PreDefinedRenderer[];
    addingToHeader?: string;
    primeReactTheme?: string;
}
declare function StyleEditor(props: Props): import("react/jsx-runtime").JSX.Element;
export default StyleEditor;
