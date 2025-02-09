import React, { useState, useEffect } from 'react';
import { account } from '../config/appwrite';
import ClusterConfigurator from './ClusterConfigurator';

const Auth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubToken, setGithubToken] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      // Extract GitHub token from user session
      const session = await account.getSession('current');
      const token = session.providerAccessToken;
      setGithubToken(token);
    } catch (error) {
      setUser(null);
      setGithubToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await account.createOAuth2Session(
        'github',
        'http://localhost:5173/',
        'http://localhost:5173/fail',
        ['repo'] // Request repo scope for repository access
      );
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setGithubToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Function to save config to GitHub
  const saveConfigToGithub = async (config) => {
    if (!githubToken || !user) return;

    try {
      // First, try to get the existing file to get its SHA
      const repoResponse = await fetch(
        `https://api.github.com/repos/${user.name}/kubernetes-config/contents/config.json`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      const content = Buffer.from(JSON.stringify(config, null, 2)).toString('base64');
      const requestBody = {
        message: 'Update kubernetes configuration',
        content,
      };

      if (repoResponse.ok) {
        // File exists, update it
        const existingFile = await repoResponse.json();
        requestBody.sha = existingFile.sha;
      }

      // Create or update the file
      const response = await fetch(
        `https://api.github.com/repos/${user.name}/kubernetes-config/contents/config.json`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

    } catch (error) {
      if (error.status === 404) {
        // Repository doesn't exist, create it first
        try {
          await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'kubernetes-config',
              description: 'K3s Cluster Configuration',
              private: true,
            }),
          });
          // Retry saving the config
          await saveConfigToGithub(config);
        } catch (createError) {
          console.error('Failed to create repository:', createError);
          throw createError;
        }
      } else {
        console.error('Failed to save configuration:', error);
        throw error;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-6">Welcome to Kubernetes</h1>
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login with GitHub
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">K3s Cluster Configurator</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <ClusterConfigurator 
            userId={user.$id} 
            onSaveConfig={saveConfigToGithub}
          />
        </div>
      )}
    </div>
  );
};

export default Auth;