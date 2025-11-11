import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import flushPromises from 'flush-promises';

import Logo from '@ecosia/common-vue2/components/logo/index.vue';

import { doodle } from '@ecosia/constants/feature-flags.js';
import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import config from './config.json';
import EDoodle from './index.vue';

const pinia = createTestingPinia({ stubActions: false });
const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const options = { pinia, localVue };

describe('EDoodle', () => {
  setActivePinia(pinia);
  const unleashStore = useUnleashStore();
  const globalStore = useGlobalStore();

  afterEach(() => {
    unleashStore.$reset();
    globalStore.$reset();
  });

  itRendersAndIsVisible(mount(EDoodle, options), 'a');

  describe('Doodle enabled', () => {
    it('sets the doodle target from the json config', () => {
      unleashStore.setFeatureToggles({
        [doodle.flag]: {
          value: doodle.enabled,
        },
      });
      const { element } = mount(EDoodle, options);
      expect(element).toHaveAttribute('target', config.target);
    });

    describe('doodle link', () => {
      it.each([
        ['de', config.href.de],
        ['fr', config.href.fr],
        ['it', config.href.en],
        ['en', config.href.en],
      ])('for locale %s is %s', async (locale, url) => {
        unleashStore.setFeatureToggles({
          [doodle.flag]: {
            value: doodle.enabled,
          },
        });
        globalStore.$patch({ locale });
        const { element } = mount(EDoodle, options);
        await flushPromises();
        expect(element).toHaveAttribute('href', url);
      });
    });
  });

  describe('Doodle disabled', () => {
    beforeAll(() => {
      unleashStore.setFeatureToggles({
        [doodle.flag]: {
          value: doodle.disabled,
        },
      });
    });

    it('uses logo component if feature flag is not enabled', async () => {
      const wrapper = mount(EDoodle, {
        ...options,
        propsData: { fallbackProps: { href: 'www.ecosia.org' } },
      });
      await flushPromises();
      const logo = wrapper.findComponent(Logo);
      expect(logo.exists()).toBe(true);
    });

    it('uses image if feature flag is not enabled and fallbackToImage is set', async () => {
      const wrapper = mount(EDoodle, {
        ...options,
        propsData: { fallbackToImage: 'color' },
      });
      await flushPromises();
      expect(wrapper.element).toHaveHtmlTag('svg');
    });
  });
});
