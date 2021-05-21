<template>
  <div>
    <div class="background">
      <img src="../assets/41.jpg" height="100%" width="100%"/>
    </div>
    <div class="lock-container" style="margin-left: 650px;margin-top: 300px">
      <div class="lock-main">
<!--        <h2 style="color: #DDDDDD">{{user.name}}</h2>-->
        <span class="el-dropdown-link">
          <i><img :src="user.userFace"></i><i style="color: #DDDDDD;font-size: 16px">{{user.name}}</i>
        </span>
        <div class="lock-handle">
          <el-input placeholder="请输入解锁密码" type="password" v-model="password" @keyup.enter.native="Unlock" style="width: 60%"/>
<!--            <span @click="Unlock"><svg-icon icon-class="unlock"/></span>-->
<!--            <span @click="loginOut"><svg-icon icon-class="lockOut"/></span>-->
          <el-button slot="append" @click="Unlock" style="margin-left: 8px" icon="el-icon-unlock" type="primary"></el-button>
          <el-button slot="append" @click="loginOut" icon="el-icon-close" type="danger"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5';
  import {mapGetters, mapActions} from 'vuex';
  export default {
    name: "Lock",
    data() {
      return {
        user: JSON.parse(window.sessionStorage.getItem('user')),
        password: ''
      }
    },
    methods: {
      ...mapActions([
          'clearLock'
      ]),
      loginOut() {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //注销登录
          this.postRequest('/logout');
          //清空用户信息
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');
          //清空菜单
          this.$store.commit('initRoutes', []);
          //跳转到登录页面
          this.$router.replace('/');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      Unlock() {
        if (this.$store.state.user.lockPassword != md5(this.password)) {
          this.password = '';
          this.$message({
            message: '解锁密码错误，请重新输入',
            type: 'error'
          })
          return
        }
        setTimeout(() => {
          this.$store.dispatch('clearLock')
          this.$router.push('/home')
        }, 1000)
      }
    }

  }
</script>

<style>
  .background{
    width:100%;
    height:100%;  /**宽高100%是为了图片铺满屏幕 */
    z-index:-1;
    position: absolute;
  }

  .lock-container{
    z-index:1;
    position: absolute;
  }
</style>