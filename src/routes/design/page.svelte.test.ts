// @ts-nocheck
import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/svelte'
import Page from './+page.svelte'
import store from '$lib/store'

describe('/design/+page.svelte', () => {
  beforeEach(() => {
    store.design.children = []
  })

  afterEach(() => {
    store.design.children = []
  })

  test('should render preview iframe', () => {
    render(Page)
    const iframe = screen.getByTitle('preview')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', '/design/preview/')
  })
})
