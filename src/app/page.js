'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handlePay = async () => {
    try {
      console.log('HANDLE PAY')
      const response = await fetch('/api/create-order', { method: 'POST' });

      if (response.ok) {
        const { approvalUrl } = await response.json();

        window.location.href = approvalUrl;
      } else {
        const { error } = await response.json();
        console.error('Error creating order:', error);
        alert('Failed to create order. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Node.js Complete Course</h1>
      <h2>Price: $1.00</h2>
      <button onClick={handlePay}>Buy</button>
    </div>
  );
}
