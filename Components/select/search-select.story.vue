<template>
  <div class="wrapper">
    <p>List of countries:</p>
    <ESearchSelect
      v-model="country"
      name="countries"
      :type-ahead="true"
      :options="options"
      placeholder="Select an option"
      options-shown="6"
    />
    <p>
      Selected country: {{ country || 'none' }}.
    </p>
    <p>Example with value and label</p>
    <ESearchSelect
      v-model="choice"
      name="countries"
      :type-ahead="true"
      :options="choices"
      placeholder="Select an option"
      options-shown="6"
    />
    <p>
      Selected choice: {{ choice || 'no choice selected' }}.
    </p>
    <p>When the prop singleLineOptions is set to true, the options are clipped to 1 line only.</p>
    <ESearchSelect
      v-model="selectedCurrency"
      name="currencies"
      :single-line-options="true"
      placeholder="Select a currency"
      :options="currencies"
      options-shown="5"
    />
    <p>Selected currency: {{ selectedCurrency || 'no currency selected' }}.</p>
  </div>
</template>

<script>
import ESearchSelect from './search-select.vue';

export default {
  components: {
    ESearchSelect,
  },
  data() {
    return {
      country: '',
      option: null,
      options: ['Argentina', 'Australia', 'Austria', 'Belgium (fr)',
        'Belgium (nl)', 'Brazil', 'Bulgaria', 'Canada (en)',
        'Canada (fr)', 'Chile', 'China', 'Colombia', 'Croatia',
        'Denmark', 'Finland', 'France', 'Germany', 'Hong Kong',
        'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Latvia',
        'Lithuania', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand',
        'Norway', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Russia',
        'Saudi Arabia (ar)', 'Saudi Arabia (en)', 'Singapore', 'Slovakia',
        'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland (de)',
        'Switzerland (fr)', 'Taiwan', 'Thailand (en)', 'Thailand (th)',
        'Turkey', 'Ukraine', 'United Kingdom', 'United States (en)',
        'United States (es)', 'Venezuela', 'Vietnam (en)', 'Vietnam (vi)'],
      choice: '',
      choices: [
        { value: 'option1', label: 'First Option' },
        { value: 'option2', label: 'Second Option' },
        { value: 'none', label: 'None of the above' },
      ],
      currencies: [
        'BRL - Brazilian Real',
        'BAM - Bosnia-Herzegovina Convertible Mark',
        'CNY - Chinese Yuan',
        'EUR - Euro',
        'XCD - East Caribbean Dollar',
      ],
      selectedCurrency: '',
    };
  },
};
</script>

<style lang="scss">
  .wrapper {
    height: 300px;
  }
</style>
