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
    ColorRampItem, generateRandomColor,
    getCategorizedStyle,
    getRendererColorAndSizeStroke,
    getRendererOpacity,
    getStyleColorsAndValues,
    PreDefinedRenderer,
    Render,
    RenderType,
    Row
} from "./rendererObjects";
import {SEAttribute} from "./rendererObjects.ts";
import {FlatStyle} from "ol/style/flat";
import {MyColorPicker} from "./myColorPicker.tsx";
import {Slider} from "primereact/slider";

interface Props {
    attr: SEAttribute[]
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    setVisible: (e: boolean) => void
    showPreDefinedRamps: boolean,
    moreRamps: ColorRamp[]
    preDefinedStyles: PreDefinedRenderer[]
}

interface TableRow {
    visible: boolean
    color: Color
    value: string
}

export const Categorized: React.FC<Props> = (props: Props)=> {
    const {
        attr,
        layerCurrentRenderer,
        showPreDefinedRamps,
        preDefinedStyles,
        moreRamps,
        applyRenderer,
        setVisible
    } = props

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
            value: "Nulo",
            color: currentRender[currentRender.length - 1],
            visible: true
        })

    const stroke = getRendererColorAndSizeStroke(layerCurrentRenderer)
    const [selectedSpectrumColors, setSelectedSpectrumColors] =
        useState<ColorRampItem>()
    const [table, setTable] = useState<TableRow[]>(valuesAndColors)
    const [selectedAttr, setSelectedAttr] = useState<SEAttribute | undefined>(layerCurrentRenderer.field ?
        attr.find(at => at.name == layerCurrentRenderer.field!)! : undefined)
    const [rowClick] = useState<boolean>(false)

    const currentStyle: FlatStyle | null = layerCurrentRenderer.type != RenderType.Categorized ? null : layerCurrentRenderer.rendererOL as FlatStyle;
    const [borderColor, setBorderColor] = useState<Color>(currentStyle ? stroke.color : fromString("#000000"));
    const [borderThickness, setBorderThickness] = useState<number>(currentStyle ? stroke.size : 1);
    const [fillOpacity, setFillOpacity] = useState<number>(currentStyle ? getRendererOpacity(layerCurrentRenderer) : 100);

    const allRamps = showPreDefinedRamps ? moreRamps.concat(colorRamps) : moreRamps

    //two ramps with same name
    const existingRenderers = allRamps.filter((ramp, _index, self) =>
        self.filter((r) => (
            r.name === ramp.name
        )).length > 1
    )

    if (existingRenderers.length > 0) {
        console.error("There are ramps with the same name: " + existingRenderers.map(ramp => ramp.name))
        return
    }

    const preDefinedPalettes = [
        {
            label: "Estilos pré-definidos",
            items: preDefinedStyles.map((renderer) => {
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
            label: "Rampas de Cores",
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
            <MyColorPicker
                onChange={(e) => updateColorPicker(fromString(e), tr)}
                color={tr.color}/>
        )
    }

    function updateColorsByColorRamp(colorRamp: ColorRampItem) {
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
        } else {
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
        }
    }

    function changeColorsOfValues(e: ColorRampItem) {
        const colorRamp = e
        setSelectedSpectrumColors(colorRamp)
        updateColorsByColorRamp(colorRamp)
    }

    function changeAttribute(e: DropdownChangeEvent) {

        let attribute = attr.find(a => a.name == e.value.name)!
        setSelectedAttr(attribute)
        setSelectedSpectrumColors(undefined)
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
            value: "Nulo",
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
                color: tr.color,
            })
        })
        setTable(tableValues)
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            paddingTop: "10px"
        }}>
            <div>
                <div style={{display: "flex", flexDirection: "row", gap: "5px", alignItems: "center", padding: "5px"}}>
                    <span>Cor do traço:</span>
                    <div>
                        <MyColorPicker color={borderColor} hideAlpha={true}
                                       onChange={(e: string) => setBorderColor(fromString(e))}/>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "7px", padding: "5px"}}>
                    <span>Espessura do traço: {borderThickness}</span>
                    <Slider max={10} min={0} style={{width: "300px"}}
                            value={borderThickness} onChange={(e) => setBorderThickness(e.value as number)}/>
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "7px", padding: "5px"}}>
                    <span style={{width: "auto"}}>Atributo:</span>
                    <Dropdown
                        value={selectedAttr}
                        onChange={(e: DropdownChangeEvent) => changeAttribute(e)}
                        options={attr}
                        optionLabel="name"
                        placeholder="Selecione um atributo"
                    />
                </div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "7px", padding: "5px"}}>
                    <span style={{width: "auto"}}>Espetro de cores:</span>
                    <Dropdown
                        value={selectedSpectrumColors}
                        options={preDefinedPalettes}
                        onChange={(e: DropdownChangeEvent) => changeColorsOfValues(e.value)}
                        placeholder="Selecione um espetro"
                        optionLabel={"label"}
                        optionGroupLabel={"label"}
                        itemTemplate={itemTemplate}
                    />
                    <PrimeButton text icon={"pi pi-refresh"} disabled={!selectedSpectrumColors}
                                 tooltip={"Atualizar as cores"}
                                 onClick={() => updateColorsByColorRamp(selectedSpectrumColors!)}/>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "7px", padding: "5px"}}>
                    <span>Opacidade da cor: {fillOpacity}%</span>
                    <Slider max={100} min={0} style={{width: "300px"}}
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
                </div>
                {table.length > 0 && <div style={{padding: "5px"}}>
                    <DataTable
                        value={table}
                        selectionMode={rowClick ? null : "checkbox"}
                        tableStyle={{minWidth: "25rem"}}
                        selection={table.filter((tr) => tr.visible)!}
                        onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<TableRow[]>) => {
                            const value = e.value as TableRow[]
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
                        <Column field="color" header="Cor" body={colorColumnTemplate}/>
                        <Column field="value" header="Valor" sortable/>
                    </DataTable>
                </div>}
            </div>
            <div style={{display: "flex", justifyContent: "flex-end", padding: "10px", width: "100%"}}>
                <Button label={"Concluir"}
                        onClick={() => {
                            applyRenderer({
                                type: RenderType.Categorized, field: selectedAttr?.name,
                                rendererOL: getCategorizedStyle(selectedAttr?.name!, table.filter(row => row.value != "Nulo" && row.visible)
                                    .map((tr) => ({
                                        value: tr.value,
                                        color: tr.color
                                    })), borderColor, borderThickness, table.find(row => row.value == "Nulo")!.color)
                            })
                            setVisible(false)
                        }}/></div>
        </div>)
}
