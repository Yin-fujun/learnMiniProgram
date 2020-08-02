//index.js
const app = getApp()

//注册一个页面
Page({
  //--------------------2.初始化数据--------------------
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    list: []
  },

  //---------------1.监听页面生命周期函数----------
 //页面被加载出来
  onLoad: function() {
    console.log('onload');
    wx.request({
      url: 'http://123.207.32.32:8000/recommend',
      success: res => {
        console.log('数据请求返回===', res);
      }
    })
  },
  //页面显示出来
  onShow: function(options) {
    console.log(options)
  },
  //页面初次渲染完成
  onReady() {

  },
  onHide() {

  },

  onUnload() {

  },

  //-----------3.监听wxml中相关的一些事件-------------



  //-----------4，监听其他事件---------
  //监听页面滚动
  onPageScroll(obj) {
    console.log(obj);
  },
  //监听页面滚动到底部
  onReachBottom() {
    console.log('页面滚动到底部');
  },
  //监听页面下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新');
  },

  onGetUserInfo: function(e) {
    console.log(e);
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  //点击获取用户信息
  bindGetUserInfo: function(event) {
    console.log(event);
  },
  globalData: {
    userInfo: {}
  }

})
