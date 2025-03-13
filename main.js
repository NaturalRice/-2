// 确保 config 已经定义
if (typeof config === 'undefined') {
  console.error('config 未定义！请检查文件加载顺序。');
}

// 启动游戏
const game = new Phaser.Game(config);