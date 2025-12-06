import React from 'react';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
      <h3>Counter</h3>
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Decrement
      </button>
    </div>
  );
}
