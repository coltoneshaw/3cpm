// const { scaleOrdinal } = require('d3-scale');
const { scaleLinear, scale} = require( 'd3-scale-chromatic');

const colors = scaleLinear()
.domain([0, 15- 1])
.range(["yellow", "green"]);

console.log(colors)