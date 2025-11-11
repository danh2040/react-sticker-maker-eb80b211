<script>
export const allowedStyling = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
export const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'];
export const defaultTag = 'h1';

export default {
  name: 'EHeading',
  props: {
    as: {
      type: String,
      default: null,
      validator(value) {
        return allowedTags.includes(value);
      },
    },
    styledAs: {
      type: String,
      default: null,
      validator(value) {
        return allowedStyling.includes(value);
      },
    },
  },
  computed: {
    tag() {
      if (!this.$options.props.as.validator(this.as)) {
        return defaultTag;
      }

      return this.as;
    },
    style() {
      if (!this.$options.props.styledAs.validator(this.styledAs)) {
        return this.tag === 'div' ? defaultTag : this.tag;
      }
      return this.styledAs;
    },
  },
  render(create) {
    const options = {
      class: `heading heading--${this.style}`,
      on: this.$listeners,
      attrs: this.$attrs,
    };
    return create(this.tag, options, this.$slots.default);
  },
};
</script>

<style lang="scss" scoped>
.heading {
  display: block;
  margin: 0;

  color: var(--color-text-primary);
  line-height: $line-height-1s;

  &--h1 {
    font-size: $font-3l;

    @include tablet {
      font-size: $font-4l;
    }
  }

  &--h2 {
    font-size: $font-2l;

    @include tablet {
      font-size: $font-3l;
    }
  }

  &--h3 {
    font-size: $font-1l;

    @include tablet {
      font-size: $font-2l;
    }
  }

  &--h4 {
    font-size: $font-l;

    @include tablet {
      font-size: $font-1l;
    }
  }

  &--h5 {
    font-size: $font-l;

    @include tablet {
      font-size: $font-l;
    }
  }

  &--h6 {
    font-size: $font-m;

    @include tablet {
      font-size: $font-m;
    }
  }
}
</style>
