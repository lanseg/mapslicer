import { Feature } from 'ol';
import { Geometry } from 'ol/geom';

const excludeFields = ['geometry'];

export class FeatureEditor {

    constructor(private readonly feature: Feature<Geometry>, private readonly parent: HTMLElement) {
    }

    render() {
        const content = document.createElement('div');
        content.setAttribute('class', 'properties');
        const props = this.feature.getProperties();
        for (const [k, v] of Object.entries(props)) {
            if (k in excludeFields) {
                continue;
            }
            content.innerHTML += `
              <div class="key">${k}</div>
              <div class="value">${v}</div>
            `;

        }
        this.parent.replaceChildren(content);
    }
}