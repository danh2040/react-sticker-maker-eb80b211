import { mount } from '@vue/test-utils';

import ECounter from './index.vue';

describe('ECounter', () => {
  let wrapper;
  const propsData = {
    count: '100,000',
    description: 'trees planted by Ecosia community',
  };

  beforeEach(() => {
    wrapper = mount(ECounter, { propsData });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and is visible', () => {
    const updatedWrapper = mount(ECounter, { propsData });
    expect(updatedWrapper.find('div').exists()).toBe(true);
    expect(wrapper.find(byTestId('counter-description')).exists()).toBe(true);
  });

  it('renders count', async () => {
    const expected = propsData.count.toString();
    const counter = wrapper.find(byTestId('counter-count'));
    expect(counter.text()).toContain(expected);
  });
});
