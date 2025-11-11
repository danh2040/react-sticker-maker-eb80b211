const mockResults = {
  suggestions: [
    'berlin',
    'berlin weather',
    'berlin wikipedia',
    'berlin restaurants',
    'berlin airport',
    'berlin hotels',
  ],
  contextData: [
    {
      title: 'Berlin City',
      description: 'this is a test description',
      q: 'berlin',
      type: 'QUERY',
    },
    {
      title: 'Berlin Weather',
      q: 'berlin weather',
      type: 'QUERY',
    },
    {
      title: 'Berlin - Wikipedia',
      q: 'berlin wikipedia',
      url: 'https://en.wikipedia.org/wiki/Berlin',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/250px-Brandenburger_Tor_abends.jpg',
      type: 'NAVIGATION',
    },
    {
      title: 'Berlin Restaurants',
      q: 'berlin restaurants',
      type: 'QUERY',
    },
    {
      title: 'Berlin Airport',
      q: 'berlin airport',
      type: 'QUERY',
    },
    {
      title: 'Berlin Hotels',
      q: 'berlin hotels',
      type: 'QUERY',
    },
  ],
};

const mockFetchResponse = {
  suggestions: [
    'trees',
    'treehouse',
    'tree of life',
  ],
  contextData: [
    {
      title: 'Trees',
      q: 'trees',
      type: 'QUERY',
    },
    {
      title: 'Treehouse',
      q: 'treehouse',
      type: 'QUERY',
    },
    {
      title: 'Tree of Life',
      q: 'tree of life',
      type: 'QUERY',
    },
  ],
};

