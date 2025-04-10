Page({
  data: {
    today: '',
    currentTime: '',
    lunarDate: '',
    festival: '',
    goodItems: [],
    badItems: [],
    dailyTip: '',
    knowledgeItems: [],
    topImage: '../../images/offering_incense.png', // 顶部图片
    timerInterval: null
  },

  onLoad: function (options) {
    console.log('工具页面加载开始');
    
    // 立即设置一次数据，确保页面有内容显示
    this.setInitialData();
    // 设置定时器更新时间
    this.setData({
      timerInterval: setInterval(() => {
        this.updateCurrentTime();
      }, 1000)
    });
    
    // 添加图片路径检查
    console.log('当前图片路径:', this.data.topImage);
    
    // 加载祭祖知识
    this.loadWeixinArticles();
    console.log('工具页面数据加载完成');
  },

  onShow: function() {
    // 页面显示时刷新数据
    console.log('工具页面显示');
    this.setToday();
  },

  onUnload: function() {
    // 清除定时器
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval);
    }
  },

  // 更新当前时间
  updateCurrentTime: function() {
    // 获取北京时间（东八区）
    const now = new Date();
    // 转换为东八区时间
    const beijingTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 8 * 3600000);
    
    const hours = beijingTime.getHours().toString().padStart(2, '0');
    const minutes = beijingTime.getMinutes().toString().padStart(2, '0');
    const seconds = beijingTime.getSeconds().toString().padStart(2, '0');
    
    this.setData({
      currentTime: `${hours}:${minutes}:${seconds}`
    });
  },

  // 设置今天的日期和农历信息
  setToday: function() {
    try {
      // 获取北京时间（东八区）
      const now = new Date();
      const beijingTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 8 * 3600000);
      
      const year = beijingTime.getFullYear();
      const month = beijingTime.getMonth() + 1;
      const day = beijingTime.getDate();
      
      // 格式化日期
      const today = `${year}年${month}月${day}日`;
      
      // 这里应该使用农历转换库，目前使用模拟数据
      // 实际开发中应该使用如 lunar-javascript 等库进行农历转换
      const lunarDate = this.getLunarDate(year, month, day);
      
      // 判断今日是否有节日
      let festival = this.getFestival(month, day, lunarDate);
      
      // 获取宜忌数据
      const { goodItems, badItems } = this.getGoodBadItems(month, day);
      
      // 每日小知识
      const dailyTip = this.getDailyTip(month, day);
      
      this.setData({
        today,
        lunarDate,
        festival,
        goodItems,
        badItems,
        dailyTip
      });
    } catch (error) {
      console.error('设置日期信息出错:', error);
      // 设置默认值以确保页面显示
      this.setData({
        today: new Date().toLocaleDateString('zh-CN'),
        lunarDate: '农历日期',
        festival: '',
        goodItems: ['祭祀', '祈福', '纳采'],
        badItems: ['动土', '安床'],
        dailyTip: '祭祖是中华民族的传统美德，承载着"慎终追远"的文化内涵。'
      });
    }
  },

  // 获取农历日期（示例）
  getLunarDate: function(year, month, day) {
    try {
      // 实际项目中应使用农历转换库
      // 这里使用简单的模拟数据
      const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
      const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', 
                          '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                          '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
      
      // 使用固定对应关系，确保显示
      // 这是一个简化的算法，实际应使用正确的农历计算
      const lunarMonthIndex = (month - 1) % 12;
      const lunarDayIndex = (day - 1) % 30;
      
      console.log('农历日期:', lunarMonths[lunarMonthIndex] + lunarDays[lunarDayIndex]);
      return `${lunarMonths[lunarMonthIndex]}${lunarDays[lunarDayIndex]}`;
    } catch (error) {
      console.error('获取农历日期出错:', error);
      return '正月初一'; // 返回默认值
    }
  },

  // 获取节日（示例）
  getFestival: function(month, day, lunarDate) {
    // 公历节日
    if (month === 4 && day === 5) return '清明节';
    if (month === 12 && day === 21) return '冬至';
    
    // 农历节日（简化判断）
    if (lunarDate.includes('正月初一')) return '春节';
    if (lunarDate.includes('五月初五')) return '端午节';
    if (lunarDate.includes('八月十五')) return '中秋节';
    if (lunarDate.includes('腊月三十')) return '除夕';
    
    return '';
  },

  // 获取宜忌项目（更新为使用固定的黄历数据）
  getGoodBadItems: function(month, day) {
    try {
      // 使用固定的黄历数据（简化版）
      const huangliData = {
        "1": { // 1月
          "1": { good: ['祭祀', '祈福', '斋醮', '塑绘'], bad: ['嫁娶', '动土', '掘井', '安葬'] },
          "2": { good: ['祈福', '求嗣', '出行', '解除'], bad: ['开市', '安床', '作灶', '造船'] },
          "3": { good: ['纳采', '祭祀', '修造', '盖屋'], bad: ['开仓', '出货', '启钻', '安门'] },
          "4": { good: ['祭祀', '祈福', '求嗣', '斋醮'], bad: ['出行', '安葬', '修造', '上梁'] },
          "5": { good: ['交易', '立券', '会亲友', '纳财'], bad: ['种植', '动土', '迁移', '造船'] },
          // 其他日期...
          "31": { good: ['开市', '交易', '立券', '纳财'], bad: ['宴会', '安床', '造船', '渡水'] }
        },
        "2": {
          "1": { good: ['修造', '盖屋', '移徙', '作灶'], bad: ['开光', '安葬', '伐木', '词讼'] },
          "2": { good: ['嫁娶', '开市', '交易', '入宅'], bad: ['安床', '作灶', '掘井', '伐木'] },
          // 其他日期...
          "28": { good: ['祭祀', '祈福', '斋醮', '纳采'], bad: ['开市', '安床', '入宅', '破土'] },
          "29": { good: ['纳采', '订盟', '祭祀', '动土'], bad: ['开市', '安葬', '作灶', '行丧'] }
        },
        "3": {
          "1": { good: ['祭祀', '斋醮', '纳财', '捕捉'], bad: ['嫁娶', '安葬', '入宅', '开市'] },
          // 其他日期...
        },
        // 其他月份...
        "12": {
          "1": { good: ['祭祀', '塑绘', '开光', '齐醮'], bad: ['嫁娶', '出行', '移徙', '开市'] },
          // 其他日期...
          "31": { good: ['祭祀', '沐浴', '塑绘', '订盟'], bad: ['开市', '入宅', '安床', '破土'] }
        }
      };
      
      // 为每个月的每一天都添加默认数据
      for (let m = 1; m <= 12; m++) {
        if (!huangliData[m]) {
          huangliData[m] = {};
        }
        
        for (let d = 1; d <= 31; d++) {
          if (!huangliData[m][d]) {
            huangliData[m][d] = {
              good: ['祭祀', '祈福', '纳采', '开光'],
              bad: ['动土', '安床', '作灶', '破土']
            };
          }
        }
      }
      
      // 获取今天的宜忌
      let data = huangliData[month][day];
      if (!data) {
        console.log('找不到当天黄历数据，使用默认数据');
        data = {
          good: ['祭祀', '祈福', '纳采', '开光'],
          bad: ['动土', '安床', '作灶', '破土']
        };
      }
      
      console.log('今日宜忌:', data);
      return {
        goodItems: data.good,
        badItems: data.bad
      };
    } catch (error) {
      console.error('获取宜忌数据出错:', error);
      return {
        goodItems: ['祭祀', '祈福', '纳采'], 
        badItems: ['动土', '安床', '作灶']
      };
    }
  },

  // 获取每日小知识（示例）
  getDailyTip: function(month, day) {
    const tips = [
      '清明节是中国传统节日，也是最重要的祭祀节日之一，是祭祖和扫墓的日子。',
      '在中国传统文化中，祭祀活动通常选在清晨或傍晚进行，象征着新的开始和圆满的结束。',
      '传统祭祀的祭品有六种，俗称"六礼"：饭、酒、茶、汤、果、蔬。',
      '祭祀时应保持肃穆的态度，表达对先人的尊敬与缅怀之情。',
      '祭祖是中华民族的传统美德，承载着"慎终追远"的文化内涵。'
    ];
    
    // 使用日期作为索引，确保同一天显示相同的小知识
    const index = (month * 31 + day) % tips.length;
    return tips[index];
  },

  // 加载微信公众号文章
  loadWeixinArticles: function() {
    try {
      console.log('加载文章列表开始');
      
      // 固定的3篇文章，确保始终能显示
      const fixedArticles = [
        {
          id: 1,
          title: '清明节的传统习俗与现代传承',
          desc: '探讨清明节祭祖活动的传统习俗以及在现代社会的传承方式...',
          image: '../../images/offering_flower.png',
          date: '2023-04-05',
          content: '清明节是中国二十四节气之一，也是重要的传统节日，其习俗丰富多彩。扫墓祭祖、踏青郊游是清明节的重要活动。在祭祖过程中，人们通常会准备鲜花、水果、香烛等祭品，表达对祖先的思念和敬意。随着时代变迁，祭祖方式也在不断创新，如网上祭祀、环保祭祀等形式逐渐兴起，但不变的是人们对先人的缅怀之情。'
        },
        {
          id: 2,
          title: '各地祭祖仪式的差异与共通',
          desc: '中国各地区祭祖仪式虽有差异，但都蕴含着相同的文化精神...',
          image: '../../images/offering_incense.png',
          date: '2023-03-15',
          content: '中国各地的祭祖仪式存在着地域差异。北方地区多在清明时节举行，以上坟扫墓为主；南方一些地区则重视春节、清明、中元三个时节的祭祀活动。沿海地区的祭祀活动中常有祭海、放河灯等习俗；内陆地区则多以祭山神、土地神为特色。尽管形式各异，但"慎终追远、民德归厚"的文化精神是相通的，体现了中华民族的根文化传承。'
        },
        {
          id: 3,
          title: '祭祀用品的象征意义',
          desc: '传统祭祀用品背后蕴含着丰富的文化内涵与象征意义...',
          image: '../../images/offering_candle.png',
          date: '2023-02-20',
          content: '传统祭祀用品各有象征意义：香火象征着心意的传达和沟通；蜡烛代表光明和希望；鲜花表达对逝者的思念和祝福；水果和食物象征丰收和富足；纸钱则是希望先人在另一个世界衣食无忧。这些用品摆放位置和数量也有讲究，体现了中国人对生死的理解和敬畏，以及对家族延续的重视。'
        }
      ];
      
      // 直接使用固定文章
      this.setData({ knowledgeItems: fixedArticles });
      console.log('文章加载完成', fixedArticles.length, '篇');
      
      // 检查图片路径是否正确
      fixedArticles.forEach((article, index) => {
        console.log(`文章${index+1}图片路径:`, article.image);
      });
    } catch (error) {
      console.error('加载文章出错:', error);
      // 设置默认数据，确保即使出错也能显示一些内容
      this.setData({ 
        knowledgeItems: [{
          id: 1,
          title: '祭祖知识',
          desc: '了解更多祭祖文化知识...',
          image: '../../images/offering_incense.png',
          date: new Date().toISOString().split('T')[0]
        }] 
      });
    }
  },

  // 查看知识详情
  viewKnowledge: function(e) {
    const id = e.currentTarget.dataset.id;
    
    // 根据ID找到对应的知识项
    const item = this.data.knowledgeItems.find(item => item.id === id);
    
    if (!item) {
      wx.showToast({
        title: '文章信息不存在',
        icon: 'none'
      });
      return;
    }
    
    // 显示文章内容
    wx.showModal({
      title: item.title,
      content: item.content || '此文章暂无详细内容',
      confirmText: '了解更多',
      cancelText: '关闭',
      success(res) {
        if (res.confirm) {
          // 可以跳转到更详细的页面或公众号文章
          wx.showToast({
            title: '更多内容开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 设置初始数据，确保页面立即显示内容
  setInitialData: function() {
    try {
      // 获取北京时间（东八区）
      const now = new Date();
      const beijingTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 8 * 3600000);
      
      const year = beijingTime.getFullYear();
      const month = beijingTime.getMonth() + 1;
      const day = beijingTime.getDate();
      
      const hours = beijingTime.getHours().toString().padStart(2, '0');
      const minutes = beijingTime.getMinutes().toString().padStart(2, '0');
      const seconds = beijingTime.getSeconds().toString().padStart(2, '0');
      
      // 格式化日期和时间
      const today = `${year}年${month}月${day}日`;
      const currentTime = `${hours}:${minutes}:${seconds}`;
      
      // 获取农历日期
      const lunarDate = this.getLunarDate(year, month, day);
      
      // 判断今日是否有节日
      const festival = this.getFestival(month, day, lunarDate);
      
      // 获取宜忌数据
      const { goodItems, badItems } = this.getGoodBadItems(month, day);
      
      // 每日小知识
      const dailyTip = this.getDailyTip(month, day);
      
      // 一次性设置所有数据
      this.setData({
        today,
        currentTime,
        lunarDate,
        festival,
        goodItems,
        badItems,
        dailyTip
      });
      
      console.log('初始数据设置完成:', {
        today,
        currentTime,
        lunarDate,
        festival,
        goodItems: goodItems.length + '项',
        badItems: badItems.length + '项'
      });
    } catch (error) {
      console.error('设置初始数据出错:', error);
      // 设置默认值确保页面显示
      this.setData({
        today: new Date().toLocaleDateString('zh-CN'),
        currentTime: new Date().toLocaleTimeString('zh-CN'),
        lunarDate: '正月初一',
        festival: '',
        goodItems: ['祭祀', '祈福', '纳采', '开光'],
        badItems: ['动土', '安床', '作灶', '破土'],
        dailyTip: '祭祖是中华民族的传统美德，承载着"慎终追远"的文化内涵。'
      });
    }
  }
}); 