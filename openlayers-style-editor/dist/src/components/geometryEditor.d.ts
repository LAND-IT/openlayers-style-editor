import { default as React, Dispatch, SetStateAction } from 'react';
import { SEAttribute, PreDefinedRenderer, Render } from '../RendererObjects.ts';
import { ColorRamp } from './rampColors.ts';
interface Props {
    attributes: SEAttribute[];
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    showPreDefinedRamps: boolean;
    moreRamps: ColorRamp[];
    preDefinedStyles: PreDefinedRenderer[];
    numbersLocale: string;
}
export declare const GeometryEditor: React.FC<Props>;
export {};
