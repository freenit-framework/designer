// @ts-nocheck
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte'
import TopTools from './TopTools.svelte'
import store from '$lib/store'

const clipboardKey = 'designer:clipboard'

const makeComponent = (id = 'source') => ({
  id,
  name: 'Div',
  title: 'Div',
  component: null,
  children: [],
  props: {},
  css: {},
  text: 'Copied content',
})

describe('TopTools copy/paste', () => {
  beforeEach(() => {
    store.design.children = []
    store.design.selected = null
    localStorage.clear()

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockRejectedValue(new Error('clipboard read denied')),
      },
    })
  })

  afterEach(() => {
    store.design.children = []
    store.design.selected = null
    localStorage.clear()
  })

  test('pastes copied component in another tab when clipboard read is denied', async () => {
    const source = makeComponent()
    const target = makeComponent('target')
    store.design.selected = source

    const firstTab = render(TopTools, { props: { toggle: vi.fn() } })
    await fireEvent.click(screen.getByLabelText('Copy'))

    expect(localStorage.getItem(clipboardKey)).toContain('"text":"Copied content"')

    firstTab.unmount()
    store.design.selected = target
    render(TopTools, { props: { toggle: vi.fn() } })
    await fireEvent.click(screen.getByLabelText('Paste'))

    await waitFor(() => expect(store.design.selected?.children).toHaveLength(1))
    expect(store.design.selected.children[0]).toMatchObject({
      name: 'Div',
      title: 'Div',
      text: 'Copied content',
    })
    expect(store.design.selected.children[0].id).not.toBe(source.id)
  })
})
