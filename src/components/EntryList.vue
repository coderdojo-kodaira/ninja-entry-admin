<template>
  <div>
    <nav class="nav has-shadow" id="top">
      <div class="container">
        <div class="nav-left">
          <a class="nav-item" href="../index.html">
            <img src="http://bulma.io/images/bulma-logo.png" alt="Description">
          </a>
        </div>
        <span class="nav-toggle">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div class="nav-right nav-menu">
          <a class="nav-item is-tab is-active">
            Home
          </a>
          <a class="nav-item is-tab">
            Features
          </a>
          <a class="nav-item is-tab">
            Team
          </a>
          <a class="nav-item is-tab">
            Help
          </a>
          <span class="nav-item">
            <a class="button">
              Log in
            </a>
            <a class="button is-info">
              Sign up
            </a>
          </span>
        </div>
      </div>
    </nav>
    <section class="section">
      <div class="container content">
        <p class="has-text-centered">メンター用管理画面</p>
        <table>
          <tr>
            <th>タイトル</th>
            <th>日付</th>
            <th>時刻</th>
            <th>場所</th>
            <th>公開 / 非公開</th>
          </tr>          
          <tr v-for="(event, index) in events">
            <td><b-input v-model="event.name"></b-input></td>
            <td><b-input v-model="event.date"></b-input></td>
            <td><b-input v-model="event.time"></b-input></td>
            <td><b-input v-model="event.place"></b-input></td>
            <td><b-switch v-model="event.active">{{ event.active }}</b-switch></td>
          </tr>
        </table>
        <p class="control level-right">
          <button class="button is-primary" v-on:click="save">更新</button>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
var awsCredential = require('./credentials/aws.json')
var AWS = require('aws-sdk')
AWS.config.update(awsCredential)
var s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'ap-northeast-1' })

var bucketName = 'dev-ninja-entry'

export default {
  name: 'entries',
  data () {
    return {
      events: {}
    }
  },
  methods: {
    save () {
      Promise.resolve(0)
      .then((d) => {
        return new Promise((resolve, reject) => {
          var params = {
            Bucket: bucketName,
            Key: 'master/event.json',
            ContentType: 'text/plain',
            Body: JSON.stringify(this.events)
          }
          s3.putObject(params, (err, data) => {
            if (err) {
              console.log(err, err.stack)
              reject(err)
            } else {
              console.log(data)
              resolve(data)
            }
          })
        })
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    // S3からアカウント情報が書かれているJSONを取得
    Promise.resolve(0)
    .then((d) => {
      return new Promise((resolve, reject) => {
        var params = {
          Bucket: bucketName,
          Key: 'master/event.json',
          ResponseCacheControl: 'No-cache'
        }
        s3.getObject(params, (err, data) => {
          if (err) {
            console.log(err, err.stack)
            reject(err)
          } else {
            console.log(data)
            var events = JSON.parse(data.Body.toString('UTF-8'))
            resolve(events)
          }
        })
      })
    })
    .then((events) => {
      // var eventCount = events.length

      for (var index in events) {
        if (events[index].active === 'true') {
          events[index].active = true
        } else {
          events[index].active = false
        }
      }
      console.log(events)
      this.events = events
    })
    .catch((err) => {
      console.log(err)
    })
  }
}
</script>

<style>
</style>
