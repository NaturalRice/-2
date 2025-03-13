class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.UI });
  }

  create() {
    // 创建一个半透明的黑色矩形覆盖整个屏幕
    this.overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1000); // 确保UI在最上层

    // 监听Esc键
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // 确保Esc键绑定成功
    if (!this.escKey) {
      console.error('Esc键绑定失败！');
    }

    // 创建背包栏
    this.createBackpackUI();
  }

  createBackpackUI() {
    // 背包栏背景
    const backpackWidth = 700; // 背包栏宽度
    const backpackHeight = 300; // 背包栏高度
    const backpackX = (this.cameras.main.width - backpackWidth) / 2; // 水平居中
    const backpackY = (this.cameras.main.height - backpackHeight) / 2; // 垂直居中

    // 背包栏背景矩形
    this.backpackBg = this.add.rectangle(backpackX, backpackY, backpackWidth, backpackHeight, 0x333333)
      .setStrokeStyle(2, 0xFFFFFF)
      .setOrigin(0, 0);

    // 创建4行10列的槽位
    const slotSize = 64; // 每个槽位的大小
    const padding = 10; // 槽位之间的间距
    const startX = backpackX + padding; // 槽位起始X坐标
    const startY = backpackY + padding; // 槽位起始Y坐标

    this.slots = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 10; col++) {
        const slotX = startX + col * (slotSize + padding);
        const slotY = startY + row * (slotSize + padding);

        // 创建槽位
        const slot = this.createSlot(slotX, slotY, slotSize);
        this.slots.push(slot);
      }
    }
  }

  createSlot(x, y, size) {
    // 槽位背景
    const bg = this.add.rectangle(x, y, size, size, 0x666666)
      .setInteractive()
      .on('pointerdown', () => this.onSlotClick(bg));

    // 物品图标
    const icon = this.add.image(x, y, '')
      .setDisplaySize(size - 10, size - 10) // 图标比槽位稍小
      .setVisible(false);

    // 数量文本
    const countText = this.add.text(x + size / 2 - 5, y + size / 2 - 5, '', {
      fontSize: '16px',
      fill: '#FFF',
    })
      .setOrigin(1, 1) // 文本右下角对齐
      .setVisible(false);

    return { bg, icon, countText, item: null };
  }
  
  updateSlot(index, item) {
    const slot = this.slots[index];
    if (item) {
      slot.icon.setTexture(item.spriteKey) // 设置物品贴图
        .setVisible(true);
      slot.countText.setText(item.count) // 设置物品数量
        .setVisible(true);
    } else {
      slot.icon.setVisible(false);
      slot.countText.setVisible(false);
    }
  }

  onSlotClick(slotBg) {
    // 找到被点击的槽位
    const slot = this.slots.find(s => s.bg === slotBg);
    if (slot) {
      console.log('槽位被点击:', slot);
      // 这里可以添加物品交互逻辑
    }
  }

  update() {
    // 检测Esc键按下
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      console.log('Esc键按下，关闭UI场景');
      this.scene.stop(); // 关闭UI场景
    }
  }
}

// 导出 UIScene 类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIScene;
}