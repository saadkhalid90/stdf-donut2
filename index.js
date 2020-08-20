const question = "Do vTPA programs or certification bodies share data/ info with your organization?"
const data = [
  {head: "Yes, vTPA programs share information", value: 9},
  {head: "Yes, certification bodies share information", value: 6},
  {head: "No", value: 25},
  {head: "No, but planning this for the future", value: 13},
  {head: "Don't know", value: 8},
];

const colScale = d3.scaleOrdinal()
                  .domain([
                    "Yes, vTPA programs share information",
                    "Yes, certification bodies share information",
                    "No",
                    "No, but planning this for the future",
                    "Don't know"
                  ])
                  .range([
                    d3.rgb('#02a5b2'),
                    d3.rgb('#02a5b2').darker(),
                    d3.rgb('#e74153'),
                    d3.rgb('#e74153').darker(),
                    d3.rgb('#aaa')
                  ]);

function drawDonut(data) {
  const height = 600;
  const width = 600;
  const transDur = 750;

  const svgG = d3.select('svg.donut')
                  .append('g')
                  .attr('class', 'donutGrp')
                  .attr('transform', `translate(${width/2}, ${height/2})`);

  const arc = d3.arc()
                .innerRadius(180)
              	.outerRadius(220);

  const pie = d3.pie()
                .value(d => d.value)
                .sort(null);

  function createDatum(d) {
    const clone = Object.assign({}, d);
    clone.endAngle = clone.startAngle;
    return clone;
  }

  svgG.selectAll('path.arc')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('class', 'arc')
    .style('fill', d => colScale(d.data.head))
    .transition()
    .delay((d, i) => i * transDur)
    .duration(transDur)
    .attrTween('d', d => {
      const datum = createDatum(d);
      return function(t){
        const endAngleInterp = d3.interpolate(datum, d);
          return arc(endAngleInterp(t));
      }
    });

  //const arcCents = pie(data).map(d => arc(d))
  const labels = [
    [
      {text: "Yes, vTPA", idx: 0},
      {text: "programs share", idx: 0},
      {text: "information", idx: 0}
    ],
    [
      {text: "Yes, certification", idx: 1},
      {text: "bodies share", idx: 1},
      {text: "information", idx: 1}
    ],
    [
      {text: "No", idx: 2}
    ],
    [
      {text: "No, but ", idx: 3},
      {text: "planning for ", idx: 3},
      {text: "the future", idx: 3}
    ],
    [
      {text: "Don't Know", idx: 4}
    ]
  ];
  const cents = pie(data).map(d => arc.centroid(d));

  const offSet = [[55, -55], [70, -10], [10, 40], [-60, 0], [-30, -30]];
  const text = svgG.selectAll('text')
    .data(pie(data))
    .enter()
    .append('text')
    .attr('class', 'textLab')
    .style('fill', d => '#212121')
    .style('fill-opacity', 0)
    .style('text-anchor', 'middle')
    .style('font-family', "'Roboto Condensed', sans-serif")
    .style('font-weight', '300')
    //.text(d => d.data.head)
    .attr('x', (d ,i) => arc.centroid(d)[0])
    .attr('y', (d, i) => arc.centroid(d)[1])
    .attr('transform', (d, i) => `translate(${offSet[i]})`);

  text.transition()
    .delay((d, i) => i * transDur)
    .duration(transDur)
    .style('fill-opacity', 1);

  const dy = 0;
  text.selectAll('tspan')
          .data((d, i) => labels[i])
          .enter()
          .append('tspan')
          .text(d => d.text)
          //.attr('x', )
          .attr('x', (d, i) => cents[d.idx][0])
          .attr('dy', (d, i) => i == 0 ? `${dy}px` : `18px`);
};


drawDonut(data);

d3.select('#reAnim').on('click', function(d, i){
  // remove everything
  d3.select('svg.donut').selectAll("*").remove();

  drawDonut(data)

})
