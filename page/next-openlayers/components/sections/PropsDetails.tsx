import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {ReactNode} from "react";

interface PropDetail {
    name: string,
    requirement: string,
    description: string | ReactNode
    example: string
}

export function PropsDetails() {

    const propDetails: PropDetail[] = [
        {
            name: "visible (boolean)",
            requirement: "mandatory",
            description: "Defines if the component is visible or not",
            example: "true"
        },
        {
            name: "setVisible (function)",
            requirement: "mandatory",
            description: "Function to set the visibility of the component",
            example: "() => setVisible(!visible)"
        },
        {
            name: "layerDefaultRenderer (Render)",
            requirement: "mandatory",
            description: "Default renderer of the layer to be edited",
            example: "{\n" +
                "        type: RenderType.Unique,\n" +
                "        rendererOL: {\n" +
                "            'fill-color': [255, 255, 50, 1],\n" +
                "            'stroke-color': [0, 0, 0, 1],\n" +
                "            'stroke-width': 1,\n" +
                "        }\n" +
                "    }"
        },
        {
            name: "layerCurrentRenderer (Render)",
            requirement: "mandatory",
            description: "Current renderer of the layer",
            example: "{\n" +
                "        type: RenderType.Unique,\n" +
                "        rendererOL: {\n" +
                "            'fill-color': [255, 255, 50, 1],\n" +
                "            'stroke-color': [0, 0, 0, 1],\n" +
                "            'stroke-width': 1,\n" +
                "        }\n" +
                "    }"
        },
        {
            name: "applyRenderer (function)",
            requirement: "mandatory",
            description: "Function to apply the renderer to the layer, it has as parameter the renderer to be applied",
            example: "(renderer) => setRenderer(renderer)"
        },
        {
            name: "features (Feature[])",
            requirement: "mandatory",
            description: "Features to be rendered on the map",
            example: ""
        },
        {
            name: "showPreDefinedRamps (boolean)",
            requirement: "mandatory",
            description: "Show the predefined ramps of the package",
            example: "true"
        },
        {
            name: "moreRamps (ColorRamp[])",
            requirement: "optional",
            description: "An array of color ramps that can be added to the package",
            example: "[{\n" +
                "        id: 28, //id needs to be >=28\n" +
                "        name: \"GnBu\",\n" +
                "        palette: [\n" +
                "            {offset: 0.25, color: fromString(\"rgb(186,228,188)\")},\n" +
                "            {offset: 0.5, color: fromString(\"rgb(123,204,196)\")},\n" +
                "            {offset: 0.75, color: fromString(\"rgb(67,162,202)\")},\n" +
                "        ],\n" +
                "    }]"
        },
        {
            name: "predefinedStyles (PredefinedRenderer[])",
            requirement: "optional",
            description: "Predefined styles to be used on the categorized style type",
            example: "[{name: \"Dangerousness\",\n" +
                "  renderer: [{value: \"Very High\", color: [255, 0, 0]},\n" +
                "        {value: \"High\", color: [255, 128, 0]},\n" +
                "        {value: \"Medium\", color: [255, 255, 0]},\n" +
                "        {value: \"Low\", color: [139, 209, 0]},\n" +
                "        {value: \"Very Low\", color: [56, 168, 0]}]},]"
        },
        {
            name: "addingToHeader (string)",
            requirement: "optional",
            description: "Text to be added to the header",
            example: " - Dangerousness Layer"
        },
        {
            name: "primeReactTheme (string)",
            requirement: "optional",
            description: <span>PrimeReact theme to be used, all option can be found <a href={"https://primereact.org/theming/#themes"} target="_blank" > here</a></span>,
            example: "lara-light-green"
        },
        {
            name: "numbersLocale (string)",
            requirement: "optional",
            description: "Locale to be used on numbers, represented using BCP 47 language tag. Default is 'en-US'",
            example: "en-US"
        },
        {
            name: "textLocale (string)",
            requirement: "optional",
            description: "Locale to be used for text. This package has two options available: 'en' and 'pt'." +
                " Default is 'en'. To add a custom locale, use the customLocale prop and in the textLocale prop use 'custom'",
            example: "pt"
        },
        {
            name: "customLocale (Record<string, any>)",
            requirement: "optional",
            description: <span>Custom locale to be used in case the textLocale is set to &apos;custom&apos;.
                This prop must have the same structure as the default locale, that can be found
                <a href={"https://github.com/LAND-IT/openlayers-style-editor/blob/master/openlayers-style-editor/src/locales/en/translation.json"} target="_blank" > here</a></span>,
            example: "{\"common\": {\n" +
                "    \"style_editor\": \"Editor de Estilos\",\n" +
                "    \"reset_style\": \"Repor Estilo\",\n" +
                "    ...\n" +
                "}}"

        },

    ]

    return (
        <div>
            <DataTable value={propDetails} className={"props-table"}>
                <Column field="name" style={{width: "50px"}} header="Name"></Column>
                <Column field="requirement" style={{width: "50px"}} header="Requirement"></Column>
                <Column field="description" style={{width: "220px"}} header="Description"></Column>
                <Column field="example" header="Example" style={{whiteSpace: "pre-wrap"}}></Column>
            </DataTable>
        </div>)
}