import {Dropdown, DropdownChangeEvent} from "primereact/dropdown"
import React, {useState} from "react"
import {ColorRamp, colorRamps, generateGradient, getColorRampString, Stop} from "./rampColors"
import {Checkbox} from "primereact/checkbox"
import {DataTable, DataTableSelectionMultipleChangeEvent} from "primereact/datatable"
import {Column} from "primereact/column";
import {Color, fromString} from "ol/color";
import {Button, Button as PrimeButton} from "primereact/button";
import {
    ColorRampDropdownItem,
    ColorRampItem,
    generateRandomColor,
    getCategorizedStyle,
    getRendererColorAndSizeStroke,
    getRendererOpacity,
    getStyleColorsAndValues,
    PredefinedRenderer,
    Render,
    RenderType,
    Row,
    SEAttribute
} from "../rendererUtils";
import {FlatStyle} from "ol/style/flat";
import {MyColorPicker} from "./myColorPicker.tsx";
import {Slider} from "primereact/slider";
import {useTranslation} from "react-i18next";
import "./categorized.css"

interface Props {
    attr: SEAttribute[]
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    setVisible: (e: boolean) => void
    showPreDefinedRamps: boolean,
    moreRamps?: ColorRamp[]
    predefinedStyles: PredefinedRenderer[]
}

interface TableRow {
    visible: boolean
    color: Color
    value: string
}

