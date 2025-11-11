import { createLocalVue, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';

import ECircleProgress from './circle-progress.vue';

const pinia = createTestingPinia({
  stubActions: false,
});

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const createOptions = (propsData = {}) => {
  return {
    localVue,
    pinia,
    propsData: {
      size: 80,
      percentage: 0.5,
      previousPercentage: 0.25,
      ...propsData,
    },
  };
};

const STROKE_DASH_OFFSET_FOR_0_PERCENTAGE = '230';
const STROKE_DASH_OFFSET_FOR_50_PERCENTAGE = '140';
const STROKE_DASH_OFFSET_FOR_25_PERCENTAGE = '185';
const STROKE_DASH_OFFSET_FOR_75_PERCENTAGE = '95';
const STROKE_DASH_OFFSET_FOR_100_PERCENTAGE = '50';

const impactStore = useImpactStore(pinia);

describe('ECircleProgress', () => {
  beforeEach(() => {
    impactStore.$reset();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
  });

  it('has default classes', () => {
    const options = createOptions();
    const wrapper = shallowMount(ECircleProgress, options);
    expect(wrapper.classes()).toEqual([
      'circle-progress',
    ]);
  });

  it('sets the size of the SVG and circles correctly', () => {
    const options = createOptions();
    const wrapper = shallowMount(ECircleProgress, options);

    expect(wrapper.find('svg').attributes('height')).toEqual('80');
    expect(wrapper.find('svg').attributes('width')).toEqual('80');
    expect(wrapper.find('svg').attributes('viewBox')).toEqual('0 0 80 80');

    const circleBackground = wrapper.find(byTestId('circle-progress-bar-background'));
    expect(circleBackground.attributes('cx')).toEqual('40');
    expect(circleBackground.attributes('cy')).toEqual('40');
    expect(circleBackground.attributes('r')).toEqual('36.75');

    const circleBar = wrapper.find(byTestId('circle-progress-bar'));
    expect(circleBar.attributes('cx')).toEqual('40');
    expect(circleBar.attributes('cy')).toEqual('40');
    expect(circleBar.attributes('r')).toEqual('36.75');
  });

  describe('if animation is disabled', () => {
    const options = createOptions({ isAnimationDisabled: true });
    const wrapper = shallowMount(ECircleProgress, options);

    it('sets the class for disabled animations', () => {
      expect(wrapper.classes()).toEqual([
        'circle-progress',
        'circle-progress--is-animation-disabled',
      ]);
    });

    it('uses the percentage not previous', () => {
      const circleBar = wrapper.find(byTestId('circle-progress-bar'));
      expect(circleBar.attributes('stroke-dashoffset')).toEqual(
        STROKE_DASH_OFFSET_FOR_50_PERCENTAGE,
      );
    });
  });

  describe('if the animation hasnt played yet', () => {
    it('uses the previous percentage', () => {
      const options = createOptions({});
      const wrapper = shallowMount(ECircleProgress, options);
      const circleBar = wrapper.find(byTestId('circle-progress-bar'));
      expect(circleBar.attributes('stroke-dashoffset')).toEqual(
        STROKE_DASH_OFFSET_FOR_25_PERCENTAGE,
      );
    });
  });

  describe('the animation has played', () => {
    it('uses the percentage not previous', async () => {
      const options = createOptions({});
      const wrapper = shallowMount(ECircleProgress, options);
      vi.runAllTimers();
      await wrapper.vm.$nextTick();
      const circleBar = wrapper.find(byTestId('circle-progress-bar'));
      expect(circleBar.attributes('stroke-dashoffset')).toEqual(
        STROKE_DASH_OFFSET_FOR_50_PERCENTAGE,
      );
    });
  });

  describe.each([
    { percentage: 0, expectedDashOffset: STROKE_DASH_OFFSET_FOR_0_PERCENTAGE },
    { percentage: 0.25, expectedDashOffset: STROKE_DASH_OFFSET_FOR_25_PERCENTAGE },
    { percentage: 0.5, expectedDashOffset: STROKE_DASH_OFFSET_FOR_50_PERCENTAGE },
    { percentage: 0.75, expectedDashOffset: STROKE_DASH_OFFSET_FOR_75_PERCENTAGE },
    { percentage: 1, expectedDashOffset: STROKE_DASH_OFFSET_FOR_100_PERCENTAGE },
    { percentage: 1.25, expectedDashOffset: STROKE_DASH_OFFSET_FOR_100_PERCENTAGE },
  ])('percentage is $percentage', ({ percentage, expectedDashOffset }) => {
    it(`the dashoffset is ${expectedDashOffset}`, () => {
      const options = createOptions({ previousPercentage: percentage, percentage });
      const wrapper = shallowMount(ECircleProgress, options);
      const circleBar = wrapper.find(byTestId('circle-progress-bar'));
      expect(circleBar.attributes('stroke-dashoffset')).toEqual(
        expectedDashOffset,
      );
    });
  });

  describe('is locked', () => {
    it('sets the class to locked', () => {
      const options = createOptions({ isLocked: true });
      const wrapper = shallowMount(ECircleProgress, options);
      expect(wrapper.classes()).toContain('circle-progress--is-locked');
    });
  });

  describe('if seeds levels v2 feature flag is enabled', () => {
    beforeEach(() => {
      vi.spyOn(impactStore, 'isSeedsLevelsV2UIEnabled', 'get')
        .mockReturnValue(true);
    });

    it('sets the class to seeds levels v2 enabled', () => {
      const options = createOptions({ isLocked: true });
      const wrapper = shallowMount(ECircleProgress, options);
      expect(wrapper.classes()).toContain('circle-progress--seeds-levels-v2-enabled');
    });

    // these numbers will replace the others in this document when we
    // clean up this feature flag
    describe.each([
      { percentage: 0, expectedDashOffset: STROKE_DASH_OFFSET_FOR_0_PERCENTAGE },
      { percentage: 0.25, expectedDashOffset: '172.5' },
      { percentage: 0.5, expectedDashOffset: '115' },
      { percentage: 0.75, expectedDashOffset: '57.5' },
      { percentage: 1, expectedDashOffset: '0' },
      { percentage: 1.25, expectedDashOffset: '0' },
    ])('percentage is $percentage', ({ percentage, expectedDashOffset }) => {
      it(`the dashoffset is ${expectedDashOffset}`, () => {
        const options = createOptions({ previousPercentage: percentage, percentage });
        const wrapper = shallowMount(ECircleProgress, options);
        const circleBar = wrapper.find(byTestId('circle-progress-bar'));
        expect(circleBar.attributes('stroke-dashoffset')).toEqual(
          expectedDashOffset,
        );
      });
    });
  });
});
