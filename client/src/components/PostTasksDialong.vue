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
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags"></el-input>
        </el-form-item>
        <el-form-item label="转码模板" prop="modelid">
           <el-checkbox-group  v-model="form.modelid">
            <el-checkbox v-for="models in modelsData" :label="models._id" :key="models._id">{{models.title}}</el-checkbox>
         </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialong.show = false">取 消</el-button>
        <el-button type="primary" @click="addHandle('formdoalog')">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

// @ is an alias to /src
export default {
  data() {
    return {
      modelid:[],
      modelsData: [],
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
    modelsInfo() {
       this.$axios.get("/api/models/").then(res => {
          this.modelsData = res.data;
           console.log(this.modelsData)
        }).catch(err => console.log(err));
    },
    addHandle(formdoalog) {
      this.$refs[formdoalog].validate(valid => {
        if (valid) {
          // console.log(this.form)
          let url =
            this.dialong.option == "add" ? "add" : `/edit/${this.form.id}`;
          const postData = {
              infoid: this.form.id,
              modelid: this.form.modelid
          }
          console.log(postData)
          this.$axios.post(`/api/tasks/${url}`, postData).then(res => {
            this.$message({
              type: "success",
              message: "数据添加成功"
            }),
              (this.dialong.show = false);
            this.$emit("UserData");
            this.form = "";
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });

     /* this.$refs[formdoalog].validate(valid => {
        if (valid) {
          // console.log(this.form)
          //let url =
            //this.dialong.option == "add" ? "add" : `/edit/${this.form.id}`;
          let url = 'http://192.168.97.181/work/post_client.php';

          const postdata = new URLSearchParams();
          postdata.append('id', this.form.id);
          postdata.append('path', this.form.path);
          postdata.append('format', this.form.format);
          axios.post(`${url}`,postdata).then(res=>{
            console.log(res);
            this.$message({
              type: "success",
              message: "视频发布成功"
            }),
              (this.dialong.show = false);
            //清空内容
            this.form = "";
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });*/
    }
  },
  created() {
      this.modelsInfo()
  }
};
</script>
<style scoped>
</style>
