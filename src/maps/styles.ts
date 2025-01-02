import { Fill, Stroke, Style } from "ol/style";

import { FeatureLike } from "ol/Feature";
import { Vector } from "ol/layer";

const defaultStyle = new Vector().getStyleFunction();

const dirtyGridStyle = new Style({
    fill: new Fill({
        color: 'rgba(100,255,100,0.4)',
    }),
    stroke: new Stroke({
        color: 'rgba(10,200,10,1)'
    })
});

export const GRID_STYLE = (feature: FeatureLike, resolution: number): Style | Style[] | void => {
    const props = Object.entries(feature.getProperties());
    if (props.length > 3) {
        return dirtyGridStyle;
    }
    return defaultStyle!(feature, resolution);
};