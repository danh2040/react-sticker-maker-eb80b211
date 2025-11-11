<template>
  <div :id="containerId" :invisible="true" />
</template>

<script>
import { mapActions } from 'pinia';

import { useTurnstileStore } from '@ecosia/store/turnstile/index.js';
const turnstileSrc = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const turnstileLoadFunction = 'cfTurnstileOnLoad';
export default {
  name: 'Turnstile',
  components: { },
  props: {
    containerId: {
      type: String,
      default: 'turnstile-container',
    },
    widgetId: {
      type: String,
      required: true,
    },
    loadScript: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    turnstileOptions() {
      return {
        'sitekey': this.$config.turnstileSiteKeys[this.widgetId],
        'callback': this.successCallback,
        'error-callback': this.errorCallback,
        'expired-callback': this.expiredCallback,
        'unsupported-callback': this.unsupportedCallback,
        'action': this.widgetId,
        'invisible': true,
      };
    },
  },
  beforeMount() {
    this.init();
  },
  methods: {
    ...mapActions(useTurnstileStore, [
      'setTurnstileToken',
      'refreshTurnstile',
      'setTurnstileError',
    ]),
    init() {
      /* eslint-disable better-mutation/no-mutation -- external script loading routine */
      const cfTurnstileOnLoad = () => {
        window.turnstile.render(
          `#${this.containerId}`,
          this.turnstileOptions,
        );
      };
      window[turnstileLoadFunction] = cfTurnstileOnLoad;
      if (this.loadScript) {
        this.$emit('turnstile-loading', this.widgetId);
        const url = `${turnstileSrc}?onload=${turnstileLoadFunction}`;
        const script = document.createElement('script');
        script.id = 'cfTurnstileScript';
        script.defer = true;
        script.src = url;
        script.addEventListener('error', () => {
          this.$emit('turnstile-script-error', this.widgetId);
        });
        document.head.appendChild(script);
      }
      /* eslint-enable better-mutation/no-mutation -- external script loading routine */
    },
    successCallback(token) {
      this.$emit('turnstile-success', token, this.widgetId);
      this.setTurnstileToken(token);
      // eslint-disable-next-line better-mutation/no-mutation -- creating global variable
      window.turnstileReady = true;
    },
    errorCallback(response) {
      this.$emit('turnstile-error', response, this.widgetId);

      this.setTurnstileError(response);
      this.captureTurnstileError('Turnstile script error', response);
    },
    expiredCallback() {
      this.$emit('turnstile-expired');

      this.refreshTurnstile();
    },
    unsupportedCallback(response) {
      this.$emit('turnstile-unsupported', response, this.widgetId);

      this.setTurnstileError();
      this.captureTurnstileError('Turnstile unsupported', response);
    },

    captureTurnstileError(message, error) {
      const turnstileError = new Error(message, { cause: error });
      turnstileError.name = 'TurnstileError';
      this.$sentry.captureException('Turnstile error', turnstileError);
    },
  },
};
</script>
