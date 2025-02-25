import {Dropdown, DropdownChangeEvent} from "primereact/dropdown"
import React, {useEffect, useRef, useState} from "react"
import {Slider} from "primereact/slider"
import {Color, fromString} from "ol/color";
import {Chart} from "primereact/chart";
import {InputNumber} from "primereact/inputnumber";
import {Button, Button as PrimeButton} from "primereact/button";
import {
    SEAttribute, AttributeTypeEnum, ColorRampDropdownItem, ColorRampItem, getGraduatedStyle,
    getRendererColorAndSizeStroke,
    getRendererOpacity,
    Render,
    RenderType,
    Row, GraduatedModes
} from "../RendererObjects.ts";
import {ColorRamp, colorRamps, generateGradient, getColorRampString, Stop} from "./rampColors.ts";
import {FlatStyle} from "ol/style/flat";
import {Toast, ToastMessage} from "primereact/toast";
import {jenksBuckets, quantileBuckets, standardDeviationBuckets} from "geobuckets/dist/src";
import {MyColorPicker} from "./myColorPicker.tsx";
import {useTranslation} from "react-i18next";

interface GraduatedProps {
    attr: SEAttribute[]
    setAttr: (value: never) => void
    applyRenderer: (renderer: Render) => void
    setVisible: (e: boolean) => void
    showPreDefinedRamps: boolean,
    moreRamps: ColorRamp[]
    layerCurrentRenderer: Render
    numbersLocale: string
}

interface Interval {
    min: number
    max: number
    count: number
}

