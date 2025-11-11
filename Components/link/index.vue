<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

// TODO: refactor and rename to `variant`
export const variants = [
  'primary',
  'secondary',
  'dark',
  'bare',
  'result',
  'static-light',
  'static-dark',
];

export default {
  name: 'ELink',
  mixins: [classes],
  props: {
    as: {
      type: String,
      default: 'a',
      cssClass: true,
    },
    color: {
      cssClass: true,
      type: String,
      default: null,
      validator: (value) => variants.includes(value),
    },
    variant: {
      cssClass: true,
      type: String,
      default: variants[0],
      validator: (value) => variants.includes(value),
    },
  },
  render(create) {
    void this.color;
    void this.variant;
    const attrs = {};
    if (this.as !== 'a') {
      attrs.role = 'button';
    }
    const options = {
      class: this.classes,
      attrs: { ...attrs, ...this.$attrs },
      on: this.$listeners,
    };
    return create(this.as, options, this.$slots.default);
  },
};
</script>

<style lang="scss" scoped>
$variants: (
  "primary": var(--color-link-primary),
  "secondary": var(--color-link-secondary),
  "white": var(--color-link-static-light),
  "dark": var(--color-text-primary),
  "result": var(--color-link-results-default),
  "static-light": var(--color-link-static-light),
  "static-dark": var(--color-link-static-dark),
);

.link {
  transition: color $timing-2s $easing;

  cursor: pointer;

}

@each $name, $variant in $variants {
  .link--variant-#{$name}, .link--color-#{$name} {
    content: "#{$name}";

      @if $variant != 'result' {
        text-decoration: underline;

      &:hover, &:focus {
        text-decoration: underline 2px;
      }
    }

    color: $variant;

    @if $name == 'result' {
      text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
    }
  }

}

.link--variant-result {
  &:visited {
    color: var(--color-link-results-visited);
  }

}

.link--color-result {
  &:visited {
    color: var(--color-link-results-visited);
  }

}

.link--as-button {
  appearance: none;
  width: auto;
  margin: 0;
  padding: 0;
  overflow: visible;

  border: none;

  background: none;

  font: inherit;
  text-transform: none;
}
</style>
