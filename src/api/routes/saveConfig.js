// Backend: saveConfig.js
async function saveConfig(req, res) {
  // Ensure we're sending a complete response
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { configs, githubToken, userName } = req.body;
    
    // Validate inputs
    if (!configs || !githubToken || !userName) {
      return res.send(JSON.stringify({
        success: false,
        message: "Missing required parameters"
      }));
    }

    const repoName = 'kubernetes-config';
    const filePath = 'config.json';

    // Repository operations
    const repoExists = await checkRepositoryExists(userName, repoName, githubToken);
    
    if (!repoExists) {
      await createRepository(userName, repoName, githubToken);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await saveConfigFile(userName, repoName, filePath, configs, githubToken);

    return res.send(JSON.stringify({
      success: true,
      message: "Configuration saved successfully!"
    }));

  } catch (error) {
    return res.send(JSON.stringify({
      success: false,
      message: error.message || "Failed to save configuration"
    }));
  }
}

// Frontend: ClusterConfigurator.jsx - Updated handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setSaveStatus({ type: '', message: '' });

  const newConfig = {
    ...config,
    userId,
    timestamp: new Date().toISOString(),
  };

  try {
    // First check if we have the required data
    if (!githubToken || !userName) {
      throw new Error('Authentication information missing');
    }

    const response = await fetch('/api/saveConfig', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        configs: [...savedConfigs, newConfig],
        githubToken,
        userName
      })
    });

    // Check if response is empty
    const text = await response.text();
    if (!text) {
      throw new Error('Empty response from server');
    }

    // Try to parse the response
    let result;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error('Raw response:', text);
      throw new Error('Invalid JSON response from server');
    }

    // Check if the response has the expected format
    if (!result || typeof result.success === 'undefined') {
      throw new Error('Invalid response format from server');
    }

    if (!result.success) {
      throw new Error(result.message || 'Server reported failure');
    }

    // Update local state after successful save
    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("clusterConfigs", JSON.stringify(updatedConfigs));

    setSaveStatus({
      type: 'success',
      message: result.message || 'Configuration saved successfully'
    });

    // Reset form
    setConfig({
      clusterName: "",
      provider: "aws",
      vmShape: "",
    });

    downloadJSON(updatedConfigs);

  } catch (error) {
    console.error('Save configuration error:', error);
    setSaveStatus({
      type: 'error',
      message: `Failed to save configuration: ${error.message}`
    });
  }
};

module.exports = { saveConfig };
