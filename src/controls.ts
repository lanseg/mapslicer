import { MapBrowserEvent, Map as OLMap } from 'ol';
import { Control } from 'ol/control.js';
import { Interaction } from 'ol/interaction';


export class Button extends Control {

    constructor(
        title: string,
        controlClass: string,
        private readonly onclick: (map: OLMap | null) => void
    ) {
        const button = document.createElement('button');
        button.innerHTML = title;

        const element = document.createElement('div');
        element.className = `${controlClass} button-control ol-unselectable ol-control`;
        element.appendChild(button);

        super({ element: element });
        button.addEventListener('click', () => this.onclick(this.getMap()), false);
    }
}

export class ToggleButton extends Control {

    private isDown: boolean = false;
    constructor(
        title: string,
        controlClass: string,
        private readonly onDown: (map: OLMap | null) => void,
        private readonly onUp: (map: OLMap | null) => void
    ) {

        const button = document.createElement('button');
        button.innerHTML = title;

        const element = document.createElement('div');
        element.className = `${controlClass} button-control ol-unselectable ol-control`;
        element.appendChild(button);

        super({ element: element });
        button.addEventListener('click', () => {
            if (this.isDown) {
                this.onUp(this.getMap());
                element.classList.remove("selected");
            } else {
                this.onDown(this.getMap());
                element.classList.add("selected")
            }
            this.isDown = !this.isDown;
        }, false);
    }
}


export class RotateNorthControl extends Button {

    constructor() {
        super('Ṅ', 'rotate-north', () => {
            const map = this.getMap();
            if (map != null) {
                map.getView().setRotation(0);
            }
        });
    }
}

export class KeyboardEventInteraction extends Interaction {

    constructor(private readonly actions: { [key: string]: () => void}) {
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