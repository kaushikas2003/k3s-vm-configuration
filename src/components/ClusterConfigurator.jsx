import React, { useState, useEffect } from "react";
import { Cloud } from "lucide-react";

export default function ClusterConfigurator({ userId, githubToken, userName }) {
  const [config, setConfig] = useState({
    clusterName: "",
    provider: "aws",
    vmShape: "",
  });
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const cloudProviders = [
    { value: "aws", label: "AWS" },
    { value: "azure", label: "Azure" },
    { value: "digitalocean", label: "Digital Ocean" },
  ];

  const vmShapes = {
    aws: [
      { value: "t2.micro", label: "T2 Micro (1 vCPU, 1 GB RAM)" },
      { value: "t2.small", label: "T2 Small (1 vCPU, 2 GB RAM)" },
      { value: "t2.medium", label: "T2 Medium (2 vCPU, 4 GB RAM)" },
    ],
    azure: [
      { value: "B1s", label: "B1s (1 vCPU, 1 GB RAM)" },
      { value: "B2s", label: "B2s (2 vCPU, 4 GB RAM)" },
      { value: "B4ms", label: "B4ms (4 vCPU, 16 GB RAM)" },
    ],
    digitalocean: [
      { value: "s-1vcpu-1gb", label: "Basic (1 vCPU, 1 GB RAM)" },
      { value: "s-2vcpu-4gb", label: "Standard (2 vCPU, 4 GB RAM)" },
      { value: "s-4vcpu-16gb", label: "Performance (4 vCPU, 16 GB RAM)" },
    ],
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  useEffect(() => {
    if (saveStatus.message) {
      const timer = setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const loadConfigurations = () => {
    const savedData = localStorage.getItem("clusterConfigs");
    if (savedData) {
      setSavedConfigs(JSON.parse(savedData));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "provider" && { vmShape: "" }),
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const newConfig = {
      ...config,
      userId,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch('/api/saveConfig', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        configs: [...savedConfigs, newConfig],
        githubToken,
        userName
      })
    });

    const result = await response.json();
    
    if (result.success) {
      const updatedConfigs = [...savedConfigs, newConfig];
      setSavedConfigs(updatedConfigs);
      localStorage.setItem("clusterConfigs", JSON.stringify(updatedConfigs));
      
      setSaveStatus({
        type: 'success',
        message: 'Configuration saved successfully'
      });

      setConfig({
        clusterName: "",
        provider: "aws",
        vmShape: "",
      });
      
      downloadJSON(updatedConfigs);
    } else {
      throw new Error(result.message);
    }
    
  } catch (error) {
    setSaveStatus({
      type: 'error',
      message: `Failed to save configuration: ${error.message}`
    });
  }
};
  const downloadJSON = (data) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cluster_config.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {saveStatus.message && (
        <div 
          className={`mb-4 p-4 rounded-md ${
            saveStatus.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveStatus.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Cloud className="mr-2" />
            <h2 className="text-xl font-semibold">New Cluster Configuration</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cluster Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Cluster Name</label>
              <input
                type="text"
                name="clusterName"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={config.clusterName}
                onChange={handleInputChange}
                placeholder="Enter cluster name"
                required
              />
            </div>

            {/* Cloud Provider Selection */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Cloud Provider</label>
              <select
                name="provider"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={config.provider}
                onChange={handleInputChange}
                required
              >
                {cloudProviders.map((provider) => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            {/* VM Shape Selection */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">VM Shape</label>
              <select
                name="vmShape"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={config.vmShape}
                onChange={handleInputChange}
                required
                disabled={!config.provider}
              >
                <option value="">Select a VM shape</option>
                {config.provider &&
                  vmShapes[config.provider].map((shape) => (
                    <option key={shape.value} value={shape.value}>
                      {shape.label}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Configuration
            </button>
          </form>
        </div>

        {/* Saved Configurations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Saved Configurations</h2>
          <div className="space-y-4">
            {savedConfigs.map((savedConfig, index) => (
              <div key={index} className="border p-4 rounded-lg hover:bg-gray-50">
                <h3 className="font-medium">{savedConfig.clusterName}</h3>
                <p className="text-sm text-gray-600">
                  Provider: {savedConfig.provider.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">VM Shape: {savedConfig.vmShape}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(savedConfig.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
            {savedConfigs.length === 0 && (
              <p className="text-gray-500 text-center py-4">No saved configurations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}