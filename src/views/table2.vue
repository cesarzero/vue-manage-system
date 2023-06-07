<template>
	<div>
		<div class="container">
			<div class="handle-box">
<!--				<el-select v-model="query.address" placeholder="项目名称" class="handle-select mr10">-->
<!--					<el-option key="1" label="广东省" value="广东省"></el-option>-->
<!--					<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
<!--				</el-select>-->
				<el-input v-model="query.name" placeholder="请输入项目名搜索" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
			</div>
			<el-table :data="ProjectData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
        <el-table-column prop="number" label="项目协议号" align="center"></el-table-column>
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
        <el-table-column prop="address" label="云渲染链接" align="center">
          <template #default="scope">
            <a :href="scope.row.address" target="_blank">{{scope.row.address}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="外发链接" align="center">
          <template #default="scope">
            <a :href="scope.row.link" target="_blank">{{scope.row.link}}</a>
          </template>
        </el-table-column>
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
				<el-form-item label="项目名称">
					<el-input v-model="ProjectName" placeholder="请输入项目名称"></el-input>
				</el-form-item>
        <el-form-item label="项目编号">
          <el-input v-model="ProjectNumber" placeholder="请输入项目协议号"></el-input>
        </el-form-item>
        <el-form-item label="项目链接">
          <el-input v-model="ProjectLink" :placeholder="EditorTips"></el-input>
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
import request from "../utils/request";


interface ProjectItem {
  id:string
  name:string,
  address:string,
  number:string,
  link:string
}

const query = reactive({
	// address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});
const ProjectData = ref<ProjectItem[]>([]);
const pageTotal = ref(0);
const EditorTitle = ref("")
const EditorTips = ref("")
const ProjectValue = ref('')
const ProjectName = ref('')
const ProjectNumber = ref('')
const ProjectLink = ref('')
const ProjectID = ref('')
const isEditorCustom = ref(false)

// 获取表格数据
const getData = () => {
  request.get("/project/all",{})
  .then((res) => {
    const data:any = res;
    ProjectData.value = data.data.data;
    pageTotal.value = ProjectData.value.length;
  });
};
getData();
// 查询操作
const handleSearch = () => {
  if(query.name == "")
  {
    getData();
  }else {
    request.get("/project/search",{"name":query.name})
    .then((res) => {
      const data:any = res;
      ProjectData.value = data.data.data;
    });
  }
};

//新增操作
const handleAdd = () => {
  editVisible.value = true;
  EditorTitle.value = "新增项目";
  EditorTips.value = "请输入项目连接";
  ProjectValue.value = "";
  isEditorCustom.value = false;
  ProjectID.value = "";
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('该操作会关联删除用户下的项目信息，请二次确认', '提示', {
		type: 'warning'
	})
		.then(() => {
      request.get("/project/del",{"id":ProjectData.value[index].id})
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
  EditorTitle.value = "编辑项目";
  EditorTips.value = "请输入连接";
  editVisible.value = true;
  ProjectName.value = ProjectData.value[index].name;
  ProjectLink.value = ProjectData.value[index].address;
  isEditorCustom.value = true;
  ProjectID.value = ProjectData.value[index].id;
};
const saveEdit = () => {
  if(EditorTitle.value=="编辑项目")
  {
    request.post("/project/edit",{"id":ProjectID.value,"name":ProjectName.value,"link":ProjectLink.value,"number":ProjectNumber.value})
    .then((res) => {
      const data:any = res;
      if(data.data.code == 200)
      {
        ElMessage.success("修改成功");
        editVisible.value = false;
        getData();
      }else{
        ElMessage.error("项目修改失败");
      }
    });
  }else
  {
    request.post("/project/add",{"name":ProjectName.value,"link":ProjectLink.value,"number":ProjectNumber.value})
    .then((res) => {
      const data:any = res;
      if(data.data.code == 200)
      {
        ElMessage.success("添加成功");
        editVisible.value = false;
        getData();
      }else{
        ElMessage.error("项目添加失败，请检查是否有重名项目");
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
