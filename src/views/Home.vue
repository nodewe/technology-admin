<template>
  <el-container class="home-wrap">
    <!-- header start -->
    <el-header class="flex">
      <div class="logo flex-item">{{$store.state.name}} <i @click="collaspe" style="cursor:pointer;" :class="[icon]"></i> </div>
      <div class="user-info">
        <el-dropdown @command="handleCommand">
          <el-button type="primary">
            <i class="el-icon-user-solid el-icon--left"></i>{{userInfo.username}}
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- header end -->
    <div class="container-wrap">
      <!-- aside-nav start -->
      <div class="aside-wrap" :style="{width:!isCollapse?'200px':''}">
        <el-menu :collapse="isCollapse" :default-active="activePath" background-color="#283643" text-color="#fff"
          active-text-color="#409eff" router>
          <el-menu-item v-for="item in menuList" :key="item.url" :index="item.url" @click="handleSelect(item.url)">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- aside-nav end -->

      <!-- main start -->
      <div class="main-wrap" :style="{marginLeft:!isCollapse?'200px':'56px'}">
        <router-view />
      </div>
      <!-- main end -->

    </div>
    <updatePassword v-if="updatePasswordVisble" ref="updatePassword"></updatePassword>
  </el-container>
</template>

<script>
import updatePassword from '@/components/User/Edit.vue'
export default {
  name: 'home',
  data() {
    return {
      updatePasswordVisble: false,//修改密码面板的可见性
      menuList: this.$store.state.menuList,
      activePath: null,
    }
  },
  components: {
    updatePassword
  },
  computed: {
    userInfo: function () {
      let userInfo = this.$store.state.userInfo
      return userInfo
    },
    // 菜单的展开收起
    isCollapse(){
      return this.$store.state.isCollapse
    },
    icon(){
      return this.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    }
  },
  watch: {
    '$route': function (to, from) {
      this.activePath = to.meta.pagePath
    }
  },
  created() {
    this.activePath = this.$route.meta.pagePath
  },
  methods: {
    //点击展开收起
    collaspe(){
      const isCollapse = !this.isCollapse;
      this.$store.commit('SET_COLLASPE',isCollapse)
    },
    handleCommand(command) {
      if (command == 'loginOut') {
        this.loginOut()
      }
      // 如果是修改密码
      if (command == 'updatePassword') {
        // this.loginOut()
        // alert('你好s')
        this.updatePasswordVisble = true
        this.$nextTick(() => {
          const id = this.$store.state.userInfo.id
          this.$refs.updatePassword.init(id)
        })
      }
    },
    // 登出
    loginOut() {
      this.$store.dispatch('saveUserInfo', {})
      this.$common.toast('登出成功', 'success', false)
      this.$router.replace({ path: '/' })

    },
    // 解决element导航中，当前导航路由标识和当前路由一致时，点击当前导航，页面不刷新问题
    handleSelect(indexPath) {
      if (indexPath == this.$route.path) {
        this.$common.shallowRefresh(this.$route.name)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.home-wrap {
  width: 100%;
  height: 100%;

  .el-header {
    line-height: 60px;
    color: $color-white;
    background: $color-main;

    .logo {
      font-size: 20px;
    }

    .user-info .el-button {
      font-size: 16px;
    }
  }

  .el-aside {
    background: #283643;
  }

  .el-menu {
    border: none;

    .el-menu-item {
      font-size: 16px;
    }
  }
}

.el-dropdown-menu__item {
  padding: 0 40px;

  span {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
