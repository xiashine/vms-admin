<template>
  <el-upload
    drag
    multiple
    :auto-upload="true"
    :http-request="checkedFile"
    :before-remove="removeFile"
    :limit="1"
    action="/"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>
</template>
<script>
import http from 'axios'
export default {
  data () {
    return {
      maxSize: 5 * 1024 * 1024 * 1024, // 上传最大文件限制
      multiUploadSize: 5 * 1024 * 1024, // 大于这个大小的文件使用分块上传(后端可以支持断点续传)
      eachSize: 5 * 1024 * 1024, // 每块文件大小
      requestCancelQueue: [], // 请求方法队列（调用取消上传
    }
  },
  mounted () {
  },
  methods: {
    async checkedFile (options) {
      const { maxSize, multiUploadSize, getSize, splitUpload, singleUpload } = this
      const { file, onProgress, onSuccess, onError } = options
      if (file.size > maxSize) {
        return this.$message({
          message: `您选择的文件大于${getSize(maxSize)}`,
          type: 'error'
        })
      }
      const uploadFunc = file.size > multiUploadSize ? splitUpload : singleUpload
      try {
        let res = await uploadFunc(file, onProgress)
        console.log(res)
        this.$emit("PathData",res);
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        onSuccess()
      } catch (e) {
        console.error(e)
        this.$message({
          message: e.message,
          type: 'error'
        })
        onError()
      }
      const prom = new Promise((resolve, reject) => {})
      prom.abort = () => {}
      return prom
    },
    // 格式化文件大小显示文字
    getSize (size) {
      return size > 1024
        ? size / 1024 > 1024
          ? size / (1024 * 1024) > 1024
            ? (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
            : (size / (1024 * 1024)).toFixed(2) + 'MB'
          : (size / 1024).toFixed(2) + 'KB'
        : (size).toFixed(2) + 'B'
    },
    // 单文件直接上传
    singleUpload (file, onProgress) {
      return this.postFile({ file, uid: file.uid, fileName: file.name }, onProgress)
    },
    // 大文件分块上传
    splitUpload (file, onProgress) {
      return new Promise(async (resolve, reject) => {
        try {
          const { eachSize } = this
          const chunks = Math.ceil(file.size / eachSize)
          const fileChunks = await this.splitFile(file, eachSize, chunks)
          let currentChunk = 0
          let res = {}
          for (let i = 0; i < fileChunks.length; i++) {
            // 服务端检测已经上传到第currentChunk块了，那就直接跳到第currentChunk块，实现断点续传
            console.log(currentChunk)
            if (Number(currentChunk) === i) {
              // 每块上传完后则返回需要提交的下一块的index
              
              res = await this.postFile({
                chunked: true,
                chunk: i,
                chunks,
                eachSize,
                fileName: file.name,
                fullSize: file.size,
                uid: file.uid,
                file: fileChunks[i]
              }, onProgress)
              currentChunk = res.data
            }
          }
          /*const isValidate = await this.validateFile({
            chunks: fileChunks.length,
            fileName: file.name,
            fullSize: file.size,
            uid: file.uid
          })
          if (!isValidate) {
            throw new Error('文件校验异常')
          }*/
          resolve(res)
        } catch (e) {
          reject(e)
        }
      })
    },
    // 文件分块,利用Array.prototype.slice方法
    splitFile (file, eachSize, chunks) {
      return new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
            const fileChunk = []
            for (let chunk = 0; chunks > 0; chunks--) {
              fileChunk.push(file.slice(chunk, chunk + eachSize))
              chunk += eachSize
            }
            resolve(fileChunk)
          }, 0)
        } catch (e) {
          console.error(e)
          reject(new Error('文件切块发生错误'))
        }
      })
    },
    removeFile (file) {
      this.requestCancelQueue[file.uid]()
      delete this.requestCancelQueue[file.uid]
      return true
    },
    // 提交文件方法,将参数转换为FormData, 然后通过axios发起请求
    postFile (param, onProgress) {
      const formData = new FormData()
      for (let p in param) {
        formData.append(p, param[p])
      }
      const { requestCancelQueue } = this
      const config = {
        cancelToken: new http.CancelToken(function executor (cancel) {
          if (requestCancelQueue[param.uid]) {
            requestCancelQueue[param.uid]()
            delete requestCancelQueue[param.uid]
          }
          requestCancelQueue[param.uid] = cancel
        }),
        onUploadProgress: e => {
          if (param.chunked) {
            e.percent = Number(((((param.chunk * (param.eachSize - 1)) + (e.loaded)) / param.fullSize) * 100).toFixed(2))
          } else {
            e.percent = Number(((e.loaded / e.total) * 100).toFixed(2))
          }
          onProgress(e)
        }
      }
      console.log('new upload')
      console.log(http)
      return http.post('/api/staff/upload', formData, config).then(rs => rs.data)
    },
    // 文件校验方法
    validateFile (file) {
      return http.post('/api/staff/validateFile', file).then(rs => rs.data)
    }
  }
}
</script>