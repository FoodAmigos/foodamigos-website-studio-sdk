'use client'

import { useEffect } from 'react'

type ThemePayload = {
  colors?: Record<string, string>
  typography?: {
    fontSans?: string
    fontSerif?: string
    fontMono?: string
  }
  other?: {
    radius?: number
    shadow?: string | { x: number; y: number; blur: number; spread: number; color: string }
  }
}

function camelToKebab(str: string): string {
  return str
    .replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
    .replace(/([a-z])(\d)/g, '$1-$2')
}

function applyColors(colors: Record<string, string>) {
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${camelToKebab(key)}`, value)
  })
}

function applyTypography(typography: NonNullable<ThemePayload['typography']>) {
  const root = document.documentElement
  if (typography.fontSans) root.style.setProperty('--font-sans-custom', typography.fontSans)
  if (typography.fontSerif) root.style.setProperty('--font-serif-custom', typography.fontSerif)
  if (typography.fontMono) root.style.setProperty('--font-mono-custom', typography.fontMono)
}

function applyOther(other: NonNullable<ThemePayload['other']>) {
  const root = document.documentElement
  if (other.radius != null) root.style.setProperty('--radius', `${other.radius}rem`)
  if (other.shadow) {
    const shadowStr =
      typeof other.shadow === 'string'
        ? other.shadow
        : `${other.shadow.x}px ${other.shadow.y}px ${other.shadow.blur}px ${other.shadow.spread}px ${other.shadow.color}`
    root.style.setProperty('--shadow-custom', shadowStr)
  }
}

const SELECT_MODE_STYLE_ID = 'editor-bridge-select-mode'

function enableSelectMode() {
  if (document.getElementById(SELECT_MODE_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = SELECT_MODE_STYLE_ID
  style.textContent = '[data-component-id]:hover { outline: 2px solid #3b82f6; outline-offset: 2px; cursor: pointer; }'
  document.head.appendChild(style)
}

function disableSelectMode() {
  document.getElementById(SELECT_MODE_STYLE_ID)?.remove()
}

export function EditorBridge() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!document.getElementById(SELECT_MODE_STYLE_ID)) return
      const target = (e.target as Element).closest('[data-component-id]')
      if (!target) return
      e.preventDefault()
      e.stopPropagation()
      const componentId = target.getAttribute('data-component-id') ?? ''
      const filePath = target.getAttribute('data-file-path') ?? ''
      window.parent.postMessage({ type: 'ELEMENT_SELECTED', componentId, filePath }, '*')
    }

    function handleMessage(e: MessageEvent) {
      const { type, payload } = e.data ?? {}
      if (type === 'ENABLE_SELECT_MODE') {
        enableSelectMode()
      } else if (type === 'DISABLE_SELECT_MODE') {
        disableSelectMode()
      } else if (type === 'theme-update') {
        const theme = payload as ThemePayload
        if (theme?.colors) applyColors(theme.colors)
        if (theme?.typography) applyTypography(theme.typography)
        if (theme?.other) applyOther(theme.other)
      }
    }

    window.addEventListener('message', handleMessage)
    document.addEventListener('click', handleClick, true)

    return () => {
      window.removeEventListener('message', handleMessage)
      document.removeEventListener('click', handleClick, true)
      disableSelectMode()
    }
  }, [])

  return null
}
