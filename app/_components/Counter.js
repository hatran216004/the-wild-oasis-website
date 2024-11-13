'use client';
import { useState } from 'react';

export default function Counter({ users }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div>{users.length} users</div>
      <button onClick={() => setCount((count) => count + 1)}>+</button>
      {count}
      <button onClick={() => setCount((count) => count - 1)}>-</button>
    </div>
  );
}
