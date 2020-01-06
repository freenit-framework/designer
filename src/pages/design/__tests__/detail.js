import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import TestApp from 'TestApp'
import authService from 'pages/auth/mock'


it('landing', async () => {
  let wrapper
  await act(async () => {
    wrapper = await mount(
      <TestApp path="/" />
    )
  })
  let title = wrapper.find('a[data-id="app"]')
  expect(title.text()).toEqual('Freenit')
  expect(authService.refresh).toHaveBeenCalled()
})
