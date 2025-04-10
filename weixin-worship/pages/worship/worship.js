// pages/worship/worship.js
Page({
  data: {
    location: {
      latitude: 39.909187,  // 默认位置（北京）
      longitude: 116.397451
    },
    markers: [],
    searchText: '',
    selectedTombstone: 0,
    tombstoneStyles: [
      {
        name: '传统墓碑',
        image: '../../images/tombstone1.png'
      },
      {
        name: '现代墓碑',
        image: '../../images/tombstone2.png'
      },
      {
        name: '简约风格',
        image: '../../images/tombstone3.png'
      },
      {
        name: '西式墓碑',
        image: '../../images/tombstone4.png'
      }
    ],
    offerings: [
      { id: 1, name: '鲜花', image: '../../images/offering_flower.png', selected: false },
      { id: 2, name: '水果', image: '../../images/offering_fruit.png', selected: false },
      { id: 3, name: '香', image: '../../images/offering_incense.png', selected: false },
      { id: 4, name: '蜡烛', image: '../../images/offering_candle.png', selected: false },
      { id: 5, name: '元宝', image: '../../images/offering_gold.png', selected: false },
      { id: 6, name: '甘蔗', image: '../../images/offering_sugarcane.png', selected: false },
      { id: 7, name: '烧肉', image: '../../images/offering_meat.png', selected: false },
      { id: 8, name: '星巴克', image: '../../images/offering_coffee.png', selected: false }
    ],
    ancestorName: '',
    message: '',
    showFloatingMessages: [],
    mountainSceneVisible: true,
    optionsVisible: true,
    currentPanel: 'location', // 默认显示位置选择面板
    mapHeight: 650 // 默认地图高度
  },

  onLoad: function (options) {
    // 获取用户当前位置
    this.getCurrentLocation();
    
    // 获取系统信息，调整界面尺寸
    this.adjustUIForScreenSize();
  },
  
  // 调整界面以适应不同屏幕尺寸
  adjustUIForScreenSize: function() {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        // 计算合适的地图高度（屏幕高度的60%）
        const mapHeight = Math.floor(res.windowHeight * 0.6);
        that.setData({
          mapHeight: mapHeight
        });
      }
    });
  },
  
  // 切换面板
  switchPanel: function(e) {
    const panel = e.currentTarget.dataset.panel;
    this.setData({
      currentPanel: panel
    });
    
    // 如果切换到位置面板，重新创建地图上下文
    if (panel === 'location') {
      this.mapCtx = wx.createMapContext('worshipMap');
    }
  },

  // 获取用户当前位置
  getCurrentLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res;
        this.setData({
          location: { latitude, longitude },
          markers: [{
            id: 1,
            latitude,
            longitude,
            width: 32,
            height: 32,
            iconPath: '../../images/marker.png',
            callout: {
              content: '墓碑位置',
              color: '#000000',
              fontSize: 12,
              borderRadius: 4,
              padding: 8,
              display: 'ALWAYS',
              bgColor: '#ffffff'
            }
          }]
        });
        
        // 创建地图上下文
        this.mapCtx = wx.createMapContext('worshipMap');
      },
      fail: () => {
        wx.showToast({
          title: '获取位置失败，请授权位置权限',
          icon: 'none'
        });
      }
    });
  },

  // 在地图上点击时更新位置
  onMapTap: function(e) {
    const { latitude, longitude } = e.detail;
    this.setData({
      location: { latitude, longitude },
      markers: [{
        id: 1,
        latitude,
        longitude,
        width: 32,
        height: 32,
        iconPath: '../../images/marker.png',
        callout: {
          content: '墓碑位置',
          color: '#000000',
          fontSize: 12,
          borderRadius: 4,
          padding: 8,
          display: 'ALWAYS',
          bgColor: '#ffffff'
        }
      }]
    });
    
    // 更新搜索文本为坐标信息，表示用户手动选择了一个位置
    this.setData({
      searchText: `已选择位置(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
    });
  },

  // 位置搜索输入
  onLocationInput: function(e) {
    this.setData({
      searchText: e.detail.value
    });
  },

  // 搜索位置 - 改进的函数，使用微信内置的位置选择器并传入关键词
  searchLocation: function() {
    if (!this.data.searchText) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
      return;
    }
    
    // 显示加载中
    wx.showLoading({
      title: '搜索中...',
    });

    // 使用微信位置服务搜索地点
    const that = this;
    
    // 使用chooseLocation API并传入关键词
    wx.chooseLocation({
      keyword: this.data.searchText, // 传入搜索关键词，这样打开时会自动搜索
      success: function(res) {
        console.log('位置选择成功', res);
        
        const { latitude, longitude, name, address } = res;
        
        that.setData({
          location: { latitude, longitude },
          searchText: name,
          markers: [{
            id: 1,
            latitude,
            longitude,
            width: 32,
            height: 32,
            iconPath: '../../images/marker.png',
            callout: {
              content: name,
              color: '#000000',
              fontSize: 12,
              borderRadius: 4,
              padding: 8,
              display: 'ALWAYS',
              bgColor: '#ffffff'
            }
          }]
        });

        // 更新地图位置
        that.mapCtx = wx.createMapContext('worshipMap');
        that.mapCtx.moveToLocation({
          latitude,
          longitude
        });
        
        wx.hideLoading();
        
        wx.showToast({
          title: '已找到位置',
          icon: 'success',
          duration: 1500
        });
      },
      fail: function(err) {
        console.error('位置选择失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '位置选择失败',
          icon: 'none'
        });
      }
    });
  },
  
  // 确认位置后切换到墓碑样式选择面板
  confirmLocation: function() {
    if (!this.data.searchText) {
      wx.showToast({
        title: '请先选择位置',
        icon: 'none'
      });
      return;
    }
    
    // 添加漂浮消息
    this.addFloatingMessage('已选择位置: ' + this.data.searchText);
    
    // 切换到墓碑样式选择
    this.setData({
      currentPanel: 'tombstone'
    });
    
    // 显示确认提示
    wx.showToast({
      title: '位置已确认',
      icon: 'success',
      duration: 1500
    });
  },

  // 选择墓碑样式
  selectTombstone: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedTombstone: index
    });
    
    // 添加漂浮消息
    this.addFloatingMessage('已选择 ' + this.data.tombstoneStyles[index].name);
    
    // 自动切换到祭品选择
    setTimeout(() => {
      this.setData({
        currentPanel: 'offerings'
      });
    }, 1000);
  },

  // 选择或取消选择祭品
  toggleOffering: function(e) {
    const id = e.currentTarget.dataset.id;
    const offerings = this.data.offerings.map(item => {
      if (item.id === id) {
        const newItem = { ...item, selected: !item.selected };
        
        // 添加漂浮消息
        if (newItem.selected) {
          this.addFloatingMessage('添加祭品: ' + item.name);
        } else {
          this.addFloatingMessage('移除祭品: ' + item.name);
        }
        
        return newItem;
      }
      return item;
    });
    
    this.setData({ offerings });
  },
  
  // 添加漂浮消息 - 改进版，根据响应式界面调整位置计算
  addFloatingMessage: function(message) {
    const msgId = Date.now();
    
    // 获取当前设备尺寸信息，适应不同屏幕
    let top = 80 + Math.random() * 200; // 默认随机初始高度
    let left = 400 + Math.random() * 200; // 默认随机初始左位置
    
    // 尝试获取屏幕尺寸来调整随机位置范围
    try {
      const systemInfo = wx.getSystemInfoSync();
      // 调整为屏幕宽度的60%-90%
      left = systemInfo.windowWidth * (0.6 + Math.random() * 0.3);
      // 调整为屏幕高度的10%-40%
      top = systemInfo.windowHeight * (0.1 + Math.random() * 0.3);
    } catch (e) {
      console.error('获取系统信息失败，使用默认位置计算', e);
    }
    
    const newMsg = {
      id: msgId,
      text: message,
      top: top,
      left: left
    };
    
    const messages = [...this.data.showFloatingMessages, newMsg];
    this.setData({
      showFloatingMessages: messages
    });
    
    // 3秒后消失
    setTimeout(() => {
      const updatedMessages = this.data.showFloatingMessages.filter(
        msg => msg.id !== msgId
      );
      this.setData({
        showFloatingMessages: updatedMessages
      });
    }, 3000);
  },

  // 开始祭祖
  startWorship: function() {
    // 验证输入
    if (!this.data.ancestorName) {
      // 切换到信息面板
      this.setData({
        currentPanel: 'info'
      });
      
      wx.showToast({
        title: '请输入先人姓名',
        icon: 'none'
      });
      return;
    }
    
    // 验证位置是否已选择
    if (!this.data.searchText) {
      this.setData({
        currentPanel: 'location'
      });
      
      wx.showToast({
        title: '请先选择祭祀位置',
        icon: 'none'
      });
      return;
    }

    // 获取已选祭品
    const selectedOfferings = this.data.offerings.filter(item => item.selected);
    if (selectedOfferings.length === 0) {
      this.setData({
        currentPanel: 'offerings'
      });
      
      wx.showToast({
        title: '请至少选择一件祭品',
        icon: 'none'
      });
      return;
    }

    // 准备祭祖数据
    const worshipData = {
      ancestorName: this.data.ancestorName,
      location: this.data.location,
      locationName: this.data.searchText,
      tombstoneStyle: this.data.tombstoneStyles[this.data.selectedTombstone],
      offerings: selectedOfferings.map(item => item.name).join(', '),
      message: this.data.message,
      date: new Date().toLocaleDateString()
    };
    
    // 添加祖先姓名漂浮消息
    this.addFloatingMessage('祭祖先人: ' + worshipData.ancestorName);
    
    // 如果有寄语，添加寄语漂浮消息
    if (worshipData.message) {
      this.addFloatingMessage('寄语: ' + worshipData.message);
    }

    // 显示祭祖加载
    wx.showLoading({
      title: '祭祖准备中...',
    });

    // 模拟祭祖进行
    setTimeout(() => {
      wx.hideLoading();
      
      // 为每件祭品添加漂浮消息
      selectedOfferings.forEach((item, index) => {
        setTimeout(() => {
          this.addFloatingMessage('献上' + item.name + '给' + worshipData.ancestorName);
        }, 500 + index * 800); // 按顺序依次显示
      });
      
      // 创建祭祖记录
      const newRecord = {
        date: worshipData.date,
        location: worshipData.locationName,
        ancestorName: worshipData.ancestorName,
        offerings: worshipData.offerings,
        message: worshipData.message,
        tombstoneType: worshipData.tombstoneStyle.name
      };
      
      // 获取全局应用实例
      const app = getApp();
      
      // 使用app.js中的方法保存记录，确保数据持久化
      app.addWorshipRecord(newRecord);
      
      // 4秒后显示祭祖成功
      setTimeout(() => {
        // 显示祭祖成功对话框
        wx.showModal({
          title: '线上寄思成功',
          content: `您已为${worshipData.ancestorName}献上纪念`,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              // 可以选择是返回上一页，还是重置当前页面
              wx.navigateBack();
              
              // 或者重置当前页面
              // this.resetWorshipPage();
            }
          }
        });
      }, 4000);
    }, 2000);
  },
  
  // 重置祭祖页面数据（可选功能）
  resetWorshipPage: function() {
    this.setData({
      searchText: '',
      selectedTombstone: 0,
      offerings: this.data.offerings.map(item => ({...item, selected: false})),
      ancestorName: '',
      message: '',
      showFloatingMessages: [],
      currentPanel: 'location'
    });
    
    // 重新获取当前位置
    this.getCurrentLocation();
  },
  
  // 页面显示时执行
  onShow: function() {
    // 如果地图实例已创建，重新设置地图
    if (this.data.currentPanel === 'location') {
      setTimeout(() => {
        this.mapCtx = wx.createMapContext('worshipMap');
      }, 300);
    }
  },
  
  // 页面大小变化时重新调整UI
  onResize: function(res) {
    // 使用微信API获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        // 根据获取到的屏幕尺寸计算合适的地图高度
        const mapHeight = Math.floor(res.windowHeight * 0.6);
        this.setData({
          mapHeight: mapHeight
        });
      }
    });
  }
});