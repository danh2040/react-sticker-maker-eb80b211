# Turnstile

## General documentation

Cloudflare documentation: <https://developers.cloudflare.com/turnstile/>

Internal documentation: <https://ecosia.atlassian.net/wiki/spaces/DEV/pages/3372449794/Turnstile>

## Usage

```js
import Turnstile from '@ecosia/common-vue2/components/turnstile';

<Turnstile
  widget-id="chat"
  @turnstile-success="turnstileSuccess"
  @turnstile-loading="onInitTurnstile"
  @turnstile-unsupported="onUnsupportedTurnstile"
  @turnstile-script-error="onTurnstileScriptError"
/>
```

Turnstile is a CAPTCHA service from Cloudflare. The turnstile component embeds the turnstile client via a `script` tag. To identify it uses a public siteKey which is used together with a secretKey on the backend. The script immediately does the "check" and then emits various events for different states. `turnstile-success`, `turnstile-script-error`, `turnstile-unsupported`, `turnstile-loading`.

We are currently only using the ["invisible"](<https://developers.cloudflare.com/turnstile/concepts/widget/#invisible>) mode by default. If we would use a ["managed"](<https://developers.cloudflare.com/turnstile/concepts/widget/#managed-recommended>) mode the turnstile widget would be displayed at `<div :id="containerId" />`.

The turnstile-success event emits a token which can be stored somewhere (in a store or localstorage). This token is valid for 300s and can only be consumed once. You can use this token in requests to an API.

Once the script is initialised, we have access to `window.turnstile`. Which gives access to turnstile state and various methods like `window.turnstile.reset()`.
