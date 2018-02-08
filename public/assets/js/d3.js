// var data_V1 = [{
//   "Type": "A",
//   "Amount": 250,
//   "Description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum metus vel odio convallis condimentum. Integer ullamcorper ipsum vel dui varius congue. Nulla facilisi. Morbi molestie tortor libero, ac placerat urna mollis ac. Vestibulum id ipsum mauris."
// }, {
//   "Type": "B",
//   "Amount": 1000,
//   "Description": "In hac habitasse platea dictumst. Curabitur lacus neque, congue ac quam a, sagittis accumsan mauris. Suspendisse et nisl eros. Fusce nulla mi, tincidunt non faucibus vitae, aliquam vel dolor. Maecenas imperdiet, elit eget condimentum fermentum, sem lorem fringilla felis, vitae cursus lorem elit in risus."
// }, {
//   "Type": "C",
//   "Amount": 600,
//   "Description": "Aenean faucibus, risus sed eleifend rutrum, leo diam porttitor mauris, a eleifend ipsum ipsum ac ex. Nam scelerisque feugiat augue ac porta. Morbi massa ante, interdum sed nulla nec, finibus cursus augue. Phasellus nunc neque, blandit a nunc ut, mattis elementum arcu."
// }, {
//   "Type": "D",
//   "Amount": 1750,
//   "Description": "Aenean tellus felis, finibus eget placerat nec, ultrices vel elit. Morbi viverra mi ac ornare euismod. Quisque ultrices id nibh aliquam bibendum. Morbi id tortor non magna dictum suscipit. Nunc dolor metus, aliquam vitae felis id, euismod vulputate metus."
// }];

$.get( "/api/userdata", function( userData ) {
  //Data parsing
  //====================================================================================
  //Makes sure userData.price is a number!
  for(let i = 0; i< userData.length; i++){
    userData[i].price = parseFloat(userData[i].price);
  }
  console.log((userData));

  //Rollups all data of same category
  var rollupData = d3.nest()
    .key(function(d) { 
      return d.category;
    })
    .rollup(function(d) { 
      return d3.sum(d, function(g) {
        return g.price; 
      });
    }).entries(userData)
    .map(function(d){
      return { category: d.key, price: d.values};
  });


  //Create Pie graph
  var width = parseInt(d3.select('#pieChart').style('width'), 10);
  var height = width;
  var radius = (Math.min(width, height) - 15) / 2;

  var type = function getObject(obj) {
    categories = [];
    for (var i = 0; i < obj.length; i++) {
      categories.push(obj[i].category);
    }
    return categories;
  };
  var arcOver = d3.svg.arc()
    .outerRadius(radius + 10)
    .innerRadius(150);

  var color = d3.scale.ordinal()
    // .domain(type(rollupData))
    .domain([1,rollupData.length])
    .range(["#FF4545", "#7F2FF0", "#F956E9", "#2FD9F0", "#FFFE6F", "#8CFAEB", "#76FF6F", "#2F9CF0", "#4353F7", "#F7BD23", "#F02F7B", "#02E2C5"]); //
    
  var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(80);
  
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      return +d.price;
  });
  
  
  var svg = d3.select("#pieChart").append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
    .attr('preserveAspectRatio', 'xMinYMin')
    .append("g")
    .attr("transform", "translate(" + radius + "," + height / 2 + ")");
  
  var g = svg.selectAll("path")
    .data(pie(rollupData))
    .enter().append("path")
    .style("fill", function(d) {
      return color(d.data.category);
    })
    .attr("d", arc)
    .style("fill", function(d) {
      return color(d.data.category);
    })

    //When one of the sections on the graph is clicked.
    .on("click", function(d) {
      console.log("clicked!");
      console.log(d);
      var angle = 90 - ((d.startAngle * (180 / Math.PI)) + ((d.endAngle - d.startAngle) * (180 / Math.PI) / 2))
      svg.transition()
        .duration(1000)
        .attr("transform", "translate(" + radius + "," + height / 2 + ") rotate(" + angle + ")")
      // D3 Table target .d3table ******************************************************
      $('.text-container').hide();
      $('#segmentTitle').replaceWith('<h3 id="segmentTitle">' + d.data.category + ": $" + d.data.price + '</h3>');
      $('#')
      $('.text-container').fadeIn(400);
      $("#tb_display tr").remove();

      for(let i = 0; i< userData.length; i++){
        userData[i].price = parseFloat(userData[i].price);
        if(d.data.category == userData[i].category){
          var table = document.createElement("table")
          console.log(userData)
          var tr = document.createElement("tr")
          var td1 = document.createElement("td")
          var td2 = document.createElement("td")
          var td3 = document.createElement("td")
          var td4 = document.createElement("td")
          var text1 = document.createTextNode(userData[i].createdAt)
    
          var text2 = document.createTextNode(userData[i].category)
          var text3 = document.createTextNode(userData[i].comment)
          var text4 = document.createTextNode(userData[i].price)
          td1.appendChild(text1)
          td2.appendChild(text2)
          td3.appendChild(text3)
          td4.appendChild(text4)
          tr.appendChild(td1)
          tr.appendChild(td2)
          tr.appendChild(td3)
          tr.appendChild(td4)
        }
      }
      
     
        $("#tb_display").append(tr)
    });

    var table = document.createElement("table")
    console.log(userData)
    for(let i = 0; i< userData.length; i++){
      userData[i].price = parseFloat(userData[i].price);
      // console.log((userData));
      // console.log(d.data.category)
      var tr = document.createElement("tr")
      var td1 = document.createElement("td")
      var td2 = document.createElement("td")
      var td3 = document.createElement("td")
      var td4 = document.createElement("td")
      var text1 = document.createTextNode(userData[i].createdAt)
      var text2 = document.createTextNode(userData[i].category)
      var text3 = document.createTextNode(userData[i].comment)
      var text4 = document.createTextNode(userData[i].price)
      td1.appendChild(text1)
      td2.appendChild(text2)
      td3.appendChild(text3)
      td4.appendChild(text4)
      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      $("#tb_display").append(tr)
    }

      // d3.select(i)
      //   .transition()
      //   .duration(1000)
      //   .attr("d", arcOver)
  
  // document.querySelector('style').textContent += '@media(max-width:767px) {#pieChart { transform: rotate(90deg); transform-origin: 50% 50%; transition: 1s; max-width: 50%; } .text-container { width: 100%; min-height: 0; }} @media(min-width:768px) {#pieChart { transition: 1s;}}'
  
});


/*var color = d3.scale.category20();
color.domain(type(data))*/
