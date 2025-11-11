import { shallowMount } from '@vue/test-utils';

import EMainNavMenuAnimatedLockIcon from './animated-lock-icon.vue';

describe('EMainNavMenuAnimatedLockIcon', () => {
  it("doesn't show the lock icon", () => {
    const wrapper = shallowMount(EMainNavMenuAnimatedLockIcon);
    expect(wrapper.isVisible()).toBe(false);
  });

  describe('is locked', () => {
    const options = {
      propsData: {
        isLocked: true,
      },
    };

    it('shows the lock icon', () => {
      const wrapper = shallowMount(EMainNavMenuAnimatedLockIcon, options);
      expect(wrapper.isVisible()).toBe(true);
    });

    it('sets the class to locked', () => {
      const wrapper = shallowMount(EMainNavMenuAnimatedLockIcon, options);
      expect(wrapper.classes()).toContain(
        'animated-lock-icon--is-locked',
      );
    });
  });

  describe('was locked', () => {
    const options = {
      propsData: {
        wasLocked: true,
      },
    };

    it('shows the lock icon', () => {
      const wrapper = shallowMount(EMainNavMenuAnimatedLockIcon, options);
      expect(wrapper.isVisible()).toBe(true);
    });

    it('sets the class to was locked', () => {
      const wrapper = shallowMount(EMainNavMenuAnimatedLockIcon, options);
      expect(wrapper.classes()).toContain(
        'animated-lock-icon--was-locked',
      );
    });
  });

  describe('is the animation disabled', () => {
    const options = {
      propsData: {
        isLocked: true, // needed to make component visible
        isAnimationDisabled: true,
      },
    };

    it('sets the class to have animation disabled', () => {
      const wrapper = shallowMount(EMainNavMenuAnimatedLockIcon, options);
      expect(wrapper.classes()).toContain(
        'animated-lock-icon--is-animation-disabled',
      );
    });
  });

  describe('is animation delayed', () => {
    const options = {
      propsData: {
        isLocked: true, // needed to make component visible
        isAnimationDelayed: true,
      },
    };

    it('sets the class to have animation delayed', () => {
      const wrapper = shallowMount(EMainNavMenuAnimatedLockIcon, options);
      expect(wrapper.classes()).toContain(
        'animated-lock-icon--is-animation-delayed',
      );
    });
  });

  describe('animating from the left', () => {
    const options = {
      propsData: {
        isLocked: true, // needed to make component visible
        animateInFrom: 'left',
      },
    };

    it('sets the class to have animation delayed', () => {
      const wrapper = shallowMount(EMainNavMenuAnimatedLockIcon, options);
      expect(wrapper.classes()).toContain(
        'animated-lock-icon--animate-in-from-left',
      );
    });
  });

  describe('animating from the right', () => {
    const options = {
      propsData: {
        isLocked: true, // needed to make component visible
        animateInFrom: 'right',
      },
    };

    it('sets the class to have animation delayed', () => {
      const wrapper = shallowMount(EMainNavMenuAnimatedLockIcon, options);
      expect(wrapper.classes()).toContain(
        'animated-lock-icon--animate-in-from-right',
      );
    });
  });
});
