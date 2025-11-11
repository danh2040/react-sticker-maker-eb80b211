import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { getFinancialReportURL, getTreeUpdatesURL } from '@ecosia/common-js/universal/url-utils.js';
import userEngagementMocks from '@ecosia/common-vitest/mocks/user-engagement';

import { useUserEngagementStore } from '@ecosia/user-engagement-client2/user-engagement.store.js';

import EMainFooterVisual from './visual.vue';

const { $trackUserEngagementCardEvent } = userEngagementMocks;
const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
const pinia = createTestingPinia({
  stubActions: false,
});
const mocks = {
  $trackUserEngagementCardEvent,
  $pinia: pinia,
};
const options = {
  localVue,
  mocks,
  pinia,
};

const defaultCards = [{
  id: 'financialreports',
  imageTag: 'financialreports',
  url: getFinancialReportURL('en'),
  imageUrl: '',
  linkText: 'common.footer.card.financialreports.link',
  title: 'common.footer.card.financialreports.title',
  bodyText: '',
}, {
  id: 'treeupdates',
  imageTag: 'treeupdates',
  url: getTreeUpdatesURL('en'),
  imageUrl: '',
  linkText: 'common.footer.card.treeupdates.link',
  title: 'common.footer.card.treeupdates.title',
  bodyText: '',
}];
const mockedBrazeCards = [{
  id: '1234',
  imageTag: '',
  url: 'mock-url11111',
  imageUrl: 'fake-braze-url',
  linkText: 'mock text',
  title: 'mock title',
  bodyText: '',
  extras: { location: 'footer' },
}, {
  id: '12345',
  imageTag: '',
  url: 'mock-url',
  imageUrl: 'fake-braze-url',
  linkText: 'mock text',
  title: 'mock title',
  bodyText: '',
  extras: { location: 'footer' },
}];

const userEngagementStore = useUserEngagementStore(pinia);

describe('EMainFooterVisual', () => {
  beforeEach(() => {
    userEngagementStore.$reset();
    vi.resetAllMocks();
  });

  itRendersAndIsVisible(mount(EMainFooterVisual, options), 'div', 'main-footer-visual');

  describe('Cards', () => {
    describe('Default', () => {
      it('renders default cards if showCards is true', async () => {
        const wrapper = mount(EMainFooterVisual, options);

        defaultCards.forEach(({ id, url, title, linkText, imageTag, imageUrl, bodyText }) => {
          const card = wrapper.find(byTestId(`main-footer-card-${id}`));
          expect(card).toBeVisible();
          expect(card.props()).toEqual({ url, title, linkText, imageTag, imageUrl, bodyText });
        });
      });

      it('does not render any cards if showCards is false', () => {
        const wrapper = shallowMount(EMainFooterVisual, {
          ...options,
          propsData: { showCards: false },
        });
        const cards = wrapper.findAll(byTestIdPrefix('main-footer-card'));
        expect(cards.exists()).toBe(false);
      });

      it('does not log card impression events', () => {
        mount(EMainFooterVisual, options);

        expect($trackUserEngagementCardEvent).not.toHaveBeenCalled();
      });

      it('does not log card click events', () => {
        const wrapper = mount(EMainFooterVisual, options);
        const card = wrapper.find(byTestId(`main-footer-card-${defaultCards[0].id}`));

        card.vm.$emit('click');

        expect($trackUserEngagementCardEvent).not.toHaveBeenCalled();
      });
    });

    describe('Braze', () => {
      beforeEach(() => {
        userEngagementStore.isEnabled = true;
        userEngagementStore.cards = mockedBrazeCards;
      });

      it('renders Braze cards if userEngagementEnabled is true and userEngagementCardsError is false', () => {
        const wrapper = mount(EMainFooterVisual, options);
        mockedBrazeCards.forEach(({ id, url, title, linkText, imageTag, imageUrl, bodyText }) => {
          const card = wrapper.find(byTestId(`main-footer-card-${id}`));
          expect(card.exists()).toBe(true);
          expect(card).toBeVisible();
          expect(card.props()).toEqual({ url, title, linkText, imageTag, imageUrl, bodyText });
        });
      });

      it('logs card impression on impression event', () => {
        $trackUserEngagementCardEvent.mockClear();
        mount(EMainFooterVisual, options);
        expect($trackUserEngagementCardEvent).toHaveBeenCalledTimes(2);
        expect($trackUserEngagementCardEvent.mock.calls[0][0]).toBe('impression');
        expect($trackUserEngagementCardEvent.mock.calls[0][1]).toBe(mockedBrazeCards[0]);
        expect($trackUserEngagementCardEvent.mock.calls[1][0]).toBe('impression');
        expect($trackUserEngagementCardEvent.mock.calls[1][1]).toBe(mockedBrazeCards[1]);
      });

      it('logs card click on card click event', () => {
        $trackUserEngagementCardEvent.mockClear();
        const wrapper = mount(EMainFooterVisual, options);
        const card = wrapper.find(byTestId(`main-footer-card-${mockedBrazeCards[0].id}`));

        card.vm.$emit('click');

        expect($trackUserEngagementCardEvent).toHaveBeenCalledTimes(3);
        expect($trackUserEngagementCardEvent).toHaveBeenCalledWith('click', mockedBrazeCards[0]);
      });
    });
  });
});
