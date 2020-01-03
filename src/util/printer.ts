import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

const NodePdfPrinter = {
  printFiles(pdfFiles: string[], printerName: string) {
    return new Promise((resolve, reject) => {
      //const execPath = path.join(__dirname.replace('app.asar', 'app.asar.unpacked'))
      const execPath = path.join(__dirname, 'resources', 'app.asar.unpacked', 'printer')
      let createFile = '@echo off \n'
      createFile += 'cd ' + execPath + '\n'

      if (printerName) {
        printerName = ' "' + printerName + '"'
      } else {
        printerName = ''
      }
      pdfFiles.forEach((item) => {
        createFile += ' PDFtoPrinter.exe "' + item + '"' + printerName + '\n'
      })

      createFile += 'exit /b 0 \n'
      createFile += 'pause>nul \n'

      const batFileUrl = path.join(execPath, 'printTmp.bat')
      fs.writeFile(batFileUrl, createFile, (err) => {
        if (err) {
          reject(err)
        } else {
          childProcess.exec(batFileUrl, (error, stdout) => {
            if (error) {
              reject(error)
            } else {
              resolve(true)
            }
          })
        }
      })
    })
  }
}

export default NodePdfPrinter
