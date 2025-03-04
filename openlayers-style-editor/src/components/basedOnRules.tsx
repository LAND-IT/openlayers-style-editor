import {DataTable} from "primereact/datatable";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import './baseOnRule.css'
import {FilterWidget} from "./filters/filterWidget.tsx";
import {
    getByRulesStyle,
    getRendererColorAndSizeStroke,
    getStyleColorsAndValues,
    Render,
    RenderType
} from "@/rendererUtils";
import {asString} from "ol/color";
import jsonLogic from "json-logic-js";
import {Feature} from "ol";

export interface FilterRule {
    name: string
    filterJson?: string
    isElse: boolean
    symbol: Render
    isAll?: boolean
}

interface ColumnMeta {
    field?: string;
    header: string;
    body?: (data: any) => React.ReactNode;
}

interface Props {
    setVisible: (e: boolean) => void
    features: Feature[]
    applyRenderer: (renderer: Render) => void
    layerCurrentRenderer: Render
}

export function BasedOnRules(props: Props) {

    const {setVisible, features, applyRenderer, layerCurrentRenderer} = props

    const [rules, setRules] = useState<FilterRule[]>(layerCurrentRenderer.type == RenderType.ByRules ?
        layerCurrentRenderer.filters ? layerCurrentRenderer.filters : [] : [])
    const [selectedRule, setSelectedRule] = useState<FilterRule>()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState<boolean>(false)

    const {t} = useTranslation();
    const nameLabel: string = t("based_on_rules.name" as any)
    const concludeLabel: string = t("common.conclude" as any)

    const columns: ColumnMeta[] = [
        {field: 'name', header: nameLabel},
        {
            field: 'isElse',
            header: 'Type',
            body: (data: FilterRule) => data.isElse ? "Todas as restantes geometrias" : 'Filtro'
        },
        {
            field: 'symbol',
            header: 'Preview', body: (data: FilterRule) => {
                let color = getStyleColorsAndValues(data.symbol.rendererOL, RenderType.Unique)
                let stroke = getRendererColorAndSizeStroke(data.symbol)
                return <div style={{
                    backgroundColor: asString(color.at(0)!.color!),
                    borderColor: asString(stroke.color!),
                    borderWidth: stroke.size!
                }}
                            className={"bor-preview"}></div>
            }
        },
        {field: 'filterJson', header: 'Expressão'},
    ];

    function addFilter(filter: FilterRule) {
        setRules([...rules, filter])
    }

    function editFilter(filter: FilterRule) {
        let index = rules.findIndex(r => r === selectedRule)
        if (index >= 0) {
            let newRules = [...rules]
            newRules[index] = filter
            setRules(newRules)
        }
        setSelectedRule(undefined)
    }

    //TODO traduções; deixar o user escolher o atributo ID; apresentar melhor a expressão; ID ser string

    return <>
        <div className={"container-bor"}>
            <div className={"bor-buttons"}>
                <Button label="Add Rule" icon="pi pi-plus" outlined={true} onClick={() => {
                    setIsAdding(true);
                    setShowDialog(true)
                }}/>
                <Button label="Remove Rule" disabled={!selectedRule} icon="pi pi-minus" outlined={true} onClick={() => {
                    if (selectedRule) {
                        setRules(rules.filter(r => r !== selectedRule))
                        setSelectedRule(undefined)
                    }
                }}/>
                <Button label="Edit Rule" disabled={!selectedRule}  icon="pi pi-pencil" outlined={true} onClick={() => {
                    if (selectedRule) {
                        setIsAdding(false);
                        setShowDialog(true)
                    }
                }}/>
            </div>
            <DataTable<FilterRule[]> value={rules}
                                     selectionMode={"single"}
                                     selection={selectedRule}
                                     onSelectionChange={(e) => setSelectedRule(e.value as FilterRule)}>
                {columns.map((col, i) => (
                    <Column key={col.field} field={col.field} header={col.header} body={col.body}/>
                ))}
            </DataTable>
            <div className={"footer-container"}>
                <Button label={concludeLabel}
                        onClick={() => {
                            let appliedFilters: { filter: FilterRule, ids: number[] }[] = []
                            let aux = rules.filter(r => !r.isElse)
                            aux.forEach((filter) => {
                                let res: number[] = []
                                features.forEach(feature => {
                                    let oneRes = jsonLogic.apply(JSON.parse(filter.filterJson!), feature.getProperties())
                                    if (oneRes)
                                        res.push(feature.getId() as number)
                                })
                                appliedFilters.push({filter, ids: res})
                            })

                            applyRenderer({
                                type: RenderType.ByRules,
                                filters: rules,
                                rendererOL: getByRulesStyle(appliedFilters, "id", rules.find(r => r.isElse))
                            })
                            setVisible(false)
                        }}/></div>
        </div>
        <FilterWidget visible={showDialog} setVisible={setShowDialog} filter={isAdding ? undefined : selectedRule}
                      setFilter={isAdding ? addFilter : editFilter}
                      canBeElse={!isAdding && selectedRule?.isElse || rules.find(r => r.isElse) == undefined}/>
    </>
}