<template>
  <Editor :value="value" :plugins="plugins" @change="handleChange" />
</template>

<script>
import gfm from "@bytemd/plugin-gfm";
import { Editor, Viewer } from "@bytemd/vue-next";

const plugins = [
  gfm(),
  // Add more plugins here
];

export default {
  components: { Editor },
  data() {
    return { value: "", plugins };
  },
  methods: {
    handleChange(v) {
      this.value = v;
    },
  },
};
</script>
