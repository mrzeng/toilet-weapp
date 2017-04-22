//获取应用实例
var app = getApp()
Page({
    onLoad: function (option) {
        var that = this;
        var param = JSON.parse(option.param);
        var list = param.list,
            latitude = param.latitude,
            longitude = param.longitude;
        var result = [];
        //数据组装
        list.forEach(function (item) {
            result.push({
                iconPath: "../../images/marker.png",
                id: item.id,
                latitude: item.latitude,
                longitude: item.longitude,
                width: 50,
                height: 50
            })
        });
        //赋值
        that.setData({
            markers: list,
            latitude: latitude,
            longitude: longitude
        });
    },
    data: {
        markers: [],
        longitude: 0,
        latitude: 0
    },
    //点击marker事件
    markertap: function () {

    }
})
