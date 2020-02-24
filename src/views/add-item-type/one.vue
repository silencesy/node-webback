<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="24" :lg="{ span: 12, offset: 6 }">
        <el-form ref="form" :model="form" label-width="80px">
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
import { addItemType } from '@/api/add-item-type'
export default {
  data() {
    return {
      form: {
        name: '',
        sort: ''
      }
    }
  },
  methods: {
    submitForm() {
      const params = {
        pid: '0',
        name: this.form.name,
        picture: 'no',
        series: 1,
        sort: this.form.sort,
        tree: '0'
      }
      if (!params.name) {
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
