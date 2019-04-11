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
        <el-form-item label="水印名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="水印路径" prop="in">
          <el-input v-model="form.in"></el-input>
        </el-form-item>
        <el-form-item label="水印定位" prop="position">
          <el-input v-model="form.position"></el-input>
        </el-form-item>
        <el-form-item label="x" prop="x">
          <el-input v-model="form.x"></el-input>
        </el-form-item>
        <el-form-item label="y" prop="y">
          <el-input v-model="form.y"></el-input>
        </el-form-item>
        <el-form-item label="top" prop="top">
          <el-input v-model="form.top"></el-input>
        </el-form-item>
        <el-form-item label="left" prop="left">
          <el-input v-model="form.left"></el-input>
        </el-form-item>
        <el-form-item label="right" prop="right">
          <el-input v-model="form.right"></el-input>
        </el-form-item>
        <el-form-item label="bottom" prop="bottom">
          <el-input v-model="form.bottom"></el-input>
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
  name: "WatermarkDialong",
  data() {
    return {
      formdialog: {
        title: [{ required: true, message: "水印名称不能为空", trigger: "blur" }],
        in: [{ required: true, message: "水印路径不能为空", trigger: "blur" }]
      }
    };
  },
  props: {
    dialong: Object,
    form: Object
  },
  methods: {
    addHandle(formdoalog) {
      this.$refs[formdoalog].validate(valid => {
        if (valid) {
          // console.log(this.form)
          let url =
            this.dialong.option == "add" ? "add" : `/edit/${this.form.id}`;

          this.$axios.post(`/api/watermark/${url}`, this.form).then(res => {
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
  }
};
</script>
<style scoped>
</style>
