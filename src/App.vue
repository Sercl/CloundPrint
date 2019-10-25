<template>
  <div id="app">
    <button @click="autoUpdate()">获取更新</button>
    <ol id="content">
      <li>生命周期过程展示</li>
    </ol>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ipcRenderer} from 'electron'

  @Component({
    components: {}
  })
  export default class App extends Vue {
    mounted() {
      var _ol = document.getElementById('content')
      ipcRenderer.on('message', (event, {message, data}) => {
        let _li = document.createElement('li')
        _li.innerHTML = message + ' <br>data:' + JSON.stringify(data) + '<hr>'
        _ol.appendChild(_li)
        if (message === 'isUpdateNow') {
          if (confirm('是否现在更新？')) {
            ipcRenderer.send('updateNow')
          }
        }
      })
    }

    autoUpdate() {
      ipcRenderer.send('update')
    }
  }
</script>

<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
