import {MyColorPicker} from "@/components/myColorPicker.tsx";
import {Color, fromString} from "ol/color";
import {Slider} from "primereact/slider";
import React, {useEffect} from "react";
import {FlatStyle} from "ol/style/flat";
import {useTranslation} from "react-i18next";
import "./uniqueSymbol.css"

interface Props {
    currentStyle?: FlatStyle | null
    color: Color | undefined
    setColor: (e: Color) => void
    borderColor: Color | undefined
    setBorderColor: (e: Color) => void
    borderThickness: number | undefined
    setBorderThickness: (e: number) => void
}

export function UniqueSymbolComponent(props: Props) {

    const {currentStyle, setColor, setBorderColor, setBorderThickness, borderThickness, color, borderColor} = props;

    const {t} = useTranslation();
    const fillColorLabel: string = t("unique_symbol.fill_color" as any)
    const strokeColorLabel: string = t("categorized.stroke_color" as any)
    const strokeWidthLabel: string = t("categorized.stroke_width" as any)

    const start = "#18d7ba";

    useEffect(() => {


        setColor(currentStyle ? currentStyle["fill-color"]! as Color : fromString(start))

        let auxBorder;
        if (currentStyle) {
            if (currentStyle["stroke-color"])
                if (currentStyle["stroke-color"]![0] == "case")
                    auxBorder = currentStyle["stroke-color"]![3] as Color;
                else
                    auxBorder = currentStyle["stroke-color"] as Color;
            else
                auxBorder = fromString("#000000");
        } else {
            auxBorder = fromString("#000000");
        }
        setBorderColor(auxBorder);
        let auxBorderWidth;
        if (currentStyle) {
            if (currentStyle["stroke-width"] instanceof Array)
                auxBorderWidth = (currentStyle["stroke-width"]! as any[])[3] as number;
            else
                auxBorderWidth = currentStyle["stroke-width"] as number;
        } else {
            auxBorderWidth = 0;
        }
        setBorderThickness(auxBorderWidth);
    }, []);

    return <>
        <div className={"container2"}>
            <div>
                <div className={"flex-row-unique"}>
                    <span><b>{fillColorLabel}:</b></span>
                    <div>
                        {color && <MyColorPicker color={color}
                                                 onChange={(e: string) => setColor(fromString(e))}/>}
                    </div>
                </div>
                <div className={"flex-row-unique"}>
                    <span><b>{strokeColorLabel}:</b></span>
                    <div>
                        {borderColor && <MyColorPicker color={borderColor} hideAlpha={true}
                                                       onChange={(e: string) => setBorderColor(fromString(e))}/>}
                    </div>
                </div>
                <div className={"flex-column-gap-7"}>
                    <span><b>{strokeWidthLabel}: </b></span>
                    <Slider max={10} min={0} className={"slider-wrapper"}
                            value={borderThickness} onChange={(e) => setBorderThickness(e.value as number)}/>
                    <span>{borderThickness} px</span>
                </div>
            </div>
        </div>
    </>
}