<template>
  <v-app>
   <div id="header">
      <main-header/>
    </div>

    <v-main class="main">
      <router-view class="pa-0 ma-0 mainView" v-if="$route.name==='Home'"/>
      <router-view class="pa-0 mt-3.5% mainView2" v-if="$route.name!=='Home'"/>
    </v-main>
    <div id="footer">
      <main-footer/>
      <back-to-top class="btt" text="Back to top" visibleoffset="100"></back-to-top>
    </div>
   <v-snackbar
       v-model="$store.state.sb.act"
       :color="$store.state.sb.color"
     >
       {{ $store.state.sb.msg }}
       <v-btn
         @click="$store.commit('pop', { act: false })"
       >
         <v-icon>mdi-close</v-icon>
       </v-btn>
     </v-snackbar>
  </v-app>
</template>

<script>
import MainHeader from './components/header.vue'
import MainFooter from './components/footer.vue'
import BackToTop from 'vue-backtotop'
export default {
  name: 'App',

  components  : {
    'main-header': MainHeader,
    'main-footer': MainFooter,
    BackToTop
  },

  data: () => ({
    //
  })
}
</script>
<style scoped>
@font-face {
    font-family: 'f1';
    src: url('./assets/NEXON Lv1 Gothic Low OTF Bold.otf');
}
* {
    box-sizing: border-box;
    font-family: 'f1';
    letter-spacing: 1.5px;
} 
.mainView{
  /* margin-top: 3.8%; */
  background-color: #000C1D;
  z-index: 100;
  width:100%;
  overflow-x: hidden;
}
.mainView2{
  margin-top: 3.8%;
  background-color: #000C1D;
  z-index: 100;
  width:100%;
  overflow-x: hidden;
}
.main{
  background-color: #000C1D;
  z-index: 100;
}
@media screen and (max-width:959px) {
  .btt{
    margin-right: 20%;
  }
}
</style>