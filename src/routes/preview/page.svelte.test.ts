// @ts-nocheck
import { describe, test, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import Page from './+page.svelte'

describe('/preview/+page.svelte', () => {
  test('should render component after update message', async () => {
    render(Page)

    const updateEvent = new MessageEvent('message', {
      data: {
        type: 'update',
        design: [
          {
            id: 'testlink',
            name: 'A',
            title: 'A',
            children: [],
            props: { href: 'https://example.com/' },
            css: {},
            text: 'example',
          },
        ],
        themeLight: {},
        themeDark: {},
        themeMode: 'light',
        device: 'desktop',
        selectedId: null,
        document: null,
      },
      source: window,
      origin: window.location.origin,
    })

    window.dispatchEvent(updateEvent)
    await new Promise((r) => setTimeout(r, 0))

    const link = screen.getByText('example')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com/')
  })
})
