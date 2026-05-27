import React from 'react'
import { Tag } from '../types'

export default function TagBadge({ tag }: { tag: Tag }) {
  return <span style={{ background: tag.color, color: '#fff', padding: '2px 6px', borderRadius: 6, marginRight: 6 }}>{tag.name}</span>
}
