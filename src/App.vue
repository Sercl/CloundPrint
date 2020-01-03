<template>
  <div id="app">
    <el-progress :percentage="perc"></el-progress>
    <el-button @click="printer()">打印</el-button>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ipcRenderer} from 'electron'

  @Component({
    components: {}
  })
  export default class App extends Vue {
    printList: any = ''
    $refs: any
    perc: number = 0

    mounted() {
      ipcRenderer.on('aaa', (event1, args) => {
        console.log(args)
      })
    }

    autoUpdate() {
      ipcRenderer.send('update')
    }

    printer() {
      //渲染线程主动发送getPrinterList事件到主线程请求打印机列表
      ipcRenderer.send('getPrinterList')

      //监听主线程获取到打印机列表后的回调
      ipcRenderer.once('getPrinterList', (event, data) => {
        //data就是打印机列表
        console.log('aaa')
        this.printList = data
        //ipcRenderer.send('webview-print-render')
      })
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
