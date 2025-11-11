import { shallowMount } from '@vue/test-utils';

import ELogo from './index.vue';

const href = 'https://www.ecosia.org';
const propsData = { href, title: 'Logo title' };
const options = { propsData };

describe('ELogo', () => {
  itRendersAndIsVisible(shallowMount(ELogo, options), 'a', 'logo');

  it('renders with rel noopener attribute and correct icon', () => {
    const wrapper = shallowMount(ELogo, options);
    expect(wrapper.attributes('rel')).toBe('noopener');
    expect(wrapper.attributes('aria-label')).toBe('Logo title');
    expect(wrapper.find(byTestId('logo-icon')).exists()).toBe(true);
  });

  it('assign href prop', () => {
    const wrapper = shallowMount(ELogo, options);
    expect(wrapper.attributes('href')).toBe(href);
  });

  it('renders as compact', () => {
    const wrapper = shallowMount(ELogo, { ...options, propsData: { ...propsData, variant: 'compact' } });
    expect(wrapper.find(byTestId('logo-icon-compact')).exists()).toBe(true);
  });

  it('dispatch custom core-analytics-event on click', async () => {
    const wrapper = shallowMount(ELogo, options);
    window.dispatchEvent = vi.fn();
    await triggerSafeLinkClick(wrapper);
    expect(window.dispatchEvent).toHaveBeenCalled();
    expect(window.dispatchEvent.mock.calls[0][0].type).toEqual('core-analytics-event');
    expect(window.dispatchEvent.mock.calls[0][0].detail.name).toEqual('logoClicked');
  });
});
