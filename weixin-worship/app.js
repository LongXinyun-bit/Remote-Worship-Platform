// app.js
App({
  onLaunch: function () {
    // 尝试从本地缓存恢复数据
    this.restoreUserData();
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功', res);
        
        // 模拟从服务器获取用户信息和记录
        this.getUserDataFromServer(res.code);
      }
    });
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },
  
  // 从服务器获取用户数据
  getUserDataFromServer: function(code) {
    // 实际项目中应该发送请求到你的服务器
    // 这里模拟从服务器获取数据
    
    // 设置登录状态
    this.globalData.isLoggedIn = true;
    
    // 模拟服务器返回的用户历史记录
    // 实际应用中应该使用wx.request请求后端API
    setTimeout(() => {
      // 模拟网络请求延迟
      // 检查本地是否已有缓存数据
      if (this.globalData.worshipRecords.length === 0) {
        // 假设这是从服务器返回的数据
        const serverRecords = wx.getStorageSync('userWorshipRecords') || [];
        
        // 更新全局数据
        this.globalData.worshipRecords = serverRecords;
        
        // 通知页面刷新数据（如果已经加载）
        if (this.worshipRecordsReadyCallback) {
          this.worshipRecordsReadyCallback(serverRecords);
        }
      }
    }, 500);
  },
  
  // 从本地缓存恢复数据
  restoreUserData: function() {
    try {
      // 恢复用户登录状态
      const isLoggedIn = wx.getStorageSync('isLoggedIn') || false;
      
      // 恢复用户信息
      const userInfo = wx.getStorageSync('userInfo');
      
      // 恢复祭祖记录
      const worshipRecords = wx.getStorageSync('userWorshipRecords') || [];
      
      // 更新全局数据
      this.globalData.isLoggedIn = isLoggedIn;
      if (userInfo) this.globalData.userInfo = userInfo;
      this.globalData.worshipRecords = worshipRecords;
      
    } catch (e) {
      console.error('恢复用户数据失败:', e);
    }
  },
  
  // 保存用户数据到本地缓存
  saveUserData: function() {
    try {
      // 保存登录状态
      wx.setStorageSync('isLoggedIn', this.globalData.isLoggedIn);
      
      // 保存用户信息
      if (this.globalData.userInfo) {
        wx.setStorageSync('userInfo', this.globalData.userInfo);
      }
      
      // 保存祭祖记录
      wx.setStorageSync('userWorshipRecords', this.globalData.worshipRecords);
      
    } catch (e) {
      console.error('保存用户数据失败:', e);
    }
  },
  
  // 添加新的祭祖记录
  addWorshipRecord: function(record) {
    // 添加唯一ID和时间戳
    record.id = Date.now();
    record.timestamp = new Date().toISOString();
    
    // 添加到全局数据
    this.globalData.worshipRecords.unshift(record);
    
    // 保存到本地缓存
    this.saveUserData();
    
    // 实际项目中应该同时发送到服务器
    // this.syncToServer(record);
  },
  
  // 同步数据到服务器（示例）
  syncToServer: function(record) {
    // 实际项目中应该使用wx.request发送数据到你的服务器
    wx.request({
      url: 'https://你的服务器地址/api/worship/add',
      method: 'POST',
      data: {
        record: record,
        userId: this.globalData.userId // 用户唯一标识
      },
      success: (res) => {
        console.log('祭祖记录已同步到服务器', res);
      },
      fail: (err) => {
        console.error('同步祭祖记录失败', err);
      }
    });
  },
  
  globalData: {
    userInfo: null,
    userId: null, // 用户唯一标识，从服务器获取
    // 是否已登录
    isLoggedIn: false,
    // 用户祭祀记录
    worshipRecords: [],
    // 家族树数据
    familyTreeData: null
  }
}); 