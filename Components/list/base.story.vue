<template>
  <div>
    <p>Unordered list</p>
    <EList>
      <EListItem>An item</EListItem>
      <EListItem>Another item</EListItem>
      <EListItem :highlighted="true">
        Highlighted item
      </EListItem>
    </EList>
    <p>Ordered list</p>
    <EList ordered>
      <EListItem>First item</EListItem>
      <EListItem>Second item</EListItem>
      <EListItem :highlighted="true">
        Highlighted third item
      </EListItem>
    </EList>
  </div>
</template>

<script>
import EListItem from '../list-item/index.vue';
import EList from './index.vue';

export default {
  name: 'BaseList',
  components: { EListItem, EList },
};
</script>
