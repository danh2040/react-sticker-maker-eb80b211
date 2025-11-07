<template>
  <img
    :src="src"
    :srcset="srcset"
    alt=""
    aria-hidden="true"
    v-on="$listeners"
  >
</template>

<script>
export default {
  name: 'EAvatarGoogle',
  props: {
    imageSrc: {
      type: String,
      required: true,
      validator: (value) => value && value.length > 0,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  computed: {
    src() {
      return this.getResizedImageSrc(this.size);
    },
    srcset() {
      return `${this.getResizedImageSrc(this.size)} 1x, ${this.getResizedImageSrc(this.size * 2)} 2x`;
    },
  },
  methods: {
    getResizedImageSrc(size) {
      // https://developers.google.com/people/image-sizing
      const [imageWithNoAttributes] = this.imageSrc.split('=');
      return `${imageWithNoAttributes}=s${size}-c`;
    },
  },
};
</script>
