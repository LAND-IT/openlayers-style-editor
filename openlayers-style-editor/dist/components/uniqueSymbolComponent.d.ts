import { Color } from 'ol/color';
import { FlatStyle } from 'ol/style/flat';
interface Props {
    currentStyle?: FlatStyle | null;
    color: Color | undefined;
    setColor: (e: Color) => void;
    borderColor: Color | undefined;
    setBorderColor: (e: Color) => void;
    borderThickness: number | undefined;
    setBorderThickness: (e: number) => void;
}
export declare function UniqueSymbolComponent(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
