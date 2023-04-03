import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '@mui/material';
import * as d3 from 'd3';

function Graph({ data, column, detailFilterKey }) {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const theme = useTheme();

  const updateDimensions = useCallback(() => {
    const parentRect = svgRef.current.parentElement.getBoundingClientRect();
    setDimensions({ width: parentRect.width, height: parentRect.height });
  }, [])

  useEffect(() => {
    updateDimensions();
    const svg = d3.select(svgRef.current);
    // const parentRect = svgRef.current.parentElement.getBoundingClientRect();
    // setDimensions({ width: parentRect.width, height: parentRect.height });
    // console.log(parentRect.width);
    // console.log(parentRect.height);

    svg.selectAll('.dot').remove();
    svg.selectAll('.line').remove();
    svg.selectAll('.x-axis').remove();
    svg.selectAll('.y-axis').remove();
    svg.selectAll('.axis').remove();

    const columnData = data.map((d) => parseFloat(d[column]));
    const detailFilterKeyData = data.map((d) => parseInt(d[detailFilterKey]));

    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height -margin.top - margin.bottom;
    console.log(height)

    // Append the g element once and select it
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(detailFilterKeyData).range([0, width]).padding(0.1);

    const minValue = d3.min(columnData.filter((d) => /^-?\d*\.?\d+$/.test(d)).map((d) => +d));
    const maxValue = d3.max(columnData.filter((d) => /^-?\d*\.?\d+$/.test(d)).map((d) => +d));

    const y = d3.scaleLinear().domain([(0 < minValue ? 0 : minValue), maxValue]).nice().range([height, 0]);

    const line = d3.line()
        .defined(d => !isNaN(d))
        .x((d, i) => x(detailFilterKeyData[i]) + x.bandwidth() / 2)
        .y((d) => y(d));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style('color', 'black');

    g.append('g')
      .attr('class', 'y-axis')
      .call(
        d3
          .axisLeft(y)
          .tickFormat((d) => {
            return (Math.abs(d) < 0.01 || Math.abs(d) > 1000) && d !== 0 ? d.toExponential(1) : d;
          })
      )
      .style('color', 'black');

      g.append('path')
        // .datum(columnData.map((d) => isNaN(d) ? Infinity : d))
        // .attr('class', 'line')
        // .attr('d', line)
        // .attr('fill', 'none')
        // .attr('stroke', theme.palette.primary[500])
        // .attr('stroke-width', 2)
        // .attr('stroke-linejoin', 'round')
        // .attr('opacity', (d) => d === Infinity ? 0 : 1);
        .datum(columnData)
        .attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', theme.palette.primary[500])
        .attr('stroke-width', 2)
        .attr('stroke-linejoin', 'round');

      g.selectAll('.dot')
      .data(columnData)
      .join('circle')
      .attr('r', 5)
      .attr('class', 'dot')
      .attr('cx', (d, i) => x(detailFilterKeyData[i])+x.bandwidth() / 2)
      .attr('cy', (d) => y(d))
      .attr('fill', theme.palette.primary[500])
      .attr('opacity', (d) => isNaN(d) ? 0 : 1);
      // .attr('height', (d) => {
      //   const h = height - y(d);
      //   return isNaN(h) || h < 0 ? 0 : h;
      // });

    // Add event listener to update dimensions when window size changes
    function handleResize() {
      setDimensions({
        width: svgRef.current.parentElement.clientWidth,
        height: svgRef.current.parentElement.clientHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, column, detailFilterKey, dimensions]);

  return <svg ref={svgRef} width="100%" height="100%" />;
}

export default Graph;
