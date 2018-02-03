var data_V1 = [{
  "Type": "A",
  "Amount": 250,
  "Description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum metus vel odio convallis condimentum. Integer ullamcorper ipsum vel dui varius congue. Nulla facilisi. Morbi molestie tortor libero, ac placerat urna mollis ac. Vestibulum id ipsum mauris."
}, {
  "Type": "B",
  "Amount": 1000,
  "Description": "In hac habitasse platea dictumst. Curabitur lacus neque, congue ac quam a, sagittis accumsan mauris. Suspendisse et nisl eros. Fusce nulla mi, tincidunt non faucibus vitae, aliquam vel dolor. Maecenas imperdiet, elit eget condimentum fermentum, sem lorem fringilla felis, vitae cursus lorem elit in risus."
}, {
  "Type": "C",
  "Amount": 600,
  "Description": "Aenean faucibus, risus sed eleifend rutrum, leo diam porttitor mauris, a eleifend ipsum ipsum ac ex. Nam scelerisque feugiat augue ac porta. Morbi massa ante, interdum sed nulla nec, finibus cursus augue. Phasellus nunc neque, blandit a nunc ut, mattis elementum arcu."
}, {
  "Type": "D",
  "Amount": 1750,
  "Description": "Aenean tellus felis, finibus eget placerat nec, ultrices vel elit. Morbi viverra mi ac ornare euismod. Quisque ultrices id nibh aliquam bibendum. Morbi id tortor non magna dictum suscipit. Nunc dolor metus, aliquam vitae felis id, euismod vulputate metus."
}];

var width = parseInt(d3.select('#pieChart').style('width'), 10);
var height = width;
var radius = (Math.min(width, height) - 15) / 2;

var type = function getObject(obj) {
  types = [];
  for (var i = 0; i < obj.length; i++) {
    types.push(obj[i].Type);
  }
  return types
};
var arcOver = d3.svg.arc()
  .outerRadius(radius + 10)
  .innerRadius(150);

var color = d3.scale.ordinal()
  .domain(type(data_V1))
  .range(["#8A76A6", "#54B5BF", "#8EA65B", "#F27B35"]);

/*var color = d3.scale.category20();
color.domain(type(data))*/

var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(150);

var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return +d.Amount;
  });

change = function(d, i) {
  var angle = 90 - ((d.startAngle * (180 / Math.PI)) + ((d.endAngle - d.startAngle) * (180 / Math.PI) / 2))
  svg.transition()
    .duration(1000)
    .attr("transform", "translate(" + radius + "," + height / 2 + ") rotate(" + angle + ")")
  d3.selectAll("path")
    .transition()
    .attr("d", arc)
  d3.select(i)
    .transition()
    .duration(1000)
    .attr("d", arcOver)
};

var svg = d3.select("#pieChart").append("svg")
  .attr("width", '100%')
  .attr("height", '100%')
  .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
  .attr('preserveAspectRatio', 'xMinYMin')
  .append("g")
  .attr("transform", "translate(" + radius + "," + height / 2 + ")");

var g = svg.selectAll("path")
  .data(pie(data_V1))
  .enter().append("path")
  .style("fill", function(d) {
    return color(d.data.Type);
  })
  .attr("d", arc)
  .style("fill", function(d) {
    return color(d.data.Type);
  })
  .on("click", function(d) {
    change(d, this);
    $('.text-container').hide();
    $('#segmentTitle').replaceWith('<h1 id="segmentTitle">' + d.data.Type + ": " + d.data.Amount + '</h1>');
    $('#')
    $('#segmentText').replaceWith('<p id="segmentText">' + d.data.Description + '</p>');
    $('.text-container').fadeIn(400);
  });

document.querySelector('style').textContent += '@media(max-width:767px) {#pieChart { transform: rotate(90deg); transform-origin: 50% 50%; transition: 1s; max-width: 50%; } .text-container { width: 100%; min-height: 0; }} @media(min-width:768px) {#pieChart { transition: 1s;}}'
