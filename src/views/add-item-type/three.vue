<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="24" :lg="{ span: 12, offset: 6 }">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="选择类目">
            <el-cascader
              v-model="value"
              :options="options"
              :props="props"
              @active-item-change="handleItemChange"
            />
          </el-form-item>
          <el-form-item label="分类名字">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="分类排序">
            <el-input v-model="form.sort" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addItemType, getSeriesItemTypes, getOneItemTypes } from '@/api/add-item-type'
export default {
  data() {
    return {
      form: {
        name: '',
        sort: ''
      },
      options: [],
      props: {
        value: '_id',
        children: 'children'
      },
      value: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const params = {
        series: 1
      }
      getSeriesItemTypes(params).then(({ data }) => {
        data.forEach(item => {
          item.label = item.name
          item.children = []
        })
        this.options = data
      })
    },
    handleItemChange(val) {
      const params = {
        pid: val[0]
      }
      getOneItemTypes(params).then(({ data }) => {
        data.forEach(item => {
          item.label = item.name
          item.value = item._id
        })
        this.options.forEach(item => {
          if (item._id == val[0]) {
            item.children = data
          }
        })
      })
    },
    submitForm() {
      const params = {
        pid: this.value[1],
        name: this.form.name,
        picture: 'https://img11.360buyimg.com/da/jfs/t1/102437/2/3350/50587/5ddf95b6Eddea2ab2/cf89c56d03f54a1e.jpg!q90.webp',
        series: 3,
        sort: this.form.sort,
        tree: this.value[0] + '.' + this.value[1]
      }
      if (this.value.length === 0) {
        this.$message.error('请选择分类！')
      } else if (!params.name) {
        this.$message.error('请填写分类名字！')
      } else if (!params.sort) {
        this.$message.error('请填写排序！')
      } else {
        addItemType(params).then(res => {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.form = {
            name: '',
            sort: ''
          }
          this.value = []
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .container {
        padding: 50px 30px;
    }
</style>
