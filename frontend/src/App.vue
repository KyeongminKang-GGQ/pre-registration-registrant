<template>
  <div class="app">
    <HowToUse />
    <SelectFile @data="setData" />
    <ExcelTable v-bind:initData="data" />
  </div>
</template>

<script>
import HowToUse from "./components/HowToUse.vue";
import SelectFile from "./components/SelectFile.vue";
import ExcelTable from "./components/ExcelTable.vue";

export default {
  components: { HowToUse, SelectFile, ExcelTable },
  data() {
    return {
      data: [],
      selectedData: [],
    };
  },
  methods: {
    setData(data) {
      this.data = data;
    },
  },
};
</script>
