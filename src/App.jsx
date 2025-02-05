import React from 'react';
import ClusterConfigurator from './components/ClusterConfigurator';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        K3s Cluster Configurator
      </h1>
      <ClusterConfigurator />
    </div>
  );
}

export default App;