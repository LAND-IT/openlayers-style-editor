import { default as React, Dispatch, SetStateAction } from 'react';
import { PreDefinedRenderer, Render } from './RendererObjects.ts';
import { ColorRamp } from './components/rampColors.ts';
import { Feature } from 'ol';
interface Props {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    features: Feature[];
    showPreDefinedRamps: boolean;
    moreRamps: ColorRamp[];
    preDefinedStyles: PreDefinedRenderer[];
    numbersLocale: string;
    addingToHeader?: string;
}
declare const StyleEditorComponent: React.FC<Props>;
export default StyleEditorComponent;
