'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CompleteOrder() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing your payment...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const completeOrder = async () => {
      const token = searchParams.get('token');
      const payerID = searchParams.get('PayerID');

      if (!token || !payerID) {
        setError('Missing token or PayerID.');
        setStatus('Payment could not be processed.');
        return;
      }

      try {
        const response = await fetch('/api/complete-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, payerID }),
        });

        if (response.ok) {
          const result = await response.text(); // Assuming the API responds with a success message
          setStatus(result);
        } else {
          const errorMessage = await response.text();
          setError(errorMessage);
          setStatus('Payment failed.');
        }
      } catch (err) {
        setError(err.message);
        setStatus('An unexpected error occurred.');
      }
    };

    completeOrder();
  }, [searchParams]);

  return (
    <div>
      <h1>Complete Order</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <a href="/">Return to Home</a>
    </div>
  );
}
