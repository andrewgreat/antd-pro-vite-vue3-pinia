<template>

  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    :footer="null"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          :outputSize="options.size"
          :outputType="options.outputType"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">

        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img" alt="" v-if="previews.url || options.img" />
        </div>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
          <a-button>
            <template #icon>
              <cloud-upload-outlined />
            </template>
            选择图片
          </a-button>
        </a-upload>
      </a-col>
      <a-col :lg="{span: 1, offset: 2}" :md="2">
        <a-button @click="changeScale(1)">
          <template #icon>
            <plus-outlined />
          </template>
        </a-button>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button  @click="changeScale(-1)">
          <template #icon>
            <minus-outlined />
          </template>
        </a-button>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button @click="rotateLeft">
          <template #icon>
            <undo-outlined />
          </template>
        </a-button>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button @click="rotateRight">
          <template #icon>
            <redo-outlined />
          </template>

        </a-button>
      </a-col>
      <a-col :lg="{span: 2, offset: 6}" :md="2">
        <a-button type="primary" @click="finish('blob')">保存</a-button>
      </a-col>
    </a-row>
  </a-modal>

</template>
<script lang="ts">
import {defineComponent, reactive, ref} from 'vue'
import {message} from 'ant-design-vue'
import 'vue-cropper/dist/index.css'
import { VueCropper }  from "vue-cropper";
import {requestPost} from '@/api/service';

interface optionType {
  img: string|ArrayBuffer|null,
  url?: string,
  autoCrop?: boolean,
  size?: number,
  autoCropWidth?: number,
  autoCropHeight?: number,
  outputType?: string,
  fixedBox?: boolean
}

interface prevType {
  div: {
    width:string,
    height: string
  },
  img: {
    width: string,
    height: string,
    transform: string
  },
  url: string
  h?: number,
  w?: number,
  html?: string
}



export default defineComponent({
  name: 'AvatarModal',
  components:{
    VueCropper
  },
  setup (props,{emit}) {
    const cropper = ref(<any|null>null)
    const visible = ref(false)
    const id:any = ref(null)
    const confirmLoading = ref(false)
    const fileList = ref([])
    const uploading = ref(false)
    const options  =  reactive(<optionType>{
      img: '',
      url: '',
      autoCrop: true,
      size: 1,
      autoCropWidth: 200,
      autoCropHeight: 200,
      outputType: 'jpeg',
      fixedBox: true
    })
    let previews = ref(<prevType>{})

    const edit = (val) => {
      visible.value = true
      id.value = val
      /* 获取原始头像 */
    }
    const close = () => {
      id.value = null
      visible.value = false
    }
    const cancelHandel = () => {
      close()
    }
   const changeScale =(num) => {
      num = num || 1
     cropper.value.changeScale(num)
    }
    const rotateLeft = () => {
      cropper.value.rotateLeft()
    }
    const rotateRight = () =>  {
      cropper.value.rotateRight()
    }
    const beforeUpload = (file) => {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        options.img = reader.result
        // console.log(reader.result)
      }
      // 转化为blob
      // reader.readAsArrayBuffer(file)
      return false
    }

    // 上传图片（点击上传按钮）
    const finish = (type) => {
      console.log('finish')
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        cropper.value.getCropBlob((data) => {
          const img = window.URL.createObjectURL(data)
          cropper.value.model = true
          cropper.value.modelSrc = img
          formData.append('file', data, cropper.value.fileName)
          requestPost('/api/cropperpost', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
              console.log('upload response:', response)
              // let res = response.data
              // if (response.status === 'done') {
              //   imgFile = ''
              //   headImg = res.realPathList[0] // 完整路径
              //   uploadImgRelaPath = res.relaPathList[0] // 非完整路径
              //   message.success('上传成功')
              //   visible.value = false
              // }
              message.success('上传成功')
              // @ts-ignore
              emit('ok', response.data.url)
              visible.value = false
            })
        })
      } else {
        cropper.value.getCropData((data) => {
          cropper.value.model = true
          cropper.value.modelSrc = data
        })
      }
    }
    const okHandel = () => {
      confirmLoading.value = true
      setTimeout(() => {
        confirmLoading.value = false
        close()
        message.success('上传头像成功')
      }, 2000)
    }

    const realTime = (data) => {
      previews.value = data
    }

    return {
      cropper,
      visible,
      id,
      confirmLoading,
      fileList,
      uploading,
      options,
      previews,
      edit,
      close,
      cancelHandel,
      changeScale,
      rotateLeft,
      rotateRight,
      beforeUpload,
      finish,
      okHandel,
      realTime
    }
  },
  methods: {

  }
})
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
