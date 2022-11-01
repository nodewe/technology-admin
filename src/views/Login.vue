<template>
  <div class="login-container">
    <el-form class="login-main sub-center-center" size="medium" @keydown.enter.native="submitLogin('formData')"
      :model="formData" :rules="formRules" ref="formData" label-position="left" label-width="0px">
      <h3 class="title">{{$store.state.name}}</h3>
      <el-form-item prop="username">
        <el-input type="text" prefix-icon="el-icon-user" v-model="formData.username" auto-complete="off"
          placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" prefix-icon="el-icon-lock" show-password v-model="formData.password"
          auto-complete="off" placeholder="密码">
          <!-- <i slot="suffix" :class="passwordIcon" @click="showPass"></i> -->
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input prefix-icon="el-icon-key" v-model="formData.code" auto-complete="off" placeholder="验证码"
          style="width: 63%">
        </el-input>
        <div class="login-code" @click="getCode" v-html="codeUrl">
        </div>
      </el-form-item>
      <el-checkbox v-model="rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
          @click.native.prevent="submitLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getCodeImg } from '@/api/user.js'
import { encrypt,decrypt } from '@/utils/jsencrypt.js'
import json5 from 'json5'
export default {
  name: 'login',
  data() {
    return {
      //记住我
      rememberMe:false,
      codeUrl: '',
      //密码框的后面的眼睛
      passwordIcon: 'el-input__icon el-icon-view',
      //密码框类型
      passwordType: 'password',
      loading: false,
      formData: {
        username: null,
        password: null,
        code: ''
      },
      formRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      }
    }
  },
  created() {
    this.getCode()
    this.rememberMeInit()
  },
  methods: {
    rememberMeInit(){
      //如果有userinfo
      let userinfo = localStorage.getItem('userinfo');
      if(userinfo){
        userinfo = JSON.parse(userinfo);
        userinfo.password = decrypt(userinfo.password);
        this.formData = Object.assign( this.formData,userinfo)
        this.rememberMe = true;
      }
    },
    //点击密码显示隐藏
    showPass() {
      if (this.passwordType == "text") {
        this.passwordType = "password";
        //更换图标
        this.passwordIcon = "el-input__icon el-icon-view";
      } else {
        this.passwordType = "text";
        this.passwordIcon = "el-input__icon el-icon-view-hide";
      };
    },
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = res.img
      });
    },
    submitLogin() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // 如果点击了记住密码
          if(this.rememberMe){
             const userinfo = {
               username:this.formData.username,
               password: encrypt(this.formData.password)
             }
             localStorage.setItem('userinfo',JSON.stringify(userinfo))
          }else{
            localStorage.removeItem('userinfo')
          }
          const form = JSON.parse(JSON.stringify(this.formData));
          form.password = encrypt(form.password)
          this.$store.dispatch('Login', form)
            .then(res => {
              // this.$common.toast('登陆成功', 'success', false)
              this.$message.success('登录成功')
              this.$router.push({
                path: '/home/user',
                query: {}
              })
              localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
              this.$store.dispatch('saveUserInfo', res.userInfo)
            })
          // Login(url, params)
          //   .then(res => {
          //     if (res.code == 1) {
          //       let data = res.data
          //       localStorage.setItem('userInfo', JSON.stringify(data))
          //      

          //     }
          //     this.reqFlag.login = true
          //   })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/images/login_bg.png');
  background-size: cover;
  overflow: hidden;

  .login-main {
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    background-clip: padding-box;
    width: 350px;
    padding: 25px 25px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    h3 {
      text-align: center;
    }

    .login-code {
      width: 33%;
      height: 38px;
      float: right;
      cursor: pointer;
    }

    // .btn-box{text-align: center;}
  }
}
</style>
