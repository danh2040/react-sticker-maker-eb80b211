import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import createFetchMock from 'vitest-fetch-mock';

import { AI_SEARCH_ENTRY_POINT } from '@ecosia/constants/query-params.js';

import { AI_SEARCH_ORIGIN_PREFIX, AI_SEARCH_PATH } from './constants.js';
import { mockAdMarketplaceResult, mockResults } from './mocks/autocomplete-results.js';
import { useAutocompleteStore } from './stores/autocomplete/index.js';
import ESuggestionItem from './suggestion-item.vue';

const fetchMock = createFetchMock(vi);

const adMarketplaceURL = 'https://ac.ecosia-staging.xyz/v1/autocomplete-admarketplace';
const mockQuery = 'berlin';
const mockIndex = 0;

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({ stubActions: false });

const options = {
  propsData: {
    index: mockIndex,
    inputText: mockQuery,
    searchPath: '/searchsomething',
  },
  localVue,
  pinia,
};

describe('ESuggestionItem', () => {
  const autocompleteStore = useAutocompleteStore(pinia);

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    autocompleteStore.$patch({
      suggestions: mockResults.suggestions,
    });
  });

  afterEach(() => {
    autocompleteStore.$reset();
    fetchMock.resetMocks();
  });

  it('does not add class "selected" when index does not match selectedIndex', () => {
    // selected = false is prop default, so we don't set it explicitly
    autocompleteStore.$patch({
      selectedIndex: 1,
    });
    const wrapper = mount(ESuggestionItem, options);

    expect(wrapper.element.classList).not.toContain('selected');
  });

  it('adds class "selected" when index matches selectedIndex', () => {
    autocompleteStore.$patch({
      selectedIndex: 1,
    });

    const wrapper = mount(ESuggestionItem, {
      ...options,
      propsData: {
        ...options.propsData,
        index: 1,
      },
    });

    expect(wrapper.element.classList).toContain('selected');
  });

  it('highlights input text in suggestion, without extra spaces', async () => {
    const wrapper = mount(ESuggestionItem, options);
    const highlight = wrapper.find(byTestId('suggestion-highlight'));
    expect(highlight.element.tagName.toLowerCase()).toBe('mark');
    expect(highlight.text()).toBe(mockQuery);
    expect(highlight.element.innerHTML.length).toBe(mockQuery.length);
  });

  it('triggers search on click', async () => {
    const wrapper = mount(ESuggestionItem, options);
    await wrapper.find(byTestId('suggestion-link')).trigger('click');
    expect(wrapper.emitted('linkClicked')).toBeDefined();
  });

  it('sets new selectedIndex on focus', async () => {
    const wrapper = mount(ESuggestionItem, options);
    await wrapper.trigger('focus');
    expect(autocompleteStore.selectedIndex).toBe(mockIndex);
  });

  it('displays context data for type QUERY', () => {
    autocompleteStore.$patch({
      contextData: mockResults.contextData,
    });
    const wrapper = mount(ESuggestionItem, options);
    const description = wrapper.find(byTestId('suggestion-link-description'));
    const navigational = wrapper.find(byTestId('suggestion-item-navigational'));

    expect(description.text()).toContain('this is a test description');
    expect(navigational.element).toBeUndefined();
  });

  it('displays context data for type NAVIGATION', () => {
    autocompleteStore.$patch({
      contextData: mockResults.contextData,
    });
    autocompleteStore.$patch({
      selectedIndex: 2,
    });

    const wrapper = mount(ESuggestionItem, {
      ...options,
      propsData: {
        ...options.propsData,
        index: 2,
      },
    });
    const linkText = wrapper.find(byTestId('suggestion-link-text'));
    const navigational = wrapper.find(byTestId('suggestion-item-navigational'));

    expect(linkText.text()).toContain(mockResults.contextData[2].title);
    expect(navigational).toBeVisible();
  });

  it('does not display icon if image is present', () => {
    autocompleteStore.$patch({
      contextData: mockResults.contextData,
    });
    autocompleteStore.$patch({
      selectedIndex: 2,
    });

    const wrapper = mount(ESuggestionItem, {
      ...options,
      propsData: {
        ...options.propsData,
        index: 2,
      },
    });

    const image = wrapper.find(byTestId('suggestion-item-image'));
    const icon = wrapper.find(byTestId('suggestion-item-icon'));

    expect(icon.exists()).toBe(false);
    expect(image).toBeVisible();
  });

  it('calls trackImpression once when mounted', async () => {
    autocompleteStore.$patch({
      contextData: mockAdMarketplaceResult.contextData,
    });
    autocompleteStore.$patch({
      selectedIndex: 5,
    });

    await mount(ESuggestionItem, {
      ...options,
      propsData: {
        ...options.propsData,
        index: 5,
      },
    });

    const encodedImpressionUrl = encodeURIComponent(mockAdMarketplaceResult.contextData[5].impressionUrl);
    expect(fetchMock).toHaveBeenCalledWith(`${adMarketplaceURL}/trackImpression/?impressionUrl=${encodedImpressionUrl}`);
  });

  it('calls trackClick on link click', async () => {
    autocompleteStore.$patch({
      contextData: mockAdMarketplaceResult.contextData,
    });
    autocompleteStore.$patch({
      selectedIndex: 5,
    });

    const wrapper = await mount(ESuggestionItem, {
      ...options,
      propsData: {
        ...options.propsData,
        index: 5,
      },
    });
    await wrapper.find(byTestId('suggestion-link')).trigger('click');
    const encodedClickUrl = encodeURIComponent(mockAdMarketplaceResult.contextData[5].clickUrl);
    expect(fetchMock).toHaveBeenCalledWith(`${adMarketplaceURL}/trackClick/?clickUrl=${encodedClickUrl}`);
  });

  describe('AI Search suggestion', () => {
    const aiSearchOptions = {
      ...options,
      propsData: {
        ...options.propsData,
        isAiSuggestion: true,
      },
    };

    it('renders AI search suggestion correctly', () => {
      const wrapper = mount(ESuggestionItem, aiSearchOptions);
      const link = wrapper.find(byTestId('suggestion-link'));

      const url = new URL(link.attributes('href'));
      expect(url.pathname).toBe(AI_SEARCH_PATH);
      expect(url.searchParams.get('q')).toBe(mockQuery);
    });

    it('renders origin parameter if there is one', () => {
      aiSearchOptions.propsData.origin = 'origin';
      const wrapper = mount(ESuggestionItem, aiSearchOptions);
      const link = wrapper.find(byTestId('suggestion-link'));

      const url = new URL(link.attributes('href'));
      const expected = AI_SEARCH_ORIGIN_PREFIX.concat(aiSearchOptions.propsData.origin);
      expect(url.searchParams.get(AI_SEARCH_ENTRY_POINT)).toBe(expected);
    });

    it('does not renders origin if it is empty', () => {
      delete aiSearchOptions.propsData.origin;
      const wrapper = mount(ESuggestionItem, aiSearchOptions);
      const link = wrapper.find(byTestId('suggestion-link'));

      const url = new URL(link.attributes('href'));
      expect(url.search).not.toContain('origin=');
    });
  });
});
