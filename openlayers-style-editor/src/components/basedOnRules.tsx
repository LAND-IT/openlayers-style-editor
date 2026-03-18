import {DataTable} from "primereact/datatable";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Column, ColumnBodyOptions} from "primereact/column";
import {Button} from "primereact/button";
import './baseOnRule.css'
import {FilterWidget} from "./filters/filterWidget.tsx";
import {
    FilterRule,
    getByRulesStyle,
    getFriendlyExpression,
    getRendererColorAndSizeStroke,
    getStyleColorsAndValues,
    Render,
    RenderType
} from "@/rendererUtils";
import {asString} from "ol/color";
import {Feature} from "ol";


// Removed FilterRule interface here as it's now imported from rendererUtils

interface ColumnMeta {
    field?: string;
    header: string;
    body?: (data: any, options: ColumnBodyOptions) => React.ReactNode;
}

interface Props {
    setVisible: (e: boolean) => void
    applyRenderer: (renderer: Render) => void
    layerCurrentRenderer: Render
    features: Feature[]
    idFieldName: string | null
}

export function BasedOnRules(props: Props) {

    const {setVisible, applyRenderer, layerCurrentRenderer, features, idFieldName} = props

    const [rules, setRules] = useState<FilterRule[]>(() => {
        if (layerCurrentRenderer.type == RenderType.ByRules) {
            if (layerCurrentRenderer.filters && layerCurrentRenderer.filters.length > 0) {
                return layerCurrentRenderer.filters;
            } else if ((layerCurrentRenderer.rendererOL as any)._rules ) {
                // Extract rules from rendererOL._rules
                return ((layerCurrentRenderer.rendererOL as any)._rules as any[]).map((r: any, index: number) => ({
                    name: r.name || r.expression,
                    filterJson: r.json,
                    isElse: index === ((layerCurrentRenderer.rendererOL as any)._rules as any[]).length - 1,
                    symbol: r.render,
                    isAll: false
                }));
            }
        }
        return [];
    })
    const [selectedRule, setSelectedRule] = useState<FilterRule>()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState<boolean>(false)

    const {t} = useTranslation();
    const nameLabel: string = t("based_on_rules.name" as any);
    const typeLabel: string = t("based_on_rules.type" as any);
    const previewLabel: string = t("based_on_rules.preview" as any);
    const expressionLabel: string = t("based_on_rules.expression" as any);
    const allOtherGeometriesLabel: string = t("based_on_rules.all_other_geometries" as any);
    const filterLabel: string = t("based_on_rules.filter" as any);
    const addRuleLabel: string = t("based_on_rules.add_rule" as any);
    const removeRuleLabel: string = t("based_on_rules.remove_rule" as any);
    const editRuleLabel: string = t("based_on_rules.edit_rule" as any);
    const concludeLabel: string = t("common.conclude" as any);

    const columns: ColumnMeta[] = [
        {field: 'name', header: nameLabel},
        {
            field: 'isElse',
            header: typeLabel,
            body: (data: FilterRule) => data.isElse ? allOtherGeometriesLabel : filterLabel
        },
        {
            field: 'symbol',
            header: previewLabel, body: (data: FilterRule) => {
                const color = getStyleColorsAndValues(data.symbol.rendererOL, RenderType.Unique)
                const stroke = getRendererColorAndSizeStroke(data.symbol)
                return <div style={{
                    backgroundColor: asString(color.at(0)!.color!),
                    borderColor: asString(stroke.color!),
                    borderWidth: stroke.size!
                }}
                            className={"bor-preview"}></div>
            }
        },
        {
            field: 'filterJson', header: expressionLabel,
            body: (data: FilterRule) => getFriendlyExpression(data)
        },
    ];

    function addFilter(filter: FilterRule) {
        setRules([...rules, filter])
    }

    function editFilter(filter: FilterRule) {
        const index = rules.findIndex(r => r === selectedRule)
        if (index >= 0) {
            const newRules = [...rules]
            newRules[index] = filter
            setRules(newRules)
        }
        setSelectedRule(undefined)
    }

    return <>
        <div className={"container-bor"}>
            <div className={"bor-buttons"}>
                <Button label={addRuleLabel} icon="pi pi-plus" outlined={true} onClick={() => {
                    setIsAdding(true);
                    setShowDialog(true)
                }}/>
                <Button label={removeRuleLabel} disabled={!selectedRule} icon="pi pi-minus" outlined={true}
                        onClick={() => {
                            if (selectedRule) {
                                setRules(rules.filter(r => r !== selectedRule))
                                setSelectedRule(undefined)
                            }
                        }}/>
                <Button label={editRuleLabel} disabled={!selectedRule} icon="pi pi-pencil" outlined={true}
                        onClick={() => {
                            if (selectedRule) {
                                setIsAdding(false);
                                setShowDialog(true)
                            }
                        }}/>
            </div>
            <DataTable<FilterRule[]> value={rules}
                                     selectionMode={"single"}
                                     selection={selectedRule}
                                     onSelectionChange={(e) => setSelectedRule(e.value as FilterRule)}
                                     reorderableRows
                                     onRowReorder={(e) => setRules(e.value)}>
                <Column rowReorder style={{ width: '3rem' }} />
                {columns.map((col) => (
                    <Column key={col.field} field={col.field} header={col.header} body={col.body as any}/>
                ))}
            </DataTable>
            <div className={"footer-container"}>
                <Button label={concludeLabel}
                        onClick={() => {
                            applyRenderer({
                                type: RenderType.ByRules,
                                filters: rules,
                                rendererOL: getByRulesStyle(rules.filter(r => !r.isElse), idFieldName || "", features, rules.find(r => r.isElse))
                            });
                            setVisible(false);
                        }}/></div>
        </div>
        <FilterWidget visible={showDialog} setVisible={setShowDialog} filter={isAdding ? undefined : selectedRule}
                      setFilter={isAdding ? addFilter : editFilter}
                      canBeElse={!isAdding && selectedRule?.isElse || rules.find(r => r.isElse) == undefined}/>
    </>
}