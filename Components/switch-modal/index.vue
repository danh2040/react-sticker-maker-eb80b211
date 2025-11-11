<!-- eslint-disable vue/no-v-html -->
<template>
  <EModal
    size="xl"
    class="switch-modal"
    padding="none"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #header>
      <EHeading class="switch-modal__header">
        {{ $t('common.switchmodal.title') }}
      </EHeading>
    </template>
    <div class="switch-modal__content">
      <div class="switch-modal__text">
        <div
          v-for="step in ['step1', 'step2']"
          :key="step"
          class="switch-modal__step"
        >
          <EHeading as="h6" class="switch-modal__step-title">
            {{ $t(`common.switchmodal.${step}.title`) }}
          </EHeading>
          <p
            class="switch-modal__step-description"
            v-html="getStepDescription(step)"
          />
        </div>
        <EButton
          class="switch-modal__dismiss"
          variant="solid-white"
          @click="onClose"
        >
          {{ $t(`common.choicescreen.dismiss`) }}
        </EButton>
      </div>
      <div
        :class="`switch-modal__gif--${locale}`"
      />
    </div>
  </emodal>
</template>

<script>
import { mapState } from 'pinia';

import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EHeading from '@ecosia/common-vue2/components/heading/index.vue';
import EModal from '@ecosia/common-vue2/components/modal/index.vue';

import { useGlobalStore } from '@ecosia/store/global/index.js';

export default {
  name: 'ESwitchModal',
  components: {
    EModal,
    EHeading,
    EButton,
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    getStepDescription(step) {
      const moreIcon = '</strong>&vellip;</strong>';
      return this.$t(`common.switchmodal.${step}.description`, { moreIcon });
    },
  },
};
</script>

<style lang="scss" scoped>

.switch-modal::v-deep {
  .modal__dialog  {
    gap: $space-6l;
    width: 927px;
    padding: $space-7l;

    background: var(--color-background-brand-secondary-alt);
  }
}

.switch-modal__header {
  color: var(--color-text-static-light);
  font-family: $family-brand;
  font-size: $font-5l;
  text-align: center;
}

.switch-modal__content {
  display: grid;
  gap: $space-3l;
  grid-template-columns: 1fr 1fr;

  text-align: left;
}

.switch-modal__text {
  display: flex;
  gap: $space-l;
  flex-direction: column;
  width: auto;
}

.switch-modal__step {
  display: inherit;
  gap: $space-1s;
  flex-direction: inherit;
}

.switch-modal__step-title {
  color: var(--color-text-static-light);
  font-family: $family-brand;
  font-size: $font-3l;
  line-height: 28.8px;
}

.switch-modal__step-description {
  margin: 0;

  color: var(--color-text-static-light);
  font-family: $family;
  font-size: $font-1l;
  font-weight: 400;
  line-height: 25.2px;
}

.switch-modal__dismiss {
  align-self: flex-start;
}

@each $locale in (en, de, fr, es, nl, it) {
  .switch-modal__gif--#{$locale} {
    height: inherit;
    margin-left: -20px;

    background-image: url('../../assets/switch-gifs/switch-gif@#{$locale}.gif?asPath');
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>
