import { Dispatch, SetStateAction } from 'react';
import { PredefinedRenderer, Render } from './RendererObjects.ts';
import { Feature } from 'ol';
import { ColorRamp } from './components/rampColors.ts';
interface Props {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    features: Feature[];
    showPreDefinedRamps: boolean;
    moreRamps?: ColorRamp[];
    predefinedStyles?: PredefinedRenderer[];
    addingToHeader?: string;
    primeReactTheme?: string;
    numbersLocale?: string;
    customLocale?: Record<string, any>;
    textLocale?: string;
}
declare function StyleEditor(props: Props): import("react/jsx-runtime").JSX.Element;
export default StyleEditor;
