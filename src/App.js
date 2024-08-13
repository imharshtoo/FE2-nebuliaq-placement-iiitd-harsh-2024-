// src/App.js
import React from 'react';
import ServiceGraph from './ServiceGraph';

const App = () => {
  const services = [
    { id: 'serviceA', name: 'Service A', port: 8080, namespace: 'default', cluster: 'cluster1', invocations: 120, errors: 100, type: 'http' },
    { id: 'serviceB', name: 'Service B', port: 9090, namespace: 'default', cluster: 'cluster1', invocations: 200, errors: 0, type: 'grpc' },
    { id: 'serviceC', name: 'Service C', port: 3306, namespace: 'default', cluster: 'cluster2', invocations: 90, errors: 10, type: 'mysql' },
    { id: 'serviceD', name: 'Service D', port: 6379, namespace: 'default', cluster: 'cluster2', invocations: 300, errors: 20, type: 'redis' },
    { id: 'serviceE', name: 'Service E', port: 8081, namespace: 'prod', cluster: 'cluster3', invocations: 150, errors: 15, type: 'http' },
    { id: 'serviceF', name: 'Service F', port: 9091, namespace: 'prod', cluster: 'cluster3', invocations: 250, errors: 5, type: 'grpc' },
    { id: 'serviceG', name: 'Service G', port: 3307, namespace: 'dev', cluster: 'cluster4', invocations: 180, errors: 8, type: 'mysql' },
    { id: 'serviceH', name: 'Service H', port: 6380, namespace: 'dev', cluster: 'cluster4', invocations: 220, errors: 2, type: 'redis' },
    { id: 'serviceI', name: 'Service I', port: 8082, namespace: 'qa', cluster: 'cluster5', invocations: 175, errors: 3, type: 'http' },
    { id: 'serviceJ', name: 'Service J', port: 9092, namespace: 'qa', cluster: 'cluster5', invocations: 95, errors: 12, type: 'grpc' },
  ];

  const interactions = [
    { source: 'serviceA', target: 'serviceB', invocations: 80, latency: 30 },
    { source: 'serviceA', target: 'serviceC', invocations: 40, latency: 50 },
    { source: 'serviceB', target: 'serviceD', invocations: 150, latency: 20 },
    { source: 'serviceC', target: 'serviceE', invocations: 60, latency: 40 },
    { source: 'serviceD', target: 'serviceF', invocations: 200, latency: 25 },
    { source: 'serviceE', target: 'serviceG', invocations: 75, latency: 35 },
    { source: 'serviceF', target: 'serviceH', invocations: 180, latency: 15 },
    { source: 'serviceG', target: 'serviceI', invocations: 95, latency: 45 },
    { source: 'serviceH', target: 'serviceJ', invocations: 120, latency: 10 },
    { source: 'serviceI', target: 'serviceA', invocations: 55, latency: 60 },
  ];

  return (
    <div className="App">
      <h1>Service Graph</h1>
      <ServiceGraph services={services} interactions={interactions} />
    </div>
  );
};

export default App;
