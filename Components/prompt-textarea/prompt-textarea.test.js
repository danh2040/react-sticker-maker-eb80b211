import { mount } from '@vue/test-utils';

import { isTouchDevice } from '@ecosia/common-js/client/utils.js';

import EPromptTextarea from './index.vue';

vi.mock('@ecosia/common-js/client/utils.js', () => ({
  isTouchDevice: vi.fn(() => false),
}));

describe('EPromptInput', () => {
  const mountPromptInput = (options = {}) => {
    const wrapper = mount(EPromptTextarea, options);
    return wrapper;
  };

  it('renders textarea', () => {
    const wrapper = mountPromptInput({
      propsData: {
        value: '',
        maxLength: 6000,
        doPrompt: () => { },
      },
    });
    expect(wrapper.isVisible()).toBeTruthy();
    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);
    expect(textarea.attributes('maxlength')).toBe('6000');
  });

  it('emits an enter when enter is pressed on desktop', async () => {
    isTouchDevice.mockReturnValue(false);
    const doPrompt = vi.fn();
    const wrapper = mountPromptInput({
      propsData: {
        value: '',
        maxLength: 6000,
        doPrompt,
      },
    });
    await wrapper.find('textarea').trigger('keydown.enter');
    expect(wrapper.emitted('enter')).toBeTruthy();
    expect(wrapper.emitted('enter').length).toBe(1);
  });

  it('inserts a newline when enter is pressed on mobile', async () => {
    isTouchDevice.mockReturnValue(true);
    const wrapper = mountPromptInput({
      propsData: {
        value: 'hello world',
        maxLength: 6000,
      },
    });

    const textarea = wrapper.find('textarea').element;
    textarea.selectionStart = 5;
    textarea.selectionEnd = 5;

    await wrapper.find('textarea').trigger('keydown.enter');

    expect(wrapper.emitted('enter')).toBeFalsy();
    expect(wrapper.emitted().input[0][0]).toBe('hello\n world');
  });

  describe('Linebreaks', () => {
    let wrapper;
    const doPrompt = vi.fn();

    beforeEach(() => {
      wrapper = mountPromptInput({
        propsData: {
          value: 'hello world',
          maxLength: 6000,
          doPrompt: doPrompt,
        },
      });
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('inserts a newline at the cursor position', async () => {
      const textarea = wrapper.find('textarea').element;
      const lineBreakSpy = vi.spyOn(wrapper.vm, 'lineBreak');
      vi.spyOn(wrapper.vm.$el, 'scrollHeight', 'get').mockReturnValue(100);

      // Place cursor after "hello"
      textarea.selectionStart = 5;
      textarea.selectionEnd = 5;

      await wrapper.find('textarea').trigger('keydown.enter', { shiftKey: true });
      expect(lineBreakSpy).toHaveBeenCalled();
      expect(doPrompt).not.toHaveBeenCalled();

      // The value should now be 'hello\n world
      expect(wrapper.emitted().input[0][0]).toBe('hello\n world');
      expect(wrapper.vm.$el.style.height).toBe('101px');
    });

    it('replaces selection with newline and grows height', async () => {
      const textarea = wrapper.find('textarea').element;

      textarea.selectionStart = 5;
      textarea.selectionEnd = 6;

      vi.spyOn(wrapper.vm.$el, 'scrollHeight', 'get').mockReturnValue(120);

      wrapper.vm.$el.style.height = '30px';

      await wrapper.vm.lineBreak();
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().input[0][0]).toBe('hello\nworld');
      expect(wrapper.vm.$el.style.height).toBe('121px');
    });
  });

  it('emits input value and resizes via watcher (setHeight called once after update)', async () => {
    const wrapper = mountPromptInput({
      propsData: {
        value: '',
        maxLength: 6000,
        doPrompt: () => { },
      },
    });

    const textArea = wrapper.find('textarea');
    const setHeightSpy = vi.spyOn(wrapper.vm, 'setHeight');
    await textArea.setValue('test');
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toEqual(['test']);
    // simulate parent updating prop (what triggers the watcher)
    await wrapper.setProps({ value: 'test' });
    await wrapper.vm.$nextTick();
    expect(setHeightSpy).toHaveBeenCalled();
  });

  it('emits focus value when textarea is focused', async () => {
    const wrapper = mountPromptInput({
      propsData: {
        value: '',
        maxLength: 6000,
        doPrompt: () => { },
      },
    });
    await wrapper.find('textarea').trigger('focus');
    expect(wrapper.emitted().focus).toBeTruthy();
    expect(wrapper.emitted().focus[0]).toHaveLength(1);
  });

  it('emits blur value when textarea loses focus', async () => {
    const wrapper = mountPromptInput({
      propsData: {
        value: '',
        maxLength: 6000,
        doPrompt: () => { },
      },
    });
    await wrapper.find('textarea').trigger('blur');
    expect(wrapper.emitted().blur).toBeTruthy();
    expect(wrapper.emitted().blur[0]).toHaveLength(1);
  });

  it('clear() emits input with empty string and resets height', async () => {
    const wrapper = mountPromptInput({
      propsData: {
        value: 'something',
        maxLength: 6000,
        doPrompt: () => { },
      },
    });
    wrapper.vm.$el.style.height = '100px';
    const spy = vi.spyOn(wrapper.vm, 'setHeight');
    wrapper.vm.clear();
    expect(wrapper.emitted().input).toBeTruthy();
    // The last emitted input should be ''
    const lastInput = wrapper.emitted().input[wrapper.emitted().input.length - 1];
    expect(lastInput).toEqual(['']);
    expect(wrapper.vm.$el.style.height).toBe('auto');
    expect(spy).not.toHaveBeenCalled(); // clear does not call setHeight, just resets height
  });

  it.each([
    [42, '43px'],
    [60, '61px'],
  ])('setHeight sets correct height', async (scrollHeight, expectedHeight) => {
    const wrapper = mountPromptInput({
      propsData: {
        value: 'foo',
        maxLength: 6000,
        doPrompt: () => { },
      },
    });

    Object.defineProperty(wrapper.vm.$el, 'scrollHeight', {
      value: scrollHeight,
      configurable: true,
    });
    wrapper.vm.isMultiline = true;

    await wrapper.vm.setHeight();

    expect(wrapper.vm.$el.style.height).toBe(expectedHeight);
  });

  it('does not grow endlessly and enables scroll when max-height is reached', async () => {
    const wrapper = mountPromptInput({
      propsData: {
        value: 'some input text',
        maxLength: 6000,
        doPrompt: () => { },
      },
    });
    const textarea = wrapper.find('textarea').element;
    Object.defineProperty(textarea, 'scrollHeight', { value: 1000 });
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      lineHeight: '20px',
      paddingTop: '10px',
      paddingBottom: '10px',
      maxHeight: '230px',
      overflowY: 'auto',
      height: '230px', // Computed height is capped at max-height
    });

    await wrapper.vm.checkMultiline();
    await wrapper.vm.setHeight();

    expect(parseInt(textarea.style.height)).toBe(1001);
    const computedStyle = getComputedStyle(textarea);
    expect(parseInt(computedStyle.height)).toEqual(230);
    expect(computedStyle.overflowY).toBe('auto');
  });

  it('disables textarea when audio status is displayed', () => {
    const wrapper = mountPromptInput({
      propsData: {
        value: 'Listening...',
        maxLength: 6000,
        status: true,
      },
    });
    const textarea = wrapper.find('textarea');
    expect(textarea.attributes('disabled')).toBeDefined();
    expect(textarea.classes()).toContain('status-text');
  });

  describe('autofocus', () => {
    it('does not focus by default', async () => {
      const wrapper = mountPromptInput({
        propsData: {
          value: '',
          maxLength: 6000,
          autofocus: false,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('focus')).toBeFalsy();
    });

    it('focuses textarea on mount when autofocus is true', async () => {
      const wrapper = mountPromptInput({
        propsData: {
          value: '',
          maxLength: 6000,
          autofocus: true,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted().focus).toBeTruthy();
      expect(wrapper.emitted().focus).toHaveLength(1);
    });
  });

  describe('multiline detection', () => {
    it('does not emit multiline-change when value is empty', async () => {
      const wrapper = mountPromptInput({
        propsData: {
          value: 'some initial value',
          maxLength: 6000,
        },
      });
      wrapper.vm.$refs.textarea.value = '';
      await wrapper.setProps({ value: '' });
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('multiline-change')).toBeFalsy();
    });

    it('does not emit multiline-change for single line text', async () => {
      const wrapper = mountPromptInput({
        propsData: {
          value: '',
          maxLength: 6000,
        },
      });

      // Mock the computed dimensions for single line
      const textarea = wrapper.find('textarea').element;
      Object.defineProperty(textarea, 'scrollHeight', {
        value: 40,
        configurable: true,
      });

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        lineHeight: '20px',
        paddingTop: '10px',
        paddingBottom: '10px',
      });

      wrapper.vm.$refs.textarea.value = 'Hello world';
      await wrapper.setProps({ value: 'Hello world' });
      await wrapper.vm.$nextTick();
      await wrapper.vm.checkMultiline();

      expect(wrapper.emitted('multiline-change')).toBeFalsy();
    });

    it('emits multiline-change for multiline text', async () => {
      const wrapper = mountPromptInput({
        propsData: {
          value: '',
          maxLength: 6000,
        },
      });

      // Mock the computed dimensions for multiline
      const textarea = wrapper.find('textarea').element;
      Object.defineProperty(textarea, 'scrollHeight', {
        value: 150,
        configurable: true,
      });

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        lineHeight: '20px',
        paddingTop: '10px',
        paddingBottom: '10px',
      });

      wrapper.vm.$refs.textarea.value = 'Line 1\nLine 2\nLine 3';
      await wrapper.setProps({ value: 'Line 1\nLine 2\nLine 3' });
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('multiline-change')).toBeTruthy();
      expect(wrapper.emitted('multiline-change')[0][0]).toBe(true);
    });
  });
});
