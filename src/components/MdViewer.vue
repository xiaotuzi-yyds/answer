<template>
  <Viewer :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import highlight from "@bytemd/plugin-highlight";
import { Viewer } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";
import gfm from "@bytemd/plugin-gfm";

interface Props {
  value: string;
}

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
});
</script>