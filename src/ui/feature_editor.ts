import { Feature } from 'ol';
import { Geometry } from 'ol/geom';

const excludeFields = ['geometry'];

function newCell(value: string, onchange: (now: string) => void): HTMLElement {
    const input = document.createElement('input');
    input.value = value;
    input.addEventListener('blur', () => {
        onchange(input.value);
    });
    input.addEventListener('keyup', (e) => {
        if (e.code === 'Enter') {
            onchange(input.value);
        }
    });

    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.appendChild(input);
    return cell;
}

export class FeatureEditor {

    constructor(private readonly feature: Feature<Geometry>, private readonly parent: HTMLElement) {
    }

    setProperty(key: string, value: string) {
        this.feature.set(key, value);
        this.render();
    }

    renderRow(key: string, value: string): Node {
        const keyCell = newCell(key, (newKey) => {
            this.feature.unset(key);
            const newProperty: { [x: string]: string } = {};
            newProperty[newKey] = value;
            this.feature.setProperties(newProperty);
            key = newKey;
        });

        const valueCell = newCell(value, (newValue) => {
            const newProperty: { [x: string]: string } = {};
            newProperty[key] = newValue;
            this.feature.setProperties(newProperty);
            value = newValue;
        });

        const result = document.createDocumentFragment();
        result.append(keyCell, valueCell);
        return result;
    }

    render() {
        const content = document.createElement('div');
        content.setAttribute('class', 'properties');
        content.innerHTML += '<div class="header">Feature</div>';
        const props = Object.entries(this.feature.getProperties());
        for (const [k, v] of props) {
            if (excludeFields.indexOf(k) !== -1) {
                continue;
            }
            content.appendChild(this.renderRow(k, v));
        }

        const addRowControl = document.createElement('div');
        addRowControl.setAttribute('class', 'add_property');
        addRowControl.innerHTML = 'Add property';

        const footer = document.createElement('div');
        footer.setAttribute('class', 'footer');
        footer.appendChild(addRowControl);
        content.appendChild(footer);

        addRowControl.addEventListener('click', () => {
            this.setProperty(`Property ${props.length}`, '');
        })

        this.parent.replaceChildren(content);
    }
}