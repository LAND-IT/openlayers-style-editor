import React, {useState} from "react"
import {Color, fromString} from "ol/color";
import {Slider} from "primereact/slider";
import {MyColorPicker} from "./myColorPicker.tsx";
import {Button} from "primereact/button";
import {FlatStyle} from "ol/style/flat";
import {useTranslation} from "react-i18next";
import "./uniqueSymbol.css"
import {Render, RenderType, singleColorStyle} from "../rendererUtils";

interface UniqueSymbolProps {
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    setVisible: (e: boolean) => void
}

export const UniqueSymbol: React.FC<UniqueSymbolProps> = (props: UniqueSymbolProps) => {

    const {layerCurrentRenderer, applyRenderer, setVisible} = props;

    const { t } = useTranslation();
    const fillColorLabel: string = t("unique_symbol.fill_color" as any)
    const strokeColorLabel: string = t("categorized.stroke_color" as any)
    const strokeWidthLabel: string = t("categorized.stroke_width" as any)
    const concludeLabel: string = t("common.conclude" as any)

    const start = "#18d7ba";

    const currentStyle: FlatStyle | null = layerCurrentRenderer.field ? null : layerCurrentRenderer.rendererOL as FlatStyle;
    const [color, setColor] = useState<Color>(currentStyle ? currentStyle["fill-color"]! as Color : fromString(start));
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
    const [borderColor, setBorderColor] = useState<Color>(auxBorder);
    let auxBorderWidth;
    if (currentStyle) {
        if(currentStyle["stroke-width"] instanceof Array)
            auxBorderWidth = (currentStyle["stroke-width"]! as any[])[3] as number;
        else
            auxBorderWidth = currentStyle["stroke-width"] as number;
    } else {
        auxBorderWidth = 0;
    }
    const [borderThickness, setBorderThickness] = useState<number>(auxBorderWidth);

    function createRenderUnique(color: Color, outlineColor: Color, outlineWidth: number) {
        return singleColorStyle(color, outlineColor, outlineWidth);
    }

    return (
        <div className={"container"}>
            <div>
                <div className={"flex-row-unique"}>
                    <span><b>{fillColorLabel}:</b></span>
                    <div>
                        <MyColorPicker color={color}
                                       onChange={(e: string) => setColor(fromString(e))}/>
                    </div>
                </div>
                <div className={"flex-row-unique"}>
                    <span><b>{strokeColorLabel}:</b></span>
                    <div>
                        <MyColorPicker color={borderColor} hideAlpha={true}
                                       onChange={(e: string) => setBorderColor(fromString(e))}/>
                    </div>
                </div>
                <div className={"flex-column-gap-7"}>
                    <span><b>{strokeWidthLabel}: </b></span>
                    <Slider max={10} min={0} className={"slider-wrapper"}
                            value={borderThickness} onChange={(e) => setBorderThickness(e.value as number)}/>
                    <span>{borderThickness} px</span>
                </div>
            </div>
            <div className={"button-wrapper"}>
                <Button label={concludeLabel}
                        onClick={() => {
                            applyRenderer({
                                type: RenderType.Unique,
                                rendererOL: createRenderUnique(color, borderColor, borderThickness)
                            })
                            setVisible(false)
                        }}/>
            </div>
        </div>
    )
}
