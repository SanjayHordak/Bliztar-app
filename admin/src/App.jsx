import React, { useEffect, useState } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { apiClient } from './utils/api';

function App() {
  const [apiStatus, setApiStatus] = useState('Checking backend...');

  // Example: Test backend connection
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await apiClient.get('/api/health');
        setApiStatus(`✅ Backend connected: ${data.message}`);
      } catch (error) {
        setApiStatus(`❌ Backend error: ${error.message}`);
      }
    };
    
    checkBackend();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <p style={{ fontSize: '14px', color: apiStatus.includes('✅') ? 'green' : 'red' }}>
        {apiStatus}
      </p>
      <SignedOut>
        <SignInButton mode="modal"/>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default App
