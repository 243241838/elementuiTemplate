<template>
 
  <div>
   <div class="contentBody">
    <left-nav></left-nav>
    <div class="mainContent" :class="{Collapse1:isCollapse}">
      <header-nav></header-nav>
      <div class="w-main" :class="{overf: wmain}">
        <top-nav></top-nav>
        <router-view></router-view>
      </div>
    </div>
   </div>
  </div>
</template>
<script>
import headerNav from './header.vue';
import leftNav from './leftNav.vue';
import topNav from './topNav.vue';
import { mapGetters } from 'vuex';
  export default {
  components: {
    headerNav,
    leftNav,
    topNav
  },
  computed: {
      ...mapGetters([
          'isCollapse',
          'wmain'
      ])
  },
  data(){
    return{
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
<style  lang="less" scoped>
.overf{
  overflow: visible;
}
</style>
