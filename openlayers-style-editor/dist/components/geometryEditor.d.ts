import { default as React, Dispatch, SetStateAction } from 'react';
import { PredefinedRenderer, Render, SEAttribute } from '../rendererUtils';
import { ColorRamp } from './rampColors.ts';
import { Feature } from 'ol';
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
    features: Feature[];
}
export declare const GeometryEditor: React.FC<Props>;
export {};
