<template>
	<div>
		<div class="container">
			<div class="handle-box">
<!--				<el-select v-model="query.address" placeholder="项目名称" class="handle-select mr10">-->
<!--					<el-option key="1" label="广东省" value="广东省"></el-option>-->
<!--					<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
<!--				</el-select>-->
				<el-input v-model="query.name" placeholder="输入用户名搜索，留空为查询所有" class="handle-input mr10"></el-input>
        <el-select v-model="SearchProject" clearable class="m-2" placeholder="按项目名称搜索" size="default" style="margin: 0 10px" @change="handleTypeSearch">
          <el-option
              v-for="item in ProjectData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="username" label="用户名" align="center"></el-table-column>
<!--				<el-table-column label="账户余额">-->
<!--					<template #default="scope">￥{{ scope.row.money }}</template>-->
<!--				</el-table-column>-->
<!--				<el-table-column label="头像(查看大图)" align="center">-->
<!--					<template #default="scope">-->
<!--						<el-image-->
<!--							class="table-td-thumb"-->
<!--							:src="scope.row.thumb"-->
<!--							:z-index="10"-->
<!--							:preview-src-list="[scope.row.thumb]"-->
<!--							preview-teleported-->
<!--						>-->
<!--						</el-image>-->
<!--					</template>-->
<!--				</el-table-column>-->
        <el-table-column label="所属项目" align="center" prop="customProjects">
          <template #default="{row}">
            <span v-for="cp in row.customProjects" :key="cp.id">
              [{{cp.project.name}}]
            </span>
          </template>
        </el-table-column>
        <el-table-column label="账号级别" align="center" prop="role.name">
        </el-table-column>
				<el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.state === '正常' ? 'success' : scope.row.state === '未启用' ? 'danger' : ''"
						>
							{{ scope.row.state }}
						</el-tag>
					</template>
				</el-table-column>

        <el-table-column prop="register_date" label="注册时间" align="center"></el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.pageIndex"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog v-bind:title="EditorTitle" v-model="editVisible" width="25%">
			<el-form label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="CustomUserName" placeholder="请输入用户名搜索" :disabled="isEditorCustom"></el-input>
				</el-form-item>
        <el-form-item label="用户密码">
          <el-input type="password" v-model="CustomPassWord" :placeholder="EditorTips"></el-input>
        </el-form-item>
        <el-form-item label="所属项目">
          <el-select v-model="ProjectValue" multiple class="m-2" placeholder="请选择项目" size="large" style="width: 380px">
            <el-option
                v-for="item in ProjectData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限赋予">
          <el-select v-model="ProjectRole" class="m-2" placeholder="请选择权限" size="large" style="width: 380px">
            <el-option
                v-for="item in RoleData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import request from "../utils/request";

interface TableItem {
	id: string;
  username: string;
	state: string;
  register_date: string;
  customProjects:[
    {
      id:string,
      project:{
        id:string,
        name:string,
        address:string
      }
    }
  ],
  role:{
    id:string,
    name:string
  }
}

interface ProjectItem {
  id:string
  name:string,
  address:string
}

interface RoleItem {
  id:string
  name:string,
}

const query = reactive({
	// address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const ProjectData = ref<ProjectItem[]>([]);
const RoleData = ref<RoleItem[]>([]);
const pageTotal = ref(0);
const EditorTitle = ref("")
const EditorTips = ref("")
const ProjectValue = ref([])
const SearchProject = ref([])
const ProjectRole = ref('')
const CustomUserName = ref('')
const CustomRoleName = ref('')
const CustomUserId = ref('')
const CustomPassWord = ref('')
const isEditorCustom = ref(false)

// 获取表格数据
const getData = () => {
  request.get("/custom/manage/all",{"username":localStorage.getItem("ms_username")})
  .then((res) => {
    const data:any = res;
    tableData.value = data.data.data;
    console.log(data.data.data)
    pageTotal.value = tableData.value.length;
  });
};
getData();
// 查询操作
const handleSearch = () => {
  if(query.name == "")
  {
    getData();
  }else {
    request.get("/custom/search",{"username":query.name})
    .then((res) => {
      const data:any = res;
      tableData.value = data.data.data;
    });
  }
};

const handleTypeSearch = (val:string) => {
  if(val != "")
  {
    request.get("/cp/search",{"id":val})
    .then((res) => {
      const data:any = res;
      tableData.value = data.data.data;
    });
  }else
  {
    getData();
  }
};

//新增操作
const handleAdd = () => {
  editVisible.value = true;
  EditorTitle.value = "新增用户";
  EditorTips.value = "请输入密码";
  CustomUserName.value = "";
  CustomPassWord.value = "";
  CustomUserId.value = "";
  ProjectValue.value = [];
  isEditorCustom.value = false;
  ProjectRole.value = "";
  CustomRoleName.value = "";
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
      request.get("/custom/del",{"id":tableData.value[index].id})
      .then((res) => {
        const data:any = res;
        if(data.data.code == 200)
        {
          ElMessage.success("删除成功");
          getData();
        }else{
          ElMessage.error("删除失败");
        }
      });
		})
		.catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	name: '',
	address: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  EditorTitle.value = "编辑用户";
  EditorTips.value = "保持原密码请留空";
  editVisible.value = true;
  CustomUserName.value =  tableData.value[index].username;

  CustomUserId.value = tableData.value[index].id;
  isEditorCustom.value = true;
  const TempProjectValue:any = ref([]);
  for(let i=0;i<tableData.value[index].customProjects.length;i++){
    TempProjectValue.value.push(tableData.value[index].customProjects[i].project.id);
  }
  ProjectValue.value = TempProjectValue.value;
  ProjectRole.value = tableData.value[index].role.name;
};
const saveEdit = () => {
  if(EditorTitle.value=="编辑用户")
  {
    request.post("/custom/edit",{"username":CustomUserName.value,"password":CustomPassWord.value,"project_id":ProjectValue.value.toString(),"custom_id":CustomUserId.value})
    .then((res) => {
      const data:any = res;
      if(data.data.code == 200)
      {
        ElMessage.success("修改成功");
        editVisible.value = false;
        getData();
      }else{
        ElMessage.error("用户修改失败,可能存在同名用户");
      }
    });
  }else
  {
    request.post("/custom/add",{"username":CustomUserName.value,"password":CustomPassWord.value,"project_id":ProjectValue.value.toString(),"role":ProjectRole.value})
    .then((res) => {
      const data:any = res;
      if(data.data.code == 200)
      {
        ElMessage.success("添加成功");
        editVisible.value = false;
        getData();
      }else{
        ElMessage.error("用户添加失败，请检查是否有重名账户");
      }
    });
  }
};
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #F56C6C;
}
.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
