<template>
  <button @click="enroll">자동 등록</button>
  <div>
    <p v-if="canEnrollment == false">선택된 사전 예약자가 없습니다.</p>
    <ul v-if="canEnrollment == true">
      <li v-for="(item, index) in selectedData" :key="index">
        SummonerName: {{ item.summonerName }}, Email: {{ item.email }}
      </li>
    </ul>
  </div>
  <table>
    <thead>
      <th>
        <input
          type="checkbox"
          v-model="allChecked"
          @click="checkedAll($event.target.checked)"
        />
      </th>
      <th v-for="(item, index) in headers" :key="index">
        {{ item }}
      </th>
    </thead>
    <tbody>
      <tr v-for="(line, index) in data" :key="index">
        <td>
          <input
            type="checkbox"
            :disabled="line.status != ''"
            @change="selected($event)"
            v-model="line.selected"
          />
        </td>
        <td>{{ line.id }}</td>
        <td>{{ line.date }}</td>
        <td>{{ line.summonerName }}</td>
        <td>{{ line.email }}</td>
        <td>{{ line.phone }}</td>
        <td>{{ line.status }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from "axios";
// import { Schema, model } from "mongoose";

// const PreRegisteredSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   puuid: {
//     type: String,
//     required: true,
//   },
// });
// const PreRegistered = model("preregisteredUser", PreRegisteredSchema);

const applicationAxios = axios.create({
  // withCredentials: true,
  baseURL:
    "http://alb-an2-d-pub-ggq-lol-1832451122.ap-northeast-2.elb.amazonaws.com",
  // headers: {
  // "Access-Control-Allow-Origin": "*",
  // "Content-Type": "application/json",
  // },
});

const localServerAxios = axios.create({
  // withCredentials: true,
  baseURL: "http://localhost:3000",
  // headers: {
  // "Access-Control-Allow-Origin": "*",
  // "Content-Type": "application/json",
  // },
});

export default {
  props: ["initData"],
  data: function () {
    return {
      headers: ["Id", "신청시간", "소환사명", "메일주소", "연락처", "상태"],
      allChecked: false,
      selectedData: [],
    };
  },
  computed: {
    data: {
      get: function () {
        return this.initData;
      },
      set: function (value) {
        this.$emit("data", value);
      },
    },
    selectableItemCount: {
      get: function () {
        return this.initData.filter((data) => data.status == "").length;
      },
    },
    canEnrollment: {
      get: function () {
        return this.selectedData && this.selectedData.length > 0;
      },
      set: function (value) {
        this.$emit("canEnrollment", value);
      },
    },
  },
  methods: {
    checkedAll(checked) {
      console.log("checkedAll: ", this.data.length);
      this.allChecked = checked;
      for (let i in this.data) {
        if (this.data[i].status == "") {
          this.data[i].selected = this.allChecked;
        }
      }
      this.selectedData = this.data.filter((data) => data.selected);
    },
    selected(e) {
      this.allChecked =
        this.data.filter((data) => data.selected).length ==
        this.selectableItemCount;
      this.selectedData = this.data.filter((data) => data.selected);
    },
    async requestToEnroll(information) {
      let puuid;
      try {
        const response = await applicationAxios.get(
          `/application/v1/summoners/by-name/${information.summonerName}`
        );
        puuid = response.data.puuid;
      } catch (err) {
        for (let i in this.data) {
          if (this.data[i].id == information.id) {
            this.data[i].status = "소환사명 에러";
            this.data[i].selected = false;
          }
        }
        console.log("Get puuid error: ", err);
        return;
      }

      if (await this.isRegisterEnabled(information.id, information.email)) {
        console.log("already existed email: ", information.email);
      } else {
        console.log("can register email: ", information.email);
        await this.saveEmail(information.id, information.email, puuid);
      }
    },

    async enroll() {
      const reqObject = JSON.parse(JSON.stringify(this.selectedData));
      Object.entries(reqObject).forEach(async ([key, value]) => {
        await this.requestToEnroll(value);
      });
    },

    async isRegisterEnabled(id, email) {
      try {
        const params = {
          email: email,
        };
        const response = await localServerAxios.get(`/preregistered-email`, {
          params: params,
        });
        console.log(response);
        return true;
      } catch (err) {
        for (let i in this.data) {
          if (this.data[i].id == id) {
            this.data[i].status = "이미 등록된 이메일입니다.";
            this.data[i].selected = false;
          }
        }
        console.log("checkEmail error: ", err);
        return false;
      }
    },

    async saveEmail(id, email, puuid) {
      try {
        const response = await localServerAxios.post(`/preregistered-email`, {
          email: email,
          puuid: puuid,
        });
        console.log(response);
      } catch (err) {
        for (let i in this.data) {
          if (this.data[i].id == id) {
            this.data[i].status = "사전 등록자 등록 에러";
            this.data[i].selected = false;
          }
        }
        console.log("saveEmail error: ", err);
      }
    },
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
  vertical-align: top;
}

div {
  margin-top: 20px;
}

button {
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  vertical-align: middle;
  background-color: #ff0000;
  cursor: pointer;
  height: 40px;
  margin-left: 10px;
}
</style>
