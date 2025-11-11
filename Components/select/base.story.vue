<template>
  <div>
    <p>List of countries:</p>
    <ESelect
      v-model="country"
      name="countries"
      :type-ahead="true"
      :options="options"
      placeholder="Select an option"
      options-shown="6"
    />
    <p>Select in invalid state (red border):</p>
    <ESelect
      v-model="option2"
      name="invalid"
      :options="options"
      placeholder="Select an option"
      invalid
    />
    <p>
      Selected country: {{ country || 'none' }}.
      <br>
      Selected option: {{ option2 ? options2[option2].label : 'none' }}.
    </p>
    <hr>
    <p>
      Select with different `label` and `inputLabel`
    </p>
    <ESelect
      v-model="option3"
      name="withInputLabel"
      :options="optionsWithInputLabel"
      placeholder="Select an option"
    />
    <p>
      Selected option: {{ option3 ?
        `${optionWithInputLabel.label} (${optionWithInputLabel.inputLabel})`
        : 'none'
      }}.
    </p>
  </div>
</template>

<script>
import ESelect from './index.vue';

export default {
  components: {
    ESelect,
  },
  data() {
    return {
      country: null,
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
      options2: ['First Option', 'Second Option'],
      option2: null,
      option3: null,
      optionsWithInputLabel: [
        {
          value: 'de',
          label: 'Federal Republic of Germany',
          inputLabel: 'Germany',
        },
        {
          value: 'us',
          label: 'United States of America',
          inputLabel: 'USA',
        },
      ],
    };
  },
  computed: {
    optionWithInputLabel() {
      return this.optionsWithInputLabel.find((option) => option.value === this.option3);
    },
  },
};
</script>
