<template>
  <nav
    v-if="hasLinks"
    class="breadcrumb-nav"
    :aria-label="$t('common.breadcrumbnav.label')"
  >
    <ol class="breadcrumb-nav__list">
      <li
        v-for="link in links"
        :key="link.href"
        class="breadcrumb-nav__item"
      >
        <ELink
          :href="link.href"
          surrounded-text
          data-test-id="breadcrumb-nav-item-link"
        >
          {{ link.text }}
        </ELink>
        <EIcon
          class="breadcrumb-nav__item__separator"
          icon="chevron-right"
          size="s"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

export default {
  name: 'EBreadcrumbNav',
  components: {
    EIcon,
    ELink,
  },
  props: {
    links: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    hasLinks() {
      return this.links.length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb-nav__list {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;

  list-style: none;
}

.breadcrumb-nav__item {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-nav__item__separator {
  margin: 0 $space-2s;
}
</style>
