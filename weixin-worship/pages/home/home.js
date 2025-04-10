// pages/home/home.js
Page({
  data: {
    userInfo: {},
    recentActivities: [],
    timerInterval: null
  },

  onLoad: function (options) {
    // 获取全局数据
    const app = getApp();
    
    // 检查是否已登录
    if (!app.globalData.isLoggedIn) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }

    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    } else {
      // 如果尚未获取用户信息，设置回调函数
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        });
      };
    }

    // 获取用户的祭祖记录
    this.getRecentActivities();
    
    // 注册数据更新回调
    app.worshipRecordsReadyCallback = (records) => {
      this.setData({
        recentActivities: records
      });
    };
  },

  onShow: function () {
    // 每次页面显示时刷新数据
    this.getRecentActivities();
    
    // 更新底部导航栏选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
  },

  // 获取最近祭祖活动记录
  getRecentActivities: function () {
    const app = getApp();
    
    // 使用全局数据中的祭祖记录
    if (app.globalData.worshipRecords && app.globalData.worshipRecords.length > 0) {
      this.setData({
        recentActivities: app.globalData.worshipRecords
      });
    } else {
      // 如果没有记录，显示空状态
      this.setData({
        recentActivities: []
      });
      
      // 提示用户还没有祭祖记录
      wx.showToast({
        title: '暂无祭祖记录',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 导航到祭祖活动页面
  navigateToWorship: function () {
    wx.navigateTo({
      url: '/pages/worship/worship'
    });
  },

  // 导航到家族树页面
  navigateToFamilyTree: function () {
    wx.navigateTo({
      url: '/pages/family-tree/family-tree'
    });
  },

  // 导航到实用工具页面
  navigateToTools: function () {
    wx.navigateTo({
      url: '/pages/tools/tools'
    });
  },

  updateCurrentTime: function () {
    // Implementation of updateCurrentTime function
  },

  startTimer: function () {
    this.setData({
      timerInterval: setInterval(() => {
        this.updateCurrentTime();
      }, 3000)
    });
  },

  stopTimer: function () {
    clearInterval(this.data.timerInterval);
    this.setData({
      timerInterval: null
    });
  }
}); 