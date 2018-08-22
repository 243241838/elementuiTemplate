 <template>
  <div class="breadcrumb">
    <!--顶部导航栏 -->
    <span href="#/">
      当前位置：
    </span>
    <span v-if="list[2].title != '欢迎进入'">
      <span :key="item.path" v-for="(item, index) in list">
        {{item.title}}
        <span v-if="index !== (list.length - 1)">></span>
      </span>
    </span>
    <span :key="item.path" v-for="(item, index) in list" v-else>
      <span v-show="item.title != '权限'">{{item.title}}</span>
      <span v-if="index !== (list.length - 1) && item.title != '权限'">></span>
    </span>
  </div>
</template>

<script>
import baseURL from '@utils/baseURL.js';
import Cookies from 'js-cookie';
import loginout from '@src/utils/loginout';
export default {
  data() {
    return {
    }
  },
  computed: {
    list() {
      let result = [];
      for (var index = 0; index < this.$route.matched.length; index++) {//根据路由获取
        var item = this.$route.matched[index];
        result.push({
          title: item.meta.title,
          path: item.path,
        });
      }
      // window.alert(JSON.stringify(result))
      return result;
    }
  },
  created() {
    
  },
  methods: {
  }
}
</script>
<style rel="stylesheet/less" lang="less" scoped>
</style>
