<template>
  <div>
    <div>
      <details>
        <summary>자동 등록</summary>
        <p class="error" v-if="canEnrollment == false">
          선택된 사전 예약자가 없습니다.
        </p>
        <ul v-if="canEnrollment == true">
          <li v-for="(item, index) in selectedData" :key="index">
            SummonerName: {{ item.summonerName }}, Email: {{ item.email }},
            puuid:
            {{ item.puuid }}
          </li>
        </ul>
        <button class="getPuuid" @click="onConvertPuuid">PUUID 변환</button>
        <button @click="onEnroll">자동 등록</button>
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
            <tr
              v-for="(line, index) in data"
              :key="index"
              :class="{
                'gold-star': line.status === '',
                'bronze-star': line.status === 'SUCCESS',
                'silver-star':
                  line.status == 'DUPLICATE_NUMBER' ||
                  line.status == 'DUPLICATE_SUMMONER_NAME' ||
                  line.status == 'DUPLICATE_EMAIL',
                'dark-silver-star':
                  line.status == 'ALREADY_REGISTERED_EMAIL' ||
                  line.status == 'ALREADY_REGISTERED_PUUID' ||
                  line.status == 'ERROR_PUUID' ||
                  line.status == 'ERROR',
              }"
            >
              <td>
                <input
                  type="checkbox"
                  @change="selected($event)"
                  v-model="line.selected"
                />
              </td>
              <td>{{ line.id }}</td>
              <td>{{ line.date }}</td>
              <td>{{ line.summonerName }}</td>
              <td>{{ line.email }}</td>
              <td>{{ line.phone }}</td>
              <td class="puuid">
                {{ line.puuid }}
              </td>
              <td>
                {{ line.status }}
              </td>
            </tr>
          </tbody>
        </table>
      </details>
    </div>
    <div>
      <details>
        <summary>수동 등록</summary>
        <p class="error">
          {{ errorMessage }}
        </p>
        <input
          class="manual"
          placeholder="이메일"
          :value="email"
          @input="(event) => (email = event.target.value)"
        />
        <input
          class="manual"
          placeholder="소환사명"
          :value="summonerName"
          @input="(event) => (summonerName = event.target.value)"
        />
        <input
          class="manual"
          placeholder="puuid (소환사명에서 자동 변환)"
          :value="puuid"
          @input="(event) => (puuid = event.target.value)"
        />
        <button @click="onManualEnroll">수동 등록</button>
      </details>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

console.log(`LOCAL_SERVER: `, process.env.VUE_APP_LOCAL_SERVER);

const localServerAxios = axios.create({
  // withCredentials: true,
  baseURL: process.env.VUE_APP_LOCAL_SERVER,
  // headers: {
  // "Access-Control-Allow-Origin": "*",
  // "Content-Type": "application/json",
  // },
});

export const Status = {
  DUPLICATE_NUMBER: "DUPLICATE_NUMBER",
  DUPLICATE_SUMMONER_NAME: "DUPLICATE_SUMMONER_NAME",
  DUPLICATE_EMAIL: "DUPLICATE_EMAIL",
  ALREADY_REGISTERED_EMAIL: "ALREADY_REGISTERED_EMAIL",
  ALREADY_REGISTERED_PUUID: "ALREADY_REGISTERED_PUUID",
  ERROR_PUUID: "ERROR_PUUID",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
};

