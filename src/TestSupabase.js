import { useEffect, useState } from 'react';

function TestSupabase() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users'); // Adjust if deployed
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || 'Failed to fetch data');

        console.log('Fetched data:', result);
        setData(result);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Express API Connection Test</h2>
      {error ? <p style={{ color: 'red' }}>Error: {error}</p> : null}
      <pre>{data ? JSON.stringify(data, null, 2) : 'Fetching data...'}</pre>
    </div>
  );
}

export default TestSupabase;
