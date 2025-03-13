const ITEM_TYPES = {
  SWORD: 'sword',
  POTION: 'potion',
  SHIELD: 'shield',
  SPIRIT_STONE: 'spirit_stone'
};

const SCENE_KEYS = {
  START: 'StartScene',
  AI_SELECTION: 'AISelectionScene',
  MAIN: 'MainScene',
  UI: 'UIScene'
};

// 导出常量
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ITEM_TYPES, SCENE_KEYS };
}