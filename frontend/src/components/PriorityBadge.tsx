import React from 'react'

export default function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'URGENT' ? '#b71c1c' : priority === 'HIGH' ? '#d32f2f' : priority === 'MEDIUM' ? '#f57c00' : '#388e3c'
  return <span style={{ background: color, color: '#fff', padding: '2px 6px', borderRadius: 6 }}>{priority}</span>
}
