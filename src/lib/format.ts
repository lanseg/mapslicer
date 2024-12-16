export function formatArea(area: number, sup: boolean = false): string {
    const suffix = sup ? '<sup>2</sup>' : '²';
    return area > 100000 ?
        `${Math.round((area / 1000000) * 100) / 100}km${suffix}` :
        `${Math.round(area * 100) / 100}m${suffix}`;
}
