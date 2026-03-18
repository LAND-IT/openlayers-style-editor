import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import {UniqueSymbol} from "./uniqueSymbol"
import {Categorized} from "./categorized"
import {Dropdown} from "primereact/dropdown";
import {PredefinedRenderer, Render, RenderType, SEAttribute} from "../rendererUtils";
import {ColorRamp} from "./rampColors.ts";
import {Button} from "primereact/button";
import {Graduated} from "./graduated.tsx";
import {useTranslation} from "react-i18next";
import "./geometryEditor.css"
import {BasedOnRules} from "./basedOnRules.tsx";
import {FilterWidgetContextProvider} from "./filters/filterWidgetContext.tsx";
import {Feature} from "ol";

interface Props {
    attributes: SEAttribute[]
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    layerDefaultRenderer: Render
    layerCurrentRenderer: Render
    applyRenderer: (renderer: Render) => void
    showPreDefinedRamps: boolean,
    moreRamps?: ColorRamp[]
    predefinedStyles: PredefinedRenderer[],
    numbersLocale: string
    features: Feature[]
}

export const GeometryEditor: React.FC<Props> = (props: Props) => {

    const {
        layerCurrentRenderer,
        layerDefaultRenderer,
        moreRamps,
        predefinedStyles,
        showPreDefinedRamps,
        applyRenderer,
        setVisible,
        numbersLocale,
        features
    } = props;

    const {t} = useTranslation();
    const uniqueSymbol: string = t("common.unique_symbol" as any)
    const categorized: string = t("common.categorized" as any)
    const graduated: string = t("common.graduated" as any)
    const resetStyle: string = t("common.reset_style" as any)
    const selectStyle: string = t("common.select_type" as any)
    const styleType: string = t("common.style_type" as any)
    const basedOnRules: string = t("common.based_on_rules" as any)

    const [attr, setAttr] = useState<SEAttribute[]>(props.attributes)

    useEffect(() => {
        setAttr(props.attributes)
    }, [props.attributes])

    const [currentRenderer, setCurrentRenderer] = useState<Render>(layerCurrentRenderer)

    const options = [
        {label: uniqueSymbol, code: 0},
        {label: categorized, code: 1},
        {label: graduated, code: 2},
        {label: basedOnRules, code: 3}
    ]

    const [activeIndex, setActiveIndex] = useState<{
        label: string,
        code: number
    }>(layerCurrentRenderer.type == RenderType.Categorized ?
        options[1] : layerCurrentRenderer.type == RenderType.Graduated ? options[2] :
            layerCurrentRenderer.type == RenderType.ByRules ? options[3] : options[0])

    useEffect(() => {
        setActiveIndex(currentRenderer.type == RenderType.Categorized ?
            options[1] : currentRenderer.type == RenderType.Graduated ? options[2] :
                layerCurrentRenderer.type == RenderType.ByRules ? options[3] : options[0])
    }, [currentRenderer]);

    function findIdField(features: Feature[]): string | null {
        if (!features || features.length === 0) return null;

        // 1. Collect all property keys from a sample of features
        const candidates = new Set<string>();
        const sampleSize = Math.min(features.length, 100);
        for (let i = 0; i < sampleSize; i++) {
            const props = features[i].getProperties();
            if (props) {
                Object.keys(props).filter(k => k !== 'geometry').forEach(k => candidates.add(k));
            }
        }

        if (candidates.size === 0) return null;

        let bestField: string | null = null;
        let maxUniqueness = -1;
        const perfectCandidates: string[] = [];

        // 2. Evaluate uniqueness of each candidate
        for (const key of Array.from(candidates)) {
            const uniqueValues = new Set();
            let validCount = 0;

            for (const feature of features) {
                const val = feature.get(key);
                // Ignore null/empty when counting uniqueness to allow spotty ID fields
                if (val !== null && val !== undefined && val !== "") {
                    uniqueValues.add(val);
                    validCount++;
                }
            }

            if (validCount === 0) continue;

            const uniqueness = uniqueValues.size / validCount;

            // Also prioritize fields with more valid values overall if uniqueness ties
            if (uniqueness > maxUniqueness || (uniqueness === maxUniqueness && validCount > (features.length / 2))) {
                maxUniqueness = uniqueness;
                bestField = key;
            }

            if (uniqueness === 1.0) {
                perfectCandidates.push(key);
            }
        }

        // 3. If there are perfectly unique candidates, prefer ones named like an ID
        if (perfectCandidates.length > 0) {
            const lowerKeys = perfectCandidates.map(k => k.toLowerCase());
            const exactIdMatch = perfectCandidates.find((_, i) => lowerKeys[i] === 'id' || lowerKeys[i] === 'objectid' || lowerKeys[i] === 'fid' || lowerKeys[i] === 'uid' || lowerKeys[i] === 'uuid');
            if (exactIdMatch) return exactIdMatch;

            const partialIdMatch = perfectCandidates.find((_, i) => lowerKeys[i].includes('id') || lowerKeys[i].includes('key'));
            if (partialIdMatch) return partialIdMatch;

            return perfectCandidates[0]; // Otherwise pick the first perfect one
        }

        // 4. Fallback to the field with the highest uniqueness ratio
        return bestField;
    }

    return (
        <>
            <div className={"geometry-editor"}>
                <div className={"dropdown"}>
                    <div className={"style-type"}>
                        <span><b>{styleType}:</b></span>
                        <Dropdown options={options} placeholder={selectStyle}
                                  optionLabel={"label"} value={activeIndex}
                                  onChange={(e) => setActiveIndex(e.value)}/>
                    </div>
                    <Button label={resetStyle}
                            disabled={currentRenderer == layerDefaultRenderer}
                            onClick={() => {
                                applyRenderer(layerDefaultRenderer)
                                setCurrentRenderer(layerDefaultRenderer)
                            }}
                    />
                </div>
                {activeIndex?.code == 0 && <UniqueSymbol layerCurrentRenderer={currentRenderer}
                                                         layerDefaultRenderer={layerDefaultRenderer}
                                                         applyRenderer={applyRenderer}
                                                         setVisible={setVisible}/>}
                {activeIndex?.code == 1 &&
                    <Categorized attr={attr} layerCurrentRenderer={currentRenderer}
                                 layerDefaultRenderer={layerDefaultRenderer}
                                 applyRenderer={applyRenderer} setVisible={setVisible} moreRamps={moreRamps}
                                 predefinedStyles={predefinedStyles}
                                 showPreDefinedRamps={showPreDefinedRamps}/>}
                {activeIndex?.code == 2 &&
                    <Graduated
                        attr={attr}
                        setAttr={setAttr}
                        applyRenderer={applyRenderer} moreRamps={moreRamps} setVisible={setVisible}
                        showPreDefinedRamps={showPreDefinedRamps}
                        layerCurrentRenderer={layerCurrentRenderer} numbersLocale={numbersLocale}/>}

                {activeIndex?.code == 3 && <FilterWidgetContextProvider attributes={attr} idFieldName={findIdField(features)}>
                    <BasedOnRules applyRenderer={applyRenderer}
                                  layerCurrentRenderer={layerCurrentRenderer}
                                  setVisible={setVisible}
                                  features={features}
                                  idFieldName={findIdField(features)}
                    />
                </FilterWidgetContextProvider>}
            </div>
        </>
    )
}
