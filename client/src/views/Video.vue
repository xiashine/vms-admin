<template>
  <div class="staff">
    <div class="staff-top">
        <el-form :inline="true">
            <el-form-item class="btnRight">
                <el-button type="primary" size ="small" icon="el-icon-edit-outline" @click='onAddSourceinfo()'>添加</el-button>
            </el-form-item>
        </el-form>
    </div>
      <div class="tables">
           <el-table
            :data="sourceData"
            min-height="460px"
            border
            row-key="_id"
            :expand-row-keys="expandKeys"
            @expand-change="expandChange"
            style="width: 100%">
<el-table-column type="expand"    fixed>
      <template slot-scope="props">
          <el-table
            v-loading="loading"
            :data="subTableData">
            <el-table-column
                label="视频标题"
                align="center"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="开始时间"
                align="center"
                width="100">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.starttime }}s</span>
                </template>
            </el-table-column>
            <el-table-column
                label="结束时间"
                align="center"
                width="100">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.endtime }}s</span>
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px"><el-tag type="success" v-if="scope.row.state==='1'">已发布</el-tag><el-tag v-else>未发布</el-tag></span>
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
            </el-table>
      </template>
</el-table-column>

            <el-table-column
                label="ID"
                align="center"
                width="240">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row._id }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="缩略图"
                align="center"
                width="120">
                <template slot-scope="scope">
                    <img :src="scope.row.thumb" style="width:100px">
                </template>
            </el-table-column>
            <el-table-column
                label="视频标题"
                align="center"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="文件路径"
                align="center"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.path }}</span>
                </template>
            </el-table-column>
             <el-table-column
                label="状态"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px"><el-tag type="success" v-if="scope.row.state==='1'">已发布</el-tag><el-tag v-else>未发布</el-tag></span>
                </template>
            </el-table-column>
            <el-table-column
                label="标签"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.tags }}</span>
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
                    <!--<el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <el-button
                    size="mini"
                    @click="handlePostTasks(scope.$index, scope.row)"  v-if="scope.row.state==='0'">发布</el-button>
                </template>
            </el-table-column>
        </el-table>
    <div class="paginations">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page.sync="paginations.page_index"
				:page-sizes="paginations.page_sizes"
				:page-size="paginations.page_size"
				:layout="paginations.layout"
				:total="paginations.total">
			</el-pagination>
		</div>
      </div>
      <VideoDialong :dialong="dialong" :form="form" @UserData="sourceInfo"></VideoDialong>
      <PostTasksDialong :dialong="tasksdialong" :form="form" @UserData="sourceInfo"></PostTasksDialong>
  </div>
</template>

<script>
// @ is an alias to /src
import VideoDialong from "../components/VideoDialong";
import PostTasksDialong from "../components/PostTasksDialong";
export default {
  name: "Video",
  data() {
    return {
      expandKeys:[],/** 新增 **/
      loading:true,
      subTableData:[],
      sourceData: [
      ], //数据存储
      filterTabDate:[], //查询数据
      paginations:{
        page_index:1, //当前位于哪页
        total:0, //总数
        page_size:5, //一页显示多少条
        page_sizes:[5,10,15,20], //每页显示多少条
        layout:'total, sizes, prev, pager, next, jumper'
      },
      allTableData:[], //分页数据
      tasksdialong:{
        //弹出框
        show: false,
        title: "",
        option: "edit"
      },
      dialong: {
        //弹出框
        show: false,
        title: "",
        option: "edit"
      },
      form: {   //添加和删除需要传递的字段名
        title: "",
        path: "",
        tags: "",
        thumb: "",
        state: ""
      }
    };
  },
  methods: {
    sourceInfo() {
       this.$axios.get("/api/sourceinfo/").then(res => {
					// console.log(res)
          //this.sourceData = res.data;
          this.allTableData = res.data;
					this.filterTabDate = res.data; //过滤数据
					this.setPaginations();
        }).catch(err => console.log(err));
    },
    setPaginations(){
				//分页属性设置
				this.paginations.total = this.allTableData.length; //数据的数量
				this.paginations.page_index = 1; //默认显示第一页
				this.paginations.page_size = 5; //每页显示的数据
				//数据显示
				this.sourceData = this.allTableData.filter((item,index) => {
					return index < this.paginations.page_size;
				})
		},
    handleSizeChange(page_size){
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.sourceData = this.allTableData.filter((item,index) => {
        return index < page_size;
      })
    },
    handleCurrentChange(page){
      //获取当前页
      let index = this.paginations.page_size * (page -1);
      
      //数据的总数
      let nums = this.paginations.page_size * page;
      //容器
      let tables = [];
      for(let i = index; i < nums; i++) {
        if(this.allTableData[i]) {
          tables.push(this.allTableData[i])
        }
        this.sourceData = tables;
      }
    },
    expandChange(row, expandedRows) {
                console.log(row);
                if(this.expandKeys.indexOf(row._id)>=0){
                    //收起当前行
                    this.expandKeys.shift()
                    return;
                }
                let _this = this
                //恢复默认值
                _this.loading = true
                _this.subTableData = []
                //加载数据
                 this.$axios.get(`/api/sourceinfo/list/${row._id}`).then(res => {
                        _this.subTableData = res.data
                        _this.loading = false
                        _this.expandKeys.shift()            /** 新增 **/
                        _this.expandKeys.push(row._id)       /** 新增 **/
                    }).catch(function (error) {
                    console.log(error);
                });
                if (expandedRows.length > 1) {
                    //只展开当前选项
                    expandedRows.shift()
                }
    },
    handleEdit(index, row) {
			console.log(row)
      //编辑
      this.dialong = {
        title: "发布视频",
        show: true,
        option:"edit"
      }
      this.form = {
        title: row.title,
        path: row.path,
        tags: row.tags,
        thumb: row.thumb,
        state: row.state,
        id:row.id
      }
    },
    handlePostTasks(index, row) {
			console.log(row)
      //编辑
      this.tasksdialong = {
        title: "发布视频",
        show: true,
        option:"add"
      }
      this.form = {
        title: row.title,
        path: row.path,
        tags: row.tags,
        thumb: row.thumb,
        state: row.state,
        id:row._id,
        modelid:[]
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
          this.$axios.delete(`/api/sourceinfo/delete/${row._id}`).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
          this.sourceInfo();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    onAddSourceinfo() {
      //添加内容
      this.dialong = {
        title: "添加视频",
        show: true,
        option:"add"
      }
      this.form = {
        title: "",
        path: "",
        tags: "",
        thumb: "",
        state: ""
      }
    }
  },
  created() {
    this.sourceInfo();
  },
  components: {
    VideoDialong,
    PostTasksDialong
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
.paginations{
	text-align: right;
	margin-top: 10px;
  margin-bottom: 10px;
}
</style>
