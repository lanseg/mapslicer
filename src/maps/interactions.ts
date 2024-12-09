import { Draw, Interaction, Modify, Snap } from 'ol/interaction';
import { Feature, MapBrowserEvent, Map as OLMap } from "ol";
import { Layer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { Geometry } from 'ol/geom';

import { uuid4 } from "../lib/uuid";

// uuid

export class KeyboardEventInteraction extends Interaction {

    constructor(private readonly actions: { [key: string]: () => void }) {
        super();
    }

    handleEvent(mapBrowserEvent: MapBrowserEvent<KeyboardEvent>) {
        let stopEvent = false;
        if (mapBrowserEvent.type === "keydown") {
            const keyEvent = mapBrowserEvent.originalEvent;
            const code = keyEvent.code.toLowerCase();
            if (code in this.actions) {
                this.actions[code]()
                keyEvent.preventDefault();
                stopEvent = true
            }
        }
        return !stopEvent;
    }
}

export class Mode {

    constructor(
        public readonly layers: Layer[] = [],
        public readonly interactions: Interaction[] = [],
    ) {

    }
}

function newDraw(source: VectorSource<Feature<Geometry>>): Interaction {
    const draw = new Draw({ source: source, type: "Polygon" });
    draw.on('drawend', (e) => {
        e.feature!.setId(uuid4());
        e.feature!.set("name", `Area #${source.getFeatures().length}`);
        console.log(e);
    })
    return draw;
}

export class VectorMarkupMode extends Mode {

    constructor(public readonly source: VectorSource<Feature<Geometry>>) {
        super(
            [new VectorLayer({ source })],
            [
                newDraw(source),
                new Snap({ source: source }),
                new Modify({ source: source }),
            ]
        );
    }

    enableMode(map: OLMap): void {
        this.interactions.forEach((i) => map.addInteraction(i))
    }

    disableMode(map: OLMap): void {
        this.interactions.forEach((i) => map.removeInteraction(i))
    }
}