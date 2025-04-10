Component({
  data: {
    selected: 0,
    list: [{
      pagePath: "/pages/home/home",
      text: "首页"
    }, {
      pagePath: "/pages/profile/profile",
      text: "我的"
    }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
      this.setData({
        selected: data.index
      });
    }
  }
}); 