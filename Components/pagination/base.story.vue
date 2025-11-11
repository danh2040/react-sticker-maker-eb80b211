<template>
  <div>
    <EPagination
      :current="0"
      :pages="4"
      base-url="https://www.ecosia.org"
    />
    <EPagination
      :current="2"
      :pages="4"
      base-url="https://www.ecosia.org"
    />
    <EPagination
      :current="3"
      :pages="4"
      base-url="https://www.ecosia.org"
    />
  </div>
</template>

<script>
import EPagination from './index.vue';

export default {
  name: 'BasePagination',
  statusId: 'Navigation/Pagination',
  components: { EPagination },
};
</script>
