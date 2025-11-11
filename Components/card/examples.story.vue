<template>
  <div class="container">
    <ECard as="article" class="example-card">
      <header class="header">
        <img src="images/example.jpg">
      </header>
      <div class="content">
        <h3>Title text</h3>
        <p>Body Text</p>
      </div>
      <footer class="footer">
        I am a footer
      </footer>
    </ECard>

    <ECard as="a" class="example-card" href="https://www.ecosia.org">
      <div class="content">
        <h3>Title text</h3>
        <p>
          This card sets an <em>href</em>, so it will become clickable.
        </p>
      </div>
    </ECard>

    <ECard class="example-card" :border="true">
      <div class="content">
        <h3>Title text</h3>
        <p>
          Card with border for plain backgrounds.
        </p>
      </div>
    </ECard>

    <ECard class="example-card">
      <div class="content">
        <h3>Title text</h3>
        <p>Body Text</p>
      </div>
      <footer class="footer">
        I am a footer
      </footer>
    </ECard>
  </div>
</template>

<script>
import ECard from './index.vue';

export default {
  name: 'BaseCard',
  statusId: 'Card',
  components: { ECard },
};
</script>

<style lang="scss" scoped>
.example-card {
  width: 200px;
  margin: $space-s;

  background-color: var(--color-background-primary);

  color: var(--color-text-primary);
  font-size: $font-m;
}

.example-card img {
  width: 100%;
}

.container {
  display: flex;
  align-items: flex-start;

  background: repeating-linear-gradient(
    -45deg,
    var(--color-background-primary),
    var(--color-background-primary) 8px,
    var(--color-background-secondary) 8px,
    var(--color-background-secondary) 16px
  );
}

.content {
  padding: $space-s;

  > * {
    margin: 0;
  }
}

.footer {
  padding: $space-1s $space-s;

  font-size: $font-s;
}

h3 {
  margin-top: 0;
}

</style>
