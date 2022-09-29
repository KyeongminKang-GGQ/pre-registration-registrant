<template>
  <div class="app">
    <HowToUse />
    <SelectFile @data="setData" @headers="setHeaders" /><ExcelTable
      v-if="showExcel"
      v-bind:data="data"
    />
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
      showExcel: false,
      data: [],
    };
  },
  methods: {
    setData(data) {
      console.log("setData success: ", data);
      this.data = data;
    },

    setHeaders(headers) {
      this.showExcel = true;
    },
  },
};
</script>

<style scoped></style>
