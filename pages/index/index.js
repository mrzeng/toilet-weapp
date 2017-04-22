// 引入SDK核心类
var QQMapWX = require('../../resources/map/qqmap-wx-jssdk.js');
var qqmapsdk;
//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    latitude: 0,
    longitude: 0,
    scrollTop: 0,
    size: 0,
    onLine: true,
    noAuth: false,
    yesAuth: true
  },
  // 页面加载
  onLoad: function () {
    wx.showLoading({ title: "获取数据中,别急!" });
  },
  // 页面显示
  onShow() {
    this.getData();
  },
  //获取数据
  getData: function () {
    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '2EQBZ-3XM36-RUTSG-MIO6B-GXH4E-B3FC5'
    });
    //查询附件的资源信息
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //设置经纬度值
        that.setData({
          latitude: latitude,
          longitude: longitude
        });
        //源码里面查询的是附近一公里的哦
        qqmapsdk.search({
          keyword: '厕所',
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            //有可能是参数有问题或者是网络
            that.setData({
              onLine: true
            });
            //根据返回的结果marker在地图上面
            var data = res.data;
            that.setList(data);
            //关闭loading
            wx.hideLoading();
          },
          fail: function () {
            //关闭loading
            wx.hideLoading();
            //有可能是参数有问题或者是网络
            that.setData({
              onLine: false,
              noAuth: false,
              yesAuth: true
            });
          }
        });
      },
      fail: function (json) {
        //关闭loading
        wx.hideLoading();
        //没有权限
        that.setData({
          noAuth: true,
          yesAuth: false
        });
      }
    });
  },
  //组装数据信息
  setList: function (data) {
    var that = this;
    var result = [];
    //循环遍历数据， 其实不做这一步也行
    data.forEach(function (item, index) {
      //替换一些不必要的大信息
      var reg = new RegExp(item.ad_info.province + item.ad_info.city + item.ad_info.district);
      var briefAddr = item.address.replace(reg, "");
      //组装数据
      result.push({
        distance: item["_distance"],
        briefAddr: briefAddr,
        address: item.address,
        category: item.category,
        id: item.id,
        latitude: item.location.lat,
        longitude: item.location.lng,
        name: item.title
      });
    });
    //设置data
    that.setData({
      list: result,
      size: result.length,
      noAuth: false,
      yesAuth: true
    });
  },
  //点击列表显示本地导航信息
  tapItem: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    var toilet = that.findMarkerById(id);
    //使用微信内置地图查看位置
    wx.openLocation({
      latitude: toilet.latitude,
      longitude: toilet.longitude,
      name: toilet.name,
      address: toilet.address,
      scale: 14
    });
  },
  //根据marker唯一id查询信息
  findMarkerById: function (id) {
    var that = this,
      result = {};
    var list = that.data.list;
    //查询数据信息
    for (var i = 0; i < list.length; i++) {
      if (id === list[i].id) {
        result = list[i];
        break;
      }
    }
    return result;
  },
  // 数据更新
  doRefresh: function () {
    wx.showLoading({ title: "数据更新中,别急!" });
    this.getData();
  },
  doAuth: function () {
    var that = this;
    wx.openSetting({
      success: (res) => {
        that.doRefresh();
      }
    })
  },
  // 设置界面跳转 跳转到关于界面
  navToLocation: function () {
    var that = this;
    //跳转传输的值
    var param = {
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      list: that.data.list
    }
    wx.navigateTo({
      url: '../location/location?param=' + JSON.stringify(param)
    })
  },
  //关于按钮
  doAbout: function () {

  }
})
