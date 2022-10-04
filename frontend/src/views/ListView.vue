<template>
  <div>
    <table>
      <thead>
        <th v-for="(item, index) in headers" :key="index">
          {{ item }}
        </th>
      </thead>
      <tbody>
        <tr v-for="(line, index) in data" :key="index">
          <td>{{ line.email }}</td>
          <td>
            {{ line.puuid }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs } from "vue";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";

const localServerAxios = axios.create({
  // withCredentials: true,
  baseURL: process.env.VUE_APP_LOCAL_SERVER,
  // headers: {
  // "Access-Control-Allow-Origin": "*",
  // "Content-Type": "application/json",
  // },
});

export default defineComponent({
  setup(props, { emit }) {
    const headers = ["메일주소", "PUUID"];
    let data = ref([]);

    onMounted(async () => {
      const response = await localServerAxios.get(`/preregistered-email`);
      data.value = response.data;
      console.log(`data`, data);
    });

    return {
      headers,
      data,
    };
  },
});
</script>

<style scoped>
table {
  border-collapse: collapse;
  text-align: left;
  line-height: 1.5;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin: 20px 10px;
}
table thead th {
  padding: 10px;
  font-weight: bold;
  vertical-align: top;
  color: #fff;
  background: #e7708d;
  margin: 20px 10px;
}
table tbody th {
  padding: 10px;
}
table td {
  padding: 10px;
  vertical-align: middle;
  overflow-y: scroll;
}
</style>
