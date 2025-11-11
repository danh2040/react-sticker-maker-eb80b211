import {
  createAccountSignInURL,
  createAccountSignOutURL,
  createAccountSignUpURL,
  getUnleashToggleOverridesFromURL,
} from './utils.js';

const mockConfig = {
  accountsSignInUrl: 'https://example.com/sign-in',
  accountsSignOutUrl: 'https://example.com/sign-out',
  accountsSignUpUrl: 'https://example.com/sign-up',
};

const defaultWindowLocation = window.location;
const mockSearch = vi.fn();

describe('Main nav utils', () => {
  beforeAll(() => {
    delete window.location;

    window.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(defaultWindowLocation),
        search: {
          get: mockSearch,
          configurable: true,
        },
      },
    );
  });

  beforeEach(() => {
  });

  afterAll(() => {
    // restore `window.location` to the `jsdom` `Location` object
    window.location = defaultWindowLocation;
  });

  describe('getUnleashToggleOverridesFromURL', () => {
    it ('should return empty if unleash overrides isn\'t specified', () => {
      expect(getUnleashToggleOverridesFromURL('')).toEqual('');
    });

    it ('should return valid unleash overrides', () => {
      const location = {
        href: 'https://local.ecosia.test',
        search: 'q=ecosia&features-ss-1=enabled&feature-ss-2=disabled',
      };
      expect(getUnleashToggleOverridesFromURL(location)).toEqual('feature-ss-2=disabled');
    });
  });

  describe('createAccountSignInURL', () => {
    it('creates a sign-in URL', () => {
      expect(
        createAccountSignInURL(mockConfig),
      ).toEqual(
        'https://example.com/sign-in?returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
      );
    });

    it('creates a valid sign-in URL with feature flags', () => {
      mockSearch.mockReturnValueOnce('feature-ss-1=enabled&q=11');
      expect(
        createAccountSignInURL(mockConfig),
      ).toEqual(
        'https://example.com/sign-in?feature-ss-1=enabled&returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
      );
    });
  });

  describe('createAccountSignOutURL', () => {
    it('creates a sign-out URL', () => {
      expect(
        createAccountSignOutURL(mockConfig),
      ).toEqual(
        'https://example.com/sign-out?returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
      );
    });

    it('creates a valid sign-out URL with feature flags', () => {
      mockSearch.mockReturnValueOnce('feature-ss-1=enabled&q=11');
      expect(
        createAccountSignOutURL(mockConfig),
      ).toEqual(
        'https://example.com/sign-out?feature-ss-1=enabled&returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
      );
    });
  });

  describe('createAccountSignUpURL', () => {
    it('creates a sign-up URL', () => {
      expect(
        createAccountSignUpURL(mockConfig),
      ).toEqual(
        'https://example.com/sign-up?returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
      );
    });

    it('creates a valid sign-up URL with feature flags', () => {
      mockSearch.mockReturnValueOnce('feature-ss-1=enabled');
      expect(
        createAccountSignUpURL(mockConfig),
      ).toEqual(
        'https://example.com/sign-up?feature-ss-1=enabled&returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
      );
    });
  });
});
