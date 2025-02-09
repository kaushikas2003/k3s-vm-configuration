import { useState } from 'react';

export default function VMConfigurationForm() {
  const [formData, setFormData] = useState({
    clusterName: '',
    repoName: '',
    vmName: '',
    cloudProvider: '',
    vmShape: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const githubToken = localStorage.getItem('githubToken');
      const githubUsername = localStorage.getItem('githubUsername');
      if (!githubToken || !githubUsername) throw new Error('GitHub authentication required.');

      const response = await fetch('/api/saveConfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          githubUsername,
          githubToken
        }),
      });

      if (!response.ok) throw new Error('Failed to save configuration');

      setMessage({ type: 'success', text: 'Configuration saved successfully!' });

    } catch (error) {
      setMessage({ type: 'error', text: `Error saving configuration: ${error.message}` });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="repoName"
        value={formData.repoName}
        onChange={handleInputChange}
        placeholder="GitHub Repository Name"
        required
      />
      <input
        type="text"
        name="clusterName"
        value={formData.clusterName}
        onChange={handleInputChange}
        placeholder="Cluster Name"
        required
      />
      <button type="submit">Save Configuration</button>

      {message.text && <p className={`text-${message.type === 'success' ? 'green' : 'red'}-600`}>{message.text}</p>}
    </form>
  );
}
