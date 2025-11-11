import { NEXT, PREVIOUS } from './direction.js';
import PageBasedScrolling from './page-based.js';

class MockElement {
  constructor({ offsetLeft, offsetWidth } = {}) {
    this.offsetLeft = offsetLeft;
    this.offsetWidth = offsetWidth;
    this.scrollIntoView = vi.fn();
  }
}

const mockItems = [
  new MockElement({ offsetLeft: 10 }),
  new MockElement({ offsetLeft: 100 }),
  new MockElement({ offsetLeft: 200 }),
  new MockElement({ offsetLeft: 300 }),
  new MockElement({ offsetLeft: 400 }),
  new MockElement({ offsetLeft: 500 }),
  new MockElement({ offsetLeft: 600 }),
  new MockElement({ offsetLeft: 700 }),
  new MockElement({ offsetLeft: 800 }),
];

const carouselType = 'productAds';

describe('PageBasedScrolling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    [300, 0, NEXT, 2, 'start'],
    [450, 0, NEXT, 4, 'start'],
    [300, 0, PREVIOUS, null, undefined],
    [300, 100, PREVIOUS, null, undefined],
    [300, 350, NEXT, 6, 'start'],
    [300, 350, PREVIOUS, 2, 'end'],
    [300, 800, NEXT, null, undefined],
    [300, 800, PREVIOUS, 6, 'end'],
  ])('for container width %i from position %i in direction %i, moves to item index %i aligning it to %s', (...args) => {
    const [containerWidth, currentPosition, direction, expectedItemIndex, expectedAlign] = args;
    const algorithm = new PageBasedScrolling();
    algorithm.scroll(
      new MockElement({ offsetWidth: containerWidth }),
      mockItems,
      currentPosition,
      direction,
      carouselType,
    );

    if (expectedItemIndex !== null) {
      expect(mockItems[expectedItemIndex].scrollIntoView)
        .toHaveBeenCalledWith(expect.objectContaining({ inline: expectedAlign }));
    } else {
      mockItems.forEach((item) => {
        if (item.offsetLeft < 800) {
          expect(item.scrollIntoView).not.toHaveBeenCalled();
        }
      });
    }
  });
});
