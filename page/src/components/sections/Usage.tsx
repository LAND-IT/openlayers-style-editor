import './usage.css'
import {CopyBlock} from "react-code-blocks";
import {atomOneLight} from "react-code-blocks";

export function Usage() {
    return (
        <div className={"usage"}>
            <span>It is possible to enjoy this package by adding the following code snippets to your code.</span>
            <CopyBlock
                theme={atomOneLight}
                language={"typescript"}
                showLineNumbers={false}
                text={"import { Render, RenderType, StyleEditor } from \"openlayers-style-editor\";\n"}
            />
            <CopyBlock
                theme={atomOneLight}
                language={"jsx"}
                showLineNumbers={false}
                text={"const [visible, setVisible] = useState<boolean>(false);\n" +
                    "\n" +
                    "const defaultRender: Render = {\n" +
                    "    type: RenderType.Unique,\n" +
                    "    rendererOL: {\n" +
                    "        'fill-color': [255, 255, 50, 1],\n" +
                    "        'stroke-color': [0, 0, 0, 1],\n" +
                    "        'stroke-width': 1,\n" +
                    "    }\n" +
                    "}\n" +
                    "\n" +
                    "const [renderer, setRenderer] = useState<Render>(defaultRender);"}
            />
            <CopyBlock
                theme={atomOneLight}
                language={"jsx"}
                showLineNumbers={false}
                text={"<StyleEditor visible={visible}\n" +
                    "               setVisible={setVisible}\n" +
                    "               layerDefaultRenderer={defaultRender}\n" +
                    "               layerCurrentRenderer={renderer}\n" +
                    "               applyRenderer={(renderer) => setRenderer(renderer)}\n" +
                    "               features={features}\n" +
                    "               primeReactTheme={\"bootstrap4-light-blue\"}\n" +
                    "               showPreDefinedRamps={true} moreRamps={[]} predefinedStyles={[]} />"}
            />
            <span><b>To see a full example click
                <a href={"https://github.com/LAND-IT/openlayers-style-editor/blob/master/page/src/examples/Test.tsx"} target={"_blank"}> here</a>.</b></span>
        </div>
    )
}