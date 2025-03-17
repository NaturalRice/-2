// 确保 config 已定义
if (typeof config === 'undefined') {
  console.error('config 未定义！请检查文件加载顺序。');
} else {
  console.log('config 已定义，启动游戏');
  const game = new Phaser.Game(config);
}