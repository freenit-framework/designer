import { describe, test, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import Page from './+page.svelte'
import * as components from '$lib/components'
import store from '$lib/store'

describe('/+page.svelte', () => {
  test('should render link', () => {
    store.design.children.push({
      id: 'freenit',
      name: 'A',
      title: 'A',
      component: components.A,
      children: [],
      props: { href: 'https://freenit.org/' },
      css: {},
      text: 'freenit.org',
    })
    render(Page)
    const link = screen.getByTestId('freenit')
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent('freenit.org')
    expect(link.href).toEqual('https://freenit.org/')
  })
})
