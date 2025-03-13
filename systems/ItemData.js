class ItemData {
  constructor(type, spriteKey, maxCount) {
    this.type = type;        // 物品类型
    this.spriteKey = spriteKey; // 对应 Phaser 的 texture key
    this.maxCount = maxCount || 99; // 最大堆叠数
  }
}

// 导出 ItemData 类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ItemData;
}