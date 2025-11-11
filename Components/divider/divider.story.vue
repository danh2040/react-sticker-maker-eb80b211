<template>
  <div class="example__container">
    <div class="example__left">
      left
    </div>
    <div class="example__right">
      right
    </div>
    <div class="example__top">
      top
    </div>
    <div class="example__bottom">
      bottom
    </div>
  </div>
</template>

<script>

export default {
  name: 'Divider',
  statusId: 'Divider',
};
</script>

<style lang="scss" scoped>

.example__container {
  display: flex;
}

.example__left,
.example__right,
.example__top,
.example__bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
}

.example__left {
  @include divider('left');
}

.example__right {
  @include divider('right');
}

.example__top {
  @include divider('top');
}

.example__bottom {
  @include divider('bottom');
}
</style>
