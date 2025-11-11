import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

import Turnstile from './index.vue';

const pinia = createPinia();

describe('Turnstile', () => {
  setActivePinia(pinia);
  let wrapper;
  const mockWidgetId = 'test-widget-id';
  const turnstileLoadFunction = 'cfTurnstileOnLoad';

  const $config = {
    turnstileSiteKeys: {
      [mockWidgetId]: 'test-site-key',
    },
  };

  beforeEach(() => {
    window.turnstile = {
      render: vi.fn(),
      reset: vi.fn(),
    };

    wrapper = mount(Turnstile, {
      mocks: {
        $config,
      },
      propsData: {
        widgetId: mockWidgetId,
        loadScript: false,
      },
    });
  });

  afterEach(() => {
    delete window.turnstileReady;
    wrapper.destroy();
    vi.resetAllMocks();
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('#turnstile-container').exists()).toBe(true);
  });

  it('sets the correct container id', () => {
    expect(wrapper.attributes('id')).toBe('turnstile-container');
  });

  it('uses custom container id when provided', () => {
    const customContainerId = 'custom-container';
    wrapper = mount(Turnstile, {
      propsData: {
        widgetId: mockWidgetId,
        containerId: customContainerId,
        loadScript: false,
      },
    });
    expect(wrapper.attributes('id')).toBe(customContainerId);
  });

  it('adds script to the document head when turnstile is not loaded', () => {
    delete window.turnstile;
    wrapper = mount(Turnstile, {
      propsData: {
        widgetId: mockWidgetId,
      },
    });
    const script = document.getElementById('cfTurnstileScript');
    expect(script).not.toBeNull();
  });

  it('calls window.turnstile.render with correct parameters', () => {
    const cfTurnstileOnLoad = window[turnstileLoadFunction];
    cfTurnstileOnLoad();
    expect(window.turnstile.render).toHaveBeenCalledWith(
      '#turnstile-container',
      expect.objectContaining({
        'sitekey': 'test-site-key',
        'callback': expect.any(Function),
        'error-callback': expect.any(Function),
        'unsupported-callback': expect.any(Function),
        'action': mockWidgetId,
        'invisible': true,
      }),
    );
  });

  it('emits success successCallback', () => {
    const mockToken = 'some-token';
    wrapper.vm.successCallback(mockToken);

    const emittedEvent = wrapper.emitted()['turnstile-success'];
    expect(emittedEvent).toBeTruthy();
    expect(emittedEvent[0]).toEqual([mockToken, mockWidgetId]);
  });

  it('emits expiration expiredCallback', () => {
    const mockToken = 'some-token';
    wrapper.vm.expiredCallback(mockToken);

    const emittedEvent = wrapper.emitted()['turnstile-expired'];
    expect(emittedEvent).toBeTruthy();
  });
});