export const Categorized: React.FC<Props> = (props: Props) => {
    const {
        attr,
        layerCurrentRenderer,
        showPreDefinedRamps,
        predefinedStyles,
        moreRamps,
        applyRenderer,
        setVisible
    } = props

    const {t} = useTranslation();
    const nullText: string = t("common.null" as any)
    const errorRamps: string = t("errors.error_ramps_same_name" as any)
    const predefinedStylesLabel: string = t("categorized.predefined_styles" as any)
    const colorRampLabel: string = t("categorized.color_ramps" as any)
    const strokeColorLabel: string = t("categorized.stroke_color" as any)
    const strokeWidthLabel: string = t("categorized.stroke_width" as any)
    const attributeLabel: string = t("categorized.attribute" as any)
    const selectAttributeLabel: string = t("categorized.select_attribute" as any)
    const updateColorsLabel: string = t("categorized.update_colors" as any)
    const colorOpacityLabel: string = t("categorized.color_opacity" as any)
    const selectSpectrumLabel: string = t("categorized.select_spectrum" as any)
    const concludeLabel: string = t("common.conclude" as any)
    const colorLabel: string = t("graduated.color" as any)
    const customStyleLabel: string = t("categorized.custom_style" as any)
    const valueLabel: string = t("graduated.value" as any)
    const reverseColorsLabel: string = t("categorized.reverse_colors" as any)
    const colorStyleLabel: string = t("categorized.color_style" as any)

    const currentRender = layerCurrentRenderer.type != RenderType.Categorized ? [] :
        (layerCurrentRenderer.rendererOL["fill-color"] as any[])

    const valuesAndColors: TableRow[] = []
    for (let i = 2; i < currentRender.length - 1; i += 2) {
        valuesAndColors.push({
            value: currentRender[i],
            color: currentRender[i + 1],
            visible: true
        })
    }
    if (currentRender.length > 0)
        valuesAndColors.push({
            value: nullText,
            color: currentRender[currentRender.length - 1],
            visible: true
        })

    const stroke = getRendererColorAndSizeStroke(layerCurrentRenderer)
    const [selectedSpectrumColors, setSelectedSpectrumColors] =
        useState<ColorRampItem>({label: customStyleLabel, value: []})
    const [table, setTable] = useState<TableRow[]>(valuesAndColors)
    const [selectedAttr, setSelectedAttr] = useState<SEAttribute | undefined>(layerCurrentRenderer.field ?
        attr.find(at => at.name == layerCurrentRenderer.field!)! : undefined)
    const [rowClick] = useState<boolean>(false)

    const currentStyle: FlatStyle | null = layerCurrentRenderer.type != RenderType.Categorized ? null : layerCurrentRenderer.rendererOL as FlatStyle;
    const [borderColor, setBorderColor] = useState<Color>(currentStyle ? stroke.color : fromString("#000000"));
    const [borderThickness, setBorderThickness] = useState<number>(currentStyle ? stroke.size : 1);
    const [fillOpacity, setFillOpacity] = useState<number>(currentStyle ? getRendererOpacity(layerCurrentRenderer) : 100);
    const [isReversed, setIsReversed] = useState<boolean>(false)

    let allRamps: ColorRamp[];
    if (showPreDefinedRamps)
        if (moreRamps)
            allRamps = moreRamps.concat(colorRamps)
        else
            allRamps = colorRamps
    else {
        if (moreRamps)
            allRamps = moreRamps
        else
            allRamps = []
    }
    //two ramps with same name
    const existingRenderers = allRamps.filter((ramp, _index, self) =>
        self.filter((r) => (
            r.name === ramp.name
        )).length > 1
    )

    if (existingRenderers.length > 0) {
        console.error(errorRamps + existingRenderers.map(ramp => ramp.name))
        return
    }

    const preDefinedPalettes = [
        {
            label: customStyleLabel,
            items: [{label: customStyleLabel, value: {label: customStyleLabel, value: []}}]
        },
        {
            label: predefinedStylesLabel,
            items: predefinedStyles.map((renderer) => {
                return {
                    label: renderer.name,
                    value: {
                        label: renderer.name,
                        value: renderer.renderer
                    }
                } as ColorRampDropdownItem
            })
        },
        {
            label: colorRampLabel,
            items: allRamps.map((ramp) => {
                return {
                    label: ramp.name,
                    value: {label: ramp.name, value: ramp.palette}
                } as ColorRampDropdownItem
            })
        }
    ]

    const itemTemplate = (option: ColorRampDropdownItem) => {
        if (option.value.value.length > 0 && "offset" in option.value.value[0])
            return (
                <div style={{display: "flex", gap: "3px", alignItems: "center"}}>
                    <div style={{
                        background: getColorRampString(option.value.value as Stop[]),
                        width: "90px", height: "20px"
                    }}/>
                    <span>{option.label}</span>
                </div>
            )
        return <span>{option.label}</span>
    }

    const visibleColumnTemplate = (tr: TableRow) => {
        return <Checkbox checked={tr.visible}></Checkbox>
    }

    const updateColorPicker = (newColor: Color, tableRow: TableRow) => {
        const tableUpdated: TableRow[] = []
        table.forEach(({value, visible, color}: TableRow) => {
            if (value === tableRow.value) {
                tableUpdated.push({
                    value,
                    visible,
                    color: newColor,
                })
            } else {
                tableUpdated.push({value, visible, color})
            }
        })
        setTable(tableUpdated)
    }

    const colorColumnTemplate = (tr: TableRow) => {
        return (
            <div hidden={!tr.visible}>
                <MyColorPicker
                    onChange={(e) => updateColorPicker(fromString(e), tr)}
                    color={tr.color}/>
            </div>
        )
    }

    function updateColorsByColorRamp(colorRampInput: ColorRampItem, reversed: boolean) {
        const colorRamp: ColorRampItem = {label: colorRampInput.label, value: [...colorRampInput.value] as  Row[] | Stop[]}
        if(reversed){
            colorRamp.value.reverse()
        }
        //palettes
        if (colorRamp.value.length > 0 && "offset" in colorRamp.value[0]) {
            const value = colorRamp.value.map((stop) =>
                ({offset: (stop as Stop).offset, color: (stop as Stop).color}))
            const colors = generateGradient(value, table.filter(row => row.visible).length)

            const tableUpdated: TableRow[] = []
            let i = 0
            table.forEach(({value, visible}: TableRow) => {
                if (visible)
                    tableUpdated.push({
                        value,
                        visible,
                        color: fromString(colors[i++])
                    })
                else
                    tableUpdated.push({
                        value,
                        visible,
                        color: fromString("white")
                    })

            })
            setTable(tableUpdated)
        } else if (colorRamp.value.length > 0) {
            const style = getCategorizedStyle(selectedAttr?.name!, colorRamp.value as Row[])
            const colors = getStyleColorsAndValues(style, RenderType.Categorized)

            const tableUpdated: TableRow[] = []
            table.forEach(({value, visible}: TableRow) => {
                const color = colors.find((c) => c.value == value)
                if (color)
                    tableUpdated.push({
                        value,
                        visible,
                        color: color.color
                    })
                else
                    tableUpdated.push({
                        value,
                        visible,
                        color: fromString("white")
                    })
            })
            setTable(tableUpdated)
        } else {
            const tableUpdated: TableRow[] = []
            table.forEach(({value, visible}: TableRow) => {
                tableUpdated.push({
                    value,
                    visible,
                    color: generateRandomColor()
                })
            })
            setTable(tableUpdated)
        }
    }

    function revertColors() {
        setIsReversed(!isReversed)
        updateColorsByColorRamp(selectedSpectrumColors, !isReversed)
    }

    function changeColorsOfValues(e: ColorRampItem) {
        const colorRamp = e
        setIsReversed(false)
        setSelectedSpectrumColors(colorRamp)
        updateColorsByColorRamp(colorRamp, false)
    }

    function changeAttribute(e: DropdownChangeEvent) {

        let attribute = attr.find(a => a.name == e.value.name)!
        setSelectedAttr(attribute)
        setSelectedSpectrumColors({label: customStyleLabel, value: []})
        //Change values in table

        let tableValues: TableRow[] = []

        attribute.values!.forEach((value) => {
            if (value && value != "")
                tableValues.push({
                    visible: true,
                    value: value,
                    color: generateRandomColor()
                })
        })
        tableValues.push({
            value: nullText,
            color: generateRandomColor(),
            visible: true
        })
        setTable(tableValues)
    }

    const changeVisibility = (trs: TableRow[]) => {
        let tableValues: TableRow[] = []

        table.forEach((tr: TableRow) => {
            let found = trs.some((trs) => trs === tr)
            tableValues.push({
                value: tr.value,
                visible: found,
                color: found ? tr.color : [0, 0, 0, 0],
            })
        })
        setTable(tableValues)
        // updateColorsByColorRamp(selectedSpectrumColors!)
    }

    return (
        <div className={"categorized-container"}>
            <div>
                <div className={"attribute-container"}>
                    <span style={{width: "auto"}}><b>{attributeLabel}:</b></span>
                    <Dropdown
                        value={selectedAttr}
                        onChange={(e: DropdownChangeEvent) => changeAttribute(e)}
                        options={attr}
                        optionLabel={"name"}
                        itemTemplate={(option: SEAttribute) => <span>{option.name} ({option.values.length})</span>}
                        placeholder={selectAttributeLabel}
                    />
                </div>
                {table.length > 0 &&
                    <div>
                        <div className={"stroke-row"}>
                            <div className={"stroke-color-container"}>
                                <span><b>{strokeColorLabel}:</b></span>
                                <div>
                                    <MyColorPicker color={(() => {
                                        if (borderColor.at(3)! < 1)
                                            return [borderColor[0], borderColor[1], borderColor[2], 1]
                                        return borderColor
                                    })()} hideAlpha={true}
                                                   onChange={(e: string) => setBorderColor(fromString(e))}/>
                                </div>
                            </div>
                            <div className={"stroke-width-container"}>
                                <span><b>{strokeWidthLabel}:</b></span>
                                <Slider max={10} min={0} className={"stroke-slider"}
                                        value={borderThickness}
                                        onChange={(e) => setBorderThickness(e.value as number)}/>
                                <span>{borderThickness} px</span>
                            </div>
                        </div>
                        <div className={"opacity-container"}>
                            <span><b>{colorOpacityLabel}:</b></span>
                            <Slider max={100} min={0} className={"opacity-slider"}
                                    value={fillOpacity} onChange={(e) => {
                                setFillOpacity(e.value as number)
                                let aux = [...table]
                                let newTable = aux.map((tr) => {
                                    let aux2 = []
                                    aux2.push(tr.color[0])
                                    aux2.push(tr.color[1])
                                    aux2.push(tr.color[2])
                                    aux2.push(e.value as number / 100)
                                    return {...tr, color: aux2}
                                })
                                setTable(newTable)
                            }}/>
                            <span>{fillOpacity}%</span>
                        </div>
                        <div className={"spectrum-container"}>
                            <span style={{width: "auto"}}><b>{colorStyleLabel}:</b></span>
                            <Dropdown
                                value={selectedSpectrumColors}
                                options={preDefinedPalettes}
                                onChange={(e: DropdownChangeEvent) => changeColorsOfValues(e.value)}
                                placeholder={selectSpectrumLabel}
                                optionLabel={"label"}
                                optionGroupLabel={"label"}
                                itemTemplate={itemTemplate}
                            />
                            <PrimeButton text icon={"pi pi-refresh"} disabled={!selectedSpectrumColors}
                                         tooltip={updateColorsLabel}
                                         onClick={() => updateColorsByColorRamp(selectedSpectrumColors!, isReversed)}/>
                            <PrimeButton text icon={"pi pi-arrow-right-arrow-left"} disabled={!selectedSpectrumColors}
                                         tooltip={reverseColorsLabel}
                                         onClick={() => revertColors()}/>
                        </div>
                        <div className={"table-container"}>
                            <DataTable<TableRow[]>
                                value={table}
                                selectionMode={rowClick ? null : "checkbox"}
                                tableStyle={{minWidth: "25rem"}}
                                selection={table.filter((tr) => tr.visible)!}
                                onSelectionChange={(event: DataTableSelectionMultipleChangeEvent<TableRow[]>) => {
                                    const value = event.value as TableRow[]
                                    changeVisibility(value)
                                }}
                                reorderableRows
                                onRowReorder={(e) => setTable(e.value)}
                            >
                                <Column rowReorder style={{width: '3rem'}}/>
                                <Column
                                    selectionMode="multiple"
                                    field="visible"
                                    body={visibleColumnTemplate}
                                />
                                <Column field="color" header={colorLabel} body={colorColumnTemplate}/>
                                <Column field="value" header={valueLabel} sortable/>
                            </DataTable>
                        </div>
                    </div>}
            </div>
            <div className={"footer-container"}>
                <Button label={concludeLabel}
                        onClick={() => {
                            applyRenderer({
                                type: RenderType.Categorized, field: selectedAttr?.name,
                                rendererOL: getCategorizedStyle(selectedAttr?.name!, table.filter(row => row.value != nullText && row.visible)
                                    .map((tr) => ({
                                        value: tr.value,
                                        color: tr.color
                                    })), borderColor, borderThickness, table.find(row => row.value == nullText)!.color)
                            })
                            setVisible(false)
                        }}/></div>
        </div>)
}
