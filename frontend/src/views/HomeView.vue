<template>
  <div class="app">
    <HowToUse />
    <SelectFile @data="setData" />
    <ExcelTable v-bind:initData="data" v-bind:accessToken="accessToken" />
  </div>
</template>

<script>
import HowToUse from "../components/HowToUse.vue";
import SelectFile from "../components/SelectFile.vue";
import ExcelTable from "../components/ExcelTable.vue";
import { onMounted } from "@vue/runtime-core";
import { defineComponent, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  components: { HowToUse, SelectFile, ExcelTable },
  props: {},
  data: function () {
    return {
      data: [],
      accessToken: this.$route.query.accessToken,
    };
  },
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const accessToken = ref(route.query.accessToken);

    onMounted(() => {
      if (!accessToken) {
        alert(`Token is empty, Re-Login`);
        router.push({ name: "login" });
      }
    });
    return {};
  },
  methods: {
    setData(value) {
      this.data = value;
    },
  },
});
</script>
