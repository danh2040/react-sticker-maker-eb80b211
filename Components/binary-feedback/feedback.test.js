import VueRouter from 'vue-router';
import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import EFeedbackForm from '@ecosia/common-vue2/components/feedback-form/index.vue';

import { ILLEGAL, INACCURATE, IRRELEVANT, ISSUE, OFFENSIVE, SUGGESTION } from './feedback-options.js';
import EBinaryFeedback, { FEEDBACK_NEGATIVE, FEEDBACK_POSITIVE, THANK_YOU_DELAY_MS } from './index.vue';
const pinia = createTestingPinia();

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(PiniaVuePlugin);

const router = new VueRouter();
router.push({ path: '/search', query: { q: 'berlin to munich' } });

const options = { localVue, router, pinia };

const $track = vi.fn();
const mountBinaryFeedback = ({
  trackId,
  trackingType,
  trackingProperty,
  listeners,
  forceModal,
  minimal,
  customTrackingPayload,
} = {}) => {
  const props = {
    trackId,
    trackingType,
    trackingProperty,
    forceModal,
    minimal,
    customTrackingPayload,
  };
  return mount(EBinaryFeedback, {
    propsData: props,
    mocks: { $track },
    listeners,
    ...options,
  });
};

describe('EBinaryFeedback', () => {
  const propsData = {
    trackId: 'some-track-id',
    trackingType: 'some-tracking-type',
  };

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  // itRendersAndIsVisible(mountBinaryFeedback(), 'div', 'binary-feedback');

  it('renders elements', () => {
    const wrapper = mountBinaryFeedback({ ...propsData });
    expect(wrapper.find(byTestId('binary-feedback-text')).exists()).toBe(true);
    expect(wrapper.find(byTestId('binary-feedback-thankyou')).exists()).toBe(false);
    expect(wrapper.find(byTestId('thumbs-up-button')).exists()).toBe(true);
    expect(wrapper.find(byTestId('thumbs-down-button')).exists()).toBe(true);
  });

  it('check accessible labels', () => {
    const wrapper = mountBinaryFeedback({ ...propsData });
    expect(wrapper.find(byTestId('thumbs-up-button')).attributes('aria-label')).toBe('common.search.widgets.binaryfeedback.thumbsup');
    expect(wrapper.find(byTestId('thumbs-down-button')).attributes('aria-label')).toBe('common.search.widgets.binaryfeedback.thumbsdown');
  });

  it('has title when minimal prop is false', () => {
    const wrapper = mountBinaryFeedback({ ...propsData, minimal: false });
    expect(wrapper.find(byTestId('binary-feedback-text')).exists()).toBe(true);
  });

  it('has no title when minimal prop is true', () => {
    const wrapper = mountBinaryFeedback({ ...propsData, minimal: true });
    expect(wrapper.find(byTestId('binary-feedback-text')).exists()).toBe(false);
  });

  it('displays modal if force-modal is true', async () => {
    const wrapper = mountBinaryFeedback({ ...propsData, forceModal: false });
    expect(wrapper.find(byTestId('feedback-form-element')).exists()).toBe(false);

    await wrapper.setProps({ forceModal: true });

    expect(wrapper.find(byTestId('feedback-form-element')).exists()).toBe(true);
  });

  it.each([
    ['up', FEEDBACK_POSITIVE],
    ['down', FEEDBACK_NEGATIVE],
  ])('when button %s is clicked, send event, display thank you message and hide buttons', async (button, feedback) => {
    const listeners = { 'feedback': vi.fn(), 'modal-close': vi.fn() };
    const wrapper = mountBinaryFeedback({ ...propsData, listeners });
    const buttonWrapper = wrapper.find(byTestId(`thumbs-${button}-button`));
    await buttonWrapper.trigger('click');
    await buttonWrapper.trigger('animationend');
    vi.advanceTimersByTime(THANK_YOU_DELAY_MS);
    await wrapper.vm.$nextTick();

    expect(listeners.feedback).toHaveBeenCalledWith(feedback);

    expect(wrapper.find(byTestId('binary-feedback-text')).exists()).toBe(false);
    expect(wrapper.find(byTestId('binary-feedback-thankyou')).exists()).toBe(true);
    expect(wrapper.find(byTestId('thumbs-up-button')).exists()).toBe(false);
    expect(wrapper.find(byTestId('thumbs-down-button')).exists()).toBe(false);

    if (feedback === FEEDBACK_NEGATIVE) {
      const closeButton = wrapper.find(byTestId('close'));
      await closeButton.trigger('click');

      expect(listeners['modal-close']).toHaveBeenCalled();
    }
  });

  it('contains the correct options for tracking Binary feedback', () => {
    const wrapper = mountBinaryFeedback({ ...propsData });
    const feedbackOptions = wrapper.vm.feedbackOptions.options;

    expect(feedbackOptions).toEqual(
      [
        { label: 'common.search.widgets.binaryfeedback.modal.bullet1', messageRequired: false, value: IRRELEVANT },
        { label: 'common.search.widgets.binaryfeedback.modal.bullet2', messageRequired: false, value: INACCURATE },
        { label: 'common.search.widgets.binaryfeedback.modal.bullet3', messageRequired: false, value: OFFENSIVE },
        { label: 'common.search.widgets.binaryfeedback.modal.bullet4', messageRequired: false, value: ILLEGAL },
        { label: 'common.search.widgets.binaryfeedback.modal.bullet5', messageRequired: true, value: ISSUE },
        { label: 'common.search.widgets.binaryfeedback.modal.bullet6', messageRequired: true, value: SUGGESTION },
      ],
    );
  });

  describe('EBinaryFeedback in a browser', () => {
    it('displays modal when router is not available', async () => {
      const wrapper = mountBinaryFeedback({ ...propsData });

      await wrapper.find(byTestId('thumbs-down-button')).trigger('click');
      expect(wrapper.find(byTestId('feedback-form-element')).exists()).toBe(true);
    });
  });

  describe('Tracking', () => {
    describe('Tracking', () => {
      it.each([
        ['up', FEEDBACK_POSITIVE],
        ['down', FEEDBACK_NEGATIVE],
      ])('sends correct feedback value when %s button is clicked', async (button, expectedFeedback) => {
        const wrapper = mountBinaryFeedback({ trackId: 'id', trackingType: 'type' });
        const buttonWrapper = wrapper.find(byTestId(`thumbs-${button}-button`));
        await buttonWrapper.trigger('click');
        await buttonWrapper.trigger('animationend');
        vi.advanceTimersByTime(THANK_YOU_DELAY_MS);
        await wrapper.vm.$nextTick();

        expect($track).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ label: expectedFeedback }),
          }),
        );
      });

      it('includes trackingType in category if provided', async () => {
        const wrapper = mountBinaryFeedback({ ...propsData });
        await wrapper.find(byTestId('thumbs-up-button')).trigger('click');
        await wrapper.find(byTestId('thumbs-up-button')).trigger('animationend');
        vi.advanceTimersByTime(THANK_YOU_DELAY_MS);
        await wrapper.vm.$nextTick();

        expect($track).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ category: 'some-track-id_some-tracking-type' }),
          }),
        );
      });

      it('does not include trackingType in category if not provided', async () => {
        const wrapper = mountBinaryFeedback({ trackId: 'only-track-id' });
        await wrapper.find(byTestId('thumbs-down-button')).trigger('click');
        await wrapper.find(byTestId('thumbs-down-button')).trigger('animationend');
        vi.advanceTimersByTime(THANK_YOU_DELAY_MS);
        await wrapper.vm.$nextTick();

        expect($track).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ category: 'only-track-id' }),
          }),
        );
      });

      it('includes property in track event if provided', async () => {
        const jsonProperty = { foo: 'bar', baz: 42 };
        const wrapper = mountBinaryFeedback({ trackId: 'id', trackingProperty: JSON.stringify(jsonProperty) });
        await wrapper.find(byTestId('thumbs-up-button')).trigger('click');
        await wrapper.find(byTestId('thumbs-up-button')).trigger('animationend');
        vi.advanceTimersByTime(THANK_YOU_DELAY_MS);
        await wrapper.vm.$nextTick();

        expect($track).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ property: JSON.stringify(jsonProperty) }),
          }),
        );
      });

      it('uses query as property if property is not provided', async () => {
        const wrapper = mountBinaryFeedback({ trackId: 'id' });
        await wrapper.find(byTestId('thumbs-down-button')).trigger('click');
        await wrapper.find(byTestId('thumbs-down-button')).trigger('animationend');
        vi.advanceTimersByTime(THANK_YOU_DELAY_MS);
        await wrapper.vm.$nextTick();

        expect($track).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ property: 'berlin to munich' }),
          }),
        );
      });
    });
  });

  describe('Feedback Form', () => {
    it('renders feedback form when thumbs down button is clicked', async () => {
      const wrapper = mountBinaryFeedback({ ...propsData });
      await wrapper.find(byTestId('thumbs-down-button')).trigger('click');
      expect(wrapper.find(byTestId('feedback-form-element')).exists()).toBe(true);
    });

    it('passes correct props to feedback form', async () => {
      const wrapper = mountBinaryFeedback({ ...propsData });
      await wrapper.find(byTestId('thumbs-down-button')).trigger('click');
      const feedbackForm = wrapper.findComponent(EFeedbackForm);

      expect(feedbackForm.props()).toEqual(
        expect.objectContaining({
          query: 'berlin to munich',
          widgetType: 'some-track-id_some-tracking-type',
          provider: null,
          origin: '',
        }),
      );
    });

    it('passes custom tracking payload to feedback form', async () => {
      const customTrackingPayload = { message_id: 'message-id', conversation_id: 'conversation-id', origin: 'test-origin' };
      const wrapper = mountBinaryFeedback({ ...propsData, customTrackingPayload });
      await wrapper.find(byTestId('thumbs-down-button')).trigger('click');
      const feedbackForm = wrapper.findComponent(EFeedbackForm);

      expect(feedbackForm.props('customTrackingPayload')).toEqual(customTrackingPayload);
    });
  });
});
