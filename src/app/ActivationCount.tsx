import React, { useEffect, useState } from 'react';

export default function ActivationCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/activations/count')
      .then(res => res.json())
      .then(data => setCount(data.count))
      .catch(() => setCount(null));
  }, []);

  return (
    <div
      className="activation-count-banner"
      style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 'bold' }}
    >
      {count !== null
        ? <>Current activation number: <span style={{ color: '#7a5230' }}>{count}</span></>
        : <>Loading activation number...</>
      }
    </div>
  );
}