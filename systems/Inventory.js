class Inventory {
  constructor(size) {
    this.slots = new Array(size).fill(null); // 槽位数组
  }

  addItem(itemType) {
    const existingSlot = this.slots.find(slot => 
      slot?.itemType === itemType && slot.count < slot.maxCount
    );
    
    if (existingSlot) {
      existingSlot.count++;
      return true;
    }

    const emptyIndex = this.slots.findIndex(slot => !slot);
    if (emptyIndex !== -1) {
      this.slots[emptyIndex] = {
        itemType: itemType,
        count: 1,
        maxCount: itemsData[itemType].maxCount
      };
      return true;
    }
    return false; // 背包已满
  }
}

// 导出 Inventory 类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Inventory;
}