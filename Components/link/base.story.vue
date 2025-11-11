<template>
  <div class="story">
    <table>
      <thead>
        <tr>
          <th>Variant</th>
          <th>Default</th>
          <th>Visited</th>
          <th>Use</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>result</th>
          <td>
            <ELink
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              color="result"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            <ELink
              :href="visitedUrl"
              target="_blank"
              rel="noopener noreferrer"
              color="result"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            Search results title
          </td>
        </tr>
        <tr>
          <th>primary</th>
          <td>
            <ELink
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            <ELink
              :href="visitedUrl"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            Primary action in information context (captions, tooltips, dropdowns)
          </td>
        </tr>
        <tr>
          <th>secondary</th>
          <td>
            <ELink
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              color="secondary"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            <ELink
              :href="visitedUrl"
              target="_blank"
              rel="noopener noreferrer"
              color="secondary"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            Secondary action, usually next to primary
          </td>
        </tr>
        <tr>
          <th>dark</th>
          <td>
            <ELink
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              color="dark"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            <ELink
              :href="visitedUrl"
              target="_blank"
              rel="noopener noreferrer"
              color="dark"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            Titles with links, e.g. image results and maps listings
          </td>
        </tr>
        <tr>
          <th>bare</th>
          <td>
            <ELink
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              color="bare"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            <ELink
              :href="visitedUrl"
              target="_blank"
              rel="noopener noreferrer"
              color="bare"
            >
              The trees are quiet
            </ELink>
          </td>
          <td>
            Other contexts where button is not appropriate
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import upperFirst from '@ecosia/js-utils/upper-first.js';

import ELink, { colors } from './index.vue';

export default {
  name: 'Base',
  statusId: 'Links',
  components: { ELink },
  computed: {
    colors: () => colors,
    url: () => `https://www.ecosia.org/search?q=veryunlikelyquery${Math.random()}`,
    visitedUrl: () => window.parent.location.href,
  },
  methods: {
    formatColor(string) {
      return upperFirst(string);
    },
  },
};
</script>

<style lang="scss" scoped>
.story td,
.story th {
  padding: $space-l;

  text-align: left;
}

.dark a {
  background: var(--color-background-tertiary);
}

.story a {
  white-space: nowrap;
}
</style>
