<template>
  <div
    v-if="slides.length"
    class="slider"
    :class="[`slider--${variant}`]"
  >
    <div class="slider__slides">
      <div
        class="slider__inner"
        data-test-id="slider-inner"
        :style="sliderStyle"
      >
        <div
          v-for="(_, index) in slides"
          :key="index"
          class="slider__slide"
          :class="[
            `slider__slide--${index + 1}`,
            { 'slider__slide--active': activeIndex === (index + 1) - 1 }
          ]"
        />
      </div>
    </div>
    <div class="slider__text">
      <div
        class="slider__contents"
        :style="sliderStyle"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="slider__content"
          data-test-id="slider-content"
        >
          <ESectionHeader
            :title="title"
            :subtitle="slide.header"
            class="slider__header"
          />
          <div v-if="slide.title " class="slide__title">
            {{ slide.title }}
          </div>
          <p class="slide__description">
            {{ slide.description }}
          </p>
        </div>
      </div>
    </div>
    <div class="slider__controls">
      <EButton
        icon="arrow-left"
        variant="bare"
        size="l"
        elevation="0"
        data-test-id="slider-control-previous"
        :aria-label="$t('common.slider.previous')"
        @click="onPrevious"
      />
      <div class="slider__steps">
        <label
          v-for="(_, index) in slides"
          :key="index"
          class="slider__step"
          :class="{
            'slider__step-mini': stepSize === 'mini',
          }"
          @click="stopInterval"
        >
          <input
            v-model="activeIndex"
            :value="(index + 1) - 1"
            type="radio"
            class="slider__radio"
          >
          <div class="slider__step-inner" />
        </label>
      </div>
      <EButton
        icon="arrow-right"
        variant="bare"
        size="l"
        elevation="0"
        :aria-label="$t('common.slider.next')"
        data-test-id="slider-control-next"
        @click="onNext"
      />
    </div>
  </div>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import ESectionHeader from '@ecosia/common-vue2/components/section/header.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

// Calculates how much to translate the slider according to active index and number of slides
export const translateFunc = (index, total) => (((-1 * index) / total) * 100);
export const INTERVAL_CHANGE_SLIDE = 4000 * 2;
const SLIDE_WIDTH_IN_PERCENT = 100;

const variant = ['primary', 'secondary'];
export default {
  name: 'ESlider',
  components: {
    EButton,
    ESectionHeader,
  },
  mixins: [
    classes,
  ],
  props: {
    variant: {
      type: String,
      default: 'primary',
      cssClass: true,
      validator: (value) => variant.includes(value),
    },
    title: {
      type: String,
      default: '',
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    subtitle: {
      type: String,
      default: '',
    },
    slides: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    activeIndex: 0,
    intervalId: '',
  }),
  computed: {
    sliderStyle() {
      return {
        width: `${SLIDE_WIDTH_IN_PERCENT * this.slides.length}%`,
        transform: `translateX(${translateFunc(this.activeIndex, this.slides.length)}%)`,
      };
    },
    stepSize() {
      return this.slides.length > 3 ? 'mini' : '';
    },
  },
  mounted() {
    this.initialAutoChangeSlide();
  },
  beforeDestroy() {
    this.stopInterval();
  },
  methods: {
    onNext() {
      this.stopInterval();
      this.changeSlide();
    },
    onPrevious() {
      this.stopInterval();
      this.activeIndex = (this.activeIndex ? this.activeIndex : this.slides.length) - 1;
    },
    changeSlide() {
      this.activeIndex = (this.activeIndex + 1) % this.slides.length;
    },
    initialAutoChangeSlide() {
      this.intervalId = setInterval(() => {
        this.changeSlide();
      }, INTERVAL_CHANGE_SLIDE);
    },
    stopInterval() {
      clearInterval(this.intervalId);
    },
  },
};
</script>

<style lang="scss" scoped>
$step-height: 4px;
$image-desktop-size: 460px;

.slider {
  display: grid;
  gap: 0 $space-3l;
  grid-template-areas: 'text' 'slides' 'controls';
  grid-template-columns: 1fr;
  overflow-x: hidden;

  @include desktop {
    grid-template-columns: 1fr 1fr;
  }
}

.slider--primary {
  @include desktop {
    grid-template-areas: 'slides text' 'slides controls';
  }
}

.slider--secondary {
  @include desktop {
    grid-template-areas: 'text slides' 'controls slides';
  }
}

.slider__slides {
  position: relative;
  grid-area: slides;
  width: 100%;
  margin: $space-1l auto 0;
  padding-bottom: 100%;
  overflow: hidden;

  @include desktop-l {
    width: $image-desktop-size;
    height: $image-desktop-size;
    margin-top: 0;
  }
}

.slider__inner {
  display: flex;
  position: absolute;
  height: 100%;
}

.slider__slide {
  width: 100%;
  height: 100%;

  border-radius: $border-radius-l;

  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

.slider__inner,
.slider__slide--active {
  animation: e-fade-in $timing-1l forwards;
}

.slider__text {
  grid-area: text;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;

  color: var(--color-text-primary);
  font-family: $family;
  font-size: $font-l;
  text-align: center;

  @include desktop {
    align-self: center;

    text-align: left;
  }
}

.slider--secondary .slider__text {
  @include desktop {
    align-self: end;
    padding-bottom: $space-3l;
  }
}

.slider__header {
  text-align: center;

  @include desktop {
    text-align: left;
  }
}

.slide__description {
  margin: 0;
}

.slider__contents {
  display: flex;
}

.slider__content {
  width: 100%;
}

.slide__title {
  margin-bottom: $space-s;

  font-weight: $font-weight-700;
}

.slider__controls {
  display: flex;
  grid-area: controls;
  align-items: flex-end;
  justify-content: center;
  width: 280px;
  margin: $space-l auto 0;

  @include desktop {
    align-self: center;
    justify-content: flex-start;
    margin: 0;
  }
}

.slider--secondary .slider__controls {
  @include desktop {
    align-self: baseline;
  }
}

.slider__steps {
  display: flex;
  align-items: center;
  height: $space-4l;
}

.slider__step {
  display: inline-block;
  height: $step-height;
  margin-right: $space-1s;

  cursor: pointer;

  &:first-of-type {
    margin-left: $space-1s;
  }
}

.slider__radio {
  display: none;
}

.slider__step-inner {
  width: 32px;
  height: 100%;

  transition: width $timing-l;

  border-radius: $border-radius-1l;

  background-color: $c-gray-30;
}

.slider__step-mini .slider__step-inner {
  width: 21px;
}

.slider__radio:checked + .slider__step-inner {
  width: 80px;

  background-color: var(--color-brand-primary);
}

</style>