const mockAdMarketplaceResult = {
  query: 'nike',
  suggestions: [
    'nike',
    'nike schuhe',
    'nike shox',
    'nike air force 1',
    'nike air max',
    'Nike Offizielle Website',
    'StubHub.com - Official Site',
  ],
  contextData: [
    {
      type: 'QUERY',
      title: 'nike',
      provider: 'Bing',
    },
    {
      type: 'QUERY',
      title: 'nike schuhe',
      provider: 'Bing',
    },
    {
      type: 'QUERY',
      title: 'nike shox',
      provider: 'Bing',
    },
    {
      type: 'QUERY',
      title: 'nike air force 1',
      provider: 'Bing',
    },
    {
      type: 'QUERY',
      title: 'nike air max',
      provider: 'Bing',
    },
    {
      type: 'NAVIGATION',
      title: 'Nike Offizielle Website',
      description: '',
      imageUrl: 'https://amp-asset.45tu1c0.com/assets/1065/cd9d37667fda68724c878cd222d3732c67d1ba8cfb54ace4a53ef77568b6ccd5.png',
      impressionUrl: 'https://imp.mt48.net/imp?id=7R7wxEzkiFdwxr3NJGbzfQbY4BkW1BkYfYbW4C%2Fk1p%2FW4C%2FW4pDr7RcdIG7%2B5FwqgC8Y1pLX4pxkfClWfQqZ4Qbm4tIoIGwrJr7qGmwqgCfd1pxd1pHm1BIXjFEYsEzkIG7ugF%2BvimDnHF4kjFcTGm4WHZkW5QbWfBIksGew5FwqgClnHr7wHG3vjnDuiF2zfC8d1plnx%3DXNHmEuIF%2Bk5FwqgC2r4C8nHF2uxmETIF4kiFzU5FwqgC8Y1pLX4pxkfClX1CxW1CHY4BIZJ%3Dzk5F%2BdJF7wxQkX',
      clickUrl: 'https://bridge.pdx1.admarketplace.net/ct?version=1.0.0&encp=jnEYxmwVJQkX5QbUftINI%3DwqgClnxGEkgClr4CLmfQba1pDk4Cxnx%3D8zfCbW5QbnjG3vgC8njFjvgC8nJG4kxczvI9LzftIojmwqgCfd1pxd1pHm1BIXjFEYsFwqgC8Y1pLX4pxkfClWfQqZ4Qbm4tIuxr3kgCbnxR3OJpdnHFXZIBIWj93vIpkW7n3WHmwqgCbnHr3_iF2zfC8nHr7wiF2zfC8d1plnx%3DXvIpkk4ZDY7n3Zx%3D7vIpkXfp2_7n3Zx%3DcqjnwqgClW4QDnI94WHGEqjnwqgCxrfZfnI94WiFzvIpkX1pfX7ncqxmXvIpkYfQLafC2r4plXfCqrfpqmfQDnxmXVj%3D_dJCkX7nEUEE7fgDX82C4nEw3%2F1cxrinuHF9x_im_wfqX5C9eY3we%3D4mEP2wjvxnI1jEqm4qz1CEw77C7tEQeaD%3DvDs%3DdNHnzNDGjSJ%3D3gDQ4IsEw_F9j7xZ7H1c8wfqIrxkaX3tDY2w79IYDY2n_XHG7R4l3fD94kJnDm7C7tDBDZ3tIYj%3DzZgB%2FM6QTS1Y%2FniFwQgBkX1YkX1YkX1YkX1YkX7n4WgCbUfQHWftWW5plY4CDTftWW5plYfQbT5tWT5%3D_vimDTHncQimIvJ%3DXKHmzUI9EQiGIw',
      url: 'https://www.nike.com/de/',
      provider: 'adMarketplace',
    },
    {
      type: 'NAVIGATION',
      title: 'StubHub.com - Official Site',
      description: '',
      imageUrl: 'https://amp-asset.45tu1c0.com/assets/1115/2001b76cbf569bf1ba537a56ca32cbd2ba14c07cbfcdb9232797462e1e46600c.png',
      impressionUrl: 'https://imp.mt48.net/imp?id=7R7wxEzkiFdwxr3NJGbzfQbY4BkW1BkYfYbW4Q%2FkfQ%2Fd1p%2FW4p8r7RcdIG7%2B5FwqgC8Y1pLY1pDdfQLX4CxX4pfW4tIoIGwrJr7qGmwqgCfd1CbXfpxm1tIXjFEYsEzkIG7ugG4kjF7%2FjF8nHF4kjFcTGm4WHZkW5QbWfBIksGew5FwqgClnHr7wHG3vjnDuiF2zfClWfQfnx%3DXNHmEuIF%2Bk5FwqgC2r4C8nHF2uxmETIF4kiFzU5FwqgC8Y1pLY1pDdfQLZ4QH%2B4plr4YIZJ%3Dzk5F%2BdJF7wxQkX',
      clickUrl: 'https://bridge.ric1.admarketplace.net/ct?version=1.0.0&encp=jnEYxmwVJQkX5QbUftINI%3DwqgClnxGEkgClr4CLmfQ2X4ZLkfQxnx%3D8zfCbW5QbnjG3vgC8njFjvgC8nJG4kxczvI9LzftIojmwqgCfd1CbXfpxm1tIXjFEYsFwqgC8Y1pLY1pDdfQLX4CxX4pfW4tIuxr3kgCbnxR3OJpdnHFXZIBIWj93vIpkW7n3WHmwqgCbnHr3_iF2zfOIQxnEvIpkXfCbYfYIWJ%3DwqgC2r4C8nI94WHnwqgClXfpDnI94WHF3miF2zfClX4BIqxreNjF3miF2z4Z8a1BIqxrevJmwqgClk1CDnHF3ZJ%3DwqgC8Y1pLY1pDdfQLZ4QH_4plr4YIZJ%3DzkJREugClnxR3VxZkS1Y%2FM6QTS7nEUEE7fgDX82C4nEw3%2F1cxr4lNC3E3GxkdF1plYHDIVJlWZDn4kFwwl7C7tiDz82RvaDnAdHqLwfq7c4%3Dl_s9EHfRjU4qvSDC4Uj9qY1lXuBFfrEDvgxDI23pc6jmjFHQ36IGvmBqEtDDcd1DwY4cjCxQcg4DInxl4QjkAW1cNXFlvg4mwpxnXRFnIlHQ4DHrcn4QEc3qu1xm4Cxqu%2Fx%3DEDjQjOjRHa3rc%3Diq_%3DDd4a3mwwip4CCCEG3Gv_EnvoEDfr3ZegCl7nCZ4_Jq3VBrj8DmXBHnw1CQwQj%3D3l2qNnHC4ZikN9xZLaIkwI1D4a7C7%3D1%3DNqf9cp394XHZI57C7%3DfrwBCD4D2GcTjZclIn7aI%3DzOBF_419jXCD3PJE4QDcIO4w7ws97Y3R7djtDY3qwZFn4v7C7t4GEVJG%2Fr3tDY3qDdF9eEBrw53pc6Bn2mBqckIZ33Iq3H1DkXCrfafR3NHm_Qsluos%3DLwfqIXI9EVHFv9HQLwfqI2DZwDEkwwBdNHi97oxFjUJC8_HkdZjmArfQ4dFCeQCdcSFwHwfqHwfqIniC7QJl3Bxnu5iDcDspEu3DNYBFuVC%3DdNIGEkJ9jHsDz%3DfFwn3Cw82qEDFRj%3DsQcEF%3D_OF%3DfXD%3Dda3FHaCwNPCDTWiZN6HBDY3wNiDwI51%3Dwe7C4l7C4l7nwvHZkufCTufCTufCTufCTufBIQxpkW5QDWfpbTftWYfClX5pbTftWXfQ8W5tWT5tXZj9EOi9EO5%3D7NHmuniFXTGm4VJn3dHmwmI2yy',
      url: 'https://www.stubhub.com/',
      provider: 'adMarketplace',
    },
  ],
};

export {
  mockAdMarketplaceResult,
  mockResults,
  mockFetchResponse,
};