export const Graduated: React.FC<GraduatedProps> = (props: GraduatedProps) => {
    const {
        attr, applyRenderer, setVisible, layerCurrentRenderer, moreRamps,
        showPreDefinedRamps, numbersLocale
    } = props

    const {t} = useTranslation()
    const errorRamps = t("errors.error_ramps_same_name" as any)
    const colorRampLabel: string = t("categorized.color_ramps" as any)
    const errorDiffLabel: string = t("errors.error_diff" as any)
    const errorSumLabel: string = t("errors.error_sum" as any)
    const errorSum2Label: string = t("errors.error_sum2" as any)
    const amountValuesLabel: string = t("graduated.amount_values" as any)
    const valuesLabel: string = t("graduated.values" as any)
    const amountLabel: string = t("graduated.amount" as any)
    const attributeLabel: string = t("categorized.attribute" as any)
    const selectAttributeLabel: string = t("categorized.select_attribute" as any)
    const selectModeLabel: string = t("graduated.select_mode" as any)
    const whichModeLabel: string = t("graduated.which_mode" as any)
    const intervalSizeLabel: string = t("graduated.interval_size" as any)
    const classesNumberLabel: string = t("graduated.classes_number" as any)
    const colorsSpectrumLabel: string = t("categorized.colors_spectrum" as any)
    const selectSpectrumLabel: string = t("categorized.select_spectrum" as any)
    const invertColorsLabel: string = t("graduated.invert_colors" as any)
    const gradientIntervalsLabel: string = t("graduated.gradient_intervals" as any)
    const valueLabel: string = t("graduated.value" as any)
    const strokeColorLabel: string = t("categorized.stroke_color" as any)
    const strokeWidthLabel: string = t("categorized.stroke_width" as any)
    const colorOpacityLabel: string = t("categorized.color_opacity" as any)
    const concludeLabel: string = t("common.conclude" as any)
    const previewLabel: string = t("graduated.preview" as any)
    const errorValuesLabel: string = t("errors.error_values" as any)
    const minValueLabel: string = t("graduated.min_value" as any)
    const maxValueLabel: string = t("graduated.max_value" as any)
    const colorLabel: string = t("graduated.color" as any)
    const modeLabel: string = t("graduated.mode" as any)

    const locale = numbersLocale

    const toast = useRef<Toast | null>(null);

    const showToast = (message: string, severity: string) => {
        toast.current?.show({severity: severity, summary: 'Error', detail: message} as ToastMessage);
    };

    const currentRender = layerCurrentRenderer.type != RenderType.Graduated ? [] :
        (layerCurrentRenderer.rendererOL["fill-color"] as never[])

    const valuesAndColors: Row[] = []
    for (let i = 3; i < currentRender.length - 1; i += 2) {
        valuesAndColors.push({
            value: currentRender[i],
            color: currentRender[i + 1],
        })
    }

    const currentStyle: FlatStyle | null = layerCurrentRenderer.type != RenderType.Graduated ? null : layerCurrentRenderer.rendererOL as FlatStyle;
    const stroke = getRendererColorAndSizeStroke(layerCurrentRenderer)
    const [opacity, setOpacity] = useState<number>(currentStyle ? getRendererOpacity(layerCurrentRenderer) : 100)
    const [stops, setStops] = useState<Row[]>(valuesAndColors)
    const [selectedAttr, setSelectedAttr] = useState<SEAttribute | undefined>(layerCurrentRenderer.field ?
        attr.find(at => at.name == layerCurrentRenderer.field!)! : undefined)
    const [selectedMode, setSelectedMode] = useState<GraduatedModes | undefined>(layerCurrentRenderer.type == RenderType.Graduated ?
        layerCurrentRenderer.graduatedType! : undefined)
    const [intervals, setIntervals] = useState<Interval[]>([])
    const [classNo, setClassNo] = useState<number>(layerCurrentRenderer.type == RenderType.Graduated ? valuesAndColors.length - 1 : 5)
    const [intervalSize, setIntervalSize] = useState<number>(0)
    const [selectedSpectrumColors, setSelectedSpectrumColors] =
        useState<ColorRampItem>()

    const [borderColor, setBorderColor] = useState<Color>(currentStyle ? stroke.color : fromString("#000000"));
    const [borderThickness, setBorderThickness] = useState<number>(currentStyle ? stroke.size : 1);

    const [chartData, setChartData] = useState<any>({})
    const [chartOptions, setChartOptions] = useState<any>({})

    const allRamps = showPreDefinedRamps ? moreRamps.concat(colorRamps) : moreRamps

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

    function applyRampToStops(ramp: ColorRampItem, invert?: boolean) {
        const aux = [...stops]

        if (invert) {
            const inverse = aux.map(s => s.color).reverse()
            const newTable = aux.map((tr, index) => {
                const aux2 = []
                const color = inverse[index]
                aux2.push(color[0])
                aux2.push(color[1])
                aux2.push(color[2])
                aux2.push(opacity / 100)
                return {...tr, color: aux2}
            })
            setStops(newTable)
            return
        }

        const colors = generateGradient(ramp.value as Stop[], aux.length)
        const newTable2 = aux.map((tr, index) => {
            const aux2 = []
            const color = fromString(colors[index])
            aux2.push(color[0])
            aux2.push(color[1])
            aux2.push(color[2])
            aux2.push(opacity / 100)
            return {...tr, color: aux2}
        })
        setStops(newTable2)
    }

    function countNumbers(list: number[]) {
        const counting: Record<number, number> = {};

        list.filter(n => n != null).forEach(num => {
            const rounded: number = Math.round(num);
            counting[rounded] = (counting[rounded] || 0) + 1;
        });

        const maxNumber = Math.round(Math.max(...list));
        const minNumber = Math.round(Math.min(...list));
        if (maxNumber - minNumber <= 0)
            showToast(errorDiffLabel + (maxNumber - minNumber), "error")
        const result: number[] = new Array(maxNumber - minNumber).fill(0);

        Object.entries(counting).forEach(([n, times]) => {
            result[Number(n) - minNumber] = times;
        });

        let intervals: Interval[] = result.map((value, index) => {
            return {min: index + minNumber, max: index + minNumber + 1, count: value}
        })

        if (list.length != intervals.reduce((acc, curr) => acc + curr.count, 0))
            showToast(errorSumLabel, "error")

        const reduceFactor = 2
        while (intervals.length > 100) {
            //reduce the number of intervals by 5
            const newIntervals: Interval[] = []
            for (let i = 0; i <= intervals.length - reduceFactor; i += reduceFactor) {
                const min = intervals[i].min
                let max: number
                const isLast = i == intervals.length - reduceFactor || i + reduceFactor > intervals.length - reduceFactor
                if (isLast) {
                    max = intervals[intervals.length - 1].max
                } else
                    max = intervals[i + reduceFactor].min
                const count = intervals.slice(i, isLast ?
                    intervals.length : i + reduceFactor).reduce((acc, curr) => acc + curr.count, 0)
                newIntervals.push({min: min, max: max, count: count})
            }
            intervals = newIntervals
        }

        const lastInterval = intervals[intervals.length - 1]
        intervals.push({min: lastInterval.max, max: lastInterval.max + (lastInterval.max - lastInterval.min), count: 0})

        const total = intervals.reduce((acc, curr) => acc + curr.count, 0)
        if (list.length != total)
            showToast(errorSum2Label + (list.length - total), "error")

        // let maxCount = Math.max(...intervals.map((i) => i.count))

        //normalize to 100%
        intervals = intervals.map((i) => {
            return {min: i.min, max: i.max, count: i.count * 100 / list.length}
        })

        // console.log("intervals", intervals)

        return intervals;
    }

    async function calculateStopsByMode(mode: GraduatedModes, nClasses: number, intervalSize: number) {
        let stops: Row[] = []
        let values = selectedAttr?.values!.map(Number) || []
        values = values.filter((v) => !isNaN(v) && v != null)
        const min = Math.min(...values)
        const max = Math.max(...values)
        const range = max - min

        switch (mode) {
            case GraduatedModes.EqualInterval:
            case GraduatedModes.Manual: {
                const interval2 = range / nClasses
                for (let i = 0; i < nClasses; i++) {
                    stops.push({value: min + interval2 * i, color: fromString("rgb(0,0,0)")})
                }
                stops.push({value: max, color: fromString("rgb(0,0,0)")})
                break
            }
            case GraduatedModes.DefinedInterval: {
                const interval = range / intervalSize
                console.log("interval", interval, intervalSize)
                for (let i = 0; i <= interval; i++) {
                    stops.push({value: min + intervalSize * i, color: fromString("rgb(0,0,0)")})
                }
                break
            }
            case GraduatedModes.NaturalBreaks: {
                const auxJenks = await jenksBuckets(values, nClasses);
                stops = auxJenks.map((value) => {
                    return {value: value, color: fromString("rgb(0,0,0)")}
                })
                break
            }
            case GraduatedModes.Quantile: {
                const auxQuantile = await quantileBuckets(values, nClasses)
                stops = auxQuantile.map((value) => {
                    return {value: value, color: fromString("rgb(0,0,0)")}
                })
                break
            }
            // case Modes.GeometricInterval:
            //     for (let i = 0; i < 5; i++) {
            //         stops.push({value: min + interval * i, color: fromString("rgb(0,0,0)")})
            //     }
            //     break
            case GraduatedModes.StandardDeviation:
                const auxStand = await standardDeviationBuckets(values, nClasses)
                stops = auxStand.map((value) => {
                    return {value: value, color: fromString("rgb(0,0,0)")}
                })
                break
            default:
                break
        }
        // console.log("stops", stops)
        setIntervals(countNumbers(values || []))
        return stops
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (stops.length > 0) {
            let values = selectedAttr?.values!.map(Number) || []
            values = values.filter((v) => !isNaN(v) && v != null)
            setIntervals(countNumbers(values || []))
        }
    }, []);

    const stopsValues = stops.map((s) => s.value).join(", ")

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (intervals && intervals.length > 0) {
            const chartData = {
                //max value of the attribute
                labels: intervals.map((i) => i.min.toString()),
                datasets: [
                    {
                        label: amountValuesLabel,
                        data: intervals.map((i) => i.count),
                        backgroundColor: "rgb(54, 162, 235)",
                        borderWidth: 2,
                        borderColor: "rgb(54, 162, 235)",
                    },
                ],
            }
            setChartData(chartData)

            const chartOptions = {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: valuesLabel
                        },
                        ticks: {
                            autoSkip: false,
                            color: function (val: any) {
                                // Hide every 2nd tick label
                                return val.index % 2 === 0 ? "#000" : 'rgba(255,255,255,0)';
                            },
                        },
                        grid: {
                            display: true,
                            drawTicks: true,
                            color: function (context: any) {
                                if (context.tick) {
                                    const value = Number.parseInt(context.tick.label)
                                    const interval = stops.map(stop =>
                                        intervals.find((i) => i.min <= (stop.value as number) && (stop.value as number) < i.max)!)
                                    return interval.find(i => i?.min <= value && value < i.max) ? "#ea1010" : "rgba(0,0,0,0)"
                                } else
                                    return "rgba(0,0,0,0)"
                            },
                            // color: "#da1010",
                            drawBorder: false
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: amountLabel
                        }
                    }
                }
            }
            setChartOptions(chartOptions)
        }
    }, [intervals, stopsValues]);

    return <>
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <div style={{display: "flex", flexDirection: "row", gap: "20px", alignItems: "center"}}>
                <div style={{display: "flex", flexDirection: "row", gap: "5px", alignItems: "center"}}>
                    <span style={{width: "auto"}}>{attributeLabel}:</span>

                    <Dropdown
                        value={selectedAttr}
                        onChange={(e: DropdownChangeEvent) => {
                            setStops([])
                            setSelectedAttr(e.value)
                            setSelectedMode(undefined)
                            setSelectedSpectrumColors(undefined)
                        }}
                        options={attr.filter((a) => a.type === AttributeTypeEnum.INTEGER || a.type === AttributeTypeEnum.FLOAT)}
                        optionLabel="name"
                        placeholder={selectAttributeLabel}
                    />
                </div>
                <div style={{display: "flex", flexDirection: "row", gap: "5px", alignItems: "center"}}>
                    <span style={{width: "auto"}}>{modeLabel}:</span>

                    <Dropdown
                        disabled={!selectedAttr}
                        value={selectedMode}
                        onChange={async (e: DropdownChangeEvent) => {
                            let iSize = Math.round(Math.max(...selectedAttr!.values!.map(Number).filter(v => v != null && !isNaN(v))) / 10)
                            if (iSize == 0)
                                iSize = 1
                            setIntervalSize(iSize)
                            const classNumber = selectedAttr!.values!.length > 5 ? 5 : selectedAttr!.values!.length - 1
                            setClassNo(classNumber)
                            setStops(await calculateStopsByMode(e.value as GraduatedModes, classNumber, iSize))
                            setSelectedMode(e.value)
                            setSelectedSpectrumColors(undefined)
                        }}
                        options={Object.values(GraduatedModes).filter((m) =>
                            m != GraduatedModes.GeometricInterval)
                        }
                        itemTemplate={(option: GraduatedModes) => {
                            return t(`graduate_modes.${option}` as any)
                        }}
                        valueTemplate={(option: GraduatedModes) => {
                            if (option)
                                return t(`graduate_modes.${option}` as any)
                            else return selectModeLabel
                        }}
                        placeholder={selectModeLabel}
                    />
                    <a href="https://resources.arcgis.com/en/help/main/10.2/index.html#//00s50000001r000000"
                       target="_blank">{whichModeLabel}</a>
                </div>
                {selectedAttr &&
                    <span>{minValueLabel}: {Math.min(...selectedAttr!.values!.map(Number).filter((v) => !isNaN(v) && v != null)).toLocaleString(locale)}</span>}
                {selectedAttr &&
                    <span>{maxValueLabel}: {Math.max(...selectedAttr!.values!.map(Number).filter((v) => !isNaN(v) && v != null)).toLocaleString(locale)}</span>}
            </div>
            {selectedMode &&
                <div style={{display: "flex", flexDirection: "row", gap: "15px", alignItems: "center"}}>
                    {(selectedMode == GraduatedModes.Manual || selectedMode == GraduatedModes.EqualInterval ||
                        selectedMode == GraduatedModes.Quantile || selectedMode == GraduatedModes.NaturalBreaks ||
                        selectedMode == GraduatedModes.GeometricInterval) && <div>
                        <span style={{width: "auto"}}>{classesNumberLabel}:</span>

                        <InputNumber value={classNo}
                                     locale={locale}
                                     onChange={async (e) => {
                                         setClassNo(e.value as number)
                                         setSelectedSpectrumColors(undefined)
                                         setStops(await calculateStopsByMode(selectedMode!, e.value as number, intervalSize))
                                     }}/>
                    </div>}

                    {(selectedMode == GraduatedModes.DefinedInterval || selectedMode == GraduatedModes.StandardDeviation) &&
                        <div>
                            <span style={{width: "auto"}}>{intervalSizeLabel}:</span>

                            <InputNumber value={intervalSize}
                                         locale={locale}
                                         onChange={async (e) => {
                                             setIntervalSize(e.value as number)
                                             setSelectedSpectrumColors(undefined)
                                             setStops(await calculateStopsByMode(selectedMode!, classNo, e.value as number))
                                         }}/>
                        </div>}
                </div>}

            {selectedMode && selectedAttr &&
                <Chart style={{height: "500px"}} type="bar" data={chartData}
                       options={chartOptions}
                />}

            {stops.length > 0 && selectedMode &&
                <div style={{display: "flex", flexDirection: "column", gap: "15px", paddingTop: "10px"}}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "7px",
                        padding: "5px"
                    }}>
                        <span style={{width: "auto"}}>{colorsSpectrumLabel}:</span>
                        <Dropdown
                            value={selectedSpectrumColors}
                            options={preDefinedPalettes}
                            onChange={(e: DropdownChangeEvent) => {
                                setSelectedSpectrumColors(e.value as ColorRampItem)
                                applyRampToStops(e.value)
                            }}
                            placeholder={selectSpectrumLabel}
                            optionLabel={"label"}
                            optionGroupLabel={"label"}
                            itemTemplate={itemTemplate}
                        />
                        <PrimeButton text icon={"pi pi-arrow-right-arrow-left"}
                                     tooltip={invertColorsLabel}
                                     disabled={!selectedSpectrumColors}
                                     onClick={() => applyRampToStops(selectedSpectrumColors!, true)}/>

                    </div>
                    <div style={{display: "flex", flexDirection: "row", gap: "50px"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                            <span style={{width: "auto"}}>{gradientIntervalsLabel}:</span>
                            {stops.map((value: Row, index: number) => {
                                    return (
                                        <div key={index}
                                             style={{
                                                 display: "flex",
                                                 flexDirection: "row",
                                                 gap: "5px",
                                                 alignItems: "center",
                                             }}>
                                            <span style={{width: "auto"}}> {valueLabel}:  </span>
                                            <InputNumber placeholder={valueLabel}
                                                         allowEmpty={false}
                                                         locale={locale}
                                                         min={stops[0].value as number}
                                                         max={index < (stops.length - 1 as number) ?
                                                             (stops[index + 1]?.value as number) - 0.001 : (stops[stops.length]?.value as number)}
                                                         disabled={index === 0 || selectedMode != GraduatedModes.Manual || index === stops.length - 1}
                                                         onChange={(e) => {
                                                             const aux = [...stops]
                                                             aux[index].value = e.value as number
                                                             setStops(aux)
                                                         }
                                                         }
                                                         value={value.value as number}
                                            />

                                            <span style={{width: "auto"}}>{colorLabel}: </span>
                                            <MyColorPicker
                                                color={value.color}
                                                onChange={(e: string) => {
                                                    const aux = [...stops]
                                                    aux[index].color = fromString(e)
                                                    setStops(aux)
                                                }}
                                            />
                                        </div>
                                    )
                                },
                            )}

                        </div>

                        <div>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "5px",
                                alignItems: "center",
                                padding: "5px"
                            }}>
                                <span>{strokeColorLabel}:</span>
                                <div>
                                    <MyColorPicker color={borderColor} hideAlpha={true}
                                                   onChange={(e: string) => setBorderColor(fromString(e))}/>
                                </div>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", gap: "7px", padding: "5px"}}>
                                <span>{strokeWidthLabel}: {borderThickness}</span>
                                <Slider max={10} min={0} style={{width: "300px"}}
                                        value={borderThickness}
                                        onChange={(e) => setBorderThickness(e.value as number)}/>
                            </div>

                            <div style={{display: "flex", flexDirection: "column", gap: "7px", padding: "5px"}}>
                                <span>{colorOpacityLabel}: {opacity}%</span>
                                <Slider max={100} min={0} style={{width: "300px"}}
                                        value={opacity} onChange={(e) => {
                                    setOpacity(e.value as number)
                                    const aux = [...stops]
                                    const newTable = aux.map((tr) => {
                                        const aux2 = []
                                        aux2.push(tr.color[0])
                                        aux2.push(tr.color[1])
                                        aux2.push(tr.color[2])
                                        aux2.push(e.value as number / 100)
                                        return {...tr, color: aux2}
                                    })
                                    setStops(newTable)
                                }}/>
                            </div>
                            <span>{previewLabel}</span>
                            <div style={{
                                background: getColorRampString(stops.map((stop, index) => {
                                    return {offset: index / stops.length, color: stop.color}
                                })),
                                width: "90px", height: "20px"
                            }}/>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "flex-end", padding: "10px", width: "100%"}}>
                        <Button label={concludeLabel}
                                onClick={() => {
                                    let allGood = true
                                    stops.forEach((stop, index) => {
                                        if (index < stops.length - 1 && stop.value >= stops[index + 1].value) {
                                            showToast(errorValuesLabel, "error")
                                            allGood = false
                                        }
                                    })
                                    if (allGood) {
                                        applyRenderer({
                                            type: RenderType.Graduated,
                                            graduatedType: selectedMode,
                                            field: selectedAttr?.name,
                                            rendererOL: getGraduatedStyle(selectedAttr?.name!, stops, borderColor, borderThickness,)
                                        })
                                        setVisible(false)
                                    }
                                }}/></div>
                </div>}
        </div>
        <Toast ref={toast}/>
    </>
}