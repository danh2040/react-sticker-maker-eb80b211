import { mount } from '@vue/test-utils';

import ESummaryList from './index.vue';

const expectedItems = [
  {
    id: 'name',
    label: 'Name',
    value: 'Juno Birch',
  },
  {
    id: 'email',
    label: 'Email',
    value: 'juno.birch@example.com',
  },
];

const options = {
  propsData: {
    items: expectedItems,
  },
};

describe('ESummaryList', () => {
  it('renders items correctly', () => {
    const wrapper = mount(ESummaryList, options);
    const summaryListRowElements = wrapper.findAll(byTestId('summary-list-row'));
    summaryListRowElements.wrappers.forEach((summaryListRowElement, index) => {
      const expectedItem = expectedItems[index];
      expect(summaryListRowElement.exists()).toBe(true);

      const summaryListRowLabelElement = summaryListRowElement.find(
        byTestId('summary-list-row-info-label'),
      );
      expect(summaryListRowLabelElement.text()).toBe(expectedItem.label);

      const summaryListRowValueElement = summaryListRowElement.find(
        byTestId('summary-list-row-info-value'),
      );
      expect(summaryListRowValueElement.text()).toBe(expectedItem.value);
    });
  });

  it("doesn't render a hint", () => {
    const wrapper = mount(ESummaryList, options);
    const summaryListRowElement = wrapper.find(byTestId('summary-list-row'));
    const summaryListRowHintElement = summaryListRowElement.find(
      byTestId('summary-list-row-info-hint'),
    );
    expect(summaryListRowHintElement.exists()).toBe(false);
  });

  it("doesn't render a link", () => {
    const wrapper = mount(ESummaryList, options);
    const summaryListRowElement = wrapper.find(byTestId('summary-list-row'));
    const summaryListRowLinkElement = summaryListRowElement.find(
      byTestId('summary-list-row-link'),
    );
    expect(summaryListRowLinkElement.exists()).toBe(false);
  });

  it('has default class on the row', () => {
    const wrapper = mount(ESummaryList, options);
    const summaryListRowElement = wrapper.find(byTestId('summary-list-row'));
    expect(summaryListRowElement.classes()).toStrictEqual([
      'summary-list__row',
    ]);
  });

  describe('the item has a hint', () => {
    const optionsWithAHint = {
      propsData: {
        items: [
          {
            ...expectedItems[0],
            hint: 'What do we call you?',
          },
        ],
      },
    };

    it('renders a hint', () => {
      const wrapper = mount(ESummaryList, optionsWithAHint);
      const summaryListRowElement = wrapper.find(byTestId('summary-list-row'));
      const summaryListRowHintElement = summaryListRowElement.find(
        byTestId('summary-list-row-info-hint'),
      );
      expect(summaryListRowHintElement.exists()).toBe(true);
      expect(summaryListRowHintElement.text()).toBe('What do we call you?');
    });
  });

  describe('the item has a link', () => {
    const optionsWithALink = {
      propsData: {
        items: [
          {
            ...expectedItems[0],
            link: {
              url: '/profile/name/',
              text: 'Change name',
            },
          },
        ],
      },
    };

    it('adds a class to the row', () => {
      const wrapper = mount(ESummaryList, optionsWithALink);
      const summaryListRowElement = wrapper.find(byTestId('summary-list-row'));
      expect(summaryListRowElement.classes()).toStrictEqual([
        'summary-list__row',
        'summary-list__row--has-link',
      ]);
    });

    it('renders a link', () => {
      const wrapper = mount(ESummaryList, optionsWithALink);
      const summaryListRowElement = wrapper.find(byTestId('summary-list-row'));
      const summaryListRowLinkElement = summaryListRowElement.find(
        byTestId('summary-list-row-link'),
      );
      expect(summaryListRowLinkElement.exists()).toBe(true);
      expect(summaryListRowLinkElement.attributes('href')).toBe('/profile/name/');
      expect(summaryListRowLinkElement.text()).toBe('Change name');
    });
  });
});
