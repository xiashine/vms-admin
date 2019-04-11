<template>
  <div class="staff">
    <div class="staff-top">
        <el-form :inline="true">
            <el-form-item class="btnRight">
                <el-button type="primary" size ="small" icon="el-icon-edit-outline" @click='onAddModels()'>添加</el-button>
            </el-form-item>
        </el-form>
    </div>
      <div class="tables">
           <el-table
            :data="modelsData"
            border
            style="width: 100%">
            <el-table-column
                label="转码模板名称"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="输出格式"
                align="center"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.format }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="视频格式"
                align="center"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">码率：{{ scope.row.bitrate }} 分辨率：{{ scope.row.width }}x{{ scope.row.height }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="音频"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">码率：{{ scope.row.abitrate }} 采样率：{{ scope.row.sampling }}</span>
                </template>
            </el-table-column>
             <el-table-column
                label="水印名称"
                align="center"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.watermarkid }}</span>
                </template>
            </el-table-column>
             <el-table-column
                label="日期"
                align="center"
                width="250">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.date | moment }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>
      <ModelsDialong :dialong="dialong" :form="form" @UserData="modelsInfo"></ModelsDialong>
  </div>
</template>

<script>
// @ is an alias to /src
import ModelsDialong from "../components/ModelsDialong";
export default {
  name: "Models",
  data() {
    return {
      modelsData: [
      ], //数据存储
      dialong: {
        //弹出框
        show: false,
        title: "",
        option: "edit"
      },
      form: {   //添加和删除需要传递的字段名
        title: "",
        video: "",
        bitrate: "",
        width: "",
        height: "",
        audio: "",
        abitrate: "",
        sampling: "",
        format: "",
        watermarkid:[]
      }
    };
  },
  methods: {
    modelsInfo() {
       this.$axios.get("/api/models/").then(res => {
		 // console.log(res)
          this.modelsData = res.data;
        }).catch(err => console.log(err));
    },
    handleEdit(index, row) {
			console.log(row)
      //编辑
      this.dialong = {
        title: "编辑模板",
        show: true,
        option:"edit"
      }
      this.form = {
        title: row.title,
        video: row.video,
        bitrate: row.bitrate,
        width: row.width,
        height: row.height,
        audio: row.audio,
        abitrate: row.abitrate,
        sampling: row.sampling,
        format: row.format,
        watermarkid: [row.watermarkid],
        id:row._id
      }
    },
    handleDelete(index, row) {
      //删除数据
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.delete(`/api/models/delete/${row._id}`).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
          this.modelsInfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onAddModels() {
      //添加内容
      this.dialong = {
        title: "添加模板",
        show: true,
        option:"add"
      }
      this.form = {
        title: "",
        video: "",
        bitrate: "",
        width: "",
        height: "",
        audio: "",
        abitrate: "",
        sampling: "",
        format: "",
        watermarkid:[]
      }
    }
  },
  created() {
    this.modelsInfo();
  },
  components: {
    ModelsDialong
  }
};
</script>
<style scoped>
.staff {
  margin: 10px;
}
.btnRight {
  float: right;
}
</style>
