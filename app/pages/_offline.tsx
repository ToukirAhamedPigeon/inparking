// pages/_offline.tsx
import type { NextPage } from 'next';

const OfflinePage: NextPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Offline</h1>
      <p>Sorry, you're offline. Please check your connection and try again.</p>
    </div>
  );
};

export default OfflinePage;