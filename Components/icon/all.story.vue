<template>
  <div>
    <div v-for="{ name, icons }, size in sets" :key="size">
      <h2>{{ name }}</h2>
      <div class="icon-grid" :class="`icon-grid--${size}`">
        <span
          v-for="icon in icons"
          :key="`${size}-${icon}`"
          class="icon-item"
        >
          <EIcon :size="size" :icon="icon" />
          <p>{{ icon }}</p>
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import { getAll } from '../../../../flora/.storybook/utils/icons.js';
import EIcon, { sizes } from './index.vue';

const initial = Object.fromEntries(sizes.map((id) => {
  let name;
  switch (id) {
    case 's':
      name = 'Small';
      break;
    case 'm':
      name = 'Medium';
      break;
    case 'l':
      name = 'Large';
      break;
    default:
  }
  return [id, { name, icons: [] }];
}));
const sets = getAll().reduce((acc, [size, name]) => {
  acc[size].icons.push(name);
  return acc;
}, initial);

export default {
  components: {
    EIcon,
  },
  computed: {
    sets() {
      return sets;
    },
  },
};
</script>

<style lang="scss">
.icon-grid {
  display: grid;
  gap: 10px;
  grid-auto-rows: minmax(150px, auto);
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.icon-grid--s svg {
  width: 16px;
  height: 16px;
}

.icon-grid--m svg {
  width: 24px;
  height: 24px;
}

.icon-grid--l svg {
  width: 36px;
  height: 36px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5em;

  border: 1px solid grey;
  border-radius: 10px;
}
</style>
