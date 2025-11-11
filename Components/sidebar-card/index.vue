<template>
  <ECard
    v-show="showCard"
    v-intersect="onIntersect"
    as="div"
    class="sidebar-card"
    data-test-id="sidebar-card"
    :href="url"
    target="_blank"
    rel="noopener"
    :border="true"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      class="sidebar-card__illustration"
      role="presentation"
      width="72"
      height="72"
    >
    <div class="sidebar-card__body">
      <p
        v-if="title"
        class="sidebar-card__title"
        data-test-id="sidebar-card-title"
      >
        {{ title }}
      </p>
      <p
        class="sidebar-card__description"
        :class="{ 'sidebar-card__description--m': smallerText }"
        data-test-id="sidebar-card-description"
      >
        {{ description }}
      </p>
      <ELink
        v-if="url"
        as="a"
        color="primary"
        class="sidebar-card__link"
        data-test-id="sidebar-card-link"
        :href="url"
        target="_blank"
        rel="noopener"
        tabindex="0"
        @click.stop="onClick"
      >
        {{ linkText }}
      </ELink>
    </div>
    <EButton
      class="sidebar-card__dismiss"
      size="s"
      icon="close"
      icon-size="s"
      variant="bare"
      data-test-id="sidebar-card-dismiss"
      aria-label="Dismiss the card"
      @click="onDismiss"
    />
  </ECard>
</template>

<script>
import EButton from '../button/index.vue';
import ECard from '../card/index.vue';
import ELink from '../link/index.vue';

export default {
  name: 'ESidebarCard',
  components: { EButton, ELink, ECard },
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    linkText: {
      type: String,
      default: '',
    },
    smallerText: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showCard: true,
    };
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    onDismiss() {
      this.showCard = false;
      this.$emit('dismiss');
    },
    onIntersect() {
      this.$emit('impression');
    },
  },
};
</script>

<style scoped lang="scss">
.sidebar-card {
  display: flex;
  place-self: center;
  align-self: stretch;
  width: 100%;
  padding: $space-m;

  background: var(--color-background-primary);
}

.sidebar-card__body {
  margin: 0 $space-2s;

  line-height: $line-height-m;

  @include tablet {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.sidebar-card__title {
  display: flex;
  margin-block: 0;

  color: var(--color-text-primary);
  font-size: $font-l;
  font-weight: $font-weight-700;
}

.sidebar-card__description {
  display: flex;
  margin: $space-2s 0;
  margin-right: $space-1s;
  margin-block: 0;

  color: var(--color-text-primary);
  font-size: $font-l;
  font-weight: $font-weight-400;
}

.sidebar-card__description--m {
  font-size: $font-m;
}

.sidebar-card__link {
  display: inline-flex;
  margin-top: $space-2s;

  font-size: $font-m;
  font-weight: $font-weight-400;
}

.sidebar-card__illustration {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  margin-right: $space-m;
}
</style>
