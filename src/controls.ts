import { Map as OLMap } from 'ol';
import { Control } from 'ol/control.js';


export class Button extends Control {

    constructor(
        title: string,
        controlClass: string,
        private readonly onclick: (map: OLMap|null) => void,
        options: { [key: string]: any } = {}
    ) {
        const button = document.createElement('button');
        button.innerHTML = title;

        const element = document.createElement('div');
        element.className = `${controlClass} button-control ol-unselectable ol-control`;
        element.appendChild(button);

        super({ element: element, target: options.target });
        button.addEventListener('click', () => this.onclick(this.getMap()), false);
    }
}

export class ToggleButton extends Control {

    private isDown: boolean = false;
    constructor(
        title: string,
        controlClass: string,
        private readonly onDown: (map: OLMap|null) => void,
        private readonly onUp: (map: OLMap|null) => void,
        options: { [key: string]: any } = {}
    ) {

        const button = document.createElement('button');
        button.innerHTML = title;

        const element = document.createElement('div');
        element.className = `${controlClass} button-control ol-unselectable ol-control`;
        element.appendChild(button);

        super({ element: element, target: options.target });
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

    constructor(options: { [key: string]: any } = {}) {
        super('N', 'rotate-north', () => {
            const map = this.getMap();
            if (map != null) {
                map.getView().setRotation(0);
            }
        }, options);
    }
}
