import { shallowMount } from '@vue/test-utils';

import { BCORP_CERTIFICATION, BCORP_ECOSIA } from '@ecosia/constants/urls.js';

import EFooterBcorp from './bcorp.vue';

describe('Footer B-Corp', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(EFooterBcorp);
  });

  itRendersAndIsVisible(shallowMount(EFooterBcorp), 'div', 'footer-bcorp');

  describe('B-Corp Logo', () => {
    let logo;

    beforeEach(() => {
      logo = wrapper.find(byTestId('footer-bcorp-logo'));
    });

    it('renders blank noopener link on logo', () => {
      expect(logo.attributes('target')).toBe('_blank');
      expect(logo.attributes('rel')).toBe('noopener');
    });

    it('renders link to b-corporation website on logo', () => {
      expect(logo.attributes('href')).toBe(BCORP_ECOSIA);
    });

    it('adds the visible class to the logo on prop showLogo', async () => {
      expect(logo.classes()).not.toContain('footer-bcorp__logo--visible');
      await wrapper.setProps({ showLogo: true });
      expect(logo.classes()).toContain('footer-bcorp__logo--visible');
    });
  });

  describe('Certification Notice', () => {
    let notice;

    beforeEach(() => {
      notice = wrapper.find(byTestId('footer-bcorp-certification'));
    });

    it('renders blank noopener link on notice', () => {
      expect(notice.attributes('target')).toBe('_blank');
      expect(notice.attributes('rel')).toBe('noopener');
    });

    it('renders link to certification notice', () => {
      expect(notice.attributes('href')).toBe(BCORP_CERTIFICATION);
    });
  });
});
