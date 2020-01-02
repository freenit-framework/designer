import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import TestApp from 'TestApp'
// import { data } from 'store/provider'
import meService from 'pages/me/mock'


it('dashboard', async () => {
  let wrapper
  const props = {
    path: '/dashboard',
  }
  await act(async () => {
    wrapper = await mount(
      <TestApp {...props} />
    )
  })
  expect(meService.fetch).toHaveBeenCalled()
  const emailElement = wrapper.find('div[data-id="email"]')
  expect(emailElement.text()).toEqual('admin@example.com')
})
