// 确保场景已经定义
if (typeof StartScene === 'undefined' || typeof AISelectionScene === 'undefined' || typeof MainScene === 'undefined' || typeof UIScene === 'undefined') {
  console.error('场景未定义！请检查文件加载顺序。');
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 700,
  parent: 'game-container',
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [StartScene, AISelectionScene, MainScene, UIScene] // 注册所有场景
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config; // 用于 Node.js 环境
}