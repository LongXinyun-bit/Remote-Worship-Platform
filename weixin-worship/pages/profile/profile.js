Page({
  data: {
    userInfo: {},
    stats: {
      worshipCount: 0,
      ancestorCount: 0
    }
  },

  onLoad: function (options) {
    // 获取用户信息
    this.getUserInfo();
    
    // 获取用户统计数据
    this.getUserStats();
  },

  onShow: function () {
    // 刷新统计数据
    this.getUserStats();
    
    // 更新底部导航栏选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }
  },

  // 获取用户信息
  getUserInfo: function() {
    const app = getApp();
    
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
  },

  // 获取用户统计数据
  getUserStats: function() {
    const app = getApp();
    
    // 计算祭祖次数
    const worshipCount = app.globalData.worshipRecords ? app.globalData.worshipRecords.length : 0;
    
    // 计算先祖人数
    let ancestorCount = 0;
    if (app.globalData.familyTreeData && app.globalData.familyTreeData.root) {
      // 递归计算家族树中的人数
      const countNodes = (node) => {
        let count = 1; // 当前节点
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => {
            count += countNodes(child);
          });
        }
        return count;
      };
      
      ancestorCount = countNodes(app.globalData.familyTreeData.root);
    }
    
    this.setData({
      stats: {
        worshipCount,
        ancestorCount
      }
    });
  },

  // 导航到我的祭祖记录页面
  navigateToMyWorship: function() {
    wx.navigateTo({
      url: '/pages/worship-history/worship-history'
    });
    
    // 如果worship-history页面不存在，则显示提示
    wx.onAppRoute(function(res) {
      if (res.path.indexOf('pages/worship-history/worship-history') === -1) {
        wx.showToast({
          title: '历史祭祖记录页面正在开发中',
          icon: 'none'
        });
      }
    });
  },

  // 导航到我的先祖页面
  navigateToMyAncestors: function() {
    wx.navigateTo({
      url: '/pages/family-tree/family-tree'
    });
  },

  // 导航到收藏页面
  navigateToFavorites: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到设置页面
  navigateToSettings: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到帮助与反馈页面
  navigateToHelp: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到关于我们页面
  navigateToAbout: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 处理退出登录
  handleLogout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          const app = getApp();
          app.globalData.isLoggedIn = false;
          app.globalData.userInfo = null;
          
          // 跳转到登录页
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  }
}); 