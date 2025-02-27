
export function Presentation() {
    return (
        <div>
            <span>This Style Editor for OpenLayers allows the user to change the style of layers.
                This editor was inspired in both QGIS and ArcMap editors.</span>
            <p><b>There are three edition modes:</b></p>
            <ul>
                <li><b>Unique Symbol:</b> Allows the user to change the layer's color, opacity, and stroke.</li>
                <li><b>Categorized:</b> Allows the user to change the layer's color, opacity, and stroke based on the values of an attribute.</li>
                <li><b>Graduated:</b> Allows the user to change the layer's color, opacity, and stroke based on a
                    numeric attribute and the mode used to group its values.
                    This package has six modes implemented, some of them are implemented using
                    the <a href={"https://www.npmjs.com/package/geobuckets"} target={"_blank"}>GeoBuckets package</a>.
                    The implemented modes are:</li>
                <ul>
                    <li>Manual</li>
                    <li>Equal Intervals</li>
                    <li>Defined Intervals</li>
                    <li>Quantile</li>
                    <li>Natural Breaks (Jenks)</li>
                    <li>Standard Deviation</li>
                </ul>

                A detailed explanation of each mode can be found
                 <a href={"https://resources.arcgis.com/en/help/main/10.2/index.html#//00s50000001r000000"} target={"_blank"}> here</a>.
            </ul>
        </div>
    );
}