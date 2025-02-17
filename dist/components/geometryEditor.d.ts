import { default as React, Dispatch, SetStateAction } from 'react';
import { AttributeDTO, PreDefinedRenderer, Render } from './rendererObjects.ts';
import { ColorRamp } from './rampColors.ts';
interface Props {
    attributes: AttributeDTO[];
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    showPreDefinedRamps: boolean;
    moreRamps: ColorRamp[];
    preDefinedStyles: PreDefinedRenderer[];
}
export declare const GeometryEditor: React.FC<Props>;
export {};
