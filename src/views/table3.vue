<template>
	<div>
		<div class="container">
			<div class="handle-box">
<!--				<el-select v-model="query.address" placeholder="项目名称" class="handle-select mr10">-->
<!--					<el-option key="1" label="广东省" value="广东省"></el-option>-->
<!--					<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
<!--				</el-select>-->
<!--				<el-input v-model="query.name" placeholder="请输入用户名搜索" class="handle-input mr10"></el-input>-->
<!--				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>-->
<!--				<el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>-->
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="project.name" label="项目名称" align="center"></el-table-column>
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
            <el-button type="primary" :icon="ChromeFilled" @click="handleEdit(scope.$index, scope.row)">
              打开链接
            </el-button>
          </template>
        </el-table-column>
<!--				<el-table-column label="操作" width="220" align="center">-->
<!--					<template #default="scope">-->
<!--						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">-->
<!--							编辑-->
<!--						</el-button>-->
<!--						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">-->
<!--							删除-->
<!--						</el-button>-->
<!--					</template>-->
<!--				</el-table-column>-->
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
<!--		<el-dialog v-bind:title="EditorTitle" v-model="editVisible" width="25%">-->
<!--			<el-form label-width="70px">-->
<!--				<el-form-item label="项目名称">-->
<!--					<el-input v-model="ProjectName" placeholder="请输入项目名称" :disabled="isEditorCustom"></el-input>-->
<!--				</el-form-item>-->
<!--        <el-form-item label="项目链接">-->
<!--          <el-input v-model="ProjectLink" :placeholder="EditorTips"></el-input>-->
<!--        </el-form-item>-->
<!--			</el-form>-->
<!--			<template #footer>-->
<!--				<span class="dialog-footer">-->
<!--					<el-button @click="editVisible = false">取 消</el-button>-->
<!--					<el-button type="primary" @click="saveEdit">确 定</el-button>-->
<!--				</span>-->
<!--			</template>-->
<!--		</el-dialog>-->
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ChromeFilled } from '@element-plus/icons-vue';
import request from "../utils/request";

interface TableItem {
	id: string;
  username: string;
	state: string;
  register_date: string;
	project:{
    id:string
    name:string,
    address:string
  }
}

interface ProjectItem {
  id:string
  name:string,
  address:string
}

const query = reactive({
	// address: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const EditorTitle = ref("")
const EditorTips = ref("")
const ProjectValue = ref('')
const ProjectName = ref('')
const ProjectLink = ref('')
const isEditorCustom = ref(false)

// 获取表格数据
const getData = () => {
  request.get("https://www.atchain.cn:8004/custom/get",{"username":localStorage.getItem("ms_username")})
  .then((res) => {
    const data:any = res;
    tableData.value = data.data.data;
    pageTotal.value = tableData.value.length;
  });
};
getData();

// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	name: '',
	address: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  window.open(tableData.value[index].project.address)
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
