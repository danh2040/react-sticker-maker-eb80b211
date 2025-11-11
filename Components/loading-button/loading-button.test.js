import { mount, shallowMount } from '@vue/test-utils';

import ELoadingButton from './index.vue';

describe('ELoadingButton', () => {
  itRendersAndIsVisible(mount(ELoadingButton), 'button', 'loading-button');

  it('warns on invalid loading', () => {
    expect(() => mount(ELoadingButton, { propsData: { loading: 'abc' } }))
      .toHaveInvalidProp('loading');
  });

  it('renders loading indicator on loading', () => {
    const wrapper = shallowMount(ELoadingButton, { propsData: { loading: true } });
    const indicator = wrapper.find(byTestId('loading-button-indicator'));
    expect(indicator).toBeVisible();
  });
});
