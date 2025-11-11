<template>
  <div class="story">
    <h2>Sizes</h2>
    <table>
      <thead>
        <tr>
          <th>Size</th>
          <th>All breakpoints</th>
          <th>Mobile and tablet</th>
          <th>Desktop-only</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>S</th>
          <td>
            <ELinkBubble
              href="https://someurlyouhaventvisited1.com"
              target="_blank"
              rel="noopener noreferrer"
              color="result"
              size="s"
            >
              A Link Bubble
            </ELinkBubble>
          </td>
          <td>
            <ELinkBubble
              href="https://someurlyouhaventvisited2.com"
              target="_blank"
              rel="noopener noreferrer"
              color="result"
              size="s"
              at-breakpoint="mobile-tablet"
            >
              A Link Bubble
            </ELinkBubble>
          </td>
          <td>
            <ELinkBubble
              href="https://someurlyouhaventvisited3.com"
              target="_blank"
              rel="noopener noreferrer"
              color="result"
              size="s"
              at-breakpoint="desktop"
            >
              A Link Bubble
            </ELinkBubble>
          </td>
        </tr>
        <tr>
          <th>L</th>
          <td>
            <ELinkBubble
              href="https://someurlyouhaventvisited1.com"
              target="_blank"
              rel="noopener noreferrer"
              color="result"
              size="l"
            >
              A Link Bubble
            </ELinkBubble>
          </td>
          <td>
            <ELinkBubble
              href="https://someurlyouhaventvisited2.com"
              target="_blank"
              rel="noopener noreferrer"
              color="result"
              size="l"
              at-breakpoint="mobile-tablet"
            >
              A Link Bubble
            </ELinkBubble>
          </td>
          <td>
            <ELinkBubble
              href="https://someurlyouhaventvisited3.com"
              target="_blank"
              rel="noopener noreferrer"
              color="result"
              size="l"
              at-breakpoint="desktop"
            >
              A Link Bubble
            </ELinkBubble>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>Colors</h2>
    <div class="wrapper">
      <ELinkBubble
        href="https://someurlyouhaventvisited1.com"
        target="_blank"
        rel="noopener noreferrer"
        color="result"
        size="l"
      >
        Link Bubble in light theme
      </ELinkBubble>
      <ELinkBubble
        :href="currentUrl"
        target="_blank"
        rel="noopener noreferrer"
        color="result"
        size="l"
      >
        Visited Link
      </ELinkBubble>
    </div>
    <div class="dark">
      <div class="wrapper">
        <ELinkBubble
          href="https://someurlyouhaventvisited1.com"
          target="_blank"
          rel="noopener noreferrer"
          color="result"
          size="l"
        >
          Link Bubble in dark theme
        </ELinkBubble>
        <ELinkBubble
          :href="currentUrl"
          target="_blank"
          rel="noopener noreferrer"
          color="result"
          size="l"
        >
          Visited Link
        </ELinkBubble>
      </div>
    </div>
  </div>
</template>

<script>
import ELinkBubble, { breakpoints, sizes } from './index.vue';

export default {
  name: 'Base',
  statusId: 'LinkBubble',
  components: { ELinkBubble },
  computed: {
    breakpoints: () => breakpoints,
    sizes: () => sizes,
    currentUrl: () => location.href,
  },
};
</script>

<style lang="scss" scoped>
.story td,
.story th {
  padding: $space-l;

  text-align: left;
}

.story a {
  white-space: nowrap;
}

.wrapper {
  display: inline-flex;
  padding: 8px;

  background: repeating-linear-gradient(
    -45deg,
    var(--color-background-primary),
    var(--color-background-primary) 8px,
    var(--color-background-secondary) 8px,
    var(--color-background-secondary) 16px
  );
}
</style>
