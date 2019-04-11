<template>
    <div  class="player">
     <d-player ref="player" :options="options"></d-player>

      <div class="player-controller"  ref="controller">
      <CropTool :duration="duration"
                  :playing="playing"
                  :currentPlayingTime="currentTime"
                  @play="playVideo"
                  @seek="seekVideo"
                  @pause="pauseVideo"
                  @stop="stopVideo"
                  @crop="cropVideo"
                  />
      </div>
    </div>
</template>

<script>
import VueDPlayer from '../components/VueDPlayerHls';
import CropTool from '../components/CropTool'
export default {
    name: 'VideoEditor',
    components: {
      'd-player': VueDPlayer,
      CropTool,
    },
     data() {
        return {
            duration: 0,
            playing: false,
            currentTime: 0,
            id:null,
            infoid:null,
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
       
        this.player = this.$refs.player.dp;
        const videoElement = this.player.video;
        videoElement.ondurationchange = () => {
            this.duration = videoElement.duration
        }
        videoElement.onplaying = () => {
            this.playing = true
        }
        videoElement.onpause = () => {
            this.playing = false
        }
        videoElement.ontimeupdate = () => {
            this.currentTime = videoElement.currentTime
        }
        console.log(this.player)
     },
     methods: { 
        tasksInfo() {
          this.$axios.get(`/api/tasks/${this.id}`).then(res => {
            console.log(res)
            this.source = 'http://192.168.97.181/video/out/'+ res.data.outpath;
            this.infoid = res.data.infoid;
            //this.source = 'http://global.vodfile.m1905.com/1553675993/dcea4e127dcc19577d5e8c1796610f40/m3u8i/movie/2018/09/28/m20180928SH8S3LFX80Q1PWJA/43D507C5688EE7A6B6F2FF33C.m3u8';
            //console.log(this.source)
            this.switchvideo(this.source)
        }).catch(err => console.log(err));
        },
        play() {
            console.log('play callback')
        },
        switchvideo(url) {
            //this.player.play();
            this.player.switchVideo({
                url: url
            });
        },
        seekVideo (seekTime) {
                this.player.seek(seekTime);
        },
        playVideo (time) {
            this.seekVideo(time)
            this.player.play()
        },
        pauseVideo () {
            if(this.playing)
             this.player.pause()
             else
             this.player.play()
        },
        stopVideo () {
            this.player.pause()
            this.seekVideo(0)
        },
        cropVideo(item){
          console.log('crop')
          item.forEach(row => {
            let form = {
              title: '剪辑片段-'+ Math.ceil(row.startTime) +'s-'+ Math.ceil(row.endTime)+'s',
              parentid:this.infoid,
              starttime:Math.ceil(row.startTime),
              endtime:Math.ceil(row.endTime)
            };
           this.$axios.post(`/api/sourceinfo/add`, form).then(res => {
             console.log(res);
          });

          });
          let msg = '无剪辑数据';
          if(item.length>0)
          {
            msg = '剪辑成功';
          }
          this.$message({
                type: "success",
                message: msg
            })
          console.log(item)
        }
     },
    computed:{
    },
   created() {
    this.id = this.$route.query.id;
    this.tasksInfo();
  },
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
    width: 100%;
    margin:20px;
    height: 500px;
}
.player-controller {
  width: 100%;
  height: 180px;
  margin-top: 20px;
  padding-top: 20px;
}

</style>