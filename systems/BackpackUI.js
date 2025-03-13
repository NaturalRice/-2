class BackpackUI {
  constructor(scene, x, y) {
    this.scene = scene;
    this.slots = [];
    
    // 创建背包背景
    const bg = scene.add.rectangle(x, y, 400, 500, 0x333333)
      .setStrokeStyle(2, 0xFFFFFF);
    
    // 创建24个槽位（6x4布局）
    for(let row = 0; row < 4; row++) {
      for(let col = 0; col < 6; col++) {
        const slotX = x - 180 + col * 70;
        const slotY = y - 220 + row * 110;
        
        const slot = this.createSlot(slotX, slotY);
        this.slots.push(slot);
      }
    }
  }

  createSlot(x, y) {
    // 槽位背景
    const bg = this.scene.add.rectangle(x, y, 64, 64, 0x666666)
      .setInteractive()
      .on('pointerdown', () => this.onSlotClick(bg));
    
    // 物品图标
    const icon = this.scene.add.image(x, y-10, '')
      .setDisplaySize(48, 48)
      .setVisible(false);
    
    // 数量文本
    const countText = this.scene.add.text(x+20, y+20, '', 
      { fontSize: '16px', fill: '#FFF' })
      .setOrigin(1, 0.5)
      .setVisible(false);

    return { bg, icon, countText, item: null };
  }

  updateSlot(index, item) {
    const slot = this.slots[index];
    
    if(item) {
      slot.icon.setTexture(itemsData[item.type].spriteKey)
        .setVisible(true);
      slot.countText.setText(item.count)
        .setVisible(true);
    } else {
      slot.icon.setVisible(false);
      slot.countText.setVisible(false);
    }
  }

  onSlotClick(slotBg) {
    const slotIndex = this.slots.findIndex(s => s.bg === slotBg);
    // 处理物品交换逻辑
    // ...
  }
}

// 导出 BackpackUI 类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackpackUI;
}