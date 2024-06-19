<template>
  <div id="background"></div>
  <div class="top">
    <h1>404</h1>
  </div>
  <div class="container">
    <div class="ghost-copy">
      <div class="one"></div>
      <div class="two"></div>
      <div class="three"></div>
      <div class="four"></div>
    </div>
    <div class="ghost">
      <div class="face">
        <div class="eye"></div>
        <div class="eye-right"></div>
        <div class="mouth"></div>
      </div>
    </div>
    <div class="shadow"></div>
  </div>
  <div class="bottom">
    <div class="buttons">
      <button class="btn" @click="doBack">回退</button>
      <button class="btn" @click="doHome">主页</button>
    </div>
  </div>
  <footer>
    <p>made by <a href="https://blog.csdn.net/qq_44273429">Haiyong</a> ♡</p>
  </footer>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
/**
 * 主页
 * */
const doHome = async () => {
  router.push({
    path: "/",
    replace: true, // 替换当前页。没必要点击后，又回到登录页
  });
};
/**
 * 回退
 * */
const doBack = async () => {
  router.back();
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Abril+Fatface|Lato");

body {
  background: #d3deea;
}

.top {
  margin-top: 30px;
  margin-bottom: 10px;
}

.container {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
  margin-top: -40px;
}

.ghost {
  position: absolute;
  top: 10%;
  left: 25%;
  width: 50%;
  height: 53%;
  background: #ededed;
  border: 1px solid #bfc0c0;
  border-bottom: none;
  border-radius: 50% 50% 0 0;
  animation: float 2s ease-out infinite;
}

.ghost-copy {
  position: absolute;
  top: 10%;
  left: 25%;
  z-index: 0;
  width: 50%;
  height: 53%;
  background: #ededed;
  border: 1px solid #bfc0c0;
  border-bottom: none;
  border-radius: 50% 50% 0 0;
  animation: float 2s ease-out infinite;
}

.face {
  position: absolute;
  top: 20%;
  width: 100%;
  height: 60%;
}

.eye,
.eye-right {
  position: absolute;
  top: 40%;
  width: 13px;
  height: 13px;
  background: #585959;
  border-radius: 50%;
}

.eye {
  left: 25%;
}

.eye-right {
  right: 25%;
}

.mouth {
  position: absolute;
  top: 50%;
  left: 45%;
  width: 10px;
  height: 10px;
  border: 3px solid;
  border-color: transparent #585959 #585959 transparent;
  border-radius: 50%;
  transform: rotate(45deg);
}

.one,
.two,
.three,
.four {
  position: absolute;
  top: 85%;
  z-index: 0;
  width: 25%;
  height: 23%;
  background: #ededed;
  border: 1px solid #bfc0c0;
}

.one {
  left: -1px;
  border-radius: 0 0 100% 30%;
}

.two {
  left: 23%;
  border-radius: 0 0 50% 50%;
}

.three {
  left: 50%;
  border-radius: 0 0 50% 50%;
}

.four {
  left: 74.5%;
  border-radius: 0 0 30% 100%;
}

.shadow {
  position: absolute;
  top: 80%;
  left: 35%;
  width: 30%;
  height: 7%;
  background: #bfc0c0;
  border-radius: 50%;
  animation: scale 2s infinite;
}

@keyframes scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  50% {
    transform: translateY(15px);
  }
}

.bottom {
  margin-top: 10px;
}

/*text styling*/
h1 {
  margin: 0;
  color: #ededed;
  font-size: 9em;
  font-family: "Abril Fatface", serif;
  text-align: center;
  text-shadow: -1px 0 #bfc0c0, 0 1px #bfc0c0, 1px 0 #bfc0c0, 0 -1px #bfc0c0;
}

h3 {
  margin-top: -20px;
  color: #bfc0c0;
  font-weight: 900;
  font-size: 2em;
  font-family: "Lato", sans-serif;
  text-align: center;
  text-transform: uppercase;
}

p {
  margin-top: -20px;
  color: #585959;
  font-size: 0.6em;
  font-family: "Lato", sans-serif;
  text-align: center;
  text-transform: uppercase;
}

.search {
  text-align: center;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

/*search style*/
.search-bar {
  width: 200px;
  height: 20px;
  margin-left: -30px;
  padding: 5px;
  border: 1px solid #bfc0c0;
  outline: none;
}

.search-bar:focus {
  border: 1px solid #d3deea;
}

.search-btn {
  position: absolute;
  width: 30px;
  height: 32px;
  color: #ededed;
  font-size: 1em;
  text-align: center;
  background: #bfc0c0;
  border: 1px solid #bfc0c0;
  outline: none;
  cursor: pointer;
}

.search-btn:hover {
  color: #bfc0c0;
  background: #ededed;
  border: 1px solid #ededed;
  transition: all 0.2s ease;
}

.btn {
  margin: 5px;
  padding: 15px 20px;
  color: #585959;
  font-size: 2em;
  font-family: "华文新魏", sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: #ededed;
  border: 0;
}

.btn:hover {
  background: #bfc0c0;
  transition: all 0.4s ease-out;
}

footer {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 10px;
  color: #ea7996;
  font-size: 0.8em;
  font-family: "Lato", sans-serif;
  letter-spacing: 3px;
  text-align: center;
  text-transform: uppercase;
}

footer a {
  color: #ffffff;
  text-decoration: none;
}

footer a:hover {
  color: #7d7d7d;
}
</style>
