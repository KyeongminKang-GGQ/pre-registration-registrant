<script>
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import axios from "axios";
import router from "../router";

export default {
  data() {
    return {
      status: "Check permissions...",
    };
  },
  setup() {
    const app = getCurrentInstance();
    const route = useRoute();
    const googleClientId =
      "61660663640-3mtk3ple6f9dv2tuohq7fj5imm6vfs00.apps.googleusercontent.com";
    const googleClientSecret = "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";
    const redirectUri = `${process.env.VUE_APP_SERVER}/oauth/google`;
    const AUTHORIZED = app.appContext.config.globalProperties.AUTHORIZED;

    onMounted(async () => {
      const code = route.query.code;
      console.log(`code: `, code);
      let response;

      try {
        response = await axios.post(
          `https://www.googleapis.com/oauth2/v4/token`,
          {},
          {
            headers: {
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            params: {
              grant_type: "authorization_code",
              client_id: googleClientId,
              redirect_uri: redirectUri,
              client_secret: googleClientSecret,
              code: code,
            },
          }
        );
      } catch (err) {
        console.log(`get accessToken error: `, err.response.data);
        alert(`get accessToken error`);
        router.push({ name: "login" });
        return;
      }

      const accessToken = response.data.access_token;

      let userInfoResponse;
      try {
        userInfoResponse = await axios.get(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );
      } catch (err) {
        console.log(`get userInfo error: `, err.response.data);
        alert(`get userInfo error`);
        router.push({ name: "login" });
        return;
      }

      const id = userInfoResponse.data.id;
      const email = userInfoResponse.data.email;
      console.log(`id: ${id}, email: ${email}`);
      if (AUTHORIZED.includes(email)) {
        console.log(`${email} is authorized`);
        router.push({ name: "home", query: { accessToken: accessToken } });
      } else {
        alert(`${email} is not authorized`);
        console.log(`${email} is not authorized`);
        router.push({ name: "login" });
      }
    });

    return {
      googleClientId,
      googleClientSecret,
      redirectUri,
    };
  },
};
</script>
