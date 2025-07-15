<p align="center"><img src="https://land-it.github.io/openlayers-style-editor/favicons/android-chrome-192x192.png"></p>
<h1 align="center">Welcome to <code>openlayers-style-editor</code></h1>

![](https://img.shields.io/npm/v/openlayers-style-editor.svg)
![](https://img.shields.io/npm/dw/openlayers-style-editor)
![](https://img.shields.io/npm/dt/openlayers-style-editor)
![](https://img.shields.io/github/stars/land-it/openlayers-style-editor)
![](https://img.shields.io/github/commit-activity/m/land-it/openlayers-style-editor)
![](https://img.shields.io/github/v/release/land-it/openlayers-style-editor)

![](https://img.shields.io/badge/documentation-yes-brightgreen.svg)
![](https://img.shields.io/github/issues/land-it/openlayers-style-editor)
![](https://img.shields.io/github/issues-closed/land-it/openlayers-style-editor)
![](https://img.shields.io/github/contributors/land-it/openlayers-style-editor)


### ✨ [Demo](https://land-it.github.io/openlayers-style-editor/#/demo)

> [!NOTE]
> This package is compatible with SSR.

## Contents

- [Background](#background)
- [Presentation](#presentation)
- [Installation](#installation)
- [Usage](#usage)
- [Props Details](#props-details)
- [TODOs](#todos)
- [Show your support](#show-your-support)
- [Author & Maintainer](#author--maintainer)

## Background

This package was created in the context of the [LAND IT](https://land-it.github.io/) project,
a decision support system to help stakeholders planning a new
landscape for the most affected areas by wildfires in Portugal.
LAND IT uses OpenLayers as its main GIS dependency,
and throughout the project the need to edit layers styles increased.

## Presentation

This Style Editor for OpenLayers allows the user to change the style of layers. This editor was inspired in both QGIS and ArcMap editors.

**There are three edition modes:**

- **Unique Symbol:** Allows the user to change the layer's color, opacity, and stroke.
- **Categorized:** Allows the user to change the layer's color, opacity, and stroke based on the values of an attribute.
- **Graduated:** Allows the user to change the layer's color, opacity, and stroke based on a numeric attribute and the
  mode used to group its values. This package has six modes implemented, some of them are implemented using the
  [GeoBuckets](https://www.npmjs.com/package/geobuckets) package. The implemented modes are:
    - Manual
    - Equal Intervals
    - Defined Intervals
    - Quantile
    - Natural Breaks (Jenks)
    - Standard Deviation

A detailed explanation of each mode can be found [here](https://resources.arcgis.com/en/help/main/10.2/index.html#//00s50000001r000000).

## Installation

Depending on the installed package provider, this package can be installed with one of the following commands.

```
npm install openlayers-style-editor
```

```
yarn add openlayers-style-editor
```

## Usage

Firstly it is necessary to import the styles of the package. This can be done by adding the following code snippet to your index/main file.

```tsx
import 'openlayers-style-editor/dist/openlayers-style-editor.css';
```

It is possible to enjoy this package by adding the following code snippets to your code.

```tsx
import { Render, RenderType, StyleEditor } from "openlayers-style-editor";
```


```tsx
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
```

```tsx
<StyleEditor visible={visible}
             setVisible={setVisible}
             layerDefaultRenderer={defaultRender}
             layerCurrentRenderer={renderer}
             applyRenderer={(renderer) => setRenderer(renderer)}
             features={features}
             primeReactTheme={"bootstrap4-light-blue"}
             showPreDefinedRamps={true} />
```

***To see a full example click [here](https://github.com/LAND-IT/openlayers-style-editor/blob/master/page/src/examples/Test.tsx).***

## Props Details

| Name                    | Type                   | Requirement   | Description                                                                                                                                                                                                                                                                        | Example                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-------------------------|------------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `visible`               | `boolean`              | **mandatory** | Defines if the component<br/> is visible or not                                                                                                                                                                                                                                    | true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `setVisible`            | `function`             | **mandatory** | Function to set the <br/>visibility of the component                                                                                                                                                                                                                               | () => setVisible(!visible)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `layerDefaultRenderer`  | `Render`               | **mandatory** | Default renderer of <br/>the layer to be edited                                                                                                                                                                                                                                    | {<br/>&emsp;type: RenderType.Unique, <br/>&emsp;rendererOL: { <br/>&emsp;&emsp;'fill-color': [255, 255, 50, 1], <br/>&emsp;&emsp;'stroke-color': [0, 0, 0, 1], <br/>&emsp;&emsp;'stroke-width': 1<br/>&emsp;}<br/>}                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `layerCurrentRenderer ` | `Render`               | **mandatory** | Current renderer of the layer                                                                                                                                                                                                                                                      | {<br/>&emsp;type: RenderType.Unique, <br/>&emsp;rendererOL: { <br/>&emsp;&emsp;'fill-color': [255, 255, 50, 1], <br/>&emsp;&emsp;'stroke-color': [0, 0, 0, 1], <br/>&emsp;&emsp;'stroke-width': 1<br/>&emsp;}<br/>}                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `applyRenderer`         | `function`             | **mandatory** | Function to apply the renderer to the layer, it has as parameter the renderer to be applied                                                                                                                                                                                        | (renderer: Render) => setRenderer(renderer)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `features`              | `Feature[]`            | **mandatory** | Features to be rendered on the map                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `showPreDefinedRamps`   | `boolean`              | **mandatory** | Show the predefined ramps of the package                                                                                                                                                                                                                                           | true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `moreRamps`             | `ColorRamp[]`          | optional      | An array of color ramps that can be added to the package                                                                                                                                                                                                                           | [{<br/>&emsp;id: 28, //id needs to be >=28 <br/>&emsp;name: "GnBu", <br/>&emsp;palette: <br/>&emsp;&emsp;[{<br/>&emsp;&emsp;&emsp;offset: 0.25, <br/>&emsp;&emsp;&emsp;color: fromString("rgb(186,228,188)")<br/>&emsp;&emsp;},<br/>&emsp;&emsp;{<br/>&emsp;&emsp;&emsp;offset: 0.5,<br/>&emsp;&emsp;&emsp;color: fromString("rgb(123,204,196)")<br/>&emsp;&emsp;}, <br/>&emsp;&emsp;{<br/>&emsp;&emsp;&emsp;offset: 0.75, <br/>&emsp;&emsp;&emsp;color: fromString("rgb(67,162,202)")<br/>&emsp;&emsp;}]<br/>}]                                                                                                                                                                      |
| `predefinedStyles`      | `PredefinedRenderer[]` | optional      | Predefined styles to be used on the categorized style type                                                                                                                                                                                                                         | [{<br/>&emsp;name: "Dangerousness",<br/>&emsp;renderer: <br/>&emsp;&emsp;[{<br/>&emsp;&emsp;&emsp;value: "Very High", <br/>&emsp;&emsp;&emsp;color: [255, 0, 0]<br/>&emsp;&emsp;},<br/>&emsp;&emsp;{<br/>&emsp;&emsp;&emsp;value: "High", <br/>&emsp;&emsp;&emsp;color: [255, 128, 0]<br/>&emsp;&emsp;},<br/>&emsp;&emsp;{<br/>&emsp;&emsp;&emsp;value: "Medium", <br/>&emsp;&emsp;&emsp;color: [255, 255, 0]<br/>&emsp;&emsp;},<br/>&emsp;&emsp;{<br/>&emsp;&emsp;&emsp;value: "Low", <br/>&emsp;&emsp;&emsp;color: [139, 209, 0]<br/>&emsp;&emsp;},<br/>&emsp;&emsp;{<br/>&emsp;&emsp;&emsp;value: "Very Low", <br/>&emsp;&emsp;&emsp;color: [56, 168, 0]<br/>&emsp;&emsp;}]<br/>}] |
| `addingToHeader`        | `string`               | optional      | Text to be added to the header                                                                                                                                                                                                                                                     | - Dangerousness Layer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `primeReactTheme`       | `string`               | optional      | PrimeReact theme to be used, all option can be found [here](https://primereact.org/theming/#themes)                                                                                                                                                                                | bootstrap4-light-blue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `numbersLocale`         | `string`               | optional      | Locale to be used on numbers, represented using BCP 47 language tag. Default is 'en-US'                                                                                                                                                                                            | en-US                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `textLocale`            | `string`               | optional      | Locale to be used for text. This package has two options available: 'en' and 'pt'. Default is 'en'. To add a custom locale, use the customLocale prop and in the textLocale prop use 'custom'.                                                                                     | pt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `customLocale`          | `Record<string, any>`  | optional      | Custom locale to be used in case the textLocale is set to 'custom'. This prop must have the same structure as the default locale, that can be found [here](https://github.com/LAND-IT/openlayers-style-editor/blob/master/openlayers-style-editor/src/locales/en/translation.json) | {"common": {<br/>&emsp;"style_editor": "Editor de Estilos",<br/>&emsp;"reset_style": "Repor Estilo",<br/>&emsp;...<br/>}}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## TODOs

- [ ] Add the condition style type
- [ ] Add a license

## Show your support

Give a ⭐️ if this project helped you!

## Author & Maintainer

<img src="https://avatars.githubusercontent.com/u/45342267?v=4" height="80px" style="border-radius:50px" />

Márcia Matias

- Github: [@MarciaBM](https://github.com/MarciaBM)
- Personal Page: [marciabm.github.io](https://marciabm.github.io/)
