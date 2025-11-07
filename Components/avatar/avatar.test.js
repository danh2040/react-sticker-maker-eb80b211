import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { useUserStore } from '@ecosia/store/user/index.js';

import EAvatarGoogle from './avatar-google.vue';
import EAvatar, { SIZES } from './index.vue';
import SignedInPlaceholderAvatarSVG from './SignedInPlaceholderAvatar.svg';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({
  stubActions: false,
  initialState: {
    user: {
      isSignedIn: false,
      picture: null,
    },
  },
});

const options = {
  localVue,
  pinia,
};

const userStore = useUserStore(pinia);

describe('EAvatar', () => {
  describe('is signed-out', () => {
    beforeAll(() => {
      userStore.$patch({ isSignedIn: false });
    });

    it('shows the signed-out placeholder', () => {
      const wrapper = mount(EAvatar, options);
      expect(wrapper.find(byTestId('avatar-signed-out-placeholder')).exists()).toBe(true);
      expect(wrapper.findComponent(SignedInPlaceholderAvatarSVG).exists()).toBe(false);
      expect(wrapper.findComponent(EAvatarGoogle).exists()).toBe(false);
    });

    it.each(Object.entries(SIZES).map(
      ([sizeName, sizePixels]) => ({ sizeName, sizePixels }),
    ))('sets the size correctly for $sizeName', ({ sizeName, sizePixels }) => {
      const optionsWithSizeProp = {
        ...options,
        propsData: {
          size: sizeName,
        },
      };
      const wrapper = mount(EAvatar, optionsWithSizeProp);
      expect(
        wrapper.find(byTestId('avatar-signed-out-placeholder')).attributes('style'),
      ).toBe(
        `width: ${sizePixels}px; height: ${sizePixels}px;`,
      );
    });
  });

  describe('is signed-in', () => {
    beforeAll(() => {
      userStore.$patch({ isSignedIn: true });
    });

    describe('if there is no google image', () => {
      it('shows the placeholder svg', () => {
        const wrapper = mount(EAvatar, options);
        expect(wrapper.find(byTestId('avatar-signed-out-placeholder')).exists()).toBe(false);
        expect(wrapper.findComponent(EAvatarGoogle).exists()).toBe(false);
        expect(wrapper.findComponent(SignedInPlaceholderAvatarSVG).exists()).toBe(true);
      });
    });

    describe('if is a google image', () => {
      beforeEach(() => {
        userStore.$patch({
          picture: 'https://lh3.googleusercontent.com/a/1234567891011213=s96-c',
        });
      });

      it('shows the google component', () => {
        const wrapper = mount(EAvatar, options);
        expect(wrapper.find(byTestId('avatar-signed-out-placeholder')).exists()).toBe(false);
        expect(wrapper.findComponent(SignedInPlaceholderAvatarSVG).exists()).toBe(false);
        expect(wrapper.findComponent(EAvatarGoogle).exists()).toBe(true);
      });

      describe('but the image errors', () => {
        it('shows the placeholder svg', async () => {
          const wrapper = mount(EAvatar, options);

          // simulate the google image erroring
          await wrapper.findComponent(EAvatarGoogle).vm.$emit('error');

          expect(wrapper.find(byTestId('avatar-signed-out-placeholder')).exists()).toBe(false);
          expect(wrapper.findComponent(EAvatarGoogle).exists()).toBe(false);
          expect(wrapper.findComponent(SignedInPlaceholderAvatarSVG).exists()).toBe(true);
        });

        it.each(Object.entries(SIZES).map(
          ([sizeName, sizePixels]) => ({ sizeName, sizePixels }),
        ))('sets the size correctly for $sizeName', async ({ sizeName, sizePixels }) => {
          const optionsWithSizeProp = {
            ...options,
            propsData: {
              size: sizeName,
            },
          };
          const wrapper = mount(EAvatar, optionsWithSizeProp);

          // simulate the google image erroring
          await wrapper.findComponent(EAvatarGoogle).vm.$emit('error');

          expect(
            wrapper.findComponent(SignedInPlaceholderAvatarSVG).attributes('style'),
          ).toBe(
            `width: ${sizePixels}px; height: ${sizePixels}px; background: rgb(164, 210, 79);`,
          );
        });
      });
    });
  });
});
