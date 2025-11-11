import Scrolling from './scrolling.js';

const mockPrefersReducedMotion = vi.fn(() => true);
vi.mock('@ecosia/common-vue2/utils/screen.js', () => ({ prefersReducedMotion: () => mockPrefersReducedMotion() }));

describe('Scrolling', () => {
  describe('scrollToStart', () => {
    it.each([
      ['defaults', undefined, { behavior: 'auto', block: 'nearest', inline: 'start' }, true],
      ['defaults', undefined, { behavior: 'smooth', block: 'nearest', inline: 'start' }, false],
      ['custom', () => ({ block: 'start', inline: 'end' }), { block: 'start', inline: 'end' }, true],
    ])('calls scrollIntoView on the given element with provided options', (test, scrollOptions, expectedOptions, prefersReduced) => {
      mockPrefersReducedMotion.mockImplementationOnce(() => prefersReduced);
      const scrolling = new Scrolling({ scrollOptions });
      const element = { scrollIntoView: vi.fn() };
      scrolling.scrollToStart(element);
      expect(element.scrollIntoView).toHaveBeenCalledWith(expectedOptions);
    });
  });
});
