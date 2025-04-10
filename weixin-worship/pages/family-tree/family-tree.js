Page({
  data: {
    familyMembers: [],
    generations: {
      generation1: [], // 先祖辈
      generation2: [], // 父辈
      generation3: [], // 我辈
      generation4: []  // 子辈
    },
    isEditMode: false,
    showMemberModal: false,
    showDetailModal: false,
    selectedMemberId: null,
    selectedMember: null,
    editingMemberId: null,
    tempMember: {
      name: '',
      gender: '男',
      birthYear: '',
      deathYear: '',
      isAlive: true,
      generation: 1,
      parentId: null,
      parentName: '',
      description: ''
    },
    generationOptions: ['先祖辈', '父辈', '我辈', '子辈'],
    parentOptions: []
  },

  onLoad: function (options) {
    // 加载家族树数据
    this.loadFamilyTree();
  },

  // 加载家族树数据
  loadFamilyTree: function() {
    const app = getApp();
    
    // 从本地存储加载数据
    const familyMembers = wx.getStorageSync('familyMembers') || [];
    
    if (familyMembers.length > 0) {
      this.setData({ familyMembers });
      this.organizeByGenerations();
    }
  },

  // 按代际整理家族成员
  organizeByGenerations: function() {
    const { familyMembers } = this.data;
    const generations = {
      generation1: [],
      generation2: [],
      generation3: [],
      generation4: []
    };

    // 将成员分配到对应代际
    familyMembers.forEach(member => {
      if (member.generation === 1) {
        generations.generation1.push(member);
      } else if (member.generation === 2) {
        generations.generation2.push(member);
      } else if (member.generation === 3) {
        generations.generation3.push(member);
      } else if (member.generation === 4) {
        generations.generation4.push(member);
      }
    });

    // 更新数据
    this.setData({ generations });
  },

  // 切换编辑模式
  toggleEditMode: function() {
    this.setData({
      isEditMode: !this.data.isEditMode
    });
  },

  // 添加家族成员
  addFamilyMember: function() {
    // 重置临时成员数据
    this.setData({
      showMemberModal: true,
      editingMemberId: null,
      tempMember: {
        name: '',
        gender: '男',
        birthYear: '',
        deathYear: '',
        isAlive: true,
        generation: 1,
        parentId: null,
        parentName: '',
        description: ''
      },
      // 更新可选父母列表
      parentOptions: this.getParentOptions(1)
    });
  },

  // 根据所选代际获取可选的父母列表
  getParentOptions: function(generation) {
    if (generation <= 1) return [];
    
    // 父母应该是上一代的成员
    const parentGeneration = generation - 1;
    let parentOptions = [];
    
    // 找出所有上一代的成员作为可选父母
    this.data.familyMembers.forEach(member => {
      if (member.generation === parentGeneration) {
        parentOptions.push({
          id: member.id,
          name: member.name,
          gender: member.gender
        });
      }
    });
    
    return parentOptions;
  },

  // 关闭成员编辑模态框
  closeMemberModal: function() {
    this.setData({
      showMemberModal: false
    });
  },

  // 切换是否在世状态
  toggleIsAlive: function() {
    const { tempMember } = this.data;
    tempMember.isAlive = !tempMember.isAlive;
    // 如果重新变为在世，清除死亡年份
    if (tempMember.isAlive) {
      tempMember.deathYear = '';
    }
    this.setData({ tempMember });
  },

  // 性别变更
  onGenderChange: function(e) {
    const { tempMember } = this.data;
    tempMember.gender = e.detail.value;
    this.setData({ tempMember });
  },

  // 出生年份变更
  onBirthYearChange: function(e) {
    const { tempMember } = this.data;
    tempMember.birthYear = e.detail.value.substring(0, 4);
    this.setData({ tempMember });
  },

  // 死亡年份变更
  onDeathYearChange: function(e) {
    const { tempMember } = this.data;
    tempMember.deathYear = e.detail.value.substring(0, 4);
    this.setData({ tempMember });
  },

  // 代际变更
  onGenerationChange: function(e) {
    const { tempMember } = this.data;
    const newGeneration = parseInt(e.detail.value) + 1;
    tempMember.generation = newGeneration;
    
    // 如果代际变了，重置父母信息
    tempMember.parentId = null;
    tempMember.parentName = '';
    
    // 更新可选父母列表
    const parentOptions = this.getParentOptions(newGeneration);
    
    this.setData({
      tempMember,
      parentOptions
    });
  },

  // 父母变更
  onParentChange: function(e) {
    const { tempMember, parentOptions } = this.data;
    const selectedParent = parentOptions[e.detail.value];
    
    if (selectedParent) {
      tempMember.parentId = selectedParent.id;
      tempMember.parentName = selectedParent.name;
      this.setData({ tempMember });
    }
  },

  // 保存成员
  saveMember: function() {
    const { tempMember, editingMemberId, familyMembers } = this.data;
    
    // 验证必填字段
    if (!tempMember.name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      });
      return;
    }

    // 编辑现有成员
    if (editingMemberId) {
      const index = familyMembers.findIndex(m => m.id === editingMemberId);
      if (index !== -1) {
        familyMembers[index] = {
          ...familyMembers[index],
          ...tempMember
        };
      }
    } 
    // 添加新成员
    else {
      // 生成唯一ID
      const newId = Date.now().toString();
      familyMembers.push({
        id: newId,
        ...tempMember
      });
    }

    // 更新数据
    this.setData({ familyMembers });
    
    // 重新组织代际数据
    this.organizeByGenerations();
    
    // 保存到本地存储
    wx.setStorageSync('familyMembers', familyMembers);
    
    // 关闭模态框
    this.closeMemberModal();
    
    wx.showToast({
      title: editingMemberId ? '成员已更新' : '成员已添加',
      icon: 'success'
    });
  },

  // 选择成员
  selectMember: function(e) {
    const memberId = e.currentTarget.dataset.id;
    if (this.data.isEditMode) return; // 编辑模式下不显示详情
    
    // 隐藏所有删除按钮
    this.hideAllDeleteButtons();
    
    // 查找选中的成员
    const selectedMember = this.data.familyMembers.find(m => m.id === memberId);
    if (selectedMember) {
      // 整理关系信息
      const relations = this.getMemberRelations(selectedMember);
      selectedMember.relations = relations;
      
      this.setData({
        selectedMemberId: memberId,
        selectedMember: selectedMember,
        showDetailModal: true
      });
    }
  },
  
  // 显示删除按钮
  showDeleteButton: function(e) {
    const memberId = e.currentTarget.dataset.id;
    
    // 获取所有家族成员的副本
    const { familyMembers } = this.data;
    const updatedMembers = [...familyMembers];
    
    // 隐藏所有成员的删除按钮，然后显示当前成员的删除按钮
    updatedMembers.forEach(member => {
      if (member.id === memberId) {
        member.showDelete = true;
      } else {
        member.showDelete = false;
      }
    });
    
    // 更新数据
    this.setData({ familyMembers: updatedMembers });
    
    // 重新组织代际数据，确保UI更新
    this.organizeByGenerations();
    
    // 振动反馈
    wx.vibrateShort({
      type: 'medium'
    });
  },
  
  // 隐藏所有删除按钮
  hideAllDeleteButtons: function() {
    const { familyMembers } = this.data;
    const updatedMembers = [...familyMembers];
    
    updatedMembers.forEach(member => {
      member.showDelete = false;
    });
    
    this.setData({ familyMembers: updatedMembers });
    this.organizeByGenerations();
  },
  
  // 删除成员
  deleteMember: function(e) {
    const memberId = e.currentTarget.dataset.id;
    
    // 提示确认删除
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个家族成员吗？此操作无法撤销。',
      confirmColor: '#ff4d4f',
      success: res => {
        if (res.confirm) {
          this.confirmDeleteMember(memberId);
        } else {
          // 用户取消，隐藏所有删除按钮
          this.hideAllDeleteButtons();
        }
      }
    });
  },
  
  // 确认删除成员
  confirmDeleteMember: function(memberId) {
    const { familyMembers } = this.data;
    
    // 检查是否有子女，如果有则不能删除
    const hasChildren = familyMembers.some(member => member.parentId === memberId);
    if (hasChildren) {
      wx.showModal({
        title: '无法删除',
        content: '这个成员有子女关联，无法删除。请先删除其子女或解除关联。',
        showCancel: false
      });
      return;
    }
    
    // 过滤掉要删除的成员
    const updatedMembers = familyMembers.filter(member => member.id !== memberId);
    
    // 更新数据
    this.setData({ familyMembers: updatedMembers });
    
    // 重新组织代际数据
    this.organizeByGenerations();
    
    // 保存到本地存储
    wx.setStorageSync('familyMembers', updatedMembers);
    
    // 提示成功
    wx.showToast({
      title: '成员已删除',
      icon: 'success'
    });
  },

  // 获取成员的家族关系
  getMemberRelations: function(member) {
    const { familyMembers } = this.data;
    const relations = [];
    
    // 找父母关系
    if (member.parentId) {
      const parent = familyMembers.find(m => m.id === member.parentId);
      if (parent) {
        relations.push({
          id: parent.id,
          type: parent.gender === '男' ? '父亲' : '母亲',
          name: parent.name
        });
      }
    }
    
    // 找子女关系
    familyMembers.forEach(m => {
      if (m.parentId === member.id) {
        relations.push({
          id: m.id,
          type: m.gender === '男' ? '儿子' : '女儿',
          name: m.name
        });
      }
    });
    
    return relations;
  },

  // 关闭详情模态框
  closeDetailModal: function() {
    this.setData({
      showDetailModal: false
    });
  },

  // 编辑选中的成员
  editSelectedMember: function() {
    const { selectedMember } = this.data;
    if (!selectedMember) return;
    
    // 关闭详情模态框
    this.closeDetailModal();
    
    // 设置编辑数据
    this.setData({
      editingMemberId: selectedMember.id,
      tempMember: {
        name: selectedMember.name,
        gender: selectedMember.gender,
        birthYear: selectedMember.birthYear,
        deathYear: selectedMember.deathYear,
        isAlive: selectedMember.isAlive,
        generation: selectedMember.generation,
        parentId: selectedMember.parentId,
        parentName: selectedMember.parentName || '',
        description: selectedMember.description || ''
      },
      parentOptions: this.getParentOptions(selectedMember.generation),
      showMemberModal: true
    });
  },

  // 直接编辑成员（从编辑模式点击）
  editMember: function(e) {
    const memberId = e.currentTarget.dataset.id;
    const member = this.data.familyMembers.find(m => m.id === memberId);
    
    if (member) {
      this.setData({
        editingMemberId: memberId,
        tempMember: {
          name: member.name,
          gender: member.gender,
          birthYear: member.birthYear,
          deathYear: member.deathYear,
          isAlive: member.isAlive,
          generation: member.generation,
          parentId: member.parentId,
          parentName: member.parentName || '',
          description: member.description || ''
        },
        parentOptions: this.getParentOptions(member.generation),
        showMemberModal: true
      });
    }
  },

  // 分享
  onShareAppMessage: function() {
    return {
      title: '我的家族树',
      path: '/pages/family-tree/family-tree'
    };
  },

  // 名字输入处理
  onNameInput: function(e) {
    const { tempMember } = this.data;
    tempMember.name = e.detail.value;
    this.setData({ tempMember });
  },

  // 简介输入处理
  onDescriptionInput: function(e) {
    const { tempMember } = this.data;
    tempMember.description = e.detail.value;
    this.setData({ tempMember });
  }
}); 