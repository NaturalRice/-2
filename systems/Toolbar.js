class Toolbar {
  constructor(scene) {
    this.scene = scene;
    this.toolbarSlots = [];
    this.selectedSlotIndex = -1; // 当前选中的槽位索引
    this.createToolbar();
  }

  createToolbar() {
    console.log('创建物品栏'); // 添加日志

    // 物品栏背景
    const toolbarWidth = 750;
    const toolbarHeight = 80;
    const toolbarX = this.scene.cameras.main.width - 400;
    const toolbarY = this.scene.cameras.main.height - toolbarHeight + 35;

    // 物品栏背景
    this.toolbarBg = this.scene.add.rectangle(toolbarX, toolbarY, toolbarWidth, toolbarHeight, 0x444444)
      .setStrokeStyle(2, 0xFFFFFF)
      .setScrollFactor(0)
      .setDepth(1000);

    // 创建10个槽位
    const slotSize = 64;
    const padding = 10;
    const startX = toolbarX + padding - 343;
    const startY = toolbarY + padding - 10;

    for (let i = 0; i < 10; i++) {
      const slotX = startX + i * (slotSize + padding);
      const slotY = startY;

      // 创建槽位
      const slot = this.createToolbarSlot(slotX, slotY, slotSize);
      this.toolbarSlots.push(slot);
    }

    console.log('物品栏槽位初始化完成:', this.toolbarSlots); // 添加日志
  }

  createToolbarSlot(x, y, size) {
    // 槽位背景
    const bg = this.scene.add.rectangle(x, y, size, size, 0x666666)
      .setInteractive({ 
        useHandCursor: true, // 启用手型光标
        hitArea: new Phaser.Geom.Rectangle(0, 0, size, size), // 设置交互区域
        hitAreaCallback: Phaser.Geom.Rectangle.Contains // 使用矩形检测
      })
      .setScrollFactor(0) // 固定到镜头
      .setDepth(1001) // 槽位背景的深度值较低
      .on('pointerdown', (pointer) => {
        console.log('槽位背景点击:', pointer.x, pointer.y); // 调试点击位置
        this.onSlotDragStart(pointer, bg);
      });

    // 物品图标
    const icon = this.scene.add.image(x, y, '')
      .setDisplaySize(size - 10, size - 10) // 图标比槽位稍小
      .setScrollFactor(0) // 固定到镜头
      .setDepth(1002) // 物品图标的深度值较高
      .setVisible(false)
      .setInteractive({ 
        useHandCursor: true, // 启用手型光标
        pixelPerfect: true,  // 启用像素完美检测
        hitArea: new Phaser.Geom.Rectangle(0, 0, size - 10, size - 10), // 设置交互区域
        hitAreaCallback: Phaser.Geom.Rectangle.Contains // 使用矩形检测
      })
      .on('pointerdown', (pointer) => {
        console.log('物品图标点击:', pointer.x, pointer.y); // 调试点击位置
      });

    // 数量文本
    const countText = this.scene.add.text(x + size / 2 - 5, y + size / 2 - 5, '', {
      fontSize: '16px',
      fill: '#FFF',
    })
      .setOrigin(1, 1) // 文本右下角对齐
      .setScrollFactor(0) // 固定到镜头
      .setDepth(1002) // 数量文本的深度值与物品图标一致
      .setVisible(false);

    return { bg, icon, countText, item: null };
  }
  
  // 选中槽位
  selectSlot(index) {
    // 取消之前选中的槽位
    if (this.selectedSlotIndex !== -1) {
      this.toolbarSlots[this.selectedSlotIndex].bg.setFillStyle(0x666666); // 恢复默认颜色
    }

    // 选中新的槽位
    if (index >= 0 && index < this.toolbarSlots.length) {
      this.selectedSlotIndex = index;
      this.toolbarSlots[index].bg.setFillStyle(0x888888); // 改变背景颜色
    } else {
      this.selectedSlotIndex = -1; // 如果没有选中任何槽位，重置索引
    }
  }

  
  onSlotDragStart(pointer, slotBg) {
    const slot = this.toolbarSlots.find(s => s.bg === slotBg);
    if (slot && slot.item) {
      console.log('开始拖拽:', slot.item.type);
      this.draggedItem = slot.item; // 记录被拖拽的物品
      this.draggedSlot = slot; // 记录被拖拽的槽位
      this.scene.input.setDraggable(slot.icon); // 设置图标为可拖拽
      slot.icon.setDepth(1002); // 提高深度，确保拖拽时在最上层
    }
  }

  onSlotDragEnd() {
    if (this.draggedItem && this.draggedSlot) {
      console.log('结束拖拽:', this.draggedItem.type);
      // 检查是否与其他槽位重叠
      const targetSlot = this.toolbarSlots.find(s => s.bg.getBounds().contains(this.scene.input.activePointer.x, this.scene.input.activePointer.y));
      if (targetSlot && targetSlot !== this.draggedSlot) {
        console.log('交换物品:', this.draggedItem.type, '与', targetSlot.item?.type);
        // 交换物品
        this.swapItems(this.draggedSlot, targetSlot);
      }

      // 重置拖拽状态
      this.draggedItem = null;
      this.draggedSlot.icon.setDepth(1001);
      this.scene.input.setDraggable(this.draggedSlot.icon, false);

      // 重置图标位置
      this.draggedSlot.icon.x = this.draggedSlot.bg.x;
      this.draggedSlot.icon.y = this.draggedSlot.bg.y;
    }
  }

  swapItems(slotA, slotB) {
    const tempItem = slotA.item;
    slotA.item = slotB.item;
    slotB.item = tempItem;

    // 更新槽位显示
    this.updateToolbarSlot(this.toolbarSlots.indexOf(slotA), slotA.item);
    this.updateToolbarSlot(this.toolbarSlots.indexOf(slotB), slotB.item);
  }

  updateToolbarSlot(index, item) {
    const slot = this.toolbarSlots[index];
    if (item) {
      slot.icon.setTexture(item.spriteKey) // 设置物品贴图
        .setVisible(true)
        .setDepth(1002); // 确保物品图标的深度值高于槽位背景
      slot.countText.setText(item.count) // 设置物品数量
        .setVisible(true)
        .setDepth(1002); // 确保数量文本的深度值高于槽位背景
    } else {
      slot.icon.setVisible(false);
      slot.countText.setVisible(false);
    }
  }
}

// 导出 Toolbar 类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Toolbar;
}