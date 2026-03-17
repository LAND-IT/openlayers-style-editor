import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {Column, ColumnBodyOptions} from "primereact/column";
import { Button } from "primereact/button";
import './baseOnRule.css'
import { FilterWidget } from "./filters/filterWidget.tsx";
import {
    getByRulesStyle,
    getRendererColorAndSizeStroke,
    getStyleColorsAndValues,
    Render,
    RenderType, SEAttribute
} from "@/rendererUtils";
import { asString } from "ol/color";
import { Feature } from "ol";
import { Dropdown } from "primereact/dropdown";
import { Geometry } from "ol/geom";
import jsonLogic from "json-logic-js";

export interface FilterRule {
    name: string
    filterJson?: string
    isElse: boolean
    symbol: Render
    isAll?: boolean
    friendlyExpression?: string
}

interface ColumnMeta {
    field?: string;
    header: string;
    body?: (data: any,  options: ColumnBodyOptions) => React.ReactNode;
}

interface Props {
    setVisible: (e: boolean) => void
    features: Feature[]
    applyRenderer: (renderer: Render) => void
    layerCurrentRenderer: Render
    attributes: SEAttribute[]
}

export function BasedOnRules(props: Props) {

    const { setVisible, features, applyRenderer, layerCurrentRenderer, attributes } = props

    const [rules, setRules] = useState<FilterRule[]>(layerCurrentRenderer.type == RenderType.ByRules ?
        layerCurrentRenderer.filters ? layerCurrentRenderer.filters : [] : [])
    const [selectedRule, setSelectedRule] = useState<FilterRule>()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [selectedAttribute, setSelectedAttribute] = useState<SEAttribute | undefined>(
        attributes.find(a => a.name === layerCurrentRenderer.field)
    )

    useEffect(() => {
        if (!selectedAttribute && layerCurrentRenderer.field && attributes.length > 0) {
            const attr = attributes.find(a => a.name === layerCurrentRenderer.field);
            if (attr) setSelectedAttribute(attr);
        }
    }, [attributes, layerCurrentRenderer.field]);

    const { t } = useTranslation();
    const nameLabel: string = t("based_on_rules.name" as any);
    const typeLabel: string = t("based_on_rules.type" as any);
    const previewLabel: string = t("based_on_rules.preview" as any);
    const expressionLabel: string = t("based_on_rules.expression" as any);
    const allOtherGeometriesLabel: string = t("based_on_rules.all_other_geometries" as any);
    const filterLabel: string = t("based_on_rules.filter" as any);
    const selectIdAttributeLabel: string = t("based_on_rules.select_id_attribute" as any);
    const idsNotUniqueLabel: string = t("based_on_rules.ids_not_unique" as any);
    const addRuleLabel: string = t("based_on_rules.add_rule" as any);
    const removeRuleLabel: string = t("based_on_rules.remove_rule" as any);
    const editRuleLabel: string = t("based_on_rules.edit_rule" as any);
    const concludeLabel: string = t("common.conclude" as any);

    const columns: ColumnMeta[] = [
        { field: 'name', header: nameLabel },
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

    function getFriendlyExpression(data: FilterRule): string {
        if (!data.filterJson) return "";
        try {
            const parsed = JSON.parse(data.filterJson);
            const formatCondition = (cond: any): string => {
                const operator = Object.keys(cond)[0];
                const value = cond[operator];
                if (operator === "!" && value.hasOwnProperty("in")) {
                    const innerCondition = value["in"];
                    return `${innerCondition[1].var} not in ${JSON.stringify(innerCondition[0])}`;
                }
                if (operator === "==" && Array.isArray(value) && value[0] && value[0].hasOwnProperty("substr")) {
                    const substr = value[0].substr;
                    const valueString = value[1];
                    return `${substr[0].var} ${substr[1] < 0 ? 'endsWith' : 'startsWith'} "${valueString}"`;
                }
                if (operator === "==" && Array.isArray(value) && value[0] === null) {
                    return `${value[1].var} is null`;
                }
                const max = Array.isArray(value) ? value[0] : null;
                if (max && max.hasOwnProperty("var")) return `${max.var} ${operator} ${JSON.stringify(value[1])}`;
                if (Array.isArray(value) && value[1] && value[1].hasOwnProperty("var")) return `${value[1].var} ${operator} ${JSON.stringify(max)}`;
                return JSON.stringify(cond);
            };
            const isAll = parsed.hasOwnProperty("and");
            const isAny = parsed.hasOwnProperty("or");
            if (isAll || isAny) {
                const operator = isAll ? " AND " : " OR ";
                return parsed[isAll ? "and" : "or"].map(formatCondition).join(operator);
            } else {
                return formatCondition(parsed);
            }
        } catch (e) {
            return data.filterJson;
        }
    }

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

    function hasUniqueIDs(features: Feature<Geometry>[], IDAttribute: SEAttribute): boolean {
        const idSet = new Set<string | number>();

        for (const feature of features) {
            const id = feature.get(IDAttribute.name);

            if (id === undefined || id === null) {
                return false;
            }

            if (idSet.has(id)) {
                return false;
            }

            idSet.add(id);
        }
        return true;
    }

    return <>
        <div className={"container-bor"}>
            <div className={"bor-id"}>
                <Dropdown options={attributes} optionLabel={"name"} value={selectedAttribute}
                    placeholder={selectIdAttributeLabel}
                    onChange={(e) => setSelectedAttribute(e.value)} />

                {selectedAttribute && !hasUniqueIDs(features, selectedAttribute) &&
                    <div className={"bor-id"}>
                        <i className={"pi pi-exclamation-triangle"} style={{ color: 'orange' }} />
                        <span><b>{idsNotUniqueLabel}</b></span>
                    </div>}
            </div>
            <div className={"bor-buttons"}>
                <Button label={addRuleLabel} icon="pi pi-plus" outlined={true} onClick={() => {
                    setIsAdding(true);
                    setShowDialog(true)
                }} />
                <Button label={removeRuleLabel} disabled={!selectedRule} icon="pi pi-minus" outlined={true} onClick={() => {
                    if (selectedRule) {
                        setRules(rules.filter(r => r !== selectedRule))
                        setSelectedRule(undefined)
                    }
                }} />
                <Button label={editRuleLabel} disabled={!selectedRule} icon="pi pi-pencil" outlined={true} onClick={() => {
                    if (selectedRule) {
                        setIsAdding(false);
                        setShowDialog(true)
                    }
                }} />
            </div>
            <DataTable<FilterRule[]> value={rules}
                selectionMode={"single"}
                selection={selectedRule}
                onSelectionChange={(e) => setSelectedRule(e.value as FilterRule)}>
                {columns.map((col) => (
                    <Column key={col.field} field={col.field} header={col.header} body={col.body as any} />
                ))}
            </DataTable>
            <div className={"footer-container"}>
                <Button label={concludeLabel}
                    disabled={!selectedAttribute || !hasUniqueIDs(features, selectedAttribute)}
                    onClick={() => {
                        const appliedFilters: { filter: FilterRule, ids: (string | number)[] }[] = []
                        const aux = rules.filter(r => !r.isElse)
                        aux.forEach((filter) => {
                            const res: (string | number)[] = []
                            try {
                                const parsedLogic = JSON.parse(filter.filterJson!);
                                features.forEach(feature => {
                                    const oneRes = jsonLogic.apply(parsedLogic, feature.getProperties())
                                    if (oneRes)
                                        res.push(feature.get(selectedAttribute!.name) as (string | number))
                                })
                            } catch (e) {
                                console.error("Error evaluating jsonLogic rule", e);
                            }
                            appliedFilters.push({ filter, ids: res })
                        })

                        const completedFilters = appliedFilters.map(r => ({ids: [...r.ids],
                            filter: {...r.filter, friendlyExpression: getFriendlyExpression(r.filter)}}))

                        applyRenderer({
                            type: RenderType.ByRules,
                            field: selectedAttribute!.name,
                            filters: rules,
                            rendererOL: getByRulesStyle(completedFilters, selectedAttribute!.name, rules.find(r => r.isElse))
                        })
                        setVisible(false)
                    }} /></div>
        </div>
        <FilterWidget visible={showDialog} setVisible={setShowDialog} filter={isAdding ? undefined : selectedRule}
            setFilter={isAdding ? addFilter : editFilter}
            canBeElse={!isAdding && selectedRule?.isElse || rules.find(r => r.isElse) == undefined} />
    </>
}