<script lang="ts">
export default {
  name: 'BookView',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      media: null,
    };
  },
};
</script>

<template>
  <div>"Book View" {{ id }}</div>
</template>
