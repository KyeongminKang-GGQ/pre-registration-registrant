<template>
  <div>
    허가된 사용자만 사용할 수 있습니다<br />
    허가된 사용자: <br />
    <ul>
      <li v-for="(item, index) in AUTHORIZED" :key="index">
        {{ item }}
      </li>
    </ul>

    <p class="message">
      <a :href="googleLink">Google Login</a>
    </p>
  </div>
</template>

<script>
console.log(`APPLICATION_SERVER: `, process.env.VUE_APP_APPLICATION_SERVER);
console.log(`LOCAL_SERVER: `, process.env.VUE_APP_LOCAL_SERVER);
console.log(`VUE_APP_SERVER: `, process.env.VUE_APP_SERVER);

export default {
  setup() {
    const googleClientId =
      "61660663640-3mtk3ple6f9dv2tuohq7fj5imm6vfs00.apps.googleusercontent.com";
    const googleClientSecret = "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";
    const redirectUri = `${process.env.VUE_APP_SERVER}/oauth/google`;
    const googleLink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=offline`;
    return {
      googleClientId,
      googleClientSecret,
      googleLink,
    };
  },
};
</script>

<style scoped>
input {
  display: inline-block;
  padding: 10px 20px;
  color: #000000;
  vertical-align: middle;
  background-color: #ffe400;
  cursor: pointer;
  height: 40px;
  margin-top: 20px;
}
</style>
