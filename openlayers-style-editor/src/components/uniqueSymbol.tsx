import React, {useState} from "react"
import {Color, fromString} from "ol/color";
import {Slider} from "primereact/slider";
import {Render, RenderType, singleColorStyle} from "../RendererObjects.ts";
import {MyColorPicker} from "./myColorPicker.tsx";
import {Button} from "primereact/button";
import {FlatStyle} from "ol/style/flat";
import {useTranslation} from "react-i18next";

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
    const [borderThickness, setBorderThickness] = useState<number>(currentStyle ? (currentStyle["stroke-width"]! as any[])[3] as number : 1);

    function createRenderUnique(color: Color, outlineColor: Color, outlineWidth: number) {
        return singleColorStyle(color, outlineColor, outlineWidth);
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
                    <span>{fillColorLabel}:</span>
                    <div>
                        <MyColorPicker color={color}
                                       onChange={(e: string) => setColor(fromString(e))}/>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", gap: "5px", alignItems: "center", padding: "5px"}}>
                    <span>{strokeColorLabel}:</span>
                    <div>
                        <MyColorPicker color={borderColor} hideAlpha={true}
                                       onChange={(e: string) => setBorderColor(fromString(e))}/>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "7px", padding: "5px"}}>
                    <span>{strokeWidthLabel}: {borderThickness}</span>
                    <Slider max={10} min={0} style={{width: "300px"}}
                            value={borderThickness} onChange={(e) => setBorderThickness(e.value as number)}/>
                </div>
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "end", padding: "15px"}}>
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
