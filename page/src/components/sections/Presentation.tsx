export function Presentation() {
    return (
        <div>
            <span>This Style Editor for OpenLayers allows the user to change the style of layers.
                This editor was inspired in both QGIS and ArcMap editors.</span>
            <p><b>There three edition modes:</b></p>
            <ul>
                <li><b>Unique Symbol:</b> Allows the user to change the layer's color, opacity, and stroke.</li>
                <li><b>Categorized:</b> Allows the user to change the layer's color, opacity, and stroke based on the values of an attribute.</li>
                <li><b>Graduated:</b> Allows the user to change the layer's color, opacity, and stroke based on a
                    numeric attribute and the mode used to group its values.</li>
            </ul>
        </div>
    );
}