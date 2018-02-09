$(document).ready(function(){
  

  $('#submit-expense').modal({
    ready: function(){alert('Ready');},
    complete: function(){alert('Closed');}
  })
  //A function for appending the proper rows to the table.
  //=====================================================================================================================================
    var appendRows = function(userData , i){
        userData[i].price = parseFloat(userData[i].price);
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var td5 = document.createElement("td");
        var text1 = document.createTextNode(userData[i].createdAt);
        var text2 = document.createTextNode(userData[i].category);
        var text3 = document.createTextNode(userData[i].comment);
        var text4 = document.createTextNode("$" + userData[i].price);
        var text5_1 = document.createTextNode("create");
        var text5_2 = document.createTextNode("delete");
        
        //Adding divs to td5
        var editDiv = document.createElement("div");
        var removeDiv = document.createElement("div");

        editDiv.classList.add("material-icons", "edit-expense", "modal-trigger");
        removeDiv.classList.add("material-icons", "delete-expense", "modal-trigger");

        editDiv.setAttribute('data-id', userData[i].input_id);
        editDiv.setAttribute('href', '#edit-expense')
        removeDiv.setAttribute('data-id', userData[i].input_id);
        removeDiv.setAttribute('href', '#delete-expense');

        editDiv.appendChild(text5_1);
        removeDiv.appendChild(text5_2);

        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        td4.appendChild(text4);
        td5.appendChild(editDiv);
        td5.appendChild(removeDiv);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        $("#tb_display").append(tr);
    }

  $.get( "/api/userdata", function( userData ) {
    //Data parsing
    //=====================================================================================================================================
    //Makes sure userData.price is a number!
    if (userData.length == 0){
      alert("no data")
      console.log(name)
    } else {
      for(let i = 0; i< userData.length; i++){
        userData[i].price = parseFloat(userData[i].price);
      }
      console.log((userData));
    }
    

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
    //Reorders rollup so that prices are appropriately shown. 
    rollupData.sort(function(x, y){
      return (d3.ascending(x.price, y.price));
    })

    //Create Pie graph
    //=====================================================================================================================================

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
      //Refills table
        for(let i = 0; i< userData.length; i++){
          if(d.data.category == userData[i].category){
            appendRows(userData, i);
          }
        }
      });
    //Initial Table creation
    //=====================================================================================================================================
    for(let i = 0; i< userData.length; i++){
      appendRows(userData, i);
    } 

    // Table listeners and functions
    // =====================================================================================================================================
    
    //Edit Listeners
    $(document).on('click', '.edit-expense', function(e){
      var currentEle;
      for(let i = 0; i< userData.length; i++){
        if(parseInt($(this).data('id')) === userData[i].input_id){
          currentEle = userData[i];
        }
      }
      $('#form_id').val(currentEle.input_id);
      $('#editcurr-field').val(currentEle.price);
      $(`#edit-selected-category option[value=${currentEle.category}]`).attr("selected",true);
      $('#edit_item_comment').val(currentEle.comment);
      Materialize.updateTextFields();   
     
    });
    $('#edit-submit').on('click', function(e){
      var data = {
        input_id: $('#form_id').val().trim(),
        price: $('#editcurr-field').val().trim(),
        category: $('#edit-selected-category').val().trim(),
        comment: $('#edit_item_comment').val().trim()
      };
      $.ajax({
        method: "PUT",
        url: "/api/edit-item",
        data: data
      }).then(function(){
        window.location.href = "/dashboard";
      });
    });

    //Deleting Listeners
    $(document).on('click','.delete-expense', function(e){
      var currentEle;
      for(let i = 0; i< userData.length; i++){
        if(parseInt($(this).data('id')) === userData[i].input_id){
          currentEle = userData[i];
        }
      }
      $('#confirm_delete').data('id', currentEle.input_id);
    });
    $('#confirm_delete').on('click', function(e){
      console.log($(this).data('id'));
      $.ajax({
        method: "DELETE",
        url: "/api/delete-item/" + $(this).data('id')
      }).then(function(response){
        window.location.href = "/dashboard";
      });
    });

        // d3.select(i)
        //   .transition()
        //   .duration(1000)
        //   .attr("d", arcOver)
    // document.querySelector('style').textContent += '@media(max-width:767px) {#pieChart { transform: rotate(90deg); transform-origin: 50% 50%; transition: 1s; max-width: 50%; } .text-container { width: 100%; min-height: 0; }} @media(min-width:768px) {#pieChart { transition: 1s;}}'
    
  });

});
/*var color = d3.scale.category20();
color.domain(type(data))*/
