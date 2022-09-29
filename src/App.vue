<template>
  <div class="app"><HowToUse /> <SelectFile /></div>
</template>

<script>
import HowToUse from "./components/HowToUse.vue";
import SelectFile from "./components/SelectFile.vue";

export default {
  components: { HowToUse, SelectFile },
};
</script>

<style scoped></style>
