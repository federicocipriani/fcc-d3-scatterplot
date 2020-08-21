var margins = { right: 30, left: 80, top: 50, bottom: 50 };
const canvasW = 900;
const canvasH = 600;
const svgW = canvasW - margins.left - margins.right;
const svgH = canvasH - margins.top - margins.bottom;

const svg = d3.select('svg').attr('viewBox', `0 0 ${canvasW} ${canvasH}`);
const chart = svg
    .append('g')
    .attr('class', 'chart_area')
    .attr('transform', `translate(${margins.left},${margins.top})`);
d3.select('.container')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', '0');

fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log(data);
        const years = data.map((item) => item.Year);
        const time = data.map((item) => {
            let min_sec = item.Time.split(':');
            return new Date(1970, 0, 1, 0, min_sec[0], min_sec[1]);
        });

        // console.log(years);
        // console.log(time);

        // ---------------------------------------------------------
        // Get min and max values
        var years_min = d3.min(years);
        var years_max = d3.max(years);
        var time_min = d3.min(time);
        var time_max = d3.max(time);

        // console.log(years_min);
        // console.log(years_max);
        // console.log(time_min);
        // console.log(time_max);

        // ---------------------------------------------------------
        // Scaling the domain to the dimensions of the canvas
        var xScale = d3
            .scaleLinear()
            .domain([years_min, years_max])
            .range([0, svgW]);

        var yScale = d3
            .scaleTime()
            .domain([time_min, time_max])
            .range([svgH, 0]);

        // ---------------------------------------------------------
        // Render the columns
        chart
            .selectAll('circle')
            .data(time)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => xScale(years[i]))
            .attr('cy', (d) => yScale(d))
            .attr('r', (d) => 5)
            .attr('fill', '#01a9b4')
            .attr('data-xvalue', (d, i) => years[i])
            .attr('data-yvalue', (d, i) => time[i])
            .attr('class', 'dot');

        // .on('mouseover', handleMouseover)
        // .on('mouseout', handleMouseout);

        // ---------------------------------------------------------
        // Create axes and grid lines
        var xAxis = d3.axisBottom(xScale).tickPadding(10);
        var yAxis = d3.axisLeft(yScale);

        var xAxisGrid = d3
            .axisTop(xScale)
            .tickFormat('')
            .ticks(0)
            .tickSize(-svgH);

        var yAxisGrid = d3.axisLeft(yScale).tickFormat('').tickSize(-svgW);

        // ---------------------------------------------------------
        // Add axes and grid lines to canvas
        chart
            .append('g')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0,' + svgH + ')')
            .call(xAxis);

        chart
            .append('g')
            .attr('id', 'x-axis-top')
            .attr('transform', 'translate(0,0)')
            .call(xAxisGrid);

        chart.append('g').attr('id', 'y-axis').call(yAxis);

        chart.append('g').attr('id', 'y-axis-grid').call(yAxisGrid);
    });
// .then((dataset) => {
//     var binLenght = svgW / dataset.data.length;

//     // ---------------------------------------------------------
//     // Arrays containing the x and y axis data
//     const dates = dataset.data.map((item) => item[0]);
//     const datesFormat = dates.map((item) => new Date(item));
//     var gdp = dataset.data.map((item) => item[1]);

//     // ---------------------------------------------------------
//     // Get min and max values
//     var date_min = d3.min(datesFormat);
//     var date_max = d3.max(datesFormat);
//     var gdp_min = d3.min(gdp);
//     var gdp_max = d3.max(gdp);

//     // ---------------------------------------------------------
//     // Adjust max GDP value to get a better graph
//     if (gdp_max % 2000 !== 0) {
//         gdp_max = gdp_max - (gdp_max % 2000) + 2000;
//     }

//     // ---------------------------------------------------------
//     // Adjust latest date to get a better graph
//     var date_max_limit = new Date(date_max);
//     date_max_limit.setMonth(date_max_limit.getMonth() + 3);

//     // ---------------------------------------------------------
//     // Scaling the domain to the dimensions of the canvas
//     var xScale = d3
//         .scaleTime()
//         .domain([date_min, date_max_limit])
//         .range([0, svgW]);

//     var yScale = d3.scaleLinear().domain([0, gdp_max]).range([svgH, 0]);

//     // ---------------------------------------------------------
//     // Render the columns
//     chart
//         .selectAll('rect')
//         .data(gdp)
//         .enter()
//         .append('rect')
//         .attr('x', (d, i) => xScale(datesFormat[i]))
//         .attr('y', (d) => yScale(d))
//         .attr('width', binLenght)
//         .attr('height', (d) => svgH - yScale(d))
//         .attr('fill', '#01a9b4')
//         .attr('data-date', (d, i) => dates[i])
//         .attr('data-gdp', (d, i) => gdp[i])
//         .attr('class', 'bar')
//         .on('mouseover', handleMouseover)
//         .on('mouseout', handleMouseout);

//     // ---------------------------------------------------------
//     // Add axes
//     var xAxis = d3.axisBottom(xScale).tickPadding(8);
//     var yAxis = d3.axisLeft(yScale);

//     var xAxisGrid = d3
//         .axisTop(xScale)
//         .tickFormat('')
//         .ticks(0)
//         .tickSize(-svgH);

//     var yAxisGrid = d3.axisLeft(yScale).tickFormat('').tickSize(-svgW);

//     chart
//         .append('g')
//         .attr('id', 'x-axis')
//         .attr('transform', 'translate(0,' + svgH + ')')
//         .call(xAxis);

//     chart
//         .append('g')
//         .attr('id', 'x-axis-top')
//         .attr('transform', 'translate(0,0)')
//         .call(xAxisGrid);

//     chart.append('g').attr('id', 'y-axis').call(yAxis);

//     chart.append('g').attr('id', 'y-axis-grid').call(yAxisGrid);

//     // ---------------------------------------------------------
//     // Add axes labels
//     svg.append('text')
//         .attr('id', 'y_axis_label')
//         .text('Gross Domestic Product [billion $]')
//         .attr('transform', 'rotate(-90)')
//         .attr('x', -(svgH / 1.5 + margins.top))
//         .attr('y', margins.left / 3);
//     svg.append('text')
//         .attr('id', 'x_axis_label')
//         .text('Years')
//         .attr('x', margins.left + svgW / 2.1)
//         .attr('y', svgH * 1.22);

//     // ---------------------------------------------------------
//     // Calculate quarters
//     var quarters = datesFormat.map((d) =>
//         d.getMonth() === 0
//             ? 'Q4'
//             : d.getMonth() === 3
//             ? 'Q1'
//             : d.getMonth() === 6
//             ? 'Q2'
//             : d.getMonth() === 9
//             ? 'Q3'
//             : ''
//     );
//     var years = datesFormat.map((d) => d.getFullYear());

//     // ---------------------------------------------------------
//     // Functions
//     function handleMouseover(d, i) {
//         let textbox = '';
//         d3.select(this).attr('opacity', '0.5');
//         d3.select('#tooltip')
//             .transition()
//             .duration(0)
//             .style('opacity', '0.7')
//             .style('top', '35%')
//             .style('left', '20%')
//             .attr('data-date', dates[i]);
//         d3.select('#tooltip').html(
//             quarters[i] +
//                 ' ' +
//                 years[i] +
//                 '<br /><strong>GDP = ' +
//                 d.toFixed(1) +
//                 '</strong>'
//         );
//     }
//     function handleMouseout(d, i) {
//         d3.select(this).attr('opacity', '1');
//         d3.select('#tooltip')
//             .transition()
//             .duration(300)
//             .style('opacity', '0');
//         d3.select('#tooltip-text').remove();
//     }
// });
