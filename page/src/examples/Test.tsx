import {useEffect, useMemo, useState} from "react";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {Map, View} from "ol";
import VectorSource from "ol/source/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import {GeoJSON} from "ol/format";
import "./test.css";
import {Button} from "primereact/button";
import { Render, RenderType, StyleEditor } from "openlayers-style-editor";
// import 'primereact/resources/themes/mdc-light-indigo/theme.css';

export function Test() {

    const [visible, setVisible] = useState<boolean>(false);

    const defaultRender: Render = {
        type: RenderType.Unique,
        rendererOL: {
            'fill-color': [255, 255, 50, 1],
            'stroke-color': [0, 0, 0, 1],
            'stroke-width': 1,
        }
    }

    const [renderer, setRenderer] = useState<Render>(defaultRender);

    const vectorSource = new VectorSource({
        url: 'https://openlayers.org/data/vector/ecoregions.json',
        format: new GeoJSON(),
    });

    const vectorLayer = new WebGLVectorLayer({
        source: vectorSource,
        style: defaultRender.rendererOL,
        variables: {
            highlightedId: -1,
        },
    });

    const map = useMemo(() => new Map({
        layers: [new TileLayer({
            source: new OSM(),
        }), vectorLayer],
        view: new View({
            center: [0, 0],
            zoom: 1,
        }),
    }), []);

    useEffect(() => {
        map.setTarget("viewID")
    })

    useEffect(() => {
        map.removeLayer(vectorLayer)
        map.addLayer(new WebGLVectorLayer({
            source: vectorSource,
            style: renderer.rendererOL,
            variables: {
                highlightedId: -1,
            },
        }))
    }, [renderer])

    return (
        <>
            <div id={"viewID"} className={"map"}></div>
            <Button onClick={() => setVisible(true)}>
                Edit Style
            </Button>
            <StyleEditor visible={visible} setVisible={setVisible} layerDefaultRenderer={defaultRender}
                         layerCurrentRenderer={renderer} applyRenderer={(renderer) => setRenderer(renderer)}
                         vectorSource={vectorSource} primeReactTheme={"bootstrap4-light-blue"}
                         showPreDefinedRamps={true} moreRamps={[]} preDefinedStyles={[]} />
        </>
    );
}