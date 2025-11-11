<template>
  <div class="loading" aria-label="Loading indicator" role="img">
    <div class="loading__container">
      <EIcon
        class="loading__icon"
        icon="source-ecosia"
        data-test-id="loading-icon"
      />
      <svg class="loading__spinner" width="28" height="28" viewBox="25 25 50 50">
        <circle
          class="loading__spinner-circle"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke-width="3"
          stroke-miterlimit="10"
          data-test-id="loading-spinner"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

export default {
  name: 'ELoading',
  components: {
    EIcon,
  },
};
</script>

<style lang="scss" scoped>
@keyframes loading-rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}

.loading {
  padding: $space-l 0;
}

.loading__container {
  position: relative;
  width: $icon-size-m;
  height: $icon-size-m;
  margin: auto;
}

.loading__icon,
.loading__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
}

.loading__icon {
  transform: translate(-50%, -50%) scale($scale-4l);

  ::v-deep [data-circle] {
    display: none;
  }
}

// TODO: figure out if it's possible to animate the original circle inside the SVG instead of
// creating one here
.loading__spinner {
  transform: translate(-50%, -50%);
  transform-origin: center center;
  animation: loading-rotate 2s linear infinite;
}

.loading__spinner-circle {
  animation: loading-dash 1.5s ease-in-out infinite;

  stroke-linecap: round;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
}
</style>
