Page({
  data: {
    records: []
  },

  onLoad: function (options) {
    this.loadWorshipRecords();
  },

  onShow: function () {
    // 每次页面显示时刷新数据
    this.loadWorshipRecords();
  },

  // 加载祭祖记录
  loadWorshipRecords: function () {
    const app = getApp();
    
    // 获取祭祖记录
    const worshipRecords = app.globalData.worshipRecords || [];
    
    // 处理日期格式
    const formattedRecords = worshipRecords.map(record => {
      // 解析日期
      const timestamp = record.timestamp ? new Date(record.timestamp) : new Date();
      const dateInfo = {
        year: timestamp.getFullYear(),
        month: timestamp.getMonth() + 1,
        day: timestamp.getDate(),
        time: `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`
      };
      
      return {
        ...record,
        dateInfo
      };
    });
    
    this.setData({
      records: formattedRecords
    });
  },

  // 导航到祭祖页面
  navigateToWorship: function () {
    wx.navigateTo({
      url: '/pages/worship/worship'
    });
  }
}); 