import { mount, shallowMount } from '@vue/test-utils';

import EModal from './index.vue';

const propsData = { active: true };

describe('EModal', () => {
  itRendersAndIsVisible(mount(EModal, { propsData }), 'div', 'modal');

  describe('Close', () => {
    it('does not render a close button if closeButton is false', () => {
      const wrapper = shallowMount(EModal, { propsData: { ...propsData, closeButton: false } });
      expect(wrapper.element.querySelector(byTestId('close'))).toBe(null);
    });

    it('sets correct variant to close button', async () => {
      const wrapper = mount(EModal, { propsData: { active: true } });
      await wrapper.vm.$nextTick();
      const attributes = wrapper.find(byTestId('close')).attributes();
      expect(attributes.variant).toEqual('solid-white');
    });

    it('emits close event on close click', () => {
      const wrapper = mount(EModal, { propsData });
      wrapper.find(byTestId('close')).trigger('click');
      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('emits close event on escape press', () => {
      const wrapper = mount(EModal, { propsData });
      wrapper.trigger('keyup.esc');
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  it('returns flag for any emitted event', () => {
    const flag = 'button';
    const wrapper = mount(EModal, { propsData });
    wrapper.find(byTestId('close')).trigger('click', { flag });
    expect(wrapper.emitted('close')).toStrictEqual(expect.arrayContaining([['button']]));
  });

  describe('Scroll lock', () => {
    const scrollLockClass = 'modal__no-scroll';

    beforeEach(() => {
      document.body.classList.remove(scrollLockClass);
    });

    it('adds no-scroll class on body when mounted if active', async () => {
      shallowMount(EModal, { propsData: { active: true } });
      expect(document.body.classList.contains(scrollLockClass)).toBe(true);
    });

    it('retains no-scroll class on body when mounted if not active', async () => {
      // This happens if multiple modals exist but a different one is active
      document.body.classList.add(scrollLockClass);

      shallowMount(EModal, { propsData: { active: false } });
      expect(document.body.classList.contains(scrollLockClass)).toBe(true);
    });

    it('adds and removes no-scroll class on body when toggled', async () => {
      const wrapper = shallowMount(EModal, { propsData: { active: false } });
      expect(document.body.classList.contains(scrollLockClass)).toBe(false);
      await wrapper.setProps({ active: true });
      expect(document.body.classList.contains(scrollLockClass)).toBe(true);
      await wrapper.setProps({ active: false });
      expect(document.body.classList.contains(scrollLockClass)).toBe(false);
    });

    it('does not add no-scroll class on body when scrollableBody is true', async () => {
      document.body.className = '';
      const wrapper = mount(EModal, { propsData: { active: true, scrollableBody: true } });
      await wrapper.vm.$nextTick();
      expect(document.body.classList.contains(scrollLockClass)).toBe(false);
      await wrapper.setProps({ active: true, scrollableBody: true });
      expect(document.body.classList.contains(scrollLockClass)).toBe(false);
    });

    it('removes no-scroll class once destroyed', () => {
      const wrapper = shallowMount(EModal, { propsData });
      expect(document.body.classList.contains(scrollLockClass)).toBe(true);
      wrapper.destroy();
      expect(document.body.classList.contains(scrollLockClass)).toBe(false);
    });
  });

  describe('With feature', () => {
    it('does not show feature element if no slot is present', () => {
      const wrapper = shallowMount(EModal, { propsData });
      expect(wrapper.find(byTestId('modal-feature')).exists()).toBe(false);
    });

    it('shows feature element if added to slot', () => {
      const wrapper = shallowMount(EModal, {
        propsData,
        slots: {
          feature: '<div>This is the image space</div>',
        },
      });

      expect(wrapper.find(byTestId('modal-feature'))).toBeVisible();
    });

    it('renders medium image size by default', () => {
      const wrapper = shallowMount(EModal, {
        propsData,
        slots: {
          feature: '<div>This is the image space</div>',
        },
      });

      const featureContainer = wrapper.find(byTestId('modal-feature'));
      expect(featureContainer.classes()).toContain('modal__feature--m');
    });

    it.each([
      's',
      'm',
    ])('sets correct image size class for %s size', (featureSize) => {
      const wrapper = shallowMount(EModal, {
        propsData: { ...propsData, featureSize },
        slots: {
          feature: '<div>This is the image space</div>',
        },
      });

      const featureContainer = wrapper.find(byTestId('modal-feature'));
      expect(featureContainer.classes()).toContain(`modal__feature--${featureSize}`);
    });
  });

  describe('With footer', () => {
    it('shows footer element if added to slot', () => {
      const footerSelector = 'footer-slot';
      const wrapper = shallowMount(EModal, {
        propsData,
        slots: {
          footer: '<div data-test-id="footer-slot"></div>',
        },
      });

      expect(wrapper.find(byTestId(footerSelector))).toBeVisible();
    });
  });
});
