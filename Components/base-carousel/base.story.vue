<template>
  <div class="story">
    <EBaseCarousel class="carousel">
      <template #previous-control="{ getCurrentScrollPosition, visible }">
        <EButton
          v-show="visible"
          class="indicator indicator--prev"
          icon="chevron-left"
          icon-size="s"
          variant="solid-white"
          elevation="1"
          @click="onPrevious(getCurrentScrollPosition)"
        />
      </template>
      <ul ref="content" class="items">
        <li v-for="i in items" :key="i" :ref="`item-${i}`" class="item">
          <div class="item-content">
            Item #{{ i + 1 }}
          </div>
        </li>
      </ul>
      <template #next-control="{ getCurrentScrollPosition, visible }">
        <EButton
          v-show="visible"
          class="indicator indicator--next"
          icon="chevron-right"
          icon-size="s"
          variant="solid-white"
          elevation="1"
          @click="onNext(getCurrentScrollPosition)"
        />
      </template>
    </EBaseCarousel>
  </div>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';

import EBaseCarousel from './index.vue';
import CarouselController, { ItemBasedScrolling } from './utils/index.js';

export default {
  name: 'BaseBaseCarousel',
  statusId: 'BaseCarousel',
  components: { EBaseCarousel, EButton },
  data: () => ({
    scrollPosition: 0,
    items: [0, 1, 2, 3, 4, 5],
  }),
  mounted() {
    this.carousel = new CarouselController({
      algorithm: new ItemBasedScrolling({ scrollBy: 1 }),
      container: this.$refs.content,
      items: Array.from(this.$refs.content.getElementsByClassName('item-content')),
    });
  },
  methods: {
    async onPrevious(getCurrentScrollPosition) {
      this.carousel.previous(getCurrentScrollPosition());
    },
    async onNext(getCurrentScrollPosition) {
      this.carousel.next(getCurrentScrollPosition());
    },
  },
};
</script>

<style lang="scss" scoped>
.story {
  padding: $space-m;
}

.carousel {
  width: 100%;
}

.items {
  display: flex;
  margin: 0;
  padding: 0;
}

.item {
  display: inline-flex;
  flex-basis: 50%;
  flex-shrink: 0;
  padding: 0 $space-l;
}

.item-content {
  width: 100%;
  padding: $space-m $space-l;

  border-radius: $border-radius-l;

  background-color: var(--color-background-secondary);

  text-align: center;
}

.indicator {
  position: absolute;
  z-index: 99;
  top: 50%;

  transform: translateY(-50%);

  font-size: $font-3l;
}

.indicator--prev {
  left: 0;
}

.indicator--next {
  right: 0;
}
</style>
