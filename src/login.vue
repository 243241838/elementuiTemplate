<template>
  <div class="login-container ggg_user" :style="logo_background">
    <div class="centent">
      <img class="logo animated fadeInDown" :src="img">
      <div class="form" :style="logo_content">
        <p>欢迎使用 借多多</p>
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="center" label-width="0px" style="width:295px;margin:0 auto;">
          <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" autoComplete="on" placeholder="登录名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button style="width:100%;" type="primary" :loading="loading" @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="完善资料" :visible.sync="dialogVisible" width="30%" class="autoAlert">
      <el-form :rules="rules1" ref="alertForm" label-position="center" label-width="80px" :model="alertForm">
        <el-form-item prop="name" label="真实姓名">
          <el-input v-model="alertForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="idcard" label="身份证号">
          <el-input v-model="alertForm.idcard" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="alertForm.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="账户" prop="username" v-show="false">
          <el-input v-model="loginForm.username" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input type="" v-model="alertForm.password" placeholder="请输入" @keyup.native="InputFocus($event)"></el-input>
        </el-form-item>
      </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAlert ('alertForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@utils/config';
import Cookies from 'js-cookie';
import store from '@src/store';
import handleRouter from '@src/utils/handleRouter';
import { validate } from '@src/utils/validation';
export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位！'));
      } else {
        callback();
      }
    };
    var phone = (rule, value, callback) => {
      if (!validate.validatPhone(value)) {
        callback(new Error('手机号号码格式不正确'));
        return false;
      }
      callback();
    };
    var validIdcard = (rule, value, callback) => {
      if (!validate.idCard(value)) {
        callback(new Error('身份证号格式有误'));
        return false;
      }
      callback();
    };
    var validatePass1 = (rule, value, callback) => {
      console.log(this.loginForm.password == value)
      if (this.loginForm.password == value) {
        callback(new Error('和原密码相同'));
        return false;
      }
      callback();
    }
    return {
      logo_background: {
        backgroundImage: "url(" + require("@res/img/logobackground.jpg") + ")"
      },
      img: require('@res/img/logocenter.png'),
      logo_content: {
        backgroundImage: "url(" + require("@res/img/logoContent.png") + ")"
      },
      loginForm: {
        url: 'doLogin',
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入' }
        ],
        password: [
          // { required: true, trigger: 'blur', validator: validatePass }
          { required: true, message: '请输入', trigger: 'blur' },
        ]
      },
      loading: false,
      dialogVisible: false,
      alertForm: {
        idcard: '',
        name: '',
        password: '',
        phone: ''
      },
      rules1: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'blur' },
          // { validator: phone, trigger: 'blur' },
        ],
        idcard: [
          { required: true, message: '请输入', trigger: 'blur' },
          // { validator: validIdcard, trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入', trigger: 'blur' },
          // { validator: validatePass, trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.login();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 登录
    login() {
      this.$store.dispatch('SETUSER', { user: '11' });
      Cookies.set('user', '11')
      this.$router.push({ path: 'jurisdiction/greetPage' });
      ajax({
        url: 'auth/login',
        optionParams: {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
      }).post()
        .then(res => {
          if (res.code === 200) {
            let data = res.data;
            let name = data.username ? data.username : data.userCode;
            this.$store.dispatch('SETUSER', { user: name });
            Cookies.set('user', name)
            this.$router.push({ path: 'jurisdiction/greetPage' });
            Cookies.set('id', data.id);
          } else {
            this.loading = false;
            this.$message.warning(res.msg)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    //解决密码框自动填充问题
    InputFocus(e) {
      let input = e.srcElement ? e.srcElement : e.target;
      input.type = 'password';
    },
    //弹框提交
    submitAlert(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          ajax({
            url: 'sysAdmin/updateinfo',
            optionParams: this.alertForm
          }).post()
            .then(response => {
              if (response.code === 200) {
                this.$message.success(response.message);
                this.dialogVisible = false;
                let name = this.alertForm.name;
                this.$store.dispatch('SETUSER', { user: name });
                Cookies.set('user', name)
                this.$router.push({ path: 'jurisdiction/greetPage' });
              } else {
                this.$message.warning(response.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
<style rel="stylesheet/less" lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  position: relative;
  .centent {
    width: 750px;
    height: 455px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    img {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
    }
    .form {
      width: 582px;
      height: 270px;
      margin: 0 auto;
      margin-top: 60px;
      padding-top: 90px;
      p {
        color: #fff;
        font-size: 20px;
        text-align: center;
        line-height: 70px; // margin-bottom:40px;
      }
    }
  }
}
</style>

