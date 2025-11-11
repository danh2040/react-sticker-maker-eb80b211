import VueRouter from 'vue-router';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import createFetchMock from 'vitest-fetch-mock';

import { mockMatchMedia } from '@ecosia/common-vue2/test-utils/mocks/index.js';

import debounce from '@ecosia/js-utils/debounce.js';

import {
  adMarketplaceExperiment,
  adMarketplaceGhostPhase,
  aiSearchAutocomplete,
  aiSearchMvp,
  autocompleteDebounceDelayExp,
  system1,
} from '@ecosia/constants/feature-flags.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import {
  AUTOCOMPLETE_DEBOUNCE_DELAY,
  AUTOCOMPLETE_DEBOUNCE_DELAY_SHORT,
  MAX_SUGGESTIONS_AI_DESKTOP,
  MAX_SUGGESTIONS_AI_MOBILE,
  MAX_SUGGESTIONS_DESKTOP,
  MAX_SUGGESTIONS_MOBILE } from './constants.js';
import ESearchForm from './index.vue';
import { mockResults } from './mocks/autocomplete-results.js';
import { useAutocompleteStore } from './stores/autocomplete/index.js';
import ESuggestionList from './suggestion-list.vue';

vi.useFakeTimers();
vi.mock('@ecosia/js-utils/debounce.js', () => ({
  default: vi.fn((fn) => fn),
}));

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
localVue.use(VueRouter);

const testQuery = 'TEST_QUERY';
const router = new VueRouter({ mode: 'history' });
router.push({
  path: '/search',
  query: { q: testQuery },
  hash: '',
});

const propsData = {
  action: 'http://www.test.de',
  autocompleteUrl: 'http://www.test.de',
  variant: 'medium',
};

const pinia = createTestingPinia({
  stubActions: false,
  initialState: {
    user: {
      autoSuggest: 1,
    },
  },
});

const options = {
  attachTo: document.body,
  localVue,
  router,
  propsData,
  pinia,
};

const submit = vi.fn();
window.HTMLFormElement.prototype.submit = submit;

const fetchMock = createFetchMock(vi);

