import { NEXT, PREVIOUS } from './direction.js';
import CarouselController from './index.js';
import ItemBasedScrolling from './item-based.js';
import Scrolling from './scrolling.js';

describe('CarouselController', () => {
  it('defaults to item based', () => {
    const controller = new CarouselController();
    expect(controller.algorithm).toBeInstanceOf(ItemBasedScrolling);
  });

  it('calls the provided algorithm correctly', () => {
    const scroll = vi.fn();
    const TestAlgorithm = class extends Scrolling {
      scroll(...args) {
        scroll(...args);
      }
    };

    const algorithm = new TestAlgorithm();
    const container = {};
    const items = [];
    const controller = new CarouselController({ container, items, algorithm });
    const carouselType = 'productAds';

    const position = 123;
    const distance = 20;
    controller.previous(position, carouselType);
    expect(scroll).toHaveBeenLastCalledWith(container, items, position, PREVIOUS, carouselType);

    controller.next(position, carouselType);
    expect(scroll).toHaveBeenLastCalledWith(container, items, position, NEXT, carouselType);

    controller.hovered(distance, 'next');
    expect(scroll).toHaveBeenLastCalledWith(container, NEXT, distance);

    controller.hovered(distance, 'previous');
    expect(scroll).toHaveBeenLastCalledWith(container, PREVIOUS, distance);

    controller.leave(distance, 'next');
    expect(scroll).toHaveBeenLastCalledWith(container, PREVIOUS, distance);

    controller.leave(distance, 'previous');
    expect(scroll).toHaveBeenLastCalledWith(container, NEXT, distance);

    controller.hoveredNext(distance);
    expect(scroll).toHaveBeenLastCalledWith(container, NEXT, distance);

    controller.hoveredPrev(distance);
    expect(scroll).toHaveBeenLastCalledWith(container, PREVIOUS, distance);
  });
});
