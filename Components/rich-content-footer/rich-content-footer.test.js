import { shallowMount } from '@vue/test-utils';

import ERichContentFooter, { verticalAlignments } from './index.vue';

const propsData = {
  sources: [],
};

describe('ERichContentFooter', () => {
  itRendersAndIsVisible(shallowMount(ERichContentFooter, { propsData }), 'div', 'rc-footer');

  it('renders as footer', () => {
    const as = 'footer';
    const wrapper = shallowMount(ERichContentFooter, { propsData: { ...propsData, as } });
    expect(wrapper.element.tagName.toLowerCase()).toBe(as);
  });

  it('renders content', () => {
    const feedbackLink = {
      errorMessage: '',
      options: [
        { label: 'option1', value: 'Option 1' },
        { label: 'option2', value: 'Option 2' },
      ],
      query: '',
      submitText: '',
      successMessage: '',
      successTitle: '',
      text: 'Feedback',
      textareaLabel: '',
      title: '',
      url: 'https://httpstat.us/200',
    };
    const sources = [{
      title: 'Ecosia',
      url: 'https://www.ecosia.org',
    }, {
      title: 'Best Data Source',
      url: 'https://data-sources.ecosia.org',
    }];
    const wrapper = shallowMount(ERichContentFooter, {
      propsData: {
        ...propsData,
        feedbackLink,
        sources,
      },
    });
    sources.forEach((source, index) => {
      const sourceLink = wrapper.find(byTestId(`rc-footer-link-${index}`));
      expect(sourceLink.text()).toBe(source.title);
      expect(sourceLink.attributes()).toMatchObject({
        href: source.url,
        target: '_blank',
        rel: 'noopener',
      });
    });
    expect(wrapper.find(byTestId('rc-footer-feedback'))).toBeVisible();
    expect(wrapper.find(byTestId('powered-by-ecosia')).exists()).toBe(false);
  });

  it.each([
    [[]],
    [[{ title: 'some source', url: 'https://example.com' }, { title: 'other source', url: 'https://example2.com' }]],
    [[{ title: 'some source', url: 'https://example.com' }]],
  ])('renders with "Powered by Ecosia" for sources "%O"', (sources) => {
    const wrapper = shallowMount(
      ERichContentFooter,
      { propsData: { ...propsData, sources, poweredByEcosia: true } },
    );
    const poweredByEcosia = wrapper.findAll(byTestId('powered-by-ecosia'));
    // ensure we don't show it twice (since it can show in 2 different places in the template)
    expect(poweredByEcosia.length).toBe(1);
  });

  it('does not render sources and feedback link if props are not set', () => {
    const wrapper = shallowMount(ERichContentFooter, { propsData });
    const sources = wrapper.find(byTestId('rc-footer-sources-container'));
    const feedback = wrapper.find(byTestId('rc-footer-feedback-container'));
    expect(sources.exists()).toBe(false);
    expect(feedback.exists()).toBe(false);
  });

  it.each(verticalAlignments)('render with vertical align %s', (footerVerticalAlign) => {
    const wrapper = shallowMount(
      ERichContentFooter,
      { propsData: { ...propsData, footerVerticalAlign } },
    );
    expect(wrapper.classes(`rc-footer--footer-vertical-align-${footerVerticalAlign}`)).toBe(true);
  });

  it('warns on invalid vertical align', () => {
    expect(() => shallowMount(ERichContentFooter, { propsData: { ...propsData, footerVerticalAlign: 'abc' } }))
      .toHaveInvalidProp('footerVerticalAlign');
  });

  it('renders left slot', () => {
    const leftText = 'Test';
    const left = `<p data-test-id="left-content">${leftText}</p>`;
    const wrapper = shallowMount(ERichContentFooter, {
      propsData,
      slots: { left },
    });
    expect(wrapper.find(byTestId('left-content')).text()).toBe(leftText);
  });
});
