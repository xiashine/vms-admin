<template>
  <div class="staff">
    <div class="staff-top">
        <el-form :inline="true">
            <el-form-item class="btnRight">
                <el-button type="primary" size ="small" icon="el-icon-edit-outline" @click='onAddWatermark()'>添加</el-button>
            </el-form-item>
        </el-form>
    </div>
      <div class="tables">
           <el-table
            :data="watermarkData"
            border
            style="width: 100%">
            <el-table-column
                label="水印名称"
                align="center"
                width="50">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="水印路径"
                align="center"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.in }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="水印定位"
                align="center"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.position }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="坐标"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">x:{{ scope.row.x }} y:{{ scope.row.y }} top:{{ scope.row.top }} left:{{ scope.row.left }} right:{{ scope.row.right }} bottom:{{ scope.row.bottom }}</span>
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
      <WatermarkDialong :dialong="dialong" :form="form" @UserData="watermarkInfo"></WatermarkDialong>
  </div>
</template>

<script>
// @ is an alias to /src
import WatermarkDialong from "../components/WatermarkDialong";
export default {
  name: "Watermark",
  data() {
    return {
      watermarkData: [
      ], //数据存储
      dialong: {
        //弹出框
        show: false,
        title: "",
        option: "edit"
      },
      form: {   //添加和删除需要传递的字段名
        title: "",
        in: "",
        position: "",
        x: "",
        y: "",
        top: "",
        left: "",
        right: "",
        bottom: ""
      }
    };
  },
  methods: {
    watermarkInfo() {
       this.$axios.get("/api/watermark/").then(res => {
		 // console.log(res)
          this.watermarkData = res.data;
        }).catch(err => console.log(err));
    },
    handleEdit(index, row) {
			console.log(row)
      //编辑
      this.dialong = {
        title: "添加水印",
        show: true,
        option:"edit"
      }
      this.form = {
        title: row.title,
        in: row.in,
        position: row.position,
        x: row.x,
        y: row.y,
        top: row.top,
        left:row.left,
        right: row.right,
        bottom:row.bottom,
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
          this.$axios.delete(`/api/watermark/delete/${row._id}`).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
          this.watermarkInfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onAddWatermark() {
      //添加内容
      this.dialong = {
        title: "添加水印",
        show: true,
        option:"add"
      }
      this.form = {
        title: "",
        in: "",
        position: "",
        x: "",
        y: "",
        top: "",
        left: "",
        right: "",
        bottom: ""
      }
    }
  },
  created() {
    this.watermarkInfo();
  },
  components: {
    WatermarkDialong
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
