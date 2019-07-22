<template>
  <div class="common-footer">
    <p class="link-wrapper">
      <span v-for="(item, index) in linkList" :key="index" class="link-item">{{item.text}}</span>
    </p>
    <p class="copy-right-wrapper">备案号: 粤ICP备18014657号-1<i class="space"></i>粤公网安备 44011102001247号<i class="space"></i>Copyright © 2017 - 2019赞播集团 版权所有</p>
    <div class="img-wrapper">
      <img src="./pic-wangbei@2x.png" alt="">
      <img src="./pic-jubao@2x.png" alt="">
      <img src="./pic-wenming@2x.png" alt="">
      <img src="./pic-kexin@2x.png" alt="">
      <img src="./pic-wangjian@2x.png" alt="">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'COMMON_FOOTER'
  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        linkList: [
          {
            text: '关于赞播'
          },
          {
            text: '赞播优鲜'
          },
          {
            text: '代理商加盟'
          },
          {
            text: '供应商加盟'
          },
          {
            text: '团长加盟'
          },
          {
            text: '云服务'
          },
          {
            text: '服务条款'
          },
          {
            text: '隐私政策'
          },
          {
            text: '问题反馈'
          },
        ]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .common-footer
    height :130px
    background: #222222;
    font-family: $font-family-regular
    font-size: 12px;
    line-height: 12px;
    text-align :center
    color: #fff
    .img-wrapper
      padding-top :16px
      & > img
        width: 54px
        height: 22px
        margin-right :2px
        &:last-child
          margin-right :0
    .copy-right-wrapper
      padding-top :14px
      opacity: 0.5;
      .space
        display :inline-block
        width :20px
    .link-wrapper
      opacity: 0.5;
      padding-top :24px
      .link-item
        margin : 0 14px
        position :relative
        &:after
          content: ''
          position :absolute
          col-center()
          right : -14px
          height :10px
          width :1px
          background :#fff
        &:last-child:after
          display :none

</style>
