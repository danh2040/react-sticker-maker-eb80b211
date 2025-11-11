import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { aiSearchAutocomplete, aiSearchMvp } from '@ecosia/constants/feature-flags.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import { mockResults } from './mocks/autocomplete-results.js';
import { useAutocompleteStore } from './stores/autocomplete/index.js';
import ESuggestionList from './suggestion-list.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const propsData = {
  action: 'https://www.test.de',
  autocompleteUrl: 'https://www.test.de',
  searchPath: '/searchthis',
};

const $config = { searchUrl: 'https://example.com' };
const mocks = { $config, $route: { query: { q: 'test' } } };
const pinia = createTestingPinia({
  stubActions: false,
  initialState: {
    user: {
      autoSuggest: 1,
    },
  },
});

const options = {
  localVue,
  mocks,
  propsData,
  pinia,
};

describe('ESuggestionList', () => {
  const unleashStore = useUnleashStore(pinia);
  const autocompleteStore = useAutocompleteStore(pinia);

  afterEach(() => {
    autocompleteStore.$reset();
    vi.clearAllMocks();
  });

  it('renders but is not visible with no suggestions', async () => {
    const wrapper = mount(ESuggestionList, options);
    expect(wrapper).not.toBeVisible();
    wrapper.setProps({ inputText: 'test' });
    expect(wrapper.element.tagName.toLowerCase()).toBe('ul');
    expect(wrapper.attributes('id')).toEqual('search-form-suggestion-list');
  });

  it('renders and is visible with suggestions', () => {
    autocompleteStore.$patch({
      suggestions: mockResults.suggestions,
    });
    const wrapper = mount(ESuggestionList, options);
    expect(wrapper).toBeVisible();
  });

  it('emits suggestion click event when item link is clicked', async () => {
    autocompleteStore.$patch({
      suggestions: mockResults.suggestions,
      selectedIndex: 0,
    });
    const wrapper = mount(ESuggestionList, options);
    const itemLink = wrapper.find(byTestId('suggestion-link'));
    await itemLink.trigger('click');
    expect(wrapper.emitted('suggestionClicked')).toBeTruthy();
  });

  it('renders suggestion links with required attributes', async () => {
    autocompleteStore.$patch({
      suggestions: mockResults.suggestions,
    });
    const wrapper = mount(ESuggestionList, options);
    wrapper.setProps({ inputText: 'berlin' });

    await wrapper.vm.$nextTick();

    const links = wrapper.findAll(byTestId('suggestion-link'));
    expect(links.wrappers.every((wrp) => {
      const { tabindex, rel } = wrp.attributes();
      return tabindex === '0' && rel === 'noopener';
    })).toBe(true);
  });

  it('handles empty suggestion list', async () => {
    autocompleteStore.$patch({
      suggestions: [],
    });
    const wrapper = mount(ESuggestionList, options);
    wrapper.setProps({ inputText: 'test' });
    expect(wrapper).not.toBeVisible();
  });

  it('emits event on onFocusOut', () => {
    autocompleteStore.$patch({
      suggestions: mockResults.suggestions,
    });
    const wrapper = mount(ESuggestionList, options);
    wrapper.setProps({ inputText: 'test' });
    wrapper.vm.onFocusOut();
    expect(wrapper.emitted('focusout')).toBeTruthy();
  });

  describe('compact prop', () => {
    it.each([true, false])('passes compact prop to suggestion items', (compact) => {
      autocompleteStore.$patch({
        suggestions: mockResults.suggestions,
      });
      const wrapper = mount(ESuggestionList, {
        ...options,
        propsData: {
          ...propsData,
          compact,
        },
      });

      const suggestionItems = wrapper.findAllComponents({ name: 'ESuggestionItem' });
      suggestionItems.wrappers.forEach((item) => {
        expect(item.props('compact')).toBe(compact);
      });
    });

    it('defaults compact to false', () => {
      autocompleteStore.$patch({
        suggestions: mockResults.suggestions,
      });
      const wrapper = mount(ESuggestionList, options);

      const suggestionItems = wrapper.findAllComponents({ name: 'ESuggestionItem' });
      suggestionItems.wrappers.forEach((item) => {
        expect(item.props('compact')).toBe(false);
      });
    });
  });

  describe('AI entry point', () => {
    it('should not show AI ESuggestionItem with suggestions when aiSearchAutocomplete flag is disabled', () => {
      unleashStore.setFeatureToggles({
        [aiSearchMvp.flag]: {
          value: aiSearchMvp.enabled,
        },
      });
      autocompleteStore.$patch({
        suggestions: mockResults.suggestions,
      });
      const wrapper = mount(ESuggestionList, options);
      expect(wrapper.find(byTestId('search-form-ai-suggestion')).exists()).toBe(false);
      expect(wrapper.vm.aiItemIndex).toBe(mockResults.suggestions.length);
    });

    it('shows AI ESuggestionItem with suggestions when both feature flags are enabled', () => {
      unleashStore.setFeatureToggles({
        [aiSearchMvp.flag]: {
          value: aiSearchMvp.enabled,
        },
        [aiSearchAutocomplete.flag]: {
          value: aiSearchAutocomplete.enabled,
        },
      });
      autocompleteStore.$patch({
        suggestions: mockResults.suggestions,
      });
      const wrapper = mount(ESuggestionList, options);
      expect(wrapper.find(byTestId('search-form-ai-suggestion')).exists()).toBe(true);
      expect(wrapper.vm.aiItemIndex).toBe(mockResults.suggestions.length);
    });

    it('shows AI ESuggestionItem without suggestions when both feature flags are enabled', () => {
      unleashStore.setFeatureToggles({
        [aiSearchMvp.flag]: {
          value: aiSearchMvp.enabled,
        },
        [aiSearchAutocomplete.flag]: {
          value: aiSearchAutocomplete.enabled,
        },
      });
      autocompleteStore.$patch({
        suggestions: [],
      });
      const wrapper = mount(ESuggestionList, options);
      expect(wrapper.find(byTestId('search-form-ai-suggestion')).exists()).toBe(true);
      expect(wrapper.vm.aiItemIndex).toBe(0);
    });

    it('does not show AI ESuggestionItem when addAiEntryPoint is false', () => {
      unleashStore.setFeatureToggles({
        [aiSearchMvp.flag]: {
          value: aiSearchMvp.enabled,
        },
        [aiSearchAutocomplete.flag]: {
          value: aiSearchAutocomplete.enabled,
        },
      });
      autocompleteStore.$patch({
        suggestions: mockResults.suggestions,
      });
      const wrapper = mount(ESuggestionList, { ...options, propsData: { ...propsData, addAiEntryPoint: false } });
      expect(wrapper.find(byTestId('search-form-ai-suggestion')).exists()).toBe(false);
    });
  });
});
