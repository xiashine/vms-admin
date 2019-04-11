<template>
  <div class="staff">
    <div class="staff-top">
    </div>
      <div class="tables">
           <el-table
            v-if="tasksData.length > 0"
            :data="tasksData"
            min-height="460px"
            border
            style="width: 100%">
            <el-table-column
             fixed
                label="视频标题"
                align="center"

                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px"  @click="handlePreview(scope.row._id)">{{ scope.row.infoid.title }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="文件路径"
                align="center"
                width="300">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.infoid.path }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="转码模板"
                align="center"
                width="120">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.modelid.title }}</span>
                </template>
            </el-table-column>
             <el-table-column
                label="输出格式"
                align="center"
                width="250">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">输出格式：{{ scope.row.modelid.format }} 码率：{{ scope.row.modelid.bitrate }}kb/s 分辨率：{{ scope.row.modelid.width }}x{{ scope.row.modelid.height }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="进度"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.percentage | number"></el-progress>
                </template>
            </el-table-column>
            <el-table-column
                label="用时"
                align="center"
                width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.time | formatString  }}</span>
                </template>
            </el-table-column>
        </el-table>
        		<div v-else class="txt">{{message}}</div>
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
  </div>
</template>

<script>
export default {
  name: "Tasks",
  data() {
    return {
        visible: false,
        message:"数据不存在",
        filterTabDate:[], //查询数据
        paginations:{
          page_index:1, //当前位于哪页
          total:0, //总数
          page_size:5, //一页显示多少条
          page_sizes:[5,10,15,20], //每页显示多少条
          layout:'total, sizes, prev, pager, next, jumper'
        },
        tasksData:[],  //数据
        allTableData:[] //分页数据
    };
  },
  methods: {
    tasksInfo() {
      this.$axios
        .get("/api/tasks").then(res => {
					 console.log(res)
          //this.tasksData = res.data;
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
				this.tasksData = this.allTableData.filter((item,index) => {
					return index < this.paginations.page_size;
				})
		},
    handleSizeChange(page_size){
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tasksData = this.allTableData.filter((item,index) => {
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
        this.tasksData = tables;
      }
    },
    handlePreview(id){
      console.log(id)
      this.$router.push({
          path: '/videoeditor',
          query: {
            id: id
          }
        })
    }
  },
  created() {
    this.tasksInfo();
  },
  filters:{
    formatString :function(sec){
    if(isNaN(parseInt(sec))) return '00:00:00'
      let h = sec / 3600;
      let m = sec % 3600 / 60;
      let s = sec % 60; //不足60的就是秒，够60就是分
      return  parseInt(h)+":"+parseInt(m)+":"+parseInt(s);
        //return this.$moment(ss);
    },
    number:function(num){
      return isNaN(parseInt(num)) ? 0 : parseInt(num)
    }
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
