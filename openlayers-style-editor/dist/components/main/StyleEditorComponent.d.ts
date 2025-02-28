import { default as React, Dispatch, SetStateAction } from 'react';
import { PredefinedRenderer, Render } from '../../rendererUtils.ts';
import { ColorRamp } from '../rampColors.ts';
import { Feature } from 'ol';
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
    numbersLocale: string;
    addingToHeader?: string;
}
declare const StyleEditorComponent: React.FC<Props>;
export default StyleEditorComponent;
