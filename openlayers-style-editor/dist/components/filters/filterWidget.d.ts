import { Dispatch, SetStateAction } from 'react';
import { FilterRule } from '../../rendererUtils';
interface Props {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    filter: FilterRule | undefined;
    setFilter: (filter: FilterRule) => void;
    canBeElse: boolean;
}
export declare const FilterWidget: (props: Props) => import("react/jsx-runtime").JSX.Element | null;
export {};
