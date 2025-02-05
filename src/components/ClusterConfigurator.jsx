import React, { useState } from 'react';
import { Cloud } from 'lucide-react';

function ClusterConfigurator() {
  const [config, setConfig] = useState({
    clusterName: '',
    provider: 'aws'
  });

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Cloud className="mr-2" />
        <h2 className="text-xl font-semibold">Cluster Configuration</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Cluster Name</label>
          <input 
            type="text"
            className="w-full p-2 border rounded"
            value={config.clusterName}
            onChange={(e) => setConfig({...config, clusterName: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block mb-2">Cloud Provider</label>
          <select 
            className="w-full p-2 border rounded"
            value={config.provider}
            onChange={(e) => setConfig({...config, provider: e.target.value})}
          >
            <option value="aws">AWS</option>
            <option value="azure">Azure</option>
            <option value="digitalocean">Digital Ocean</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ClusterConfigurator;