import React, {useState} from "react"
import {Color} from "ol/color";
import {Button} from "primereact/button";
import {FlatStyle} from "ol/style/flat";
import {useTranslation} from "react-i18next";
import "./uniqueSymbol.css"
import {Render, RenderType, singleColorStyle} from "../rendererUtils";
import {UniqueSymbolComponent} from "@/components/uniqueSymbolComponent.tsx";

interface UniqueSymbolProps {
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    setVisible: (e: boolean) => void
}

export const UniqueSymbol: React.FC<UniqueSymbolProps> = (props: UniqueSymbolProps) => {

    const {layerCurrentRenderer, applyRenderer, setVisible} = props;

    const { t } = useTranslation();
    const concludeLabel: string = t("common.conclude" as any)

    const [color, setColor] = useState<Color>()
    const [borderColor, setBorderColor] = useState<Color>()
    const [borderThickness, setBorderThickness] = useState<number>()

    const currentStyle: FlatStyle | null = layerCurrentRenderer.type != RenderType.Unique ? null :
        layerCurrentRenderer.rendererOL as FlatStyle;

    function createRenderUnique(color: Color, outlineColor: Color, outlineWidth: number) {
        return singleColorStyle(color, outlineColor, outlineWidth);
    }

    return (
        <div className={"container"}>
            <UniqueSymbolComponent color={color} setColor={setColor} currentStyle={currentStyle}
                                   borderColor={borderColor} setBorderColor={setBorderColor}
                                   borderThickness={borderThickness} setBorderThickness={setBorderThickness}/>
            <div className={"button-wrapper"}>
                <Button label={concludeLabel}
                        onClick={() => {
                            applyRenderer({
                                type: RenderType.Unique,
                                rendererOL: createRenderUnique(color!, borderColor!, borderThickness!)
                            })
                            setVisible(false)
                        }}/>
            </div>
        </div>
    )
}
