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
          //row : 엑셀의 한 행이 json으로 추출됨
          console.log(`sheetName: `, sheetName);
          const row = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
          console.log(`row: `, row);
        });
      };
      reader.readAsBinaryString(file);
    },
  },
};
</script>
