
# Remote-Worship-Platform

## 项目介绍

我是Long Xinyun，一名热爱传统文化的开发者。在一次清明节回家拜山的经历中，我深刻体会到许多离家远或因工作繁忙无法按时回乡的人们内心的愧疚和思念。这款微信小程序正是为这些人群设计 - 无论是留学生还是异地工作者，都可以通过线上方式进行祭祖活动，随时表达对先人的思念与孝敬，不再受时间与空间的限制。

本项目致力于传承中华优秀传统文化，连接现代生活与传统习俗，让"慎终追远"的美德在快节奏的算法时代继续传承。

## 核心价值

- **时空突破**：用户可随时随地通过手机进行祭祖活动，不必等到清明节
- **家族谱记录**：线上家族谱系统有助于保存家族历史信息，防止家族史随着老一辈人离世而逐渐散失，实现数字化传承
- **文化传承**：工具栏提供清明节（国家级非物质文化遗产）相关习俗和文化价值的科普内容
- **价值引领**：促进中华优秀传统文化的传承与发扬，增强文化自信，践行"中国梦"中关于文化传承的重要内涵

## 主要功能

- **用户登录**：微信授权快速登录系统
- **在线祭拜**：提供多种祭品选择和祭拜仪式流程
- **家族树管理**：创建和维护数字化家族谱系
- **祭祀工具**：提供传统祭祀所需的数字化工具
- **文化科普**：非物质文化遗产知识普及

## 技术实现

### 前端技术栈
- **框架**: 微信小程序原生开发 (WXML/WXSS/JavaScript)
- **UI设计**: 自主设计的iOS风格界面，使用自定义组件优化用户体验
- **状态管理**: 采用App实例的globalData进行全局状态维护
- **组件化**: 自定义组件开发提高代码复用率和可维护性

### 后端与数据处理
- **登录系统**: 实现了基于用户名/密码的传统登录方式与微信快捷登录的双重验证机制
- **数据持久化**: 使用wx.setStorage/wx.getStorage进行用户数据本地存储
- **用户认证**: 结合wx.login和wx.getUserInfo实现微信授权登录
- **数据同步**: 用户登录、登出和祭祀活动记录的双向同步机制
- **本地缓存**: 实现了应用启动时自动恢复用户状态的功能，提升用户体验

### 核心技术亮点
- **自定义TabBar**: 使用component组件实现自定义底部导航栏，添加平滑过渡动画效果
- **页面路由优化**: 合理设计页面层级结构，优化页面切换体验
- **响应式设计**: 采用rpx单位适配不同屏幕尺寸设备
- **性能优化**: 图片资源压缩处理，避免不必要的页面重绘提升性能


## 未来规划

- 增加AR功能，提供更沉浸式的祭祀体验
- 添加家族故事分享功能
- 打造跨平台版本，服务更多用户

---



# Remote-Worship-Platform

## Project Introduction

I am Long Xinyun, a developer passionate about traditional culture. During a Qingming Festival when returning home for ancestral worship, I deeply realized the guilt and longing felt by many who work far from home or are unable to return due to busy schedules. This WeChat Mini Program is designed for these individuals - whether international students or remote workers, they can conduct ancestral worship activities online, expressing filial piety and remembrance at any time, unrestricted by time and space.

## Core Values

- **Breaking Spatiotemporal Constraints**: Users can perform ancestral worship anytime, anywhere via mobile devices, not limited to the Qingming Festival
- **Family Genealogy Records**: The online family tree system helps preserve family historical information, preventing the loss of family history as older generations pass away, enabling digital inheritance
- **Cultural Inheritance**: The toolkit provides educational content about Qingming Festival (National Intangible Cultural Heritage) customs and cultural values
- **Value Guidance**: Promotes the inheritance and development of excellent Chinese traditional culture, enhances cultural confidence, and implements the important connotations of cultural inheritance in the "Chinese Dream"

## Key Features

- **User Authentication**: Quick login through WeChat authorization
- **Online Worship**: Multiple offerings and worship ceremony processes
- **Family Tree Management**: Create and maintain digitalized family genealogy
- **Worship Tools**: Digital tools required for traditional worship ceremonies
- **Cultural Education**: Knowledge dissemination about intangible cultural heritage

## Technical Implementation

### Frontend Stack
- **Framework**: Native WeChat Mini Program development (WXML/WXSS/JavaScript)
- **UI Design**: Custom iOS-style interface with optimized user experience through custom components
- **State Management**: Global state maintenance using App instance's globalData
- **Component-Based Development**: Custom component development to improve code reusability and maintainability

### Backend & Data Processing
- **Login System**: Implemented dual verification mechanism with traditional username/password login and WeChat quick login
- **Data Persistence**: User data local storage using wx.setStorage/wx.getStorage
- **User Authentication**: WeChat authorized login implemented by combining wx.login and wx.getUserInfo
- **Data Synchronization**: Bidirectional synchronization mechanism for user login, logout, and worship activity records
- **Local Cache**: Automatic user state restoration functionality upon application startup, enhancing user experience

### Core Technical Highlights
- **Custom TabBar**: Custom bottom navigation bar implemented using component, with smooth transition animation effects
- **Page Routing Optimization**: Rational design of page hierarchy structure, optimizing page switching experience
- **Responsive Design**: Using rpx units to adapt to devices with different screen sizes
- **Performance Optimization**: Image resource compression processing, avoiding unnecessary page repaints to improve performance
- **Modular Development**: Modularized design of login, user management, and worship functionality, facilitating maintenance and expansion

### User Data Management
- **Secure Storage**: User information and worship records protected through security mechanisms provided by WeChat
- **Offline Functionality**: Support for basic functionality in offline environments, with automatic data synchronization when online
- **User State Management**: Globally unified user state control, ensuring data consistency between pages

## Future Plans

- Add AR functionality for a more immersive worship experience
- Add family story sharing feature
- Develop cross-platform versions to serve more users

---

*This project is dedicated to inheriting excellent Chinese traditional culture, connecting modern life with traditional customs, and allowing the virtue of "remembering ancestors" to continue in the digital age.*
