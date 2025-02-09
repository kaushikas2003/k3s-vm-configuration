import React, { useState } from "react";
import VMConfigurationForm from "./components/VMConfigurationForm";
import ClusterConfigurator from "./components/ClusterConfigurator";
import Auth from "./components/Auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showVMConfig, setShowVMConfig] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        K3s Cluster Configurator
      </h1>

      {!isAuthenticated ? (
        <Auth onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <div className="max-w-4xl mx-auto">
          {!showVMConfig ? (
            <div>
              <ClusterConfigurator />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowVMConfig(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Configure VM Settings
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowVMConfig(false)}
                className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
              >
                ← Back to Cluster Configuration
              </button>
              <VMConfigurationForm />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
