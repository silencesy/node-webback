<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="24" :lg="{ span: 18, offset: 4 }">
        <el-form ref="form" label-width="100px">
          <el-form-item label="商品分类">
            <el-select v-model="categories" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品名字">
            <el-input v-model="name" />
          </el-form-item>
          <el-form-item label="轮播图">
            <dropzone
              id="myVueDropzone"
              :url="VUE_APP_IMG_LOAD_API"
              @dropzone-removedFile="dropzoneR"
              @dropzone-success="dropzoneS"
            />
          </el-form-item>
          <el-form-item label="规格">
            <el-row :gutter="10">
              <el-col
                :xs="{span: 16}"
                :sm="{span: 12}"
              >
                <el-input v-model="specification" placeholder="请输入内容" />
              </el-col>
              <el-col
                :xs="{span: 4}"
                :sm="{span: 4}"
              >
                <el-button type="primary" @click="addSpecificationAxios">添加</el-button>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="checkList" @change="bindChangeSpec">
              <el-checkbox v-for="(item,index) in specificationData" :key="index" :label="item.name" />
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="sku表">
            <el-table
              :data="finallySkuData"

              style="width: 100%"
            >
              <el-table-column
                v-if="finallySkuData.length>0"
                label="图片"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.stock" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in checkList"
                :key="index"
                align="center"
                width="150"
                :label="item"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.difference[index]" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column
                v-if="finallySkuData.length>0"
                label="库存"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.stock" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column
                v-if="finallySkuData.length>0"
                label="售卖价"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column
                v-if="finallySkuData.length>0"
                label="原价"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.original_price" placeholder="请输入内容" />
                </template>
              </el-table-column>
              <el-table-column
                v-if="finallySkuData.length>0"
                label="成本价"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.cost_price" placeholder="请输入内容" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addTableRow">添加</el-button>
          </el-form-item>
          <el-form-item>
            <editor-bar v-model="details" :is-clear="isClear" @change="change" />
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
import { addItemType, getSeriesItemTypes, getAttributesAndSpecification, addItem } from '@/api/add-item-type'
import { getAttrSpec, addAttributes, addSpecification } from '@/api/specification'
import EditorBar from '@/components/wangEnduit'
import Dropzone from '@/components/Dropzone'
export default {
  components: { EditorBar, Dropzone },
  data() {
    return {
      name: '', // 名字
      options: [], // 商品分类列表
      categories: '', // 商品分类
      isClear: false, // 是否清空编辑器
      details: '', // 编辑器内容
      checkList: [], // 选中规格
      specificationData: [], // 规格列表
      specification: '', // 添加规格绑定值
      finallySkuData: [], // 最终提交sku值
      emptySkuData: {},
      carousel: [], // 轮播图
      VUE_APP_IMG_LOAD_API: process.env.VUE_APP_IMG_LOAD_API // 根据环境上传图片地址
    }
  },
  watch: {
    checkList: function(newVal, oldVal) {
      // 选中之前如果有SkuData 则在原来的数据上处理
      if (this.finallySkuData.length > 0) {
        if (newVal.length != 0) {
          var indexFlag = null
          for (let index = 0; index < oldVal.length + 1; index++) {
            if (newVal[index] != oldVal[index]) {
              indexFlag = index
              console.log(index)
              break
            }
          }
          const arr = []
          this.finallySkuData.forEach(item => {
            // 删除对应没有选中的规格
            if (indexFlag != null && newVal.length < oldVal.length) {
              item.difference.splice(indexFlag, 1)
            }
            arr.push(item)
          })
          this.finallySkuData = arr
        } else {
          this.finallySkuData = []
        }
        // 建议一个新的sku信息
      } else {
        const arr = []
        const obj = {}
        obj.stock = ''
        obj.price = ''
        obj.original_price = ''
        obj.cost_price = ''
        obj.pic = ''
        obj.difference = []
        arr.push(obj)
        this.finallySkuData = arr
        this.emptySkuData = JSON.parse(JSON.stringify(obj))
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    bindChangeSpec(val) {
      // console.log(val);
    },
    async loadData() {
      await this.getSeriesItemTypesAxios()
      await this.getAttrSpecAxios()
    },
    async getSeriesItemTypesAxios() {
      const params = {
        series: 3
      }
      // 获取商品分类
      await getSeriesItemTypes(params).then(({ data }) => {
        this.options = data
      })
    },
    // 获取规格属性
    async getAttrSpecAxios() {
      await getAttrSpec().then(({ data }) => {
        this.specificationData = data.specificationData
      })
    },
    dropzoneS(file) {
      this.carousel.push({ pic: process.env.VUE_APP_IMG_BASE_API + JSON.parse(file.xhr.response).data.files[0].path })
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      // console.log(JSON.parse(file.xhr.response).data.files[0].path)
      this.carousel.forEach((item, index) => {
        if (item.pic == process.env.VUE_APP_IMG_BASE_API + JSON.parse(file.xhr.response).data.files[0].path) {
          this.carousel.splice(index, 1)
        }
      })
      this.$message({ message: 'Delete success', type: 'success' })
    },
    addTableRow() {
      if (this.checkList.length == 0) {
        this.$message.error('请选择规格！')
      } else {
        this.finallySkuData.push(JSON.parse(JSON.stringify(this.emptySkuData)))
      }
    },
    // 添加规格
    async addSpecificationAxios() {
      if (this.specification) {
        const params = {
          name: this.specification
        }
        await addSpecification(params).then(({ data }) => {
          this.getAttrSpecAxios()
          this.specification = ''
        })
      } else {
        this.$message.error('请请输入规格名字！')
      }
    },
    changeCell(value, data, index, scope) {
      console.log(value)
      console.log(data)
      console.log(index)
      console.log(scope)
      // this.planTemplateColums.forEach(item => {
      // if (item.parentKey === prop) {
      //     // 找到parentKey是prop的列 获取列的数组 将row中的这些列改值
      //     this.$set(row, item.prop, value)
      //     }
      // })
    },
    skuVerification() {
      let skuAllowFlag = true
      this.finallySkuData.forEach(item => {
        if (!item.cost_price || !item.original_price || !item.price || !item.cost_price || !item.stock) {
          skuAllowFlag = false
        }
        if (item.difference.length != this.checkList.length) {
          skuAllowFlag = false
        }
      })
      return skuAllowFlag
    },
    // 去重J数组
    uniq(array) {
      var temp = [] // 一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i])
        }
      }
      return temp
    },
    // 提交表单
    submitForm() {
      if (!this.categories) {
        this.$message.error('请选择分类！')
      } else if (!this.name) {
        this.$message.error('请填写商品名字！')
      } else if (this.carousel.length == 0) {
        this.$message.error('请上传轮播图！')
      } else if (this.finallySkuData == 0) {
        this.$message.error('请选择sku规格！')
      } else if (!this.skuVerification()) {
        this.$message.error('请填写sku详情每一项！')
      } else if (!this.details) {
        this.$message.error('请编写详情！')
      } else {
        console.log('提交')

        const specifications = []
        this.checkList.forEach((item, index) => {
          const specificationsItem = {}
          specificationsItem.name = item
          specificationsItem.item = []
          this.finallySkuData.forEach(item2 => {
            const obj = {}
            obj.name = item2.difference[index]
            specificationsItem.item.push(obj)
          })
          specifications.push(specificationsItem)
        })
        specifications.forEach(element => {
          element.item = this.uniq(element.item)
        })

        const { categories, carousel, name, details, finallySkuData } = this
        const params = {
          categories,
          carousel,
          name,
          details,
          sku: finallySkuData,
          specifications
        }
        addItem(params).then(({ code }) => {
          if (code == 1) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
          }
        })
      }
    }, change(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
    .container {
        padding: 50px 30px;
    }
</style>
