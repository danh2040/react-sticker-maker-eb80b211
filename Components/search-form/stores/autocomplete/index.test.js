import { createTestingPinia } from '@pinia/testing';
import createFetchMock from 'vitest-fetch-mock';

import { MOCKED_ADMARKETPLACE, MOCKED_DEFAULT } from '../../constants.js';
import {
  mockAdMarketplaceResult,
  mockFetchResponse,
  mockResults,
} from '../../mocks/autocomplete-results.js';
import { useAutocompleteStore } from './index.js';

const autocompleteUrl = 'https://ac.ecosia.org';
const impressionBaseUrl = 'https://ac.ecosia.org/v1/autocomplete-admarketplace/trackImpression';
const impressionUrl1 = `${impressionBaseUrl}/de/1`;
const impressionUrl2 = `${impressionBaseUrl}/de/2`;

const fetchMock = createFetchMock(vi);

describe('useAutocompleteStore', () => {
  const autocompleteStore = useAutocompleteStore(createTestingPinia({ stubActions: false }));

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    autocompleteStore.$reset();
  });

  describe('Actions', () => {
    describe('getSuggestions', () => {
      const fetchResultsSpy = vi.spyOn(autocompleteStore, 'fetchResults');

      afterEach(() => {
        fetchResultsSpy.mockClear();
      });

      it('should clear suggestions if query is empty', () => {
        const clearSuggestionsSpy = vi.spyOn(autocompleteStore, 'clearSuggestions');
        autocompleteStore.$patch({
          suggestions: mockResults.suggestions,
        });

        autocompleteStore.getSuggestions(autocompleteUrl, { q: '', limit: 10 });

        expect(fetchResultsSpy).not.toHaveBeenCalled();
        expect(clearSuggestionsSpy).toHaveBeenCalledTimes(1);
        expect(autocompleteStore.suggestions).toEqual([]);
        expect(autocompleteStore.contextData).toEqual([]);
        expect(autocompleteStore.selectedIndex).toEqual(-1);
      });

      it('should return suggestions from cache if query is in cache', () => {
        autocompleteStore.$patch({
          cache: {
            berlin: mockResults,
          },
        });

        autocompleteStore.getSuggestions(autocompleteUrl, { q: 'berlin', limit: 10 });

        expect(autocompleteStore.suggestions).toEqual(mockResults.suggestions);
        expect(autocompleteStore.contextData).toEqual(mockResults.contextData);
        expect(fetchResultsSpy).not.toHaveBeenCalled();
      });

      it('should fetch suggestions via API if query is not in cache', async () => {
        fetchMock.mockResponse(JSON.stringify(mockFetchResponse));

        await autocompleteStore.getSuggestions(autocompleteUrl, { q: 'berlin', limit: 10 });

        expect(fetchResultsSpy).toHaveBeenCalledTimes(1);
        expect(fetchResultsSpy).toHaveBeenCalledWith(
          autocompleteUrl,
          { q: 'berlin', limit: 10 },
          new AbortController().signal,
        );
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
          `${autocompleteUrl}/?q=berlin&limit=10`,
          {
            method: 'GET',
            credentials: 'include',
            signal: expect.any(AbortSignal),
          },
        );
        expect(autocompleteStore.suggestions).toEqual(mockFetchResponse.suggestions);
        expect(autocompleteStore.contextData).toEqual(mockFetchResponse.contextData);
      });

      it('returns empty data if API returns non-ok response', async () => {
        autocompleteStore.$patch({
          suggestions: mockResults.suggestions,
          contextData: mockResults.contextData,
        });
        fetchMock.mockResponse(JSON.stringify({}), { status: 503, statusText: 'Service Unavailable' });

        expect(autocompleteStore.suggestions.length).toBeGreaterThan(0);
        expect(autocompleteStore.contextData.length).toBeGreaterThan(0);

        await autocompleteStore.getSuggestions(autocompleteUrl, { q: 'berlin', limit: 10 });

        expect(fetchResultsSpy).toHaveBeenCalledTimes(1);
        expect(fetchResultsSpy).toHaveBeenCalledWith(
          autocompleteUrl,
          { q: 'berlin', limit: 10 },
          new AbortController().signal,
        );
        expect(autocompleteStore.suggestions).toEqual([]);
        expect(autocompleteStore.contextData).toEqual([]);
      });

      it('throws error if fetch via API fails', async () => {
        fetchMock.mockReject(new Error('Network error'));

        await expect(autocompleteStore.getSuggestions(
          autocompleteUrl,
          { q: 'berlin', limit: 10 },
        )).rejects.toThrow('Network error');

        expect(fetchResultsSpy).toHaveBeenCalledTimes(1);
        expect(fetchResultsSpy).toHaveBeenCalledWith(
          autocompleteUrl,
          { q: 'berlin', limit: 10 },
          new AbortController().signal,
        );
        expect(autocompleteStore.suggestions).toEqual([]);
        expect(autocompleteStore.contextData).toEqual([]);
      });

      it('throws error if no autocomplete URL is provided', async () => {
        await expect(autocompleteStore.getSuggestions(
          '',
          { q: 'berlin', limit: 10 },
        )).rejects.toThrow('No autocomplete URL provided');
      });

      describe('TypeError and AbortError handling', () => {
        it('returns empty data on AbortError without throwing', async () => {
          fetchMock.mockRejectOnce(() => {
            const error = new Error('The user aborted a request.');
            error.name = 'AbortError';
            throw error;
          });

          await autocompleteStore.getSuggestions(autocompleteUrl, { q: 'berlin', limit: 10 });

          expect(fetchResultsSpy).toHaveBeenCalledTimes(1);
          expect(autocompleteStore.suggestions).toEqual([]);
          expect(autocompleteStore.contextData).toEqual([]);
        });

        it('returns empty data on "TypeError: Load failed" without throwing', async () => {
          fetchMock.mockRejectOnce(() => {
            const error = new Error('Load failed');
            error.name = 'TypeError';
            throw error;
          });

          await autocompleteStore.getSuggestions(autocompleteUrl, { q: 'berlin', limit: 10 });

          expect(fetchResultsSpy).toHaveBeenCalledTimes(1);
          expect(autocompleteStore.suggestions).toEqual([]);
          expect(autocompleteStore.contextData).toEqual([]);
        });

        it('throws on "TypeError" if not "Load failed"', async () => {
          fetchMock.mockRejectOnce(() => {
            const error = new Error('Failed to fetch');
            error.name = 'TypeError';
            throw error;
          });

          await expect(autocompleteStore.getSuggestions(
            autocompleteUrl,
            { q: 'berlin', limit: 10 },
          )).rejects.toThrow('Failed to fetch');

          expect(fetchResultsSpy).toHaveBeenCalledTimes(1);
        });

        it('throws other types of errors', async () => {
          fetchMock.mockRejectOnce(() => {
            const error = new Error('Some other error');
            error.name = 'SomeOtherError';
            throw error;
          });

          await expect(autocompleteStore.getSuggestions(
            autocompleteUrl,
            { q: 'berlin', limit: 10 },
          )).rejects.toThrow('Some other error');

          expect(fetchResultsSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('mocked results', () => {
        it('does not mock results if no mocked param is given', async () => {
          fetchMock.mockResponse(JSON.stringify({
            suggestions: [],
            contextData: [],
          }));

          await autocompleteStore.getSuggestions(autocompleteUrl, { q: 'berlin', limit: 10 });

          expect(fetchResultsSpy).toHaveBeenCalled();
          expect(autocompleteStore.suggestions).toEqual([]);
          expect(autocompleteStore.contextData).toEqual([]);
        });

        it('should return mocked default results', async () => {
          await autocompleteStore.getSuggestions(autocompleteUrl, { q: 'berlin', limit: 10 }, MOCKED_DEFAULT);

          expect(fetchResultsSpy).not.toHaveBeenCalled();
          expect(autocompleteStore.suggestions).toEqual(mockResults.suggestions);
          expect(autocompleteStore.contextData).toEqual(mockResults.contextData);
        });

        it('should return mocked ad marketplace results', async () => {
          await autocompleteStore.getSuggestions(autocompleteUrl, { q: 'berlin', limit: 10 }, MOCKED_ADMARKETPLACE);

          expect(fetchResultsSpy).not.toHaveBeenCalled();
          expect(autocompleteStore.suggestions).toEqual(mockAdMarketplaceResult.suggestions);
          expect(autocompleteStore.contextData).toEqual(mockAdMarketplaceResult.contextData);
        });
      });
    });

    describe('setSentImpression', () => {
      it('should add impression URL to sentImpressions if not already present', () => {
        expect(autocompleteStore.wasImpressionAlreadySent(impressionUrl1)).toBeFalsy();
        autocompleteStore.setSentImpression(impressionUrl1);
        expect(autocompleteStore.wasImpressionAlreadySent(impressionUrl1)).toBeTruthy();
        expect(autocompleteStore.sentImpressions.has(impressionUrl1)).toBe(true);
      });

      it('should not add duplicate impression URLs', () => {
        autocompleteStore.setSentImpression(impressionUrl1);
        expect(autocompleteStore.sentImpressions.size).toBe(1);

        autocompleteStore.setSentImpression(impressionUrl1);
        expect(autocompleteStore.sentImpressions.size).toBe(1);
      });
    });
  });

  describe('Getters', () => {
    it('selectedSuggestion: contains current selection', () => {
      autocompleteStore.$patch({
        ...mockResults,
        selectedIndex: 1,
      });

      expect(autocompleteStore.selectedSuggestion).toEqual({
        q: mockResults.suggestions[1],
        ...mockResults.contextData[1],
      });
    });

    describe('wasImpressionAlreadySent', () => {
      it('should return true if impression URL is in sentImpressions', () => {
        autocompleteStore.$patch({
          sentImpressions: new Set([impressionUrl1]),
        });

        expect(autocompleteStore.wasImpressionAlreadySent(impressionUrl1)).toBeTruthy();
      });

      it('should return false if impression URL is not in sentImpressions', () => {
        autocompleteStore.$patch({
          sentImpressions: new Set([impressionUrl1]),
        });

        expect(autocompleteStore.wasImpressionAlreadySent(impressionUrl2)).toBeFalsy();
      });
    });

    describe('isCached', () => {
      it('should return true if query is in cache', () => {
        autocompleteStore.$patch({
          cache: {
            berlin: mockResults,
          },
        });

        expect(autocompleteStore.isCached('berlin')).toBeTruthy();
      });

      it('should return false if query is not in cache', () => {
        autocompleteStore.$patch({
          cache: {
            berlin: mockResults,
          },
        });

        expect(autocompleteStore.isCached('berlin wall')).toBeFalsy();
      });
    });
  });
});
