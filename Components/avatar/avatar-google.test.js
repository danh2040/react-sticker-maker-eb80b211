import { mount } from '@vue/test-utils';

import EAvatarGoogle from './avatar-google.vue';

const options = {
  propsData: {
    imageSrc: 'https://lh3.googleusercontent.com/a/1234567891011213=s96-c',
    size: 64,
  },
};

describe('EAvatarGoogle', () => {
  it('sets src and srcset correctly', () => {
    const wrapper = mount(EAvatarGoogle, options);
    expect(wrapper.attributes('src')).toBe('https://lh3.googleusercontent.com/a/1234567891011213=s64-c');
    expect(wrapper.attributes('srcset')).toBe('https://lh3.googleusercontent.com/a/1234567891011213=s64-c 1x, https://lh3.googleusercontent.com/a/1234567891011213=s128-c 2x');
  });

  it('will allow malformed urls passed as imageSrc prop', () => {
    const optionsWithMalformedImage = { ...options };
    optionsWithMalformedImage.propsData.imageSrc = 'https://lh3.googleusercontent.com/a/123=456=7891011213=s96-c';
    const wrapper = mount(EAvatarGoogle, options);
    expect(wrapper.attributes('src')).toBe('https://lh3.googleusercontent.com/a/123=s64-c');
  });
});
