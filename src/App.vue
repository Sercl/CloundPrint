<template>
  <div id="app">
    <button @click="print()">获取更新</button>
    <ol id="content">
      <li>生命周期过程展示</li>
    </ol>
    <webview ref="printWebview" src="./1.html"></webview>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ipcRenderer} from 'electron'

  @Component({
    components: {}
  })
  export default class App extends Vue {
    // mounted() {
    //   var _ol = document.getElementById('content')
    //   ipcRenderer.on('message', (event, {message, data}) => {
    //     let _li = document.createElement('li')
    //     _li.innerHTML = message + ' <br>data:' + JSON.stringify(data) + '<hr>'
    //     _ol.appendChild(_li)
    //     if (message === 'isUpdateNow') {
    //       if (confirm('是否现在更新？')) {
    //         ipcRenderer.send('updateNow')
    //       }
    //     }
    //   })
    // }
    printList: any = ''
    $refs: any

    mounted() {
      ipcRenderer.on('aaa', (event1, args) => {
        console.log(args)
      })

      //当vue节点渲染完成后，获取<webview>节点
      const webview = this.$refs.printWebview

      //监听<webview>里面的消息，也就是监听print.html里面的ipcRenderer.sendToHost发送的事件，当该事件发送成功后就会进入下面的回调事件中执行打印操作。
      webview.addEventListener('ipc-message', (event: any) => {
        if (event.channel === 'webview-print-do') {
          //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
          webview.print({
              //是否是静默打印
              silent: true,
              printBackground: true,
              //打印机的名称，就是本文一开始获得的打印机列表其中一个
              deviceName: 'pdfFactory',
            }, (data: any) => {
              //这个回调是打印后的回调事件，data为true就是打印成功，为false就打印失败
              console.log('webview success', data)
            },
          )
        }
      })
    }

    autoUpdate() {
      ipcRenderer.send('update')
    }

    print() {
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
