'use client';

import { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function PaymentForm({ amount = 50 ,getMessage }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (typeof getMessage === 'function') {
      getMessage(message);
    }
  }, [message]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!stripe || !elements) return;

    try {
      const res = await fetch('https://fb-backend.vercel.app/MarketPlace/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setMessage('✅ Payment Successful!');
      }
    } catch (err) {
      setMessage('⚠️ Payment failed. Try again.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <CardElement className="p-4 border border-gray-300 rounded-md" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
      {message && <p className="text-center text-sm mt-2">{message}</p>}
    </form>
  );
}
