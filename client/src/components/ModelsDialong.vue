<template>
  <div class="nofind">
    <el-dialog
      :title="dialong.title"
      type="primary"
      size="small"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="dialong.show"
    >
      <el-form :model="form" ref="formdoalog" :rules="formdialog" label-width="80px">
        <el-form-item label="模板名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="输出格式" prop="format">
          <el-radio-group v-model="form.format">
            <el-radio label="m3u8">m3u8</el-radio>
            <el-radio label="mp4">mp4</el-radio>
           </el-radio-group>
        </el-form-item>

        <el-form-item label="视频" prop="video">
        <el-switch v-model="form.video" active-value="1"
    inactive-value="0" ></el-switch>
         </el-form-item>
       <el-form-item label="码率" prop="bitrate">
          <el-input v-model="form.bitrate"></el-input>
        </el-form-item>
        <el-form-item label="宽" prop="width">
          <el-input v-model="form.width"></el-input>
        </el-form-item>
        <el-form-item label="高" prop="height">
          <el-input v-model="form.height"></el-input>
        </el-form-item>

       <el-form-item label="音频" prop="audio">
        <el-switch v-model="form.audio" active-value="1"
    inactive-value="0"></el-switch>
         </el-form-item>
       <el-form-item label="码率" prop="abitrate">
          <el-input v-model="form.abitrate"></el-input>
        </el-form-item>
        <el-form-item label="采样率" prop="sampling">
          <el-input v-model="form.sampling"></el-input>
        </el-form-item>

        <el-form-item label="水印" prop="watermarkid">
           <el-checkbox-group  v-model="form.watermarkid">
    <el-checkbox v-for="watermark in watermarks" :label="watermark._id" :key="watermark._id">{{watermark.title}}</el-checkbox>
  </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialong.show = false">取 消</el-button>
        <el-button type="primary" @click="addHandle('formdoalog')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "ModelsDialong",
  data() {
    return {
      activeNames: ['1'],
      watermarks:[],
      formdialog: {
        title: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        format: [{ required: true, message: "输出格式不能为空", trigger: "blur" }]
      }
    };
  },
  props: {
    dialong: Object,
    form: Object
  },
  methods: {
    watermarkInfo() {
       this.$axios.get("/api/watermark/").then(res => {
          this.watermarks = res.data;
           console.log(this.watermarks)
        }).catch(err => console.log(err));
    },
    addHandle(formdoalog) {
      this.$refs[formdoalog].validate(valid => {
        if (valid) {
          let url =
            this.dialong.option == "add" ? "add" : `/edit/${this.form.id}`;

          this.$axios.post(`/api/models/${url}`, this.form).then(res => {
            this.$message({
              type: "success",
              message: "数据添加成功"
            }),
              (this.dialong.show = false);
            this.$emit("UserData");
            //清空内容
            this.form = "";
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
created() {
    this.watermarkInfo();
  },
};
</script>
<style scoped>
</style>
