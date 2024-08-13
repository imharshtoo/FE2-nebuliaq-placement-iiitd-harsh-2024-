import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Service icons (mock)
const serviceIcons = {
  http: '🌐',
  grpc: '🔗',
  mysql: '🐬',
  redis: '📦',
  // Add more icons as needed
};

const ServiceGraph = ({ services, interactions }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Set up responsive SVG dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const isSmallDevice = width < 768;  // Define small devices

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('border', '1px solid black');

    // Clear any previous elements
    svg.selectAll('*').remove();

    // Create the force simulation
    const simulation = d3.forceSimulation(services)
      .force('link', d3.forceLink(interactions).id(d => d.id).distance(200))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))  // Center at the middle of the SVG
      .force('collide', d3.forceCollide(60));  // Prevent nodes from overlapping

    // Define the arrowheads with a smaller size
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 12)  // Adjust for smaller arrow size
      .attr('refY', 0)
      .attr('markerWidth', 4)  // Smaller arrow size
      .attr('markerHeight',4)  // Smaller arrow size
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    // Create the link elements
    const link = svg.append('g')
      .selectAll('line')
      .data(interactions)
      .enter().append('line')
      .attr('stroke-width', d => Math.max(2, d.invocations / 12))
      .attr('stroke', '#999')
      .attr('marker-end', 'url(#arrow)');  // Add arrowheads to edges

    // Create the node elements
    const node = svg.append('g')
      .selectAll('g')
      .data(services)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    // Add circles for each node
    node.append('circle')
      .attr('r', 40)  // Node size
      .attr('fill', '#666')
      .attr('stroke', d => {
        const ratio = d.errors / d.invocations;
        const green = Math.max(0, 255 - ratio * 255);
        const red = Math.min(255, ratio * 255);
        return `rgb(${red},${green},0)`;
      })
      .attr('stroke-width', 5);  // Border thickness

    // Add text labels for service information
    node.append('text')
      .attr('x', 50)
      .attr('y', -10)
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'middle')
      .style('font-size', isSmallDevice ? '10px' : '12px')  // Responsive font size
      .style('fill', 'black')
      .text(d => `${d.name} (${d.port})`);

    if (!isSmallDevice) {
      node.append('text')
        .attr('x', 50)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .style('font-size', '12px')
        .style('fill', 'black')
        .text(d => `${d.namespace}, ${d.cluster}`);
    }

    // Add service type icon
    node.append('text')
      .attr('x', -25)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', isSmallDevice ? '20px' : '24px')  // Responsive icon size
      .style('fill', 'black')
      .text(d => serviceIcons[d.type] || '❓');

    // Add metrics to the edges
    const edgeLabel = svg.append('g')
      .selectAll('text')
      .data(interactions)
      .enter().append('text')
      .attr('dy', -5)
      .attr('font-size', '10px')
      .attr('fill', 'black')
      .text(d => `${d.invocations} inv, ${d.latency}ms`);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);

      edgeLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);
    });

    // Drag functions
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      svg.selectAll('*').remove(); // Clean up the SVG when the component unmounts
    };
  }, [services, interactions]);

  return <svg ref={svgRef} style={{ width: '100%', height: '100vh' }}></svg>;
};

export default ServiceGraph;
