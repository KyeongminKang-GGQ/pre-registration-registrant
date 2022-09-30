<template>
  <input
    class="upload-name"
    placeholder="사전예약자 명단 첨부(.xlsx)"
    :value="fileName"
  />
  <label for="file">파일찾기</label>
  <input type="file" id="file" @change="onChange" />
</template>

<script>
import * as XLSX from "xlsx";
import { Status } from "./ExcelTable.vue";

export default {
  data: function () {
    return {
      fileName: "",
    };
  },
  methods: {
    onChange(event) {
      const file = event.target.files[0];
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        const excelData = reader.result;
        const workBook = XLSX.read(excelData, { type: "binary" });
        //workBook.SheetNames : 엑셀파일의 시트이름이 배열로 담김
        console.log(`workBook: `, workBook);

        const data = [];

        workBook.SheetNames.forEach((sheetName) => {
          const sheet = workBook.Sheets[sheetName];
          console.log(`sheetName: `, sheetName);

          const jsonData = XLSX.utils.sheet_to_json(sheet);
          Object.entries(jsonData).forEach(([key, value]) => {
            const entries = Object.values(value);
            const date = this.convertToDate(entries[0]).toLocaleString();
            const summonerName = entries[1];
            const email = entries[2];
            const phone = entries[3];
            let status = "";

            for (var i = 0; i < data.length; i++) {
              if (data[i].email === email) {
                status = Status.DUPLICATE_EMAIL;
              } else if (data[i].phone === phone) {
                status = Status.DUPLICATE_NUMBER;
              } else if (data[i].summonerName === summonerName) {
                status = Status.DUPLICATE_SUMMONER_NAME;
              }
            }

            data.push({
              id: key,
              date: date,
              summonerName: summonerName,
              email: email,
              phone: phone,
              status: status,
              selected: false,
            });
          });
          this.$emit("data", data);
        });
      };
      reader.readAsBinaryString(file);
    },

    getHeader(sheet) {
      var headers = [],
        range = XLSX.utils.decode_range(sheet["!ref"]);
      var C,
        R = range.s.r; /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        var cell =
          sheet[
            XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* find the cell in the first row */
        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },

    convertToDate(GoogleDateValue) {
      return new Date(
        new Date(
          1899,
          11,
          30 + Math.floor(GoogleDateValue),
          0,
          0,
          0,
          0
        ).getTime() +
          (GoogleDateValue % 1) * 86400000
      );
    },
  },
};
</script>

<style scoped>
.upload-name {
  display: inline-block;
  height: 40px;
  padding: 0 10px;
  vertical-align: middle;
  border: 1px solid #dddddd;
  width: 20%;
  color: #999999;
}

label {
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  vertical-align: middle;
  background-color: #999999;
  cursor: pointer;
  height: 20px;
  margin-left: 10px;
}

input[type="file"] {
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
}
</style>
