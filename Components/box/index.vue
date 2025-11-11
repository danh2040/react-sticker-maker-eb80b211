<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

export const paddings = ['none', '3s', '2s', 's', 'm', 'l', '2l', '3l', '4l', '5l', '6l'];

export default {
  name: 'EBox',
  mixins: [classes],
  props: {
    /**
      `button, a`
    */
    as: {
      type: String,
      default: 'div',
    },
    /**
     * `none, 3s, 2s, s, m, l, 2l, 3l, 4l, 5l, 6l`
     */
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    padding: {
      type: String,
      default: 'm',
      validator: (padding) => paddings.includes(padding),
      cssClass: true,
    },
  },
  render(create) {
    const options = {
      class: this.classes,
      on: this.$listeners,
    };
    return create(this.as, options, this.$slots.default);
  },
};
</script>

<style lang="scss" scoped>
.box {
  @include elevation(1);
  border-radius: $border-radius-l;

  background-color: var(--color-background-primary);

  @each $name, $padding in $spaces {
    &--padding-#{$name} {
      padding: $padding;
    }
  }
}
</style>
