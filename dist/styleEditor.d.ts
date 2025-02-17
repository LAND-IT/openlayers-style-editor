import { default as React, Dispatch, SetStateAction } from 'react';
import { AttributeDTO, PreDefinedRenderer, Render } from './components/rendererObjects.ts';
import { ColorRamp } from './components/rampColors.ts';
interface Props {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    attributesAndValues: AttributeDTO[];
    showPreDefinedRamps: boolean;
    moreRamps: ColorRamp[];
    preDefinedStyles: PreDefinedRenderer[];
    addingToHeader?: string;
}
export declare const StyleEditor: React.FC<Props>;
export {};
