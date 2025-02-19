import {asString, Color, fromString} from "ol/color";

export interface Stop { color: Color; offset: number }

export interface ColorRamp {
    id: number
    name: string
    palette: Stop[]
}

export function getColorRampString(ramp: Stop[]) {
    let rampString = "linear-gradient(90deg, "
    ramp.forEach((color, index) => {
        rampString += asString(color.color) + " " + color.offset * 100 + "%"
        if (index < ramp.length - 1) {
            rampString += ", "
        }
    })
    rampString += ")"
    return rampString
}

type RGB = { r: number; g: number; b: number };

// Helper to convert HEX to RGB
function hexToRgb(hex: Color): RGB {
    return {
        r: hex[0],
        g: hex[1],
        b: hex[2],
    };
}

// Helper to convert RGB to HEX
function rgbToHex({r, g, b}: RGB): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Interpolation function
function interpolateColor(color1: RGB, color2: RGB, factor: number): RGB {
    return {
        r: Math.round(color1.r + (color2.r - color1.r) * factor),
        g: Math.round(color1.g + (color2.g - color1.g) * factor),
        b: Math.round(color1.b + (color2.b - color1.b) * factor),
    };
}

export function generateGradient(stops: Stop[], numberOfSteps: number): string[] {
    // Convert colors to RGB
    const rgbStops = stops.map(({ color, offset }) => ({
        rgb: hexToRgb(color),
        offset,
    }));

    // Normalize positions to account for arbitrary start and end offsets
    const start = rgbStops[0].offset;
    const end = rgbStops[rgbStops.length - 1].offset;
    const range = end - start;

    const normalizedStops = rgbStops.map((stop) => ({
        ...stop,
        normalizedPosition: (stop.offset - start) / range,
    }));

    const result: string[] = [];
    const stepIncrement = 1 / (numberOfSteps - 1);

    for (let i = 0; i < numberOfSteps; i++) {
        const stepPosition = i * stepIncrement;

        // Find the two stops this step falls between
        const lowerStop = normalizedStops.find((stop) => stop.normalizedPosition <= stepPosition)!;
        const upperStop = normalizedStops.find((stop) => stop.normalizedPosition >= stepPosition)!;

        if (lowerStop.normalizedPosition === upperStop.normalizedPosition) {
            // Exact match for a stop position
            result.push(rgbToHex(lowerStop.rgb));
        } else {
            // Interpolate between lower and upper stops
            const segmentProgress =
                (stepPosition - lowerStop.normalizedPosition) /
                (upperStop.normalizedPosition - lowerStop.normalizedPosition);

            const interpolatedColor = interpolateColor(
                lowerStop.rgb,
                upperStop.rgb,
                segmentProgress
            );

            result.push(rgbToHex(interpolatedColor));
        }
    }

    return result;
}

// Function to get the color at a specific position in the gradient
export function getColorAtPosition(stops: Stop[], position: number): Color {
    if (position <= stops[0].offset) return stops[0].color; // Before the first stop
    if (position >= stops[stops.length - 1].offset) return stops[stops.length - 1].color; // After the last stop

    // Find the two stops the position falls between
    let lowerStop = stops[0];
    let upperStop = stops[stops.length - 1];

    for (let i = 0; i < stops.length - 1; i++) {
        if (stops[i].offset <= position && stops[i + 1].offset >= position) {
            lowerStop = stops[i];
            upperStop = stops[i + 1];
            break;
        }
    }

    // Normalize position within the current segment
    const segmentProgress =
        (position - lowerStop.offset) / (upperStop.offset - lowerStop.offset);

    // Interpolate colors
    const lowerColor = hexToRgb(lowerStop.color);
    const upperColor = hexToRgb(upperStop.color);
    const interpolatedColor = interpolateColor(lowerColor, upperColor, segmentProgress);

    return fromString(rgbToHex(interpolatedColor));
}

export const colorRamps: ColorRamp[] = [
    {
        id: 0,
        name: "Blues",
        palette: [
            {offset: 0.13, color: fromString("rgb(222,235,247)")},
            {offset: 0.26, color: fromString("rgb(198,219,239)")},
            {offset: 0.39, color: fromString("rgb(158,202,225)")},
            {offset: 0.52, color: fromString("rgb(107,174,214)")},
            {offset: 0.65, color: fromString("rgb(66,146,198)")},
            {offset: 0.78, color: fromString("rgb(33,113,181)")},
            {offset: 0.9, color: fromString("rgb(8,81,156)")},
        ],
    },
    {
        id: 1,
        name: "BrBG",
        palette: [
            {offset: 0.25, color: fromString("rgb(223,194,125)")},
            {offset: 0.5, color: fromString("rgb(245,245,245)")},
            {offset: 0.75, color: fromString("rgb(128,205,193)")},
        ],
    },
    {
        id: 2,
        name: "BuGn",
        palette: [
            {offset: 0.25, color: fromString("rgb(178,226,226)")},
            {offset: 0.5, color: fromString("rgb(102,194,164)")},
            {offset: 0.75, color: fromString("rgb(44,162,95)")},
        ],
    },
    {
        id: 3,
        name: "BuPu",
        palette: [
            {offset: 0.25, color: fromString("rgb(179,205,227)")},
            {offset: 0.5, color: fromString("rgb(140,150,198)")},
            {offset: 0.75, color: fromString("rgb(136,86,167)")},
        ],
    },
    {
        id: 4,
        name: "GnBu",
        palette: [
            {offset: 0.25, color: fromString("rgb(186,228,188)")},
            {offset: 0.5, color: fromString("rgb(123,204,196)")},
            {offset: 0.75, color: fromString("rgb(67,162,202)")},
        ],
    },
    {
        id: 5,
        name: "Greens",
        palette: [
            {offset: 0.13, color: fromString("rgb(229,245,224)")},
            {offset: 0.26, color: fromString("rgb(199,233,192)")},
            {offset: 0.39, color: fromString("rgb(161,217,155)")},
            {offset: 0.52, color: fromString("rgb(116,196,118)")},
            {offset: 0.65, color: fromString("rgb(65,171,93)")},
            {offset: 0.78, color: fromString("rgb(35,139,69)")},
            {offset: 0.9, color: fromString("rgb(0,109,44)")},
        ],
    },
    {
        id: 6,
        name: "Greys",
        palette: [
            {offset: 0, color: fromString("rgb(250,250,250)")},
            {offset: 1, color: fromString("rgb(5,5,5)")},
        ],
    },
    {
        id: 7,
        name: "OrRd",
        palette: [
            {offset: 0.25, color: fromString("rgb(253,204,138)")},
            {offset: 0.5, color: fromString("rgb(252,141,89)")},
            {offset: 0.75, color: fromString("rgb(227,74,51)")},
        ],
    },
    {
        id: 8,
        name: "Oranges",
        palette: [
            {offset: 0.13, color: fromString("rgb(254,230,206)")},
            {offset: 0.26, color: fromString("rgb(253,208,162)")},
            {offset: 0.39, color: fromString("rgb(253,174,107)")},
            {offset: 0.52, color: fromString("rgb(253,141,60)")},
            {offset: 0.65, color: fromString("rgb(241,105,19)")},
            {offset: 0.78, color: fromString("rgb(217,72,1)")},
            {offset: 0.9, color: fromString("rgb(166,54,3)")},
        ],
    },
    {
        id: 9,
        name: "PRGn",
        palette: [
            {offset: 0.25, color: fromString("rgb(194,165,207)")},
            {offset: 0.5, color: fromString("rgb(247,247,247)")},
            {offset: 0.75, color: fromString("rgb(166,219,160)")},
        ],
    },
    {
        id: 10,
        name: "PiYG",
        palette: [
            {offset: 0.25, color: fromString("rgb(241,182,218)")},
            {offset: 0.5, color: fromString("rgb(247,247,247)")},
            {offset: 0.75, color: fromString("rgb(184,225,134)")},
        ],
    },
    {
        id: 11,
        name: "PuBu",
        palette: [
            {offset: 0.25, color: fromString("rgb(189,201,225)")},
            {offset: 0.5, color: fromString("rgb(116,169,207)")},
            {offset: 0.75, color: fromString("rgb(43,140,190)")},
        ],
    },
    {
        id: 12,
        name: "PuBuGn",
        palette: [
            {offset: 0.25, color: fromString("rgb(189,201,225)")},
            {offset: 0.5, color: fromString("rgb(103,169,207)")},
            {offset: 0.75, color: fromString("rgb(28,144,153)")},
        ],
    },
    {
        id: 13,
        name: "PuOr",
        palette: [
            {offset: 0.25, color: fromString("rgb(230,97,1)")},
            {offset: 0.5, color: fromString("rgb(94,60,153)")},
            {offset: 0.75, color: fromString("rgb(178,171,210)")},
        ],
    },
    {
        id: 14,
        name: "PuRd",
        palette: [
            {offset: 0.25, color: fromString("rgb(215,181,216)")},
            {offset: 0.5, color: fromString("rgb(223,101,176)")},
            {offset: 0.75, color: fromString("rgb(221,28,119)")},
        ],
    },
    {
        id: 15,
        name: "Purples",
        palette: [
            {offset: 0.13, color: fromString("rgb(239,237,245)")},
            {offset: 0.26, color: fromString("rgb(218,218,235)")},
            {offset: 0.39, color: fromString("rgb(188,189,220)")},
            {offset: 0.52, color: fromString("rgb(158,154,200)")},
            {offset: 0.65, color: fromString("rgb(128,125,186)")},
            {offset: 0.75, color: fromString("rgb(106,81,163)")},
            {offset: 0.9, color: fromString("rgb(84,39,143)")},
        ],
    },
    {
        id: 16,
        name: "RdBu",
        palette: [
            {offset: 0.25, color: fromString("rgb(244,165,130)")},
            {offset: 0.5, color: fromString("rgb(247,247,247)")},
            {offset: 0.75, color: fromString("rgb(146,197,222)")},
        ],
    },
    {
        id: 17,
        name: "RdGy",
        palette: [
            {offset: 0.25, color: fromString("rgb(244,165,130)")},
            {offset: 0.5, color: fromString("rgb(255,255,255)")},
            {offset: 0.75, color: fromString("rgb(186,186,186)")},
        ],
    },
    {
        id: 18,
        name: "RdPu",
        palette: [
            {offset: 0.25, color: fromString("rgb(253,180,185)")},
            {offset: 0.5, color: fromString("rgb(247,104,161)")},
            {offset: 0.75, color: fromString("rgb(197,27,138)")},
        ],
    },
    {
        id: 19,
        name: "RdYlBu",
        palette: [
            {offset: 0.25, color: fromString("rgb(253,184,99)")},
            {offset: 0.5, color: fromString("rgb(255,255,191)")},
            {offset: 0.75, color: fromString("rgb(171,217,233)")},
        ],
    },
    {
        id: 20,
        name: "RdYlGn",
        palette: [
            {offset: 0.25, color: fromString("rgb(253,174,97)")},
            {offset: 0.5, color: fromString("rgb(255,255,192)")},
            {offset: 0.75, color: fromString("rgb(166,217,106)")},
        ],
    },
    {
        id: 21,
        name: "Reds",
        palette: [
            {offset: 0.13, color: fromString("rgb(254,224,210)")},
            {offset: 0.26, color: fromString("rgb(252,187,161)")},
            {offset: 0.39, color: fromString("rgb(252,146,114)")},
            {offset: 0.52, color: fromString("rgb(251,106,74)")},
            {offset: 0.65, color: fromString("rgb(239,59,44)")},
            {offset: 0.78, color: fromString("rgb(203,24,29)")},
            {offset: 0.9, color: fromString("rgb(165,15,21)")},
        ],
    },
    {
        id: 22,
        name: "Spectral",
        palette: [
            {offset: 0.25, color: fromString("rgb(253,174,97)")},
            {offset: 0.5, color: fromString("rgb(255,255,191)")},
            {offset: 0.75, color: fromString("rgb(171,221,164)")},
        ],
    },
    {
        id: 23,
        name: "YlGn",
        palette: [
            {offset: 0.25, color: fromString("rgb(194,230,153)")},
            {offset: 0.5, color: fromString("rgb(120,198,121)")},
            {offset: 0.75, color: fromString("rgb(49,163,84)")},
        ],
    },
    {
        id: 24,
        name: "YlGnBu",
        palette: [
            {offset: 0.25, color: fromString("rgb(161,218,180)")},
            {offset: 0.5, color: fromString("rgb(65,182,196)")},
            {offset: 0.75, color: fromString("rgb(44,127,184)")},
        ],
    },
    {
        id: 25,
        name: "YlOrBr",
        palette: [
            {offset: 0.25, color: fromString("rgb(254,217,142)")},
            {offset: 0.5, color: fromString("rgb(254,153,41)")},
            {offset: 0.75, color: fromString("rgb(217,95,14)")},
        ],
    },
    {
        id: 26,
        name: "YlOrRd",
        palette: [
            {offset: 0.25, color: fromString("rgb(254,204,92)")},
            {offset: 0.5, color: fromString("rgb(253,141,60)")},
            {offset: 0.75, color: fromString("rgb(240,59,32)")},
        ],
    },
    {
        id: 27,
        name: "Semaphore",
        palette: [
            {offset: 0.1, color: fromString("rgb(215,48,39)")},
            {offset: 0.3, color: fromString("rgb(252,141,89)")},
            {offset: 0.5, color: fromString("rgb(218,225,12)")},
            {offset: 0.7, color: fromString("rgb(145,207,96)")},
            {offset: 0.9, color: fromString("rgb(26,152,80)")},
        ],
    }

]
