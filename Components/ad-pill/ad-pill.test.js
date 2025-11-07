import { mount } from '@vue/test-utils';

import EAdPill from './index.vue';

describe('AdPill', () => {
  itRendersAndIsVisible(mount(EAdPill, {}), 'span');

  it('contains ad-pill class', () => {
    const wrapper = mount(EAdPill, {});

    expect(wrapper.classes()).toContain('ad-pill');
  });

  it('displays translation inside span', () => {
    const wrapper = mount(EAdPill, {});

    expect(wrapper.text()).toContain('common.search.ad');
  });
});
