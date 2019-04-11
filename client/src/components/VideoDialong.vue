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
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path"></el-input>
          <Upload  @PathData="pathinfo"></Upload>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags"></el-input>
        </el-form-item>
        <el-form-item label="配图" prop="thumb">
          <el-input v-model="form.thumb"></el-input>
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
import axios from "axios";
import Upload from "./Upload";
// @ is an alias to /src
export default {
  name: "VideoDialong",
  data() {
    return {
      formdialog: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        path: [{ required: true, message: "路径不能为空", trigger: "blur" }]
      }
    };
  },
  props: {
    dialong: Object,
    form: Object
  },
  methods: {
    pathinfo(res){
      //console.log(res)
      console.log('pathinfo....')
      this.form.path = res.filepath
      console.log(res)
    },
    addHandle(formdoalog) {
      this.$refs[formdoalog].validate(valid => {
        if (valid) {
          let url =
            this.dialong.option == "add" ? "add" : `/edit/${this.form.id}`;

          this.$axios.post(`/api/sourceinfo/${url}`, this.form).then(res => {
            this.$message({
              type: "success",
              message: "数据添加成功"
            }),
              (this.dialong.show = false);
            this.$emit("UserData");
            //清空内容
            //this.form = "";
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  components: {
    Upload
  }
};
</script>
<style scoped>
</style>
