import {DataTable} from "primereact/datatable";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import './baseOnRule.css'
import {FilterWidget} from "./filters/filterWidget.tsx";
import {Render} from "@/rendererUtils";

export interface FilterRule {
    name: string
    filterJson: string
    isElse: boolean
    symbol: Render
    isAll: boolean
}

interface ColumnMeta {
    field: string;
    header: string;
}

export function BasedOnRules() {

    const [rules, setRules] = useState<FilterRule[]>([])
    const [selectedRule, setSelectedRule] = useState<FilterRule>()
    const [showDialog, setShowDialog] = useState<boolean>(false)

    const {t} = useTranslation();
    const nameLabel: string = t("based_on_rules.name" as any)

    const columns: ColumnMeta[] = [
        {field: 'name', header: nameLabel},
        {field: 'isElse', header: 'Name'},
        // {field: 'symbol', header: 'Category'},
    ];

    function addFilter (filter: FilterRule) {
        setRules([...rules, filter])
    }

    return <>
        <div className={"container-bor"}>
            <div className={"bor-buttons"}>
                <Button label="Add Rule" icon="pi pi-plus" outlined={true} onClick={() => setShowDialog(true)}/>
                <Button label="Remove Rule" icon="pi pi-minus" outlined={true}/>
                <Button label="Edit Rule" icon="pi pi-pencil" outlined={true}/>
            </div>
            <DataTable<FilterRule[]> value={rules}
                                     selectionMode={"single"}
                                     selection={selectedRule}
                                     onSelectionChange={(e) => setSelectedRule(e.value as FilterRule)}>
                {columns.map((col, i) => (
                    <Column key={col.field} field={col.field} header={col.header}/>
                ))}
            </DataTable>
        </div>
        <FilterWidget visible={showDialog} setVisible={setShowDialog} filter={undefined} setFilter={addFilter}/>
    </>
}