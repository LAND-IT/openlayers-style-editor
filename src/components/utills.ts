import { Feature } from 'ol';
import {AttributeTypeEnum, SEAttribute} from "../RendererObjects.ts";

export function mapFeaturesToSEAttributes(features: Feature[]): SEAttribute[] {
    const attributeMap: { [key: string]: Set<any> } = {};

    // Aggregate property values from all features
    features.forEach((feature) => {
        const properties = feature.getProperties();
        Object.keys(properties).forEach((key) => {
            if (key === 'geometry') return; // Skip geometry property

            if (!attributeMap[key]) {
                attributeMap[key] = new Set();
            }
            attributeMap[key].add(properties[key]);
        });
    });

    // Convert aggregated data into SEAttribute array
    const seAttributes: SEAttribute[] = Object.keys(attributeMap).map((key, index) => {
        const valuesArray = Array.from(attributeMap[key]);
        const attributeType = determineAttributeType(valuesArray);

        return {
            id: index,
            name: key,
            type: attributeType,
            values: valuesArray.map(String), // Convert all values to strings
        };
    });

    return seAttributes;
}

function determineAttributeType(values: any[]): AttributeTypeEnum {
    if (values.length === 0) {
        return AttributeTypeEnum.STRING; // Default type
    }

    const sampleValue = values[0];

    if (typeof sampleValue === 'string') {
        return AttributeTypeEnum.STRING;
    } else if (typeof sampleValue === 'number') {
        return Number.isInteger(sampleValue) ? AttributeTypeEnum.INTEGER : AttributeTypeEnum.FLOAT;
    } else if (typeof sampleValue === 'boolean') {
        return AttributeTypeEnum.BOOLEAN;
    } else if (sampleValue instanceof Date) {
        return AttributeTypeEnum.DATE;
    } else if (typeof sampleValue === 'object') {
        return AttributeTypeEnum.JSON;
    } else {
        return AttributeTypeEnum.STRING; // Fallback type
    }
}
