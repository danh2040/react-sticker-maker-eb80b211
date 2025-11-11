import { mount } from '@vue/test-utils';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

import EClaims from './index.vue';

const intersectionObserver = mockIntersectionObserver();

const claims = [
  { icon: 'trees', title: 'A title', description: 'A description' },
  { icon: 'personalization', title: 'Another title', description: 'Another description' },
  { icon: 'crossplatform', title: 'Some title', description: 'Some description' },
  { icon: 'encrypted', title: 'Other title', description: 'Other description' },
  { icon: 'community', title: 'Title', description: 'Description' },
  { icon: 'coin', title: 'This title', description: 'This description' },
];

const propsData = {
  claims,
  subtitle: 'Claims subtitle',
  title: 'Claims title',
};

const mountOptions = { propsData };

// Helper function for getting specific claims inside the tests
const getClaimsElement = (wrapper, index) => {
  const claimsTitles = wrapper.findAll(`${byTestId('claims-section-item')} h4`);
  const claimsDescriptions = wrapper.findAll(`${byTestId('claims-section-item')} p`);
  const claimsValuesIcons = wrapper.findAll(byTestId('claims-section-image'));

  return {
    title: claimsTitles.at(index),
    description: claimsDescriptions.at(index),
    icon: claimsValuesIcons.at(index),
  };
};

describe('Claims', () => {
  let wrapper;

  itRendersAndIsVisible(
    mount(EClaims, mountOptions),
    'section',
    'claims-section',
  );

  it('renders all elements', async () => {
    let claimsValuesIcons;
    wrapper = mount(EClaims, mountOptions);

    const title = wrapper.find(`${byTestId('claims-section')} h2`);
    const subtitle = wrapper.find(`${byTestId('claims-section')} h3`);

    expect(title.text()).toBe('Claims title');
    expect(subtitle.text()).toBe('Claims subtitle');

    claimsValuesIcons = wrapper.findAll(byTestId('claims-section-image'));
    expect(claimsValuesIcons.length).toBe(0);
    await intersectionObserver.enterNode(wrapper.element);
    claimsValuesIcons = wrapper.findAll(byTestId('claims-section-image'));
    expect(claimsValuesIcons.length).toBe(6);
  });

  it.each(
    claims.map((__, index) => index),
  )('renders content for item $index', async (index) => {
    wrapper = mount(EClaims, mountOptions);
    await intersectionObserver.enterNode(wrapper.element);
    const item = getClaimsElement(wrapper, index);
    const { icon, title, description } = claims[index];
    expect(item.icon.element.classList).toContain(`claims-values-section__image--${icon}`);
    expect(item.title.text()).toBe(title);
    expect(item.description.text()).toBe(description);
  });
});