export default {
  props: ["initData", "accessToken"],
  data: function () {
    return {
      headers: [
        "Id",
        "신청시간",
        "소환사명",
        "메일주소",
        "연락처",
        "PUUID",
        "상태",
      ],
      allChecked: false,
      selectedData: [],
      selectedServer: "localhost",
      email: "",
      summonerName: "",
      puuid: "",
      errorMessage: "",
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
        return this.initData.length;
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
    setSelectedServer(value) {
      console.log(`setSelectedServer: `, value);
      this.selectedServer = value;
    },
    checkedAll(checked) {
      console.log("checkedAll: ", this.data.length);
      this.allChecked = checked;
      for (let i in this.data) {
        this.data[i].selected = this.allChecked;
      }
      this.selectedData = this.data.filter((data) => data.selected);
    },
    selected(e) {
      this.allChecked =
        this.data.filter((data) => data.selected).length ==
        this.selectableItemCount;
      this.selectedData = this.data.filter((data) => data.selected);
    },

    async onConvertPuuid() {
      const reqObject = JSON.parse(JSON.stringify(this.selectedData));
      var puuidRequests = [];

      Object.entries(reqObject).forEach(async ([key, value]) => {
        puuidRequests.push(this.convertPuuid(value));
      });

      try {
        await Promise.all(puuidRequests);
      } catch (err) {
        //
      }
    },

    async convertPuuid(information) {
      let puuid;
      try {
        puuid = await this.getPuuid(information.summonerName);
        for (let i in this.data) {
          if (this.data[i].id == information.id) {
            this.data[i].puuid = puuid;
          }
        }
      } catch (err) {
        for (let i in this.data) {
          if (this.data[i].id == information.id) {
            this.data[i].status = Status.ERROR_PUUID;
            this.data[i].selected = false;
          }
        }
        console.log(
          `Get puuid error - summonerName: ${information.summonerName}, `,
          err
        );
      }
    },

    async onEnroll() {
      const reqObject = JSON.parse(JSON.stringify(this.selectedData));
      var checkIsRegistered = [];

      Object.entries(reqObject).forEach(async ([key, value]) => {
        checkIsRegistered.push(
          this.isRegisterEnabled(value.id, value.email, value.puuid)
        );
      });

      try {
        await Promise.all(checkIsRegistered);
      } catch (err) {
        //
      }

      await this.saveEmail();
    },

    async isRegisterEnabled(id, email, puuid) {
      try {
        await this.checkEmail(email);
      } catch (err) {
        for (let i in this.data) {
          if (this.data[i].id == id) {
            this.data[i].status = Status.ALREADY_REGISTERED_EMAIL;
            this.data[i].selected = false;
          }
        }
        console.log(
          `isRegisterEnabled error email is already exist: ${email}, `,
          err
        );
        throw err;
      }

      try {
        await this.checkPuuid(puuid);
      } catch (err) {
        for (let i in this.data) {
          if (this.data[i].id == id) {
            this.data[i].status = Status.ALREADY_REGISTERED_PUUID;
            this.data[i].selected = false;
          }
        }
        console.log(
          `isRegisterEnabled error puuid is already exist: ${puuid}, `,
          err
        );
        throw err;
      }
    },

    async checkEmail(email) {
      const params = {
        email: email,
      };
      const response = await localServerAxios.get(`/preregistered-email`, {
        params: params,
      });
      console.log(response);
      return response;
    },

    async checkPuuid(puuid) {
      const params = {
        puuid: puuid,
      };
      const response = await localServerAxios.get(`/preregistered-email`, {
        params: params,
      });
      console.log(response);
      return response;
    },

    async getPuuid(summonerName) {
      const response = await localServerAxios.get(
        `/summoners/by-name/${summonerName}`
      );
      const puuid = response.data.puuid;
      console.log(response);
      return puuid;
    },

    async postEmail(users) {
      console.log(`postEmail: `, users);

      if (users.length <= 0) {
        return;
      }
      const response = await localServerAxios.post(
        `/preregistered-email`,
        users,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
      console.log(response);
    },

    async onManualEnroll() {
      this.errorMessage = "";
      console.log(`manualEnroll email: ${this.email}, ${this.summonerName}`);

      if (!this.email) {
        this.errorMessage = "Email is empty";
        return;
      }

      if (!this.summonerName && this.puuid) {
        this.errorMessage = "summonerName is empty";
        return;
      }

      try {
        if (this.summonerName && !this.puuid) {
          const puuid = await this.getPuuid(this.summonerName);
          this.puuid = puuid;
        }
      } catch (err) {
        console.log(err);
        this.errorMessage = "PUUID 변환 에러";
        return;
      }

      try {
        await this.checkEmail(this.email);
      } catch (err) {
        console.log(err);
        this.errorMessage = "이미 사전 등록된 이메일입니다.";
        return;
      }

      try {
        await this.checkPuuid(this.puuid);
      } catch (err) {
        console.log(err);
        this.errorMessage = "이미 사전 등록된 puuid입니다.";
        return;
      }

      try {
        await this.postEmail([
          {
            email: this.email.trim(),
            puuid: this.puuid.trim(),
          },
        ]);

        this.errorMessage = "등록 성공";
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          alert(`Token is expired, Re-Login`);
          router.push({ name: "login" });
          return;
        }

        this.errorMessage = "수동 등록 에러";
      }
    },

    async saveEmail() {
      try {
        const users = [];
        for (let i in this.data) {
          if (this.data[i].selected && this.data[i].puuid) {
            users.push({
              email: this.data[i].email,
              puuid: this.data[i].puuid,
            });
          }
        }
        await this.postEmail(users);
        for (let i in this.data) {
          if (this.data[i].selected && this.data[i].puuid) {
            this.data[i].status = Status.SUCCESS;
          }
        }
        console.log(response);
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          alert(`Token is expired, Re-Login`);
          router.push({ name: "login" });
          return;
        }

        for (let i in this.data) {
          if (this.data[i].selected && this.data[i].puuid) {
            this.data[i].status = Status.ERROR;
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
  vertical-align: middle;
  overflow-y: scroll;
}

.puuid {
  max-width: 150px;
  word-wrap: break-word;
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
}

.getPuuid {
  display: inline-block;
  padding: 10px 20px;
  margin-right: 20px;
  color: #fff;
  vertical-align: middle;
  background-color: #999999;
  cursor: pointer;
  height: 40px;
}

.gold-star {
  background-color: #ffee58;
}

.silver-star {
  background-color: #bdbdbd;
}

.bronze-star {
  background-color: #cd7f32;
}

.dark-silver-star {
  background-color: #998a00;
}

.error {
  color: red;
}

.manual {
  display: inline-block;
  height: 40px;
  padding: 0 10px;
  vertical-align: middle;
  border: 1px solid #dddddd;
  width: 12%;
  color: #999999;
}
</style>
