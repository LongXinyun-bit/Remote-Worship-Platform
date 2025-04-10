// pages/login/login.js
Page({
  data: {
    username: '',
    password: '',
    isLoading: false
  },

  onLoad: function (options) {
    // 页面加载时检查是否已经登录
    const app = getApp();
    if (app.globalData.isLoggedIn) {
      this.redirectToHome();
    }
  },

  // 输入框变化事件
  usernameInput: function(e) {
    this.setData({
      username: e.detail.value
    });
  },
  
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 处理登录
  handleLogin: function () {
    const { username, password } = this.data;
    
    if (!username || !password) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });

    // 模拟登录请求，实际开发中应替换为真实的API请求
    setTimeout(() => {
      // 登录成功
      const app = getApp();
      // 设置登录状态
      app.globalData.isLoggedIn = true;
      
      // 设置模拟的用户信息
      app.globalData.userInfo = {
        nickName: username,
        avatarUrl: '../../images/default-avatar.png'
      };
      
      // 保存用户数据到本地
      app.saveUserData();
      
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          this.redirectToHome();
        }
      });
      
      this.setData({ isLoading: false });
    }, 1500);
  },

  // 处理注册
  handleRegister: function () {
    wx.showToast({
      title: '注册功能开发中',
      icon: 'none'
    });
  },

  // 获取微信用户信息
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      const app = getApp();
      app.globalData.userInfo = e.detail.userInfo;
      app.globalData.isLoggedIn = true;
      
      // 保存用户数据到本地
      app.saveUserData();
      
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          this.redirectToHome();
        }
      });
    } else {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
    }
  },

  // 跳转到首页
  redirectToHome: function () {
    wx.switchTab({
      url: '/pages/home/home'
    });
  }
}); 