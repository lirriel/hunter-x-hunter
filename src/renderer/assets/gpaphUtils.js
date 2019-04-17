import * as d3 from 'd3'

export function getScales(data) {
    const x = d3.scaleTime().range([0, 600]);
    const y = d3.scaleLinear().range([400, 0]);
    d3.axisLeft().scale(x);
    d3.axisBottom().scale(y);
    x.domain(d3.extent(data, (d, i) => i));
    y.domain([0, d3.max(data, d => d)]);
    return {x, y};
}

export function calculatePath(data) {
    const scale = getScales(data);
    const path = d3.line()
        .x((d, i) => scale.x(i))
        .y(d => scale.y(d));
    return path(data)
}