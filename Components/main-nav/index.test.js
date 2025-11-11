import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { accountsFeaturesHoldoutGroup, climateImpactExperience } from '@ecosia/constants/feature-flags.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import EMainNav from './index.vue';

vi.mock('@ecosia/common-vue2/mixins/trap-focus.js', () => ({
  default: {
    data: () => ({
      keyBoardFocus: null,
    }),
    methods: {
      trapFocus: vi.fn(),
      unTrapFocus: vi.fn(),
    },
  },
}));

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
const options = {
  localVue,
  attachTo: '#root',
  pinia: createTestingPinia({
    stubActions: false,
  }),
};

describe('MainNav', () => {
  let wrapper;

  beforeEach(() => {
    document.body.replaceChildren([]);
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);
  });

  itRendersAndIsVisible(
    mount(EMainNav, { localVue, pinia: createTestingPinia({ stubActions: false }) }),
    'nav',
    'main-nav',
  );

  it('toggle action is visible', () => {
    wrapper = mount(EMainNav, options);
    expect(wrapper.find(byTestId('main-nav-toggle'))).toBeVisible();
  });

  it('adds and cleans up the document keyup listener when destroyed', () => {
    const addEventListenerBackup = document.addEventListener;
    const removeEventListenerBackup = document.removeEventListener;

    const listeners = new Map();
    document.addEventListener = vi.fn((event, handler) => listeners.set(event, handler));
    document.removeEventListener = vi.fn((event, handler) => listeners.delete(event, handler));

    wrapper = mount(EMainNav, options);
    expect(listeners.has('keyup')).toBe(true);

    wrapper.destroy();
    expect(listeners.has('keyup')).toBe(false);

    document.addEventListener = addEventListenerBackup;
    document.removeEventListener = removeEventListenerBackup;
  });

  it('closes when Escape is closed', () => {
    wrapper = mount(EMainNav, options);
    wrapper.vm.hideMenu = vi.fn();

    const event = new Event('keyup');
    // this ensures the handler works even when `which` isn't available
    event.which = undefined;
    event.keyCode = 27;

    document.dispatchEvent(event);
    expect(wrapper.vm.hideMenu).toHaveBeenCalled();
  });

  describe('Desktop/Tablet viewport', () => {
    afterEach(() => {
      document.body.classList = '';
    });

    it('renders with dropdown if desktop', async () => {
      wrapper = mount(EMainNav, options);
      await wrapper.setData({ isMenuExpanded: true, isTabletUp: true });
      expect(wrapper.find(byTestId('main-nav-sheet')).exists()).toBe(false);
      expect(wrapper.find(byTestId('main-nav-dropdown')).exists()).toBe(true);
    });

    it('renders with sheet if mobile or tablet', async () => {
      wrapper = mount(EMainNav, options);
      await wrapper.setData({ isMenuExpanded: true, isTabletUp: false });
      expect(wrapper.find(byTestId('main-nav-dropdown')).exists()).toBe(false);
      expect(wrapper.find(byTestId('main-nav-sheet')).exists()).toBe(true);
    });

    it('toggles dropdown visibility', async () => {
      wrapper = mount(EMainNav, options);
      await wrapper.setData({ isTabletUp: true });
      const dropdown = () => wrapper.find(byTestId('main-nav-dropdown'));
      expect(dropdown().exists()).toBe(false);
      await wrapper.find(byTestId('main-nav-toggle')).trigger('click');
      expect(dropdown()).toBeVisible();
    });

    it('emits core-analytics event when toggled', async () => {
      const callback = vi.fn();
      window.addEventListener('core-analytics-event', callback);
      wrapper = mount(EMainNav, options);
      await wrapper.find(byTestId('main-nav-toggle')).trigger('click');
      expect(callback).toHaveBeenCalled();
    });

    it('will not add no-scroll class to body', async () => {
      wrapper = mount(EMainNav, options);
      await wrapper.setData({ isTabletUp: true });
      const dropdown = wrapper.find(byTestId('main-nav-dropdown'));
      expect(dropdown.exists()).toBe(false);
      await wrapper.find(byTestId('main-nav-toggle')).trigger('click');
      expect(
        document.body.classList.contains('no-scroll'),
      ).toBe(false);
    });
  });

  describe('Mobile viewport', () => {
    it('renders with sheet if mobile', async () => {
      wrapper = mount(EMainNav, options);
      await wrapper.setData({ isMenuExpanded: true, isTabletUp: false });
      expect(wrapper.find(byTestId('main-nav-sheet')).exists()).toBe(true);
      expect(wrapper.find(byTestId('main-nav-dropdown')).exists()).toBe(false);
    });

    it('toggles sheet visibility', async () => {
      wrapper = mount(EMainNav, options);
      await wrapper.setData({ isTabletUp: false });
      const sheet = () => wrapper.find(byTestId('main-nav-sheet'));
      expect(sheet().exists()).toBe(false);
      await wrapper.find(byTestId('main-nav-toggle')).trigger('click');
      expect(sheet().props('isVisible')).toBe(true);
      expect(sheet().exists()).toBe(true);
    });

    it('adds no-scroll class on body', async () => {
      wrapper = mount(EMainNav, options);
      await wrapper.setData({ isMenuExpanded: false, isTabletUp: false });
      const toggle = wrapper.find(byTestId('main-nav-toggle'));
      await toggle.trigger('click');
      expect(
        document.body.classList.contains('no-scroll'),
      ).toBe(true);
    });

    it('hides on sheet close', async () => {
      wrapper = mount(EMainNav, options);
      await wrapper.setData({ isMenuExpanded: true, isTabletUp: false });
      const sheet = wrapper.find(byTestId('main-nav-sheet'));
      await sheet.find(byTestId('sheet-close-button')).trigger('click');
      expect(sheet.props('isVisible')).toBe(false);
    });

    it('removes no-scroll class from body', async () => {
      wrapper = mount(EMainNav, options);
      await wrapper.setData({ isTabletUp: false });
      const toggle = wrapper.find(byTestId('main-nav-toggle'));
      await toggle.trigger('click');
      const sheet = wrapper.find(byTestId('main-nav-sheet'));
      await sheet.find(byTestId('sheet-close-button')).trigger('click');
      expect(
        document.body.classList.contains('no-scroll'),
      ).toBe(false);
    });
  });

  describe('Climate Impact Experiment', () => {
    let unleashStore;

    beforeEach(() => {
      unleashStore = useUnleashStore();
    });

    afterEach(() => {
      unleashStore.$reset();
    });

    it.each([
      [accountsFeaturesHoldoutGroup.treatment],
      [accountsFeaturesHoldoutGroup.disabled],
    ])('shows the Impact Counter when CIE flag is enabled and holdout group toggle is %s', (accountsFeaturesHoldoutGroupValue) => {
      unleashStore.setFeatureToggles({
        [climateImpactExperience.flag]: {
          value: climateImpactExperience.enabled,
        },
        [accountsFeaturesHoldoutGroup.flag]: {
          value: accountsFeaturesHoldoutGroupValue,
        },
      });

      wrapper = mount(EMainNav, options);
      const menuButton = wrapper.find(byTestId('menu-button-impact-counter'));
      expect(menuButton.exists()).toBe(true);
    });

    it.each([
      [climateImpactExperience.disabled, accountsFeaturesHoldoutGroup.treatment],
      [climateImpactExperience.enabled, accountsFeaturesHoldoutGroup.holdout],
      [climateImpactExperience.disabled, accountsFeaturesHoldoutGroup.holdout],
      [climateImpactExperience.disabled, accountsFeaturesHoldoutGroup.disabled],
    ])('does not show the Impact Counter when CIE flag is %s and holdout group toggle is %s', (climateImpactExperienceValue, accountsFeaturesHoldoutGroupValue) => {
      unleashStore.setFeatureToggles({
        [climateImpactExperience.flag]: {
          value: climateImpactExperienceValue,
        },
        [accountsFeaturesHoldoutGroup.flag]: {
          value: accountsFeaturesHoldoutGroupValue,
        },
      });

      wrapper = mount(EMainNav, options);
      const menuButton = wrapper.find(byTestId('menu-button-impact-counter'));
      expect(menuButton.exists()).toBe(false);
    });

    it('does not show the Impact Counter when enableImpactExperiment is false', () => {
      unleashStore.setFeatureToggles({
        [climateImpactExperience.flag]: {
          value: climateImpactExperience.enabled,
        },
        [accountsFeaturesHoldoutGroup.flag]: {
          value: accountsFeaturesHoldoutGroup.treatment,
        },
      });

      wrapper = mount(EMainNav, {
        ...options,
        propsData: {
          enableImpactExperiment: false,
        },
      });
      const impactMenuButton = wrapper.find(byTestId('menu-button-impact-counter'));
      const menuButton = wrapper.find(byTestId('menu-button-hamburger'));
      expect(impactMenuButton.exists()).toBe(false);
      expect(menuButton.exists()).toBe(false);
    });
  });
});
