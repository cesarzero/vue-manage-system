<template>
	<div id="box">
    <div id="box_area" v-show="!isLoginSuccess">
        <div id="box_title">
          <span>{{query.project}}</span>
        </div>
        <div id="box_input">
          <el-input type="text" v-model="query.username" style="width: 200px" placeholder="请输入账号" >
          </el-input>
          <br/>
          <el-input type="password" v-model="query.password" style="width: 200px" placeholder="请输入密码">
          </el-input>
        </div>
      <div id="box_button">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" style="width: 90px;margin: 0 -45px;" @click="handleLogin">
              登录
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" style="width: 90px;margin: 0 10px;" @click="handleLoginManage">
            用户管理
            </el-button>
          </el-col>
        </el-row>
      </div>



    </div>
    <!-- <iframe :src="address" frameborder="0" scrolling="no" style="position:absolute;width: 100%;height: 100%" v-show="isLoginSuccess">
    </iframe> -->
	</div>
</template>

<script setup lang="ts">
import 'cropperjs/dist/cropper.css';
import {useRoute} from "vue-router";
import {Base64} from "js-base64";
import {reactive, ref} from "vue";
import request from "../utils/request";
import {ElMessage} from "element-plus";

const isLoginSuccess = ref(false)
const address = ref('')

const query = reactive({
  username: '',
  password:'',
  project:''
});

const url_code:any = useRoute().query.project;
const url:any = Base64.decode(url_code)

request.post("/project/get",{"project_number":url})
.then((res) => {
  const data:any = res;
  if(data.data.code == 200)
  {
    query.project = data.data.data.name;
    console.log(data.data.data);
  }else{
    ElMessage.error("登录失败");
  }
});

const handleLogin = () => {
  request.post("/custom/login",{"username":query.username,"password":query.password,"project_number":url})
  .then((res) => {
    const data:any = res;
    if(data.data.code == 200)
    {
      isLoginSuccess.value = true;
      address.value = data.data.data;
      window.location.replace(address.value)
    }else{
      ElMessage.error("登录失败");
    }
  });
};

const handleLoginManage = () => {
  window.open("https://www.atchain.cn/CR/index.html")
};

</script>

<style scoped>
  #box{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #F4F4F4;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  #box_area{
    width: 30%;
    height: 30%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
  }
  #box_title span{
    font-size: 3rem;
    color:#43423F;
  }
  #box_input{
    display: flex;
    flex-direction: column;
  }

  #box_button {
    margin: 10px;
  }
</style>
