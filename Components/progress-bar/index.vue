<template>
  <div class="progress-bar__container">
    <div class="progress-bar__info-container">
      <span class="progress-bar__start-point-info">
        {{ startPointLabel }}
      </span>
      <span class="progress-bar__progress-info">
        {{ standingLabel }}
      </span>
      <span class="progress-bar__goal-info">
        {{ goalLabel }}
      </span>
    </div>
    <div class="progress-bar__wrapper">
      <div class="progress-bar__full">
        <div class="progress-bar" data-test-id="progress-bar" :style="progressStyle" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EProgressBar',
  props: {
    goal: {
      type: Number,
      required: true,
    },
    standing: {
      type: Number,
      default: 0,
    },
    startPoint: {
      type: Number,
      default: 0,
    },
    startPointLabel: {
      type: String,
      default: '',
    },
    standingLabel: {
      type: String,
      default: '',
    },
    goalLabel: {
      type: String,
      default: '',
    },
  },
  computed: {
    progress() {
      return (((this.standing - this.startPoint) / (this.goal - this.startPoint)) * 100).toFixed(1);
    },
    progressStyle() {
      return {
        width: `${Math.min(Math.max(this.progress, 0), 100).toFixed(1)}%`,
      };
    },
  },
};
</script>

<style lang="scss">
.progress-bar__container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.progress-bar__wrapper {
  display: flex;
  width: 100%;
  height: $space-s;
  padding: $space-2s 0;
  overflow: hidden;
}

.progress-bar__info-container {
  display: flex;
  width: 100%;
  margin-bottom: $space-3s;
}

.progress-bar__start-point-info,
.progress-bar__progress-info,
.progress-bar__goal-info {
  display: flex;

  font-size: $font-s;
  line-height: $line-height-s;
}

.progress-bar__start-point-info {
  justify-content: flex-start;
  width: 20%;

  color: var(--color-text-secondary);
  font-weight: $font-weight-400
}

.progress-bar__progress-info {
  justify-content: center;
  width: 60%;

  color: var(--color-brand-primary);
  font-weight: $font-weight-700
}

.progress-bar__goal-info {
  justify-content: flex-end;
  width: 20%;

  color: var(--color-text-secondary);
  font-weight: $font-weight-400
}

.progress-bar__full {
  width: 100%;

  border-radius: $space-3l;

  background-color: var(--color-background-quaternary)
}

.progress-bar {
  position: relative;
  width: 0;
  height: 100%;

  transition: $timing-l $easing;

  border-radius: $space-3l;

  background-color: var(--color-brand-primary);
}
</style>
