import { defineStore } from 'pinia';

import { MOCKED_ADMARKETPLACE, MOCKED_DEFAULT } from '../../constants.js';
import { mockAdMarketplaceResult, mockResults } from '../../mocks/autocomplete-results.js';

const isExpectedError = (error) => {
  if (!error || !error.name) {
    return false;
  }

  // AbortErrors are expected when a request is cancelled and
  // this TypeError occurs on Safari / Apple devices when a fetch is aborted
  if ((error.name === 'AbortError') ||
    (error.name === 'TypeError' && error.message === 'Load failed')) {
    return true;
  }

  return false;
};

export const useAutocompleteStore = defineStore('autocomplete', {
  state: () => ({
    // contains the autocomplete suggestions (only strings)
    suggestions: [],
    // the contextData array always has the same length and order as the suggestions array.
    // it contains additional data for each autocomplete suggestion item
    // (e.g. description, imageUrl, impressionUrl - provided by Searchturbo or adMarketplace).
    // information can be combined by using the same index in both arrays.
    contextData: [],
    // Set of impression URLs for which an impression has already been sent
    // so that we don't send duplicate impressions
    sentImpressions: new Set(),
    selectedIndex: -1,
    cache: {},
    abortController: null,
    // AI suggestion data when AI item is selected
    aiSuggestionData: null,
  }),
  getters: {
    isCached: (state) => (query) => state.cache[query]?.suggestions?.length > 0,
    wasImpressionAlreadySent: (state) => (impressionUrl) => state.sentImpressions.has(impressionUrl),
    selectedSuggestion(state) {
      if (state.selectedIndex < 0) {
        return null;
      }
      // If AI suggestion data is set, set as it as the selected suggestion
      if (state.aiSuggestionData) {
        return {
          type: state.aiSuggestionData.type,
          url: state.aiSuggestionData.url,
          title: state.aiSuggestionData.title,
        };
      }
      // Otherwise, return regular suggestion data
      const query = state.suggestions[state.selectedIndex];
      const contextData = state.contextData[state.selectedIndex];

      return { q: query, ...contextData };
    },
  },
  actions: {
    async fetchResults(autocompleteUrl, params, signal) {
      const url = `${autocompleteUrl}/?${new URLSearchParams(params)}`;

      const options = {
        method: 'GET',
        credentials: 'include',
        signal,
      };

      try {
        const response = await fetch(url, options);

        return response.ok ? await response.json() : { suggestions: [], contextData: [] };
      } catch (error) {
        // don't throw on certain errors that are expected
        if (isExpectedError(error)) {
          return { suggestions: [], contextData: [] };
        }
        throw error;
      }
    },
    async getSuggestions(autocompleteUrl, params, mocked) {
      if (mocked) {
        switch (mocked) {
          case MOCKED_ADMARKETPLACE:
            this.suggestions = mockAdMarketplaceResult.suggestions;
            this.contextData = mockAdMarketplaceResult.contextData;
            break;
          case MOCKED_DEFAULT:
            this.suggestions = mockResults.suggestions;
            this.contextData = mockResults.contextData;
            break;
        }
        return;
      }

      if (!autocompleteUrl) {
        throw new Error('No autocomplete URL provided');
      }

      // cancel previous request if still pending
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null; // Clear immediately after abort
      }

      const { q: query } = params;

      if (!query) {
        this.clearSuggestions();
        return;
      }

      // if the user has already searched for this query before
      // we return the data from the cache instead of firing another request
      if (this.isCached(query)) {
        this.suggestions = this.cache[query].suggestions;
        this.contextData = this.cache[query].contextData;
      } else {
        // create new abort controller for this request
        this.abortController = new AbortController();
        const currentSignal = this.abortController.signal; // Capture signal reference

        // fetch suggestions via API
        const { suggestions, contextData } = await this.fetchResults(
          autocompleteUrl,
          params,
          currentSignal, // Use captured signal
        );

        // Clean up abort controller after request completes
        this.abortController = null;

        this.suggestions = suggestions;
        this.contextData = contextData;

        // setting the cache for this query term only if there are suggestions
        if (suggestions.length > 0) {
          this.cache[query] = {
            suggestions,
            contextData,
          };
        }
      }
    },
    clearSuggestions() {
      this.selectedIndex = -1;
      this.suggestions = [];
      this.contextData = [];
      this.aiSuggestionData = null;
    },
    setAiSuggestion(aiData) {
      // Ensure we store a completely plain object
      this.aiSuggestionData = aiData;
    },
    clearAiSuggestion() {
      this.aiSuggestionData = null;
    },
    setSentImpression(impressionUrl) {
      if (!this.wasImpressionAlreadySent(impressionUrl)) {
        this.sentImpressions.add(impressionUrl);
      }
    },
  },
});
