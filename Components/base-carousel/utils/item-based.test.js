import { NEXT, PREVIOUS } from './direction.js';
import ItemBasedScrolling from './item-based.js';

class MockElement {
  constructor({ offsetLeft } = {}) {
    this.offsetLeft = offsetLeft;
    this.scrollIntoView = vi.fn();
  }
}

const mockItems = [
  new MockElement({ offsetLeft: 0 }),
  new MockElement({ offsetLeft: 100 }),
  new MockElement({ offsetLeft: 200 }),
  new MockElement({ offsetLeft: 300 }),
  new MockElement({ offsetLeft: 400 }),
];

describe('ItemBasedScrolling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    [1, 0, NEXT, 1],
    [1, 200, NEXT, 3],
    [1, 230, NEXT, 4],
    [1, 200, PREVIOUS, 1],
    [1, 250, PREVIOUS, 2],
    [2, 0, NEXT, 2],
    [2, 400, PREVIOUS, 2],
    [6, 0, NEXT, null],
    [6, 400, PREVIOUS, null],
  ])('scrolls successfully by %i items from position %i in direction %i - to item %i', (scrollBy, currentPosition, direction, expectedItemIndex) => {
    const algorithm = new ItemBasedScrolling({ scrollBy });
    algorithm.scroll(new MockElement(), mockItems, currentPosition, direction);

    if (expectedItemIndex !== null) {
      expect(mockItems[expectedItemIndex].scrollIntoView).toHaveBeenCalled();
    } else {
      mockItems.forEach((item) => expect(item.scrollIntoView).not.toHaveBeenCalled());
    }
  });
});
