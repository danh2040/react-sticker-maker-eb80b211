export const NOTIFICATION_LIMIT = 3;

export const getNotificationsUrl = ({
  locale,
  market,
  browser,
  apiUrl,
}) => {
  const url = new URL(apiUrl);
  url.pathname = '/v1/notifications';
  url.searchParams.set('language', locale);
  url.searchParams.set('limit', NOTIFICATION_LIMIT);

  if (market) {
    url.searchParams.set('market', market);
  }

  if (browser) {
    url.searchParams.set('browser', browser);
  }

  return url.toString();
};

export const getNotifications = async ({
  locale,
  market,
  browser,
  apiUrl,
}) => {
  const options = { credentials: 'include' };

  const response = await fetch(getNotificationsUrl({
    locale,
    market,
    browser,
    apiUrl,
  }), options);

  // in certain scenarios we will not receive a JSON response
  // (e.g. in branches when the API is not deployed, getting text/html instead)
  const contentType = response.headers.get('content-type');

  // as a failsafe, we return an empty array in this case
  // to avoid an error when trying to parse JSON
  if (!contentType || !contentType.includes('application/json')) {
    return [];
  }

  return response.json();
};
