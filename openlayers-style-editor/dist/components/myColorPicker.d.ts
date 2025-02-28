import { default as React } from 'react';
import { Color } from 'ol/color';
interface Props {
    color: Color;
    onChange: (e: string) => void;
    hideAlpha?: boolean;
}
export declare const MyColorPicker: React.FC<Props>;
export {};
