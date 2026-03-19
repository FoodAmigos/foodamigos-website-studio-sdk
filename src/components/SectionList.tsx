'use client'

import { type ComponentType } from 'react'
import type { SectionConfig } from '../types/sections'

interface SectionListProps {
  sections: SectionConfig[]
  components: Record<string, ComponentType>
}

export function SectionList({ sections, components }: SectionListProps) {
  const visible = [...sections]
    .filter((s) => s.is_visible)
    .sort((a, b) => a.order - b.order)

  return (
    <>
      {visible.map((section) => {
        const Component = components[section.component]
        if (!Component) return null
        return (
          <div key={section.component} data-component-id={section.component}>
            <Component />
          </div>
        )
      })}
    </>
  )
}
