import { default as React, Dispatch, SetStateAction } from 'react';
import { SEAttribute, PredefinedRenderer, Render } from '../rendererUtils';
import { ColorRamp } from './rampColors.ts';
interface Props {
    attributes: SEAttribute[];
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    showPreDefinedRamps: boolean;
    moreRamps?: ColorRamp[];
    predefinedStyles: PredefinedRenderer[];
    numbersLocale: string;
}
export declare const GeometryEditor: React.FC<Props>;
export {};
