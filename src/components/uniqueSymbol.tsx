import {useState} from "react"
import {Color, fromString} from "ol/color";
import {Slider} from "primereact/slider";
import {Render, RenderType, singleColorStyle} from "./rendererObjects.ts";
import {MyColorPicker} from "./myColorPicker.tsx";
import {Button} from "primereact/button";
import {FlatStyle} from "ol/style/flat";

interface UniqueSymbolProps {
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    setVisible: (e: boolean) => void
}

export function UniqueSymbol(props: UniqueSymbolProps) {

    const {layerCurrentRenderer, applyRenderer, setVisible} = props;

    const start = "#18d7ba";

    const currentStyle: FlatStyle | null = layerCurrentRenderer.field ? null : layerCurrentRenderer.rendererOL as FlatStyle;
    const [color, setColor] = useState<Color>(currentStyle ? currentStyle["fill-color"]! as Color : fromString(start));
    const [borderColor, setBorderColor] = useState<Color>(currentStyle ? currentStyle["stroke-color"]![3] as Color : fromString("#000000"));
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
                    <span>Cor do preenchimento:</span>
                    <div>
                        <MyColorPicker color={color}
                                       onChange={(e: string) => setColor(fromString(e))}/>
                    </div>
                </div>
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
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "end", padding: "15px"}}>
                <Button label={"Concluir"}
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
