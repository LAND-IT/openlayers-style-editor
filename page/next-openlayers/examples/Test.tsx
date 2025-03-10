"use client"
import {useEffect, useRef, useState} from "react";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {Feature, Map, View} from "ol";
import VectorSource from "ol/source/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import {GeoJSON} from "ol/format";
import styles from "./test.module.css";
import {Button} from "primereact/button";
import {Render, RenderType, StyleEditor} from "openlayers-style-editor";
import {Header} from "../components/Header";



export function Test() {
    const [visible, setVisible] = useState<boolean>(false);
    const [features, setFeatures] = useState<Feature[]>([]);
    const mapRef = useRef<Map | null>(null);
    const vectorLayerRef = useRef<WebGLVectorLayer | null>(null);

    const defaultRender: Render = {
        type: RenderType.Unique,
        rendererOL: {
            'fill-color': [255, 255, 50, 1],
            'stroke-color': [0, 0, 0, 1],
            'stroke-width': 1,
        }
    }

    const [renderer, setRenderer] = useState<Render>(defaultRender);

    // Initialize map only after component mounts
    useEffect(() => {
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
        vectorLayerRef.current = vectorLayer;

        const map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM(),
                }), 
                vectorLayer
            ],
            view: new View({
                center: [0, 0],
                zoom: 1,
            }),
        });
        mapRef.current = map;

        // Set target and register event listener
        map.setTarget("viewID");
        vectorSource.on('featuresloadend', function () {
            const features = vectorSource.getFeatures();
            setFeatures(features);
        });

        // Cleanup function
        return () => {
            if (mapRef.current) {
                mapRef.current.setTarget(undefined);
                mapRef.current = null;
            }
        };
    }, []);

    // Update layer when renderer changes
    useEffect(() => {
        if (!mapRef.current || !vectorLayerRef.current) return;
        
        mapRef.current.removeLayer(vectorLayerRef.current);
        
        const vectorSource = vectorLayerRef.current.getSource();
        const newVectorLayer = new WebGLVectorLayer({
            source: vectorSource as VectorSource<Feature>,
            style: renderer.rendererOL,
            variables: {
                highlightedId: -1,
            },
        });
        
        mapRef.current.addLayer(newVectorLayer);
        vectorLayerRef.current = newVectorLayer;
    }, [renderer]);

    return (
        <>
            <Header/>
            <div className={styles.demo}>
                <span><b>Ecoregions of the Earth</b></span>
                <div id={"viewID"} className={styles.map}></div>
                <Button onClick={() => setVisible(true)}>
                    Edit Style
                </Button>
                {visible && (
                    <StyleEditor 
                        visible={visible} 
                        setVisible={setVisible} 
                        layerDefaultRenderer={defaultRender}
                        layerCurrentRenderer={renderer} 
                        applyRenderer={(renderer) => setRenderer(renderer)}
                        features={features}
                        showPreDefinedRamps={true} 
                        moreRamps={[]} 
                        predefinedStyles={[]}
                    />
                )}
            </div>
        </>
    );
}