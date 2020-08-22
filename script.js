var margins = { right: 30, left: 80, top: 80, bottom: 60 };
const canvasW = 900;
const canvasH = 600;
const svgW = canvasW - margins.left - margins.right;
const svgH = canvasH - margins.top - margins.bottom;

const svg = d3.select('svg').attr('viewBox', `0 0 ${canvasW} ${canvasH}`);
const chart = svg
    .append('g')
    .attr('class', 'chart_area')
    .attr('transform', `translate(${margins.left},${margins.top})`);

fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        // ---------------------------------------------------------
        // Extract x and y values
        const years = data.map((item) => item.Year);

        var specifier = '%M:%S';
        const time = data.map((item) => d3.timeParse(specifier)(item.Time));

        // ---------------------------------------------------------
        // Setup legend
        const legend_val = data.map((item) =>
            item.Doping !== '' ? true : false
        );
        var color = d3.scaleOrdinal().domain(legend_val).range(d3.schemeSet1);

        // ---------------------------------------------------------
        // Get min, max and range values
        var years_min = d3.min(years);
        var years_max = d3.max(years);
        var years_range = years_max - years_min;

        var specifier_minmax = '%M';
        var time_min = d3.timeParse(specifier_minmax)(
            d3.min(time).getMinutes()
        );
        var time_max = d3.timeParse(specifier_minmax)(
            d3.max(time).getMinutes() + 1
        );

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
        // Create axes
        var xAxis = d3
            .axisBottom(xScale)
            .ticks(years_range)
            .tickFormat(d3.format('d'))
            .tickPadding(10);
        var yAxis = d3
            .axisLeft(yScale)
            .tickFormat((item) => d3.timeFormat(specifier)(item));

        // ---------------------------------------------------------
        // Create grid lines
        var xAxisGrid = d3
            .axisTop(xScale)
            .tickFormat('')
            .ticks(years_range)
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

        // Fix chart graphical structure
        chart
            .select('#x-axis-top .domain')
            .style('stroke-dasharray', '0')
            .style('stroke-opacity', '0.3');
        chart.select('#x-axis-top').select('.tick:first-of-type').remove();
        chart.select('#x-axis-top').select('.tick:last-of-type').remove();

        chart.append('g').attr('id', 'y-axis').call(yAxis);

        chart.append('g').attr('id', 'y-axis-grid').call(yAxisGrid);
        chart.select('#y-axis-grid .domain').remove();
        chart.select('#y-axis-grid').select('.tick:first-of-type').remove();
        chart.select('#y-axis-grid').select('.tick:last-of-type').remove();

        // ---------------------------------------------------------
        // Add axes labels
        svg.append('text')
            .attr('id', 'y_axis_label')
            .text('Finish Time [min:sec]')
            .attr('transform', 'rotate(-90)')
            .attr('x', -(svgH / 1.7 + margins.top))
            .attr('y', margins.left / 3);
        svg.append('text')
            .attr('id', 'x_axis_label')
            .text('Years')
            .attr('x', margins.left + svgW / 2.1)
            .attr('y', svgH * 1.28);

        // ---------------------------------------------------------
        // Add legend to canvas
        var legendBox = chart
            .append('g')
            .attr('id', 'legend')
            .attr('stroke', 'black');
        var legend_dots = d3
            .select('#legend')
            .selectAll('legend_dots')
            .data(color.domain())
            .enter()
            .append('circle')
            .attr('cx', (d, i) => svgW / 3.2 + i * 200)
            .attr('cy', -30)
            .attr('r', 10)
            .attr('fill', (d) => color(d));
        var legend_text = d3
            .select('#legend')
            .selectAll('legend_text')
            .data(color.domain())
            .enter()
            .append('text')
            .text((d) => (d ? 'Doping allegations' : 'No doping allegations'))
            .attr('x', (d, i) => 20 + svgW / 3.2 + i * 200)
            .attr('y', -30)
            .style('alignment-baseline', 'central');

        // ---------------------------------------------------------
        // Render the dots
        chart
            .selectAll('circle')
            .data(time)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => xScale(years[i]))
            .attr('cy', (d) => yScale(d))
            .attr('r', (d) => 10)
            .attr('fill', (d, i) => color(legend_val[i]))
            .attr('data-xvalue', (d, i) => years[i])
            .attr('data-yvalue', (d, i) => time[i])
            .attr('class', 'dot')
            .on('mouseover', handleMouseover)
            .on('mouseout', handleMouseout);

        // ---------------------------------------------------------
        // Functions
        function handleMouseover(d, i) {
            d3.select(this).style('opacity', '1');
            var tooltip = d3.select('body').append('div').attr('id', 'tooltip');
            tooltip
                .transition()
                .duration(0)
                .style('opacity', '0.9')
                .style('left', d3.event.pageX + 15 + 'px')
                .style('top', d3.event.pageY + 15 + 'px')
                .attr('data-year', years[i]);
            d3.select('#tooltip').html(
                '<strong>Athlete</strong>: ' +
                    data[i].Name +
                    '<br /><strong>Nationality</strong>: ' +
                    data[i].Nationality +
                    '<br />' +
                    '<br /><strong>Place</strong>: ' +
                    data[i].Place +
                    '<br /><strong>Time</strong>: ' +
                    data[i].Time +
                    '<br /><strong>Year</strong>: ' +
                    data[i].Year +
                    '<br />' +
                    '<br /><strong>Allegations</strong>: ' +
                    (data[i].Doping !== '' ? data[i].Doping : 'No allegations')
            );
        }
        function handleMouseout(d, i) {
            d3.select(this).style('opacity', '0.7');
            d3.select('#tooltip').remove();
        }
    });
