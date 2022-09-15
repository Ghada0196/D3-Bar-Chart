let dataset

const req = new XMLHttpRequest();
req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);
req.send();
req.onload = function(){
  const json = JSON.parse(req.responseText);
   dataset = json.data 

//dataset ready
   
   const w = 800
   const h = 500
   const padding = 50

   const svg = d3.select("body")
   .append('svg')
   .style("width", w)
   .style("height", h)
   .style("background-color", "#F9F9F9")
   .attr("class", "container")

//svg ready
//Axes:
    var parseDate = d3.timeParse("%Y-%m-%d") // turn string to date objects

    let arrDates = []
    for (let i = 0; i < dataset.length; i++) {
    arrDates.push(parseDate(dataset[i][0]))
    }

    const xScale = d3.scaleTime()
            .domain(d3.extent(arrDates)) //d3.extent returns an array containing min and max
           .range([padding, w - padding])
           
    const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d[1])])
            .range([h - padding, padding])

    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (h-padding) + ")")
        .call(xAxis)  
    const yAxis = d3.axisLeft(yScale)
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis)

//rect
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("x", d => xScale(parseDate(d[0])))
        .attr("y", d => yScale(d[1]))
        .attr("width", 20)
        .attr("height", (d) => {
            return h - padding - yScale(d[1])
        } )
        .attr("class", "bar")
        
//tooltip
const tooltip = d3.select(".chart")
                    .append("span")
                    .attr("class", "tooltip")
                    .attr("id", "tooltip")
    svg.selectAll("rect")
        .on("mouseover", (e, d) => {
           
            d3.select("#tooltip")
                .attr("data-date", d[0])
                .style("opacity", 1)
                .style("left", ((xScale(parseDate(d[0]))+ 50)+"px"))
                .text(formulate((d[0])) + "\n $" + d[1] + " Billion")
            
        })
        .on("mouseout", () => {
            d3.select("#tooltip")
                .style("opacity", 0)

        })
                   
};


function formulate(d) {

    let s = d.split("-")
        
    if (parseInt(s[1]) < 4) {
       return (s[0] + " Q1")
    } else if (parseInt(s[1]) < 7) {
        return (s[0] + " Q2")
    }
    else if (parseInt(s[1]) < 10) {
        return (s[0] + " Q3")
    }
    else  {
        return (s[0] + " Q4")
    }

}

  