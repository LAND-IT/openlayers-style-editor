import {Button} from "primereact/button";
import {useEffect, useMemo, useState} from "react";
import {Render, RenderType} from "../rendererUtils";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {Feature, Map, View} from "ol";
import VectorSource, {VectorSourceEvent} from "ol/source/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import {GeoJSON} from "ol/format";
import "./test.css";
import StyleEditor from "../components/main/StyleEditor";

export function Test() {

    const [visible, setVisible] = useState<boolean>(false);
    const [features, setFeatures] = useState<Feature[]>([]);

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
        vectorSource.on('featuresloadend', function (event: VectorSourceEvent<any>) {
            event.features.forEach((feature, index) => {
                feature.set("id", index); // Assign unique ID
            });
            const features = vectorSource.getFeatures();
            setFeatures(features)
        });
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
            <Button label="Edit Style" onClick={() => setVisible(true)}/>
            <StyleEditor visible={visible} setVisible={setVisible} layerDefaultRenderer={defaultRender}
                         layerCurrentRenderer={renderer} applyRenderer={(renderer) => setRenderer(renderer)}
                         features={features}
                         primeReactTheme={"bootstrap4-light-blue"}
                         showPreDefinedRamps={true} moreRamps={[]} predefinedStyles={[]}/>
        </>
    );
}