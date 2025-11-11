export const isUnleashOverrideFlag = (key) => key.startsWith('feature-') && key.length > 'feature-'.length;

export const getUnleashToggleOverridesFromURL = (url) => {
  const searchParams = new URLSearchParams(url.search);
  const newSearchParams = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    if (isUnleashOverrideFlag(key)) {
      newSearchParams.set(key, value);
    }
  }

  return newSearchParams.toString();
};

const createAccountSignUpInOutURL = (url) => {
  const returnTo = encodeURIComponent(window.location.href);
  // Include the current URL overrides query string
  // this allows us to pass around all unleash flags override across all accounts request
  const overrides = getUnleashToggleOverridesFromURL(window.location);

  if (overrides.length === 0) {
    return `${url}?returnTo=${returnTo}`;
  }

  return `${url}?${overrides}&returnTo=${returnTo}`;
};

export const createAccountSignInURL = ($config) => {
  const { accountsSignInUrl } = $config;
  return createAccountSignUpInOutURL(accountsSignInUrl);
};

export const createAccountSignOutURL = ($config) => {
  const { accountsSignOutUrl } = $config;
  return createAccountSignUpInOutURL(accountsSignOutUrl);
};

export const createAccountSignUpURL = ($config) => {
  const { accountsSignUpUrl } = $config;
  return createAccountSignUpInOutURL(accountsSignUpUrl);
};
