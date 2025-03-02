import { Dispatch, SetStateAction } from 'react';
import { FilterRule } from '../basedOnRules.tsx';
interface Props {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    filter: FilterRule | undefined;
    setFilter: Dispatch<SetStateAction<FilterRule | undefined>>;
}
export declare const FilterWidget: (props: Props) => import("react/jsx-runtime").JSX.Element | null;
export {};
