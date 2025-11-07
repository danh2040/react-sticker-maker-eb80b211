<template>
  <div class="accordion-item">
    <div class="accordion-item__header">
      <button
        :id="`accordion-header-${itemKey}`"
        class="accordion-item__button"
        data-test-id="accordion-item-button"
        :aria-expanded="active.toString()"
        :aria-controls="`accordion-content-${itemKey}`"
        type="button"
        @click="toggle"
      >
        <div>
          <slot name="header" />
        </div>
        <div class="accordion-item__toggle" aria-hidden="true">
          <EIcon :icon="toggleIcon" />
        </div>
      </button>
    </div>
    <section
      v-show="active"
      :id="`accordion-content-${itemKey}`"
      :aria-hidden="active ? 'false' : 'true'"
      :aria-labelledby="`accordion-header-${itemKey}`"
      tabindex="0"
      role="region"
    >
      <div class="accordion-item__panel">
        <slot name="panel" />
      </div>
    </section>
  </div>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

export default {
  components: { EIcon },
  props: {
    itemKey: {
      type: [Number, String],
      required: true,
    },
  },
  inject: ['getActiveItemIndex', 'update'],
  computed: {
    active() {
      return this.itemKey === this.getActiveItemIndex();
    },
    toggleIcon() {
      return this.active ? 'chevron-mini-up' : 'chevron-mini-down';
    },
  },

  methods: {
    toggle() {
      const state = this.active ? 'close' : 'open';
      if (this.active) {
        this.update(null);
      } else {
        this.update(this.itemKey);
      }
      this.$emit(`${state}`, this.itemKey);
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion-item__button {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: $space-2s 0;

  border: 0;
  border-radius: 0;

  background-color: transparent;

  color: var(--color-text-primary);
  font-size: $font-m;
  font-weight: $font-weight-500;
  text-align: left;

  cursor: pointer;
}

.accordion-item__header + .accordion-item__header {
  border-top: $border-width solid var(--color-decorative-border-1);
}

.accordion-item__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  border-radius: 28px;
}

.accordion-item__button:hover .accordion-item__toggle {
  background-color: var(--color-button-background-transparent-hover);
}

.accordion-item__panel {
  font-size: $font-m;
}
</style>
