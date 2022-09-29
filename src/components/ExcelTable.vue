<template>
  <table>
    <thead>
      <th v-for="(item, index) in headers" :key="index">
        {{ item }}
      </th>
    </thead>
    <tbody>
      <tr v-for="(line, index) in data" :key="index">
        <td v-for="(item, index) in line" :key="index">{{ item }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["data"],
  data: function () {
    return {
      headers: ["신청시간", "소환사명", "메일주소", "연락처", "약관동의"],
    };
  },
};
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
  width: 150px;
  padding: 10px;
  font-weight: bold;
  vertical-align: top;
  color: #fff;
  background: #e7708d;
  margin: 20px 10px;
}
table tbody th {
  width: 150px;
  padding: 10px;
}
table td {
  width: 350px;
  padding: 10px;
  vertical-align: top;
}
table .even {
  background: #fdf3f5;
}
</style>
