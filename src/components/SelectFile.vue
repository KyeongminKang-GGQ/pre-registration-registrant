<template>
  <input type="file" @change="onChange" />
</template>

<script>
import * as XLSX from "xlsx";

export default {
  methods: {
    onChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        const workBook = XLSX.read(data, { type: "binary" });
        //workBook.SheetNames : 엑셀파일의 시트이름이 배열로 담김
        console.log(`workBook: `, workBook);
        workBook.SheetNames.forEach((sheetName) => {
          const sheet = workBook.Sheets[sheetName];
          //row : 엑셀의 한 행이 json으로 추출됨
          console.log(`sheetName: `, sheetName);
          const data = XLSX.utils.sheet_to_json(sheet);
          //console.log(`row: `, row);
          this.$emit("data", data);
          const headers = this.getHeader(sheet);
          this.$emit("headers", headers);
          //console.log(`headers: `, headers);
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
  },
};
</script>