describe('ESearchForm', () => {
  const unleashStore = useUnleashStore(pinia);
  const userStore = useUserStore(pinia);
  const autocompleteStore = useAutocompleteStore(pinia);

  beforeAll(() => {
    fetchMock.enableMocks();
    vi.useFakeTimers();
    window.matchMedia = mockMatchMedia;
  });

  afterAll(() => {
    window.matchMedia = undefined;
    document.body.replaceChildren([]);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockResponse(JSON.stringify({
      suggestions: [],
      contextData: [],
    }, { status: 200, statusText: 'OK' }));
  });

  afterEach(() => {
    vi.runAllTimers();
    userStore.$reset();
    autocompleteStore.$reset();
    unleashStore.$reset();
  });

  it('renders and is visible', () => {
    const wrapper = shallowMount(ESearchForm, options);
    expect(wrapper.element).toHaveHtmlTag('form');
    expect(wrapper).toBeVisible();
  });

  describe('With autoSuggest is 1', () => {
    it('renders suggestions list when autoSuggest is enabled', async () => {
      userStore.$patch({ autoSuggest: 1 });
      const wrapper = shallowMount(ESearchForm, options);
      expect(wrapper.find('.search-form__suggestions').exists()).toBe(true);
    });

    it('tracks item usage on submit', async () => {
      const wrapper = shallowMount(ESearchForm, options);
      const trackSpy = vi.spyOn(wrapper.vm, 'trackSuggestionUsage');
      const form = wrapper.find('form');
      await form.trigger('submit');
      expect(trackSpy).toHaveBeenCalled();
    });

    describe('experiment: debounce delay', () => {
      it('uses regular delay when experiment is disabled', async () => {
        unleashStore.setFeatureToggles({
          [autocompleteDebounceDelayExp.flag]: {
            value: autocompleteDebounceDelayExp.disabled,
          },
        });

        await mount(ESearchForm, options);
        expect(debounce).toHaveBeenCalledWith(
          expect.any(Function),
          AUTOCOMPLETE_DEBOUNCE_DELAY,
        );
      });

      it('uses short delay when experiment is enabled', async () => {
        unleashStore.setFeatureToggles({
          [autocompleteDebounceDelayExp.flag]: {
            value: autocompleteDebounceDelayExp.enabled,
          },
        });

        await mount(ESearchForm, options);
        expect(debounce).toHaveBeenCalledWith(
          expect.any(Function),
          AUTOCOMPLETE_DEBOUNCE_DELAY_SHORT,
        );
      });
    });

    it.each([
      ['desktop', MAX_SUGGESTIONS_DESKTOP],
      ['mobile', MAX_SUGGESTIONS_MOBILE],
    ])('on "%s", requests "%s" suggestions based on breakpoint limit', (breakpoint, limit) => {
      const wrapper = mount(ESearchForm, options);
      wrapper.setData({
        isDesktopUp: breakpoint === 'desktop',
        inputText: 'berlin',
      });

      const mockQuery = 'berlin';
      const defaultMarket = 'en-us';

      wrapper.find(byTestId('search-form-input')).setValue(mockQuery);

      expect(autocompleteStore.getSuggestions).toHaveBeenCalledTimes(1);
      expect(autocompleteStore.getSuggestions).toHaveBeenCalledWith(
        propsData.autocompleteUrl,
        {
          [adMarketplaceExperiment.flag]: adMarketplaceExperiment.disabled,
          [adMarketplaceGhostPhase.flag]: adMarketplaceGhostPhase.disabled,
          [system1.flag]: system1.disabled,
          q: mockQuery,
          mkt: defaultMarket,
          limit,
        },
        false,
      );
    });
  });

  describe('With autoSuggest is 0', () => {
    it('does not render suggestions list when autoSuggest is disabled', async () => {
      userStore.$patch({ autoSuggest: 0 });
      const wrapper = shallowMount(ESearchForm, options);
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.search-form__suggestions').exists()).toBe(false);
    });
  });

  it('renders default inputs', () => {
    const wrapper = shallowMount(ESearchForm, options);
    const input = wrapper.find(byTestId('search-form-input'));
    expect(input.attributes('required')).toBe('required');
    expect(input.text()).toBe('');
  });

  it('renders params to preserve on new search', () => {
    const params = {
      canary: true,
      mocked: 'abc',
      tt: 'ecosia',
      tts: 'ecosia_apple',
      addon: 'chrome',
      addonversion: '5.0.0',
      sfn: true,
      sfs: 'y',
    };
    const hashParams = new URLSearchParams({ extraneous: 'true' });
    router.push({
      path: '/search',
      query: {
        q: testQuery,
        ...params,
        extraneous: 'abc',
      },
      hash: `#${hashParams}`,
    });
    const wrapper = shallowMount(ESearchForm, options);
    const action = wrapper.attributes('action');
    Object.entries(params).forEach(([key, value]) => {
      const input = wrapper.find(byTestId(`search-form-param-${key}`));
      const attributes = input.attributes();
      expect(attributes.type).toBe('hidden');
      expect(attributes.name).toBe(key);
      expect(attributes.value).toBe(String(value));
    });
    expect(wrapper.find(byTestId('search-form-param-extraneous')).exists()).toBe(false);
    expect(action).not.toEqual(expect.stringContaining('extraneous=true'));
  });

  it('renders hidden inputs with hidden-inputs', () => {
    const hiddenInputs = {
      hidden1: 'value1',
      hidden2: 'value2',
    };
    const wrapper = shallowMount(ESearchForm, {
      ...options,
      propsData: {
        ...options.propsData,
        hiddenInputs,
      },
    });

    Object.entries(hiddenInputs).forEach(([key, value]) => {
      const input = wrapper.find(byTestId(`search-form-param-${key}`));
      const attributes = input.attributes();
      expect(attributes.type).toBe('hidden');
      expect(attributes.name).toBe(key);
      expect(attributes.value).toBe(String(value));
    });
  });

  it('emits event when search input is focused', async () => {
    const wrapper = shallowMount(ESearchForm, options);
    const input = wrapper.find(byTestId('search-form-input'));
    await input.trigger('focus');
    expect(wrapper.emitted('input-focused')).toBeTruthy();
  });

  it('sets internals on input value update', () => {
    const value = 'test';
    const wrapper = shallowMount(ESearchForm, options);
    wrapper.find(byTestId('search-form-input')).setValue(value);
    expect(wrapper.vm.viewInputText).toEqual(value);
    expect(wrapper.vm.inputText).toEqual(value);
  });

  it('toggles autocomplete suggestions on focus', async () => {
    userStore.$patch({ autoSuggest: 1 });
    const wrapper = shallowMount(ESearchForm, options);
    const input = wrapper.find(byTestId('search-form-input'));
    await input.trigger('focus');
    expect(autocompleteStore.getSuggestions).toHaveBeenCalledTimes(1);
    await input.trigger('blur');
    expect(autocompleteStore.clearSuggestions).toHaveBeenCalledTimes(1);
  });

  it.each([
    { data: { key: 'ArrowUp' }, initial: 3, expected: 2 },
    { data: { key: 'ArrowDown' }, initial: 4, expected: 5 },
    { data: { key: 'Escape' }, initial: 2, expected: -1 },
  ])('changes selected suggestion index from $initial to $expected on $data.key', ({ data, initial, expected }) => {
    autocompleteStore.$patch({ suggestions: mockResults.suggestions, selectedIndex: initial });
    const wrapper = shallowMount(ESearchForm, options);
    wrapper.find(byTestId('search-form-input')).trigger('keydown', data);
    expect(autocompleteStore.selectedIndex).toBe(expected);
  });

  it('submits form on when suggestion item is clicked', async () => {
    const wrapper = shallowMount(ESearchForm, options);
    wrapper.findComponent(ESuggestionList).vm.$emit('suggestionClicked');
    await wrapper.vm.$nextTick();
    expect(submit).toHaveBeenCalled();
  });

  it('renders with a pre-filled query if prefill-query is enabled', () => {
    const wrapper = shallowMount(ESearchForm, {
      ...options,
      propsData: {
        ...propsData,
        prefillQuery: true,
      },
    });
    const input = wrapper.find(byTestId('search-form-input'));
    expect(input.element.value).toBe(testQuery);
  });

  describe('Autofocus', () => {
    it('does not autofocus the input field if prop is false', () => {
      const wrapper = mount(ESearchForm, {
        ...options,
        propsData: { ...propsData, hasAutoFocus: false },
      });
      const input = wrapper.find(byTestId('search-form-input'));
      expect(input.element.autofocus).toBe(false);
    });

    it('autofocuses the input field if prop is true and consent is given', () => {
      userStore.$patch({ consentGiven: true });
      const wrapper = mount(ESearchForm, {
        ...options,
        propsData: { ...propsData, hasAutoFocus: true },
      });
      const input = wrapper.find(byTestId('search-form-input'));
      expect(input.element.autofocus).toBe(true);
    });

    it('does not autofocus the input field if prop is true and no consent is given', () => {
      userStore.$patch({ consentGiven: false });
      const wrapper = mount(ESearchForm, {
        ...options,
        propsData: { ...propsData, hasAutoFocus: true },
      });
      const input = wrapper.find(byTestId('search-form-input'));
      expect(input.element.autofocus).toBe(false);
    });
  });

  describe('Reset action', () => {
    it('resets input value and focuses it', async () => {
      const value = 'test';
      const wrapper = mount(ESearchForm, options);
      const input = wrapper.find(byTestId('search-form-input'));
      await input.setValue(value);
      input.element.focus = vi.fn();
      await wrapper.find(byTestId('search-form-reset')).trigger('click');

      expect(wrapper.vm.viewInputText).toBe('');
      expect(wrapper.vm.inputText).toBe('');
      expect(input.element.value).toBe('');
      expect(input.element.focus).toHaveBeenCalled();
      wrapper.destroy();
    });

    it('resets input value if value is prefilled with query', async () => {
      process.client = true;
      const wrapper = mount(ESearchForm, {
        ...options,
        propsData: { ...propsData, prefillQuery: true },
      });
      const input = wrapper.find(byTestId('search-form-input'));
      await wrapper.find(byTestId('search-form-reset')).trigger('click');

      expect(wrapper.vm.viewInputText).toBe('');
      expect(wrapper.vm.inputText).toBe('');
      expect(input.element.value).toBe('');
      delete process.client;
    });
  });

  describe('Mobile back button', () => {
    it('resets the input text to original query', async () => {
      const wrapper = mount(ESearchForm, {
        ...options,
        propsData: {
          ...propsData,
          prefillQuery: true,
        },
      });
      wrapper.vm.isTabletUp = false;

      const input = wrapper.find(byTestId('search-form-input'));
      expect(input.element.value).toBe(testQuery);

      input.trigger('focus');
      await wrapper.vm.$nextTick();
      input.setValue('something else');
      const backButton = wrapper.find(byTestId('search-form-back'));
      backButton.trigger('click');
      await wrapper.vm.$nextTick();
      expect(input.element.value).toBe(testQuery);
    });
  });

  it('should have required aria-label by default to pass accessibility', () => {
    const wrapper = shallowMount(ESearchForm, options);
    const searchField = wrapper.find(byTestId('search-form-search-field'));
    const searchFieldSearchInput = searchField.find('input[type="search"]');
    expect(searchFieldSearchInput.attributes('role')).toEqual('combobox');
    expect(searchFieldSearchInput.attributes('aria-autocomplete')).toEqual('both');
    expect(searchFieldSearchInput.attributes('aria-controls')).toEqual('search-form-suggestion-list');
    expect(searchFieldSearchInput.attributes('aria-expanded')).toEqual('false');
    expect(searchFieldSearchInput.attributes('aria-activedescendant')).not.toBeDefined();
  });

  it('search field should have aria-expanded=true when suggestion list is visible', async () => {
    const wrapper = shallowMount(ESearchForm, options);
    const searchField = wrapper.find(byTestId('search-form-search-field'));
    const searchFieldSearchInput = searchField.find('input[type="search"]');

    // should be 'false' by default
    expect(searchFieldSearchInput.attributes('aria-expanded')).toEqual('false');

    autocompleteStore.$patch({ suggestions: mockResults.suggestions });

    // wait for the next tick to update the DOM
    await wrapper.vm.$nextTick();

    // and become 'true' when suggestions are visible
    expect(searchFieldSearchInput.attributes('aria-expanded')).toEqual('true');
  });

  it('search field should have aria-activedescendant when one of the options is selected', () => {
    autocompleteStore.$patch({ suggestions: mockResults.suggestions, selectedIndex: 1 });
    const selectedOptionId = 'search-form-suggestion-option-1';
    const wrapper = shallowMount(ESearchForm, options);
    const searchField = wrapper.find(byTestId('search-form-search-field'));
    const searchFieldSearchInput = searchField.find('input[type="search"]');
    expect(searchFieldSearchInput.attributes('aria-activedescendant')).toEqual(selectedOptionId);
  });

  describe('AI entry point', () => {
    beforeEach(() => {
      unleashStore.setFeatureToggles({
        [aiSearchMvp.flag]: {
          value: aiSearchMvp.enabled,
        },
        [aiSearchAutocomplete.flag]: {
          value: aiSearchAutocomplete.enabled,
        },
      });
    });

    it.each([
      ['desktop', MAX_SUGGESTIONS_AI_DESKTOP],
      ['mobile', MAX_SUGGESTIONS_AI_MOBILE],
    ])('on "%s", requests "%s" suggestions based on breakpoint limit', (breakpoint, limit) => {
      const wrapper = mount(ESearchForm, options);
      wrapper.setData({
        isDesktopUp: breakpoint === 'desktop',
        inputText: 'berlin',
      });

      const mockQuery = 'berlin';
      const defaultMarket = 'en-us';

      wrapper.find(byTestId('search-form-input')).setValue(mockQuery);

      expect(autocompleteStore.getSuggestions).toHaveBeenCalledTimes(1);
      expect(autocompleteStore.getSuggestions).toHaveBeenCalledWith(
        propsData.autocompleteUrl,
        {
          [adMarketplaceExperiment.flag]: adMarketplaceExperiment.disabled,
          [adMarketplaceGhostPhase.flag]: adMarketplaceGhostPhase.disabled,
          [system1.flag]: system1.disabled,
          q: mockQuery,
          mkt: defaultMarket,
          limit,
        },
        false,
      );
    });

    it('toggles autocomplete suggestions on focus', async () => {
      userStore.$patch({ autoSuggest: 1 });
      const wrapper = shallowMount(ESearchForm, options);
      const input = wrapper.find(byTestId('search-form-input'));
      await input.trigger('focus');
      expect(autocompleteStore.getSuggestions).toHaveBeenCalledTimes(1);
      await input.trigger('blur');
      expect(autocompleteStore.clearSuggestions).toHaveBeenCalledTimes(1);
    });

    it.each([
      { data: { key: 'ArrowUp' }, initial: 3, expected: 2 },
      { data: { key: 'ArrowDown' }, initial: 4, expected: 5 },
      { data: { key: 'Escape' }, initial: 2, expected: -1 },
    ])('changes selected suggestion index from $initial to $expected on $data.key', ({ data, initial, expected }) => {
      autocompleteStore.$patch({ suggestions: mockResults.suggestions, selectedIndex: initial });
      const wrapper = shallowMount(ESearchForm, options);
      wrapper.find(byTestId('search-form-input')).trigger('keydown', data);
      expect(autocompleteStore.selectedIndex).toBe(expected);
    });
  });

  describe('adMarketplace experiment', () => {
    it.each([
      { expVal: adMarketplaceExperiment.disabled, ghostPhaseVal: adMarketplaceGhostPhase.disabled },
      { expVal: adMarketplaceExperiment.enabledValues[0], ghostPhaseVal: adMarketplaceGhostPhase.disabled },
      { expVal: adMarketplaceExperiment.enabledValues[1], ghostPhaseVal: adMarketplaceGhostPhase.disabled },
      { expVal: adMarketplaceExperiment.disabled, ghostPhaseVal: adMarketplaceGhostPhase.enabled },
      { expVal: null, ghostPhaseVal: null },
    ])('attaches adMarketplace experiment values to autocomplete request, %p', ({ expVal, ghostPhaseVal }) => {
      unleashStore.setFeatureToggles({
        [adMarketplaceExperiment.flag]: {
          value: expVal,
        },
        [adMarketplaceGhostPhase.flag]: {
          value: ghostPhaseVal,
        },
      });
      const wrapper = mount(ESearchForm, options);
      const mockQuery = 'berlin';
      const defaultMarket = 'en-us';
      const defaultLimit = MAX_SUGGESTIONS_MOBILE;

      wrapper.find(byTestId('search-form-input')).setValue(mockQuery);

      expect(autocompleteStore.getSuggestions).toHaveBeenCalledTimes(1);
      expect(autocompleteStore.getSuggestions).toHaveBeenCalledWith(
        propsData.autocompleteUrl,
        {
          [adMarketplaceExperiment.flag]: expVal || 'disabled',
          [adMarketplaceGhostPhase.flag]: ghostPhaseVal || 'disabled',
          [system1.flag]: system1.disabled,
          q: mockQuery,
          mkt: defaultMarket,
          limit: defaultLimit,
        },
        false,
      );
    });
  });

  describe('Search button click tracking', () => {
    it('emits search-icon-click event when onSearchIconClick is triggered by mouse or touch click', () => {
      const wrapper = mount(ESearchForm, options);
      const event = { detail: 1 };

      wrapper.vm.onSearchIconClick(event);

      expect(wrapper.emitted('search-icon-click')).toBeTruthy();
    });

    it('does not emit search-icon-click event when onSearchIconClick is triggered by keyboard click ', () => {
      const wrapper = mount(ESearchForm, options);
      const event = { detail: 0 };

      wrapper.vm.onSearchIconClick(event);

      expect(wrapper.emitted('search-icon-click')).not.toBeTruthy();
    });
  });
});
