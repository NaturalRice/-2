class AISelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.AI_SELECTION });
  }

  create() {
    // 添加背景
    this.add.image(400, 350, 'startBackground').setOrigin(0.5);

    // 添加标题
    this.add.text(400, 100, '选择你的AI助手', {
      font: '32px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // 添加AI选择按钮
    const aiOptions = [
      { name: '剑宗AI', type: 'sword', x: 200, y: 300 },
      { name: '丹宗AI', type: 'alchemy', x: 400, y: 300 },
      { name: '符宗AI', type: 'talisman', x: 600, y: 300 }
    ];

    aiOptions.forEach(option => {
      const btn = this.add.text(option.x, option.y, option.name, {
        font: '24px Arial',
        fill: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 20, y: 10 }
      })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start(SCENE_KEYS.MAIN, { aiType: option.type }); // 传递选择的AI类型
      })
      .on('pointerover', () => {
        btn.setBackgroundColor('#555555'); // 鼠标悬停时改变背景色
      })
      .on('pointerout', () => {
        btn.setBackgroundColor('#333333'); // 鼠标离开时恢复背景色
      });
    });
  }
}

// 导出 AISelectionScene 类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AISelectionScene;
}