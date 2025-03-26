class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.START });
  }

  preload() {
    // 加载开始界面背景图
    this.load.image('startBackground', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1742990490/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250326195854_eci3hq.png');
  }

  create() {
    // 添加开始界面背景
    this.add.image(550, 550, 'startBackground').setOrigin(0.5);

    // 添加标题
    this.add.text(400, 200, '灵机修真传', {
      font: '48px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // 添加“开始游戏”按钮
    const startButton = this.add.text(400, 450, '开始游戏', {
      font: '32px Arial',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start(SCENE_KEYS.AI_SELECTION); // 点击后切换到AI选择场景
    })
    .on('pointerover', () => {
      startButton.setBackgroundColor('#555555'); // 鼠标悬停时改变背景色
    })
    .on('pointerout', () => {
      startButton.setBackgroundColor('#333333'); // 鼠标离开时恢复背景色
    });

    // 添加“退出游戏”按钮
    const exitButton = this.add.text(400, 520, '退出游戏', {
      font: '32px Arial',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.exitGame(); // 点击后退出游戏
    })
    .on('pointerover', () => {
      exitButton.setBackgroundColor('#555555'); // 鼠标悬停时改变背景色
    })
    .on('pointerout', () => {
      exitButton.setBackgroundColor('#333333'); // 鼠标离开时恢复背景色
    });
  }
  
  exitGame() {
	  // 显示确认对话框
	  const confirmExit = confirm('确定要退出游戏吗？');
	  if (confirmExit) {
		// 关闭浏览器标签页（仅适用于部分浏览器）
		window.close();
	  }
	}
}

// 导出 StartScene 类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StartScene; // 用于 Node.js 环境
}