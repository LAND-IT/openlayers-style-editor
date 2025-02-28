import { default as React } from 'react';
import { Render } from '../rendererUtils';
interface UniqueSymbolProps {
    layerDefaultRenderer: Render;
    layerCurrentRenderer: Render;
    applyRenderer: (renderer: Render) => void;
    setVisible: (e: boolean) => void;
}
export declare const UniqueSymbol: React.FC<UniqueSymbolProps>;
export {};
