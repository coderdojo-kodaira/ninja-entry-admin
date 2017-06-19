<template>
  <div class="login-wrapper columns">
    <div class="column is-8 is-hidden-mobile hero-banner">
      <section class="hero is-fullheight is-dark">
        <div class="hero-body">
          <div class="container section">
            <div class="has-text-right">
              <h1 class="title is-1">Login</h1> <br>
              <p class="title is-3">Coder Dojo Kodaira Administration System</p>
            </div>
          </div>
        </div>
        <div class="hero-footer">
          <p class="has-text-centered">Image © Glenn Carstens-Peters via unsplash</p>
        </div>
      </section>  
    </div>
    <div class="column is-4">
      <section class="hero is-fullheight">
        <div class="hero-heading">
          <div class="section has-text-centered">
            Coder Dojo Kodira<br>コーダー道場小平
          </div>
        </div>
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-8 is-offset-2">
                <h1 class="avatar has-text-centered section">
                  <img src="../assets/coderdojologo.png">
                </h1>
                <div class="login-form">
                  <p class="control has-icon has-icon-right">
                    <input class="input email-input" type="text" placeholder="id" v-model="loginId">
                    <span class="icon user">
                      <i class="fa fa-user"></i>
                    </span>
                  </p>
                  <p class="control has-icon has-icon-right">
                    <input class="input password-input" type="password" placeholder="password" v-model="password">
                    <span class="icon user">
                      <i class="fa fa-lock"></i>
                    </span>
                  </p>
                  <p class="control login">
                    <button class="button is-success is-outlined is-large is-fullwidth" v-on:click="checkLogin">Login</button>
                  </p>
                </div>
                <div class="section forgot-password">
                  <p class="has-text-centered">
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>  
    </div>
  </div>
</template>

<script>
var awsCredential = require('./credentials/aws.json')
var AWS = require('aws-sdk')
AWS.config.update(awsCredential)
var s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'ap-northeast-1' })

var bucketName = 'dev-ninja-entry'
var CryptoJS = require('crypto-js')

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      loginId: '',
      password: ''
    }
  },
  methods: {
    // ログインチェック
    checkLogin () {
      var loginId = this.loginId
      var password = this.password

      var router = this.$router

      // S3からアカウント情報が書かれているJSONを取得
      Promise.resolve(0)
      .then((d) => {
        return new Promise((resolve, reject) => {
          var params = {
            Bucket: bucketName,
            Key: 'master/login.json'
          }
          s3.getObject(params, (err, data) => {
            if (err) {
              console.log(err, err.stack)
              reject(err)
            } else {
              var loginData = JSON.parse(data.Body.toString('UTF-8'))
              resolve(loginData)
            }
          })
        })
      })
      // IDとパスワードを突き合わせ
      .then((loginData) => {
        var decryptPassword = CryptoJS.AES.decrypt(loginData[loginId], 'dojo').toString(CryptoJS.enc.Utf8)

        if (decryptPassword === password) {
          // あっていれば、一覧画面に遷移
          router.push('/entries')
        } else {
          // 間違っていれば、アラートを出す
          alert('IDもしくはパスワードが違います')
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }
}

</script>

<style>
html,body {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  height: 100%;
  padding: 0;
  margin: 0;
}

.email-input,
.password-input {
  border-radius: 40px;
  font-size: 20px;
  padding-left: 15px;
  color: #95A5A6;
}

.icon.user,
.icon.password {
  margin: 5px 10px 0 0;
}

.avatar img {
  border-radius: 100px;
  padding: 5px;
  border: 1px solid #dbdbdb;
}

.forgot-password a {
  color: #95A5A6;
  font-weight: bold;
  padding-right: 20px;
}

.login {
  padding-top: 20px;
}

.login button {
  border-radius: 40px;
  font-weight: bold;
}

.hero-body .container {
  margin-top: -100px;
}

.hero.is-dark .section {
  background-color: transparent;
}

.login-wrapper {
  margin: -0.75rem;
  overflow-y: hidden;
}

.hero-banner .hero {
  background: url('https://unsplash.it/2000/1000');
  background-position: center;
  background-size: cover;
  background-blend-mode: screen;
}

.hero-banner .title {
  display: inline-block;
  background-color: rgba(0,0,0, 0.6);
  padding: 5px;
}
</style>
