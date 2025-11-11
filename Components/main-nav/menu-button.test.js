import { shallowMount } from '@vue/test-utils';

import EMainNavMenuButton from './menu-button.vue';

describe('EMainNavMenuButton', () => {
  describe('the user is signed in', () => {
    it('shows the user picture', () => {
      const wrapper = shallowMount(EMainNavMenuButton, { propsData: { isSignedIn: true } });
      const avatarMenuButton = wrapper.find(byTestId('menu-button-avatar'));
      const hamburgerMenuButton = wrapper.find(byTestId('menu-button-hamburger'));

      expect(avatarMenuButton.exists()).toBe(true);
      expect(hamburgerMenuButton.exists()).toBe(false);
    });
  });

  describe('the user is signed out', () => {
    it('shows the user picture', () => {
      const wrapper = shallowMount(EMainNavMenuButton, { propsData: { isSignedIn: false } });
      const avatarMenuButton = wrapper.find(byTestId('menu-button-avatar'));
      const hamburgerMenuButton = wrapper.find(byTestId('menu-button-hamburger'));

      expect(hamburgerMenuButton.exists()).toBe(true);
      expect(avatarMenuButton.exists()).toBe(false);
    });
  });
});
