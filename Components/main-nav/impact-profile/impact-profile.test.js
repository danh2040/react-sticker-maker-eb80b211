import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { useUserStore } from '@ecosia/store/user/index.js';

import EMainNavImpactProfile from './index.vue';

const localVue = createLocalVue();

localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({
  stubActions: false,
});

const options = {
  localVue,
  pinia,
};

const userStore = useUserStore(pinia);

describe('EMainNavImpactProfile', () => {
  let wrapper;

  beforeEach(() => {
    userStore.$reset();
    vi.clearAllMocks();
  });

  describe('user is signed-in', () => {
    beforeEach(() => {
      userStore.$patch({
        isSignedIn: true,
        name: 'Doreen Green',
        email: 'doreen@example.com',
      });
      wrapper = mount(EMainNavImpactProfile, options);
    });

    it('shows the name', () => {
      const name = wrapper.find(byTestId('impact-profile-user-name'));
      expect(name.text()).toEqual('Doreen Green');
    });

    it('has default classes on username element', () => {
      const name = wrapper.find(byTestId('impact-profile-user-name'));
      expect(name.classes()).toStrictEqual([
        'impact-profile__top__details__user-name',
      ]);
    });

    describe('there is no name', () => {
      beforeEach(() => {
        userStore.$patch({
          name: '',
        });
      });

      it('shows the email as the name', () => {
        const name = wrapper.find(byTestId('impact-profile-user-name'));
        expect(name.text()).toEqual('doreen@example.com');
      });

      it('has additional classes on username element', () => {
        const name = wrapper.find(byTestId('impact-profile-user-name'));
        expect(name.classes()).toStrictEqual([
          'impact-profile__top__details__user-name',
          'impact-profile__top__details__user-name--is-email-address',
        ]);
      });
    });

    it('shows the sign-up button', () => {
      const signUpButton = wrapper.find(byTestId('main-nav-sign-up-button'));
      expect(signUpButton.exists()).toBe(false);
    });
  });

  describe('user is signed-out', () => {
    beforeEach(() => {
      userStore.$patch({ isSignedIn: false });
      wrapper = mount(EMainNavImpactProfile, options);
    });

    it('has classname without the modifier', () => {
      expect(wrapper.attributes('class')).toEqual(
        'impact-profile',
      );
    });

    it('shows the name for a guest', () => {
      const name = wrapper.find(byTestId('impact-profile-user-name'));
      expect(name.text()).toEqual('common.header.menu.impact.username.guest');
    });

    it('shows the sign-up button', () => {
      const signUpButton = wrapper.find(byTestId('main-nav-sign-up-button'));
      expect(signUpButton.exists()).toBe(true);
    });
  });
});
