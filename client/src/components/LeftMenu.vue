<template>
  <div class="sidebar">
    <el-row class="menu_page">
      <el-col>
        <el-menu
          mode="vertical"
          class="el-menu-vertical-demo"
          :collapse="collapse"
          :default-active="$route.path"
          background-color="#324057"
          text-color="#fff"
        >
          <Menu :items="items"/>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import bus from "../common/bus";
import Menu from "./Menu";
// @ is an alias to /src
export default {
  name: "LeftMenu",
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-menu",
          name: "首页",
          path: "/home"
        },
        {
          icon: "el-icon-view",
          name: "视频库",
          path: "/video"
        },
        {
          icon: "el-icon-tickets",
          name: "转码队列",
          path: "/tasks"
        },
        {
          icon: "el-icon-mobile-phone",
          name: "模板管理",
          path: "/models"
        },
        
        {
          icon: "el-icon-document",
          name: "在线编辑",
          path: "/videoeditor"
        },
        {
          icon: "el-icon-setting",
          name: "水印管理",
          path: "/watermark"
        },
       /* {
          icon: "el-icon-bell",
          name: "投资管理",
          path: "/list",
          children: [
            {
              path: "/chinaTouziList",
              name: "省份投资"
            },
            {
              path: "/chinaTabsList",
              name: "区域投资"
            }
          ]
        },
        {
          icon: "el-icon-tickets",
          name: "资金数据",
          path: "/position",
          children: [
            {
              path: "/fundPosition",
              name: "投资分布"
            }
          ]
        },
         {
          icon: "el-icon-service",
          name: "用户信息",
          path: "/staff"
        },
        {
          icon: "el-icon-location-outline",
          name: "地图展示",
          path: "/maplist"
        }*/
      ]
    };
  },
  components: {
    Menu
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.sidebar {
  overflow: hidden;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.el-menu {
  border: none;
  z-index: 9999;
}

.fa-margin {
  margin-right: 5px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}

.el-menu-vertical-demo {
  width: 49px;
}

.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}

a {
  text-decoration: none;
}
</style>
