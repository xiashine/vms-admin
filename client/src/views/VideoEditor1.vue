<template>
    <div  class="player">
     <d-player ref="player" :options="options"></d-player>

      <div class="player-controller"  ref="controller">
        <div class="player-bar-wrap">
          <div class="player-bar-time" :style="{left}">{{ linetime | formatString }}</div>
          <div class="player-bar-preview"></div>
                      <div class="control-bars-wrapper" :style="{left:getleft,right:endright}" >
                    <div class="control-bar cb-left" :data-content="begintime | formatString" ref="bar_left">
    
                    </div>
                    <div class="control-bar cb-right" :data-content="endtime | formatString" ref="bar_right">
             </div>
            </div>
          <div class="player-bar" ref="bar">
            <div class="player-loaded"></div>
              <div class="player-played" :style="{width}">
                <div class="player-thumb" ref="bar_thumb" :style="{left}">
                  <span  class="player-thumb-line"></span>
                  </div>
                </div>

              </div>
          </div>
          <div class="player-bar-controller">
            <el-button  type="primary" icon="el-icon-caret-right" circle  @click="handleplay"></el-button>
          </div>
      </div>
    </div>
</template>

<script>
import VueDPlayer from '../components/VueDPlayerHls';
export default {
    name: 'VideoEditor',
    components: {
            'd-player': VueDPlayer
    },
     data() {
        return {
          slider:null,        //滚动条DOM元素
          thunk:null,         //拖拽DOM元素
          startbtn:null,
          endbtn:null,
          startper:0,
          endper:100,
          duration:0,
          begintime:0,
          endtime:0,
          per:0,     //当前值
          min:0,
          max:100,
          linetime:0,
          value1:0,
            id:null,
            player:null,
            source:null,
            options: {
                autoplay: true,
                highlight: [
                    {
                        time: 20,
                        text: '这是第 20 秒'
                    },
                    {
                        time: 120,
                        text: '这是 2 分钟'
                    }
                ]
            }
        }
    },
     mounted() {
       
        this.slider = this.$refs.bar;
        this.thunk = this.$refs.bar_thumb;
        this.startbtn = this.$refs.bar_left;
        this.endbtn = this.$refs.bar_right;
        var _this = this;
        console.log(this.thunk)
        this.thunk.onmousedown = function (e) {
            var width = parseInt(_this.width);
            var disX = e.clientX;
            document.onmousemove = function(e){
                // value, left, width
                // 当value变化的时候，会通过计算属性修改left，width

                // 拖拽的时候获取的新width
                //console.log(width);
                var newWidth = e.clientX - disX + width;
                // 拖拽的时候得到新的百分比
                console.log( e.clientX)
                var scale = newWidth / _this.slider.offsetWidth;
                _this.per = Math.ceil((_this.max - _this.min) * scale + _this.min);
                _this.per = Math.max(_this.per,_this.min);
                _this.per = Math.min(_this.per,_this.max);
                _this.linetime = Math.round(_this.duration*_this.per/_this.max)
                console.log("linetime:"+_this.linetime)
                console.log(_this.per)
            }
            document.onmouseup = function(){
                document.onmousemove = document.onmouseup = null;
            }
            return false;
        }
        this.startbtn.onmousedown = function (e) {
            var width = parseInt(_this.getwidth);
            var disX = e.clientX;
            document.onmousemove = function(e){
                // value, left, width
                // 当value变化的时候，会通过计算属性修改left，width

                // 拖拽的时候获取的新width
                console.log(width);
                var newWidth = e.clientX - disX + width;
                // 拖拽的时候得到新的百分比
                console.log(_this.slider.offsetWidth)
                var scale = newWidth / _this.slider.offsetWidth;
                _this.startper = Math.ceil((_this.max - _this.min) * scale + _this.min);
                _this.startper = Math.max(_this.startper,_this.min);
                _this.startper = Math.min(_this.startper,_this.max);
                _this.begintime = Math.round(_this.duration*_this.startper/_this.max)
                console.log("begintime:"+_this.begintime)
               // _this.startper = newWidth;
                console.log(_this.startper)
            }
            document.onmouseup = function(){
                document.onmousemove = document.onmouseup = null;
            }
            return false;
        }
        this.endbtn.onmousedown = function (e) {
            var width = parseInt(_this.endwidth);
            var disX = e.clientX;
            document.onmousemove = function(e){
                // value, left, width
                // 当value变化的时候，会通过计算属性修改left，width

                // 拖拽的时候获取的新width
                var newWidth = Math.abs(e.clientX - disX + width);
                // 拖拽的时候得到新的百分比
                console.log(newWidth)
                var scale = newWidth / _this.slider.offsetWidth;
                _this.endper = Math.ceil((_this.max - _this.min) * scale + _this.min);
                _this.endper = Math.max(_this.endper,_this.min);
                _this.endper = Math.min(_this.endper,_this.max);
                _this.endtime = Math.round(_this.duration*_this.endper/_this.max)
                console.log("endtime:"+_this.endtime)
               // _this.startper = newWidth;
                console.log(_this.endper)
            }
            document.onmouseup = function(){
                document.onmousemove = document.onmouseup = null;
            }
            return false;
        }
        this.player = this.$refs.player.dp;       
      
     },
     methods: { 
        tasksInfo() {
          this.$axios.get(`/api/tasks/${this.id}`).then(res => {
            console.log(res)
            this.source = 'http://192.168.97.181/video/out/'+ res.data.outpath;
            //this.source = 'http://global.vodfile.m1905.com/1553675993/dcea4e127dcc19577d5e8c1796610f40/m3u8i/movie/2018/09/28/m20180928SH8S3LFX80Q1PWJA/43D507C5688EE7A6B6F2FF33C.m3u8';
            console.log(this.source)
            this.switchvideo(this.source)
            
        }).catch(err => console.log(err));
        },
        handleplay(){
          this.player.on('timeupdate', ()=>{
            // this.player.pause()
            console.log(this.player.video.currentTime)
            this.per =(this.player.video.currentTime/this.duration*this.max).toFixed(2);
            this.linetime = Math.round(this.player.video.currentTime)
            console.log(this.per)
          });
         //this.player.on('pause', ()=>{
            this.player.seek(this.begintime);
            this.player.play()
          //});
            
        },
        play() {
            console.log('play callback')
        },
        switchvideo(url) {
            //this.player.play();
            this.player.switchVideo({
                url: url
            });
            this.player.on('durationchange', () => {
              
              this.duration = Math.floor(this.player.video.duration);
              this.endtime = this.duration;
              console.log(this.player.video.duration)
            });
        },
        handleSizeChange(value){
          console.log(value)
          this.player.seek(value[0])
        }
     },
    computed:{
        // 设置一个百分比，提供计算slider进度宽度和trunk的left值
        // 对应公式为  当前值-最小值/最大值-最小值 = slider进度width / slider总width
        // trunk left =  slider进度width + trunk宽度/2
        scale(){
          return (this.per - this.min) / (this.max - this.min);
        },
        width(){
          if(this.slider){
            return this.slider.offsetWidth * this.scale + 'px';
          }else{
            return 0 + 'px'
          }
        },
        getscale(){
          return (this.startper - this.min) / (this.max - this.min);
        },
        getwidth(){
          if(this.slider){
            return this.slider.offsetWidth * this.getscale + 'px';
          }else{
            return 0 + 'px'
          }
        },
        getleft(){
          if(this.slider){
            return this.slider.offsetWidth * this.getscale  + 'px';
          }else{
            return 0 + 'px'
          }
        },
       endscale(){
          return (this.endper - this.min) / (this.max - this.min);
        },
       endwidth(){
          if(this.slider){
            return this.slider.offsetWidth * this.endscale + 'px';
          }else{
            return 0 + 'px'
          }
        },
        endright(){
          if(this.slider && this.endscale != 0){
            return  (this.slider.offsetWidth-this.slider.offsetWidth * this.endscale)  + 'px';
          }else{
            return 0 + 'px'
          }
        },
       left(){
          if(this.slider){
            return this.slider.offsetWidth * this.scale -  this.thunk.offsetWidth/2 - 2  + 'px';
          }else{
            return 0 + 'px'
          }
        }
    },
   created() {
    this.id = this.$route.query.id;
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
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.player{
    width: 800px;
    height: 500px;
    margin:20px auto 50px;
}
@media only screen and (max-width: 640px){
  .player{
      width: 100%;
  }
}
.player-controller {
  width: 800px;
  height: 180px;
  background-color: black;
  margin-top: 20px;
  padding-top: 20px;
}
.player-controller .player-bar-wrap {
  position: relative;
    padding: 0px 0;
    cursor: pointer;
    margin:0 auto;
    margin-top: 10px;
    width: 90%;
    height: 50px; }
    .player-controller .player-bar-wrap .player-bar-time {
      position: absolute;
      left: 0px;
      top: -20px;
      border-radius: 4px;
      padding: 5px 7px;
      background-color: rgba(0, 0, 0, 0.62);
      color: #fff;
      font-size: 12px;
      text-align: center;
      opacity: 1;
      transition: opacity .1s ease-in-out;
      word-wrap: normal;
      word-break: normal;
      z-index: 2;
      pointer-events: none; }
      .player-controller .player-bar-wrap .player-bar-time.hidden {
        opacity: 0; }
    .player-controller .player-bar-wrap .player-bar {
      position: relative;
      height: 50px;
      width: 100%;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer; }
      .player-controller .player-bar-wrap .player-bar .player-loaded {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.4);
        height: 3px;
        transition: all 0.5s ease;
        will-change: width; }
      .player-controller .player-bar-wrap .player-bar .player-played {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height:50px;
        will-change: width; }
        .player-controller .player-bar-wrap .player-bar .player-played .player-thumb {
          position: absolute;
          height: 50px;
          width: 50px;
          cursor: pointer;
          }
          .player-controller .player-bar-wrap .player-bar .player-played .player-thumb .player-thumb-line {
          position: absolute;
          left:50%;
          height: 50px;
          width: 1px;
          background-color: #fff;
          cursor: pointer;
          }
.player-bar-left {
  position: absolute;
	top: 0;
	bottom: 0;
	background-color: rgba(25,30,64,.8);
	left: 0;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px
}

.player-bar-left.active:after {
	position: absolute;
	width: 6px;
	height: 100%;
	right: -6px;
	background-image: url('data:image/svg+xml;utf8,<svg width="6px" height="50px" viewBox="0 0 6 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <path d="M6,0 C3.23857625,5.07265313e-16 1,2.23857625 1,5 L1,45 C1,47.7614237 3.23857625,50 6,50 L0,50 L0,0 L6,0 Z" id="round_inverted_left" fill="rgba(25, 30, 64, 0.8)" fill-rule="nonzero"></path> </g> </svg>');
	background-position: right;
	background-repeat: no-repeat;
	content: ' '
}

.control-bars-wrapper{
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	border: solid 1px #00e0ff;
	border-radius: 5px
}

.control-bar {
	width: 10px;
	position: absolute;
	top: 20%;
	bottom: 20%;
	background-color: #00e0ff;
	cursor: ew-resize;
	pointer-events: all;
	border-radius: 10px
}

.control-bar.padding-left:after {
	left: 100%;
	transform: translate(0,0)
}

.control-bar.padding-right:after {
	left: 0;
	transform: translate(-100%,0)
}

.control-bar.cb-left {
	transform: translateX(-50%);
  z-index: 4;
}

.control-bar.cb-left.padding-right:after {
	transform: translate(-100%,0)
}

.control-bar.cb-right {
	right: 0;
	transform: translateX(50%);
  z-index: 4;
}

.control-bar.cb-right.padding-left:after {
	transform: translate(0,0)
}

.control-bar:after {
	transition: left 100ms linear,transform 100ms linear;
	position: absolute;
	font-size: 12px;
	color: #00e0ff;
	left: 50%;
	transform: translate(-50%,0);
	content: attr(data-content);
	font-weight: 400;
	bottom: -35px
}

.control-bar:active:before,.control-bar:hover:before {
	color: #fff
}

.control-bar:before {
	content: '•\A•\A•';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	font-size: 12px;
	margin-top: 0;
	white-space: pre;
	line-height: 6px
}
.player-bar-controller{
  margin-top: 20px;
  padding: 20px;
}
</style>