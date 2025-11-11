import { NEXT, PREVIOUS } from './direction.js';
import PixelBasedScrolling from './pixel-based-scrolling.js';

class MockElement {
  constructor(parent) {
    this.parentElement = parent;
    this.scrollBy = vi.fn();
  }
}

const parent = new MockElement();
const container = new MockElement(parent);

describe('PixelBasedScrolling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    [NEXT, 'smooth', 30],
    [PREVIOUS, 'smooth', 40],
  ])('for carousel in direction %i, with behaviour %s aligning it to %i', (...args) => {
    const [direction, behaviour, expectedDistance] = args;
    const algorithm = new PixelBasedScrolling();
    algorithm.scroll(
      container,
      direction,
      expectedDistance,
    );

    expect(parent.scrollBy)
      .toHaveBeenCalledWith(
        expect.objectContaining({ left: direction * expectedDistance, behavior: behaviour }),
      );
  });
});
