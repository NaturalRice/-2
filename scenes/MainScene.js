class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.MAIN });
    this.backpack = new Inventory(24); // 24格背包
    this.isSwingingSword = false; // 剑是否正在挥动
	this.isUsingPotion = false; // 药水是否正在使用
	this.isShieldActive = false; // 盾牌是否激活
    this.shieldDurability = 0; // 盾牌耐久度
  }

  init(data) {
    // 获取选择的AI类型
    this.selectedAIType = data.aiType || 'sword'; // 默认为剑宗AI
  }

  preload() {
    // 加载资源
    this.load.image('background', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1742990491/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250326195914_zbvhpf.png');
    this.load.image('player', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1741327937/player_refbni.png');
    this.load.image('ai_sword', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1741327937/%E5%89%91%E5%AE%97_x3mado.png');
    this.load.image('ai_alchemy', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1741327937/%E4%B8%B9%E5%AE%97_mxoxwx.png'); // 替换为丹宗AI贴图
    this.load.image('ai_talisman', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1741327937/%E7%AC%A6%E5%AE%97_i4g9uf.png'); // 替换为符宗AI贴图
    this.load.image('enemy', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1741327936/enemy_yt7iyw.png');
    // 加载物品图标
    this.load.image('sword_icon', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1741766956/ac5fbabd-fbc9-4011-9220-e2cf7ae6c393_rscyp2.png');
    this.load.image('potion_icon', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1741776901/ac5fbabd-fbc9-4011-9220-e2cf7ae6c393_udgcgs.png');
    this.load.image('shield_icon', 'https://res.cloudinary.com/dfcdam31d/image/upload/v1741776712/ac5fbabd-fbc9-4011-9220-e2cf7ae6c393_wmuvcl.png');
  }

  create() {
    console.log('MainScene 已启动'); // 添加日志

    // === 游戏初始化 ===
    this.add.text(10, 10, '修真世界 v0.1', { 
      font: '16px Arial', 
      fill: '#ffffff' 
    }).setScrollFactor(0).setDepth(1);

    // 背景和物理边界
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.physics.world.setBounds(0, 0, 1152, 1152);

    // 玩家初始化
	  this.player = this.physics.add.sprite(576, 576, 'player');
	  this.player.setCollideWorldBounds(true);
	  this.player.setBounce(0.2);

    // === 玩家属性初始化 ===
	  this.playerStats = {
		hp: 100,
		energy: 100,
		maxHp: 100,
		maxEnergy: 100
	  };

    console.log('玩家血量初始化:', this.playerStats.hp); // 添加日志

    // === AI初始化 ===
    this.currentAI = this.createAI(this.selectedAIType);
    this.currentAI.setPosition(750, 550);

    // 敌人初始化
	  this.enemies = this.physics.add.group({
	  key: 'enemy',
	  repeat: 5,
	  setXY: { x: 200, y: 200, stepX: 300, stepY: 300 }
	});

	// 调整敌人初始位置，避免与玩家重叠
	this.enemies.getChildren().forEach(enemy => {
	  let newX, newY;
	  do {
		newX = Phaser.Math.Between(0, 1152);
		newY = Phaser.Math.Between(0, 1152);
	  } while (Phaser.Math.Distance.Between(newX, newY, this.player.x, this.player.y) < 200); // 确保距离玩家至少200像素
	  enemy.setPosition(newX, newY);
	});

    // 启用碰撞检测
	  this.physics.add.overlap(
		this.player,
		this.enemies,
		this.handlePlayerEnemyCollision,
		null,
		this
	  );

    console.log('碰撞检测已初始化'); // 添加日志

    // === 控制系统 ===
    this.cursors = this.input.keyboard.createCursorKeys();
    // 绑定 WSAD 键
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // === 镜头设置 ===
    this.cameras.main.setBounds(0, 0, 1152, 1152);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // === UI系统 ===
    this.initUI();

    // 监听Esc键
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // 创建物品栏
    this.toolbar = new Toolbar(this);

    // 添加测试物品到物品栏
    this.addTestItemsToToolbar();
    
    // 绑定数字键 1-10
    this.numberKeys = this.input.keyboard.addKeys({
      '1': Phaser.Input.Keyboard.KeyCodes.ONE,
      '2': Phaser.Input.Keyboard.KeyCodes.TWO,
      '3': Phaser.Input.Keyboard.KeyCodes.THREE,
      '4': Phaser.Input.Keyboard.KeyCodes.FOUR,
      '5': Phaser.Input.Keyboard.KeyCodes.FIVE,
      '6': Phaser.Input.Keyboard.KeyCodes.SIX,
      '7': Phaser.Input.Keyboard.KeyCodes.SEVEN,
      '8': Phaser.Input.Keyboard.KeyCodes.EIGHT,
      '9': Phaser.Input.Keyboard.KeyCodes.NINE,
      '0': Phaser.Input.Keyboard.KeyCodes.ZERO,
    });

    // 监听数字键按下事件
    for (let i = 0; i < 10; i++) {
      const key = this.numberKeys[i === 9 ? '0' : i + 1];
      if (key) {
        key.on('down', () => {
          console.log(`快捷键 ${i === 9 ? '0' : i + 1} 被按下`);
          this.toolbar.selectSlot(i); // 选中对应的槽位

          // 使用槽位中的物品
          const slot = this.toolbar.toolbarSlots[i];
          if (slot && slot.item) {
            this.useItem(slot); // 使用物品
          }
        });
      }
    }

    // 检查键是否绑定成功
    for (const key in this.keys) {
      if (!this.keys[key]) {
        console.error(`键 ${key} 绑定失败！`);
      } else {
        console.log(`键 ${key} 绑定成功`);
      }
    }
	
	// 延迟启用碰撞检测
	  this.time.delayedCall(1000, () => { // 延迟1秒
		this.physics.add.overlap(
		  this.player,
		  this.enemies,
		  this.handlePlayerEnemyCollision,
		  null,
		  this
		);
	  });
    
    // 在 create 方法中绑定 pointerup 事件
    this.input.on('pointerup', () => this.toolbar.onSlotDragEnd());

    // 监听鼠标左键按下事件
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) {
        this.handleLeftClick();
      }
    });

    // 监听鼠标左键按下事件
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) {
        this.handleLeftClick();
      }
    });

    // 监听鼠标左键按下事件
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) {
        this.handleLeftClick();
      }
    });
  }

  addTestItemsToToolbar() {
    // 定义测试物品
    const testItems = [
      { type: 'sword', spriteKey: 'sword_icon', count: 1 },
      { type: 'potion', spriteKey: 'potion_icon', count: 1 },
      { type: 'shield', spriteKey: 'shield_icon', count: 1 }
    ];

    // 将测试物品添加到物品栏的前三个槽位
    for (let i = 0; i < testItems.length; i++) {
      const item = testItems[i];
      const slot = this.toolbar.toolbarSlots[i];
      slot.item = item;
      this.toolbar.updateToolbarSlot(i, item);
    }
  }

  // === AI创建方法 ===
  createAI(type) {
    const ai = this.physics.add.sprite(0, 0, `ai_${type}`);
    ai.setCollideWorldBounds(true);
    ai.setBounce(0.2);

    // AI属性系统
    ai.stats = {
      attack: type === 'sword' ? 10 : type === 'alchemy' ? 5 : 7,
      defense: type === 'sword' ? 5 : type === 'alchemy' ? 10 : 8,
      loyalty: 50,
      type: type
    };

    // 技能系统
    ai.skills = {
      comboAttack: type === 'sword',
      heal: type === 'alchemy',
      shield: type === 'talisman'
    };

    return ai;
  }

  // === UI初始化 ===
  initUI() {
    // 创建UI容器并固定到屏幕
    const uiContainer = this.add.container(0, 0).setScrollFactor(0);

    // 训练按钮（根据AI类型动态生成）
    const trainingTypes = this.getTrainingOptions(this.selectedAIType);
    trainingTypes.forEach(type => {
      const btn = this.add.text(type.x, type.y, `${type.name}\n${this.formatEffect(type.effect)}\n消耗能量：${type.energyCost}`, {
        font: '14px Arial',
        fill: '#FFF',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 }
      })
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerdown', () => this.handleTraining(type));
      uiContainer.add(btn);
    });

    // 属性显示
    this.statsText = this.add.text(50, 50, '', { 
      font: '16px Arial',
      fill: '#FFF' 
    }).setScrollFactor(0);

    this.playerStatsText = this.add.text(50, 100, '', { 
      font: '16px Arial',
      fill: '#00FF00' 
    }).setScrollFactor(0);

    // 消息提示容器
    this.messageContainer = this.add.container(0, 0).setScrollFactor(0);
  }

  // === 获取训练选项 ===
  getTrainingOptions(aiType) {
    if (aiType === 'sword') {
      return [
        { name: '剑道特训', x: 650, y: 50, effect: { attack: 3, loyalty: 5 }, energyCost: 10 },
        { name: '灵气冥想', x: 650, y: 100, effect: { defense: 2, attack: 1 }, energyCost: 5 }
      ];
    } else if (aiType === 'alchemy') {
      return [
        { name: '炼丹术', x: 650, y: 50, effect: { defense: 3, loyalty: 5 }, energyCost: 10 },
        { name: '灵气调和', x: 650, y: 100, effect: { attack: 1, defense: 2 }, energyCost: 5 }
      ];
    } else if (aiType === 'talisman') {
      return [
        { name: '符咒强化', x: 650, y: 50, effect: { attack: 2, defense: 2 }, energyCost: 10 },
        { name: '灵气凝聚', x: 650, y: 100, effect: { attack: 1, defense: 3 }, energyCost: 5 }
      ];
    }
    return [];
  }

  // === 核心游戏循环 ===
  update() {
	  // 检测Esc键按下
	  if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
		// 检查UIScene是否已经启动
		if (!this.scene.isActive('UIScene')) {
		  console.log('Esc键按下，打开UI场景');
		  this.scene.launch('UIScene'); // 启动UI场景
		}
	  }

	  // 玩家移动控制
	  this.handlePlayerMovement();

	  // AI跟随逻辑
	  this.handleAIFollow();

	  // 敌人移动处理
	  this.handleEnemyMovement();

	  // 技能检测
	  this.handleSkills();

	  // === 能量恢复 ===
	  const energyRecoveryRate = 0.5; // 每秒恢复0.5能量
	  this.playerStats.energy = Phaser.Math.Clamp(
		this.playerStats.energy + energyRecoveryRate * this.timeScale * this.game.loop.delta / 1000,
		0,
		this.playerStats.maxEnergy
	  );

	  this.updatePlayerStatsDisplay();
	  
	  // 检测快捷键按下
	  for (let i = 0; i < 10; i++) {
		const key = this.keys[i === 9 ? '0' : i + 1];
		if (key && Phaser.Input.Keyboard.JustDown(key)) {
		  console.log(`快捷键 ${i === 9 ? '0' : i + 1} 被按下`);
		  const slot = this.toolbar.toolbarSlots[i];
		  if (slot && slot.item) {
			this.useItem(slot); // 使用对应槽位中的物品
		  }
		}
	  }
	  
	  // 拖拽过程中，更新被拖拽物品的位置
	  if (this.toolbar.draggedItem && this.toolbar.draggedSlot) {
		this.toolbar.draggedSlot.icon.x = this.input.activePointer.x;
		this.toolbar.draggedSlot.icon.y = this.input.activePointer.y;
	  }
	  
	  // 如果盾牌处于激活状态，更新其位置
	  if (this.isShieldActive && this.shield) {
		this.shield.x = this.player.x;
		this.shield.y = this.player.y;
	  }
	}

  // === 玩家移动处理 ===
  handlePlayerMovement() {
    try {
      const speed = 160;
      this.player.setVelocity(0);

      // 使用方向键或WSAD键移动
      if (this.cursors.left.isDown || (this.keys.left && this.keys.left.isDown)) this.player.setVelocityX(-speed);
      if (this.cursors.right.isDown || (this.keys.right && this.keys.right.isDown)) this.player.setVelocityX(speed);
      if (this.cursors.up.isDown || (this.keys.up && this.keys.up.isDown)) this.player.setVelocityY(-speed);
      if (this.cursors.down.isDown || (this.keys.down && this.keys.down.isDown)) this.player.setVelocityY(speed);
    } catch (error) {
      console.error('键盘输入处理失败:', error);
    }
  }

  // === AI跟随逻辑 ===
  handleAIFollow() {
    if (!this.currentAI) return;

    const distance = Phaser.Math.Distance.Between(
      this.currentAI.x,
      this.currentAI.y,
      this.player.x,
      this.player.y
    );

    if (distance > 100) {
      // 如果距离超过100像素，则AI助手快速移动到玩家位置
      this.currentAI.setVelocity(
        (this.player.x - this.currentAI.x) * 0.5,
        (this.player.y - this.currentAI.y) * 0.5
      );
    } else {
      // 否则，使用线性插值平滑跟随
      const lerpSpeed = 0.1;
      this.currentAI.x = Phaser.Math.Linear(
        this.currentAI.x,
        this.player.x + 50,
        lerpSpeed
      );
      this.currentAI.y = Phaser.Math.Linear(
        this.currentAI.y,
        this.player.y + 50,
        lerpSpeed
      );
      this.currentAI.setVelocity(0, 0);
    }
  }

  // === 敌人移动处理 ===
	handleEnemyMovement() {
	  this.enemies.getChildren().forEach(enemy => {
		// 计算敌人与玩家之间的距离
		const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);

		// 如果距离小于一定值，敌人开始追击玩家
		if (distance < 300) { // 300 是敌人开始追击的距离
		  const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
		  const speed = 100; // 敌人的移动速度
		  enemy.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
		} else {
		  // 否则，敌人随机移动
		  if (Phaser.Math.Between(0, 100) > 95) {
			enemy.setVelocityX(Phaser.Math.Between(-50, 50));
			enemy.setVelocityY(Phaser.Math.Between(-50, 50));
		  }
		}
	  });
	}

  // === 训练系统 ===
  handleTraining(training) {
    // 检查是否有足够的能量
    if (this.playerStats.energy < training.energyCost) {
      this.showMessage('能量不足！', '#FF0000');
      return;
    }

    // 消耗能量
    this.playerStats.energy -= training.energyCost;

    // 应用训练效果
    Object.entries(training.effect).forEach(([stat, value]) => {
      this.currentAI.stats[stat] = Phaser.Math.Clamp(
        this.currentAI.stats[stat] + value,
        0,
        100
      );
    });

    // 技能解锁检查
    if (this.currentAI.stats.attack >= 15 && !this.currentAI.skills.comboAttack) {
      this.currentAI.skills.comboAttack = true;
      this.showUnlockMessage('解锁技能：剑气连斩！');
    }

    this.updateStatsDisplay();
    this.updatePlayerStatsDisplay();
  }

  // === 战斗处理 ===
  handleCombat(ai, enemy) {
	  enemy.disableBody(true, true);
	  this.currentAI.stats.loyalty += 2;
	  this.cameras.main.shake(100, 0.01);
	  this.updateStatsDisplay();
	}

  // === 技能系统 ===
  handleSkills() {
    if (this.currentAI.skills.comboAttack) {
      this.handleComboAttack();
    }
  }

  handleComboAttack() {
    const distance = Phaser.Math.Distance.Between(
      this.currentAI.x,
      this.currentAI.y,
      this.player.x,
      this.player.y
    );

    if (distance < 100) {
      this.currentAI.setVelocityX(200);
      this.time.delayedCall(500, () => {
        this.currentAI.setVelocityX(-200);
      });
    }
  }

  // === 辅助方法 ===
  updateStatsDisplay() {
    const stats = this.currentAI.stats;
    this.statsText.setText([
      `门派：${stats.type}`,
      `攻击：${stats.attack}`,
      `防御：${stats.defense}`,
      `忠诚度：${stats.loyalty}`
    ].join('\n'));
  }

  updatePlayerStatsDisplay() {
    const stats = this.playerStats;
    this.playerStatsText.setText([
      `血量：${stats.hp}/${stats.maxHp}`,
      `能量：${stats.energy}/${stats.maxEnergy}`
    ].join('\n'));
  }

  formatEffect(effect) {
    return Object.entries(effect)
      .map(([k, v]) => `${k}+${v}`)
      .join(' ');
  }

  // 显示消息提示
  showMessage(text, color) {
    const message = this.add.text(
      this.cameras.main.width / 2,  // 水平居中
      this.cameras.main.height - 50,  // 距离底部50像素
      text, 
      {
        font: '16px Arial',
        fill: color,
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
      }
    )
    .setOrigin(0.5, 1)  // 锚点居中底部
    .setScrollFactor(0);
    
    this.messageContainer.add(message);
    this.time.delayedCall(2000, () => message.destroy()); // 2秒后消失
  }

  showUnlockMessage(text) {
    this.add.text(
      this.cameras.main.width / 2,  // 水平居中
      200,  // 距离顶部200像素
      text,
      {
        font: '20px Arial',
        fill: '#FFEB3B',
        stroke: '#000',
        strokeThickness: 2
      }
    )
    .setOrigin(0.5)  // 中心锚点
    .setScrollFactor(0);
  }

  // 使用物品
	useItem(slot) {
	  if (slot.item) {
		switch (slot.item.type) {
		  case 'potion':
			// 仅播放动画，不直接使用药水
			this.usePotion();
			break;

		  case 'sword':
			// 使用剑的逻辑（例如增加攻击力）
			this.playerStats.attack += 10; // 假设增加 10 点攻击力
			this.showMessage('使用了剑，攻击力增加 10 点！', '#00FF00'); // 显示提示信息
			break;

		  case 'shield':
			// 使用盾牌的逻辑（例如增加防御力）
			this.playerStats.defense += 10; // 假设增加 10 点防御力
			this.showMessage('使用了盾牌，防御力增加 10 点！', '#00FF00'); // 显示提示信息
			break;

		  default:
			console.log('未知物品类型:', slot.item.type);
			this.showMessage('未知物品类型，无法使用！', '#FF0000'); // 显示错误提示
		}
	  } else {
		console.log('槽位中没有物品');
		this.showMessage('槽位中没有物品！', '#FF0000'); // 显示错误提示
	  }
	}
  
  // === 处理玩家与敌人的碰撞 ===
  handlePlayerEnemyCollision(player, enemy) {
	  console.log('玩家与敌人碰撞'); // 添加日志
	  console.log('玩家血量:', this.playerStats.hp); // 添加日志
	  console.log('敌人位置:', enemy.x, enemy.y); // 添加日志

	  // 如果已经触发过碰撞，且未过冷却时间，则直接返回
	  if (this.collisionCooldown) return;

	  // 玩家扣血
	  this.playerStats.hp -= 10; // 每次碰撞扣10点血
	  this.updatePlayerStatsDisplay();

	  // 如果玩家血量小于等于0，退出游戏
	  if (this.playerStats.hp <= 0) {
		this.playerStats.hp = 0;
		this.updatePlayerStatsDisplay();
		this.gameOver();
	  }

	  // 敌人被击退
	  const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
	  enemy.setVelocity(-Math.cos(angle) * 200, -Math.sin(angle) * 200);

	  // 设置冷却时间
	  this.collisionCooldown = true;
	  this.time.delayedCall(1000, () => { // 1秒后重置冷却时间
		this.collisionCooldown = false;
	  });
	}
	
	// === 游戏结束逻辑 ===
	gameOver() {
	  console.log('游戏结束，返回开始界面'); // 添加日志
	  console.log('玩家血量:', this.playerStats.hp); // 添加日志
	  this.scene.stop(SCENE_KEYS.MAIN); // 停止主场景
	  this.scene.start(SCENE_KEYS.START); // 返回开始场景
	}
  
  handleLeftClick() {
	  const selectedSlot = this.toolbar.toolbarSlots[this.toolbar.selectedSlotIndex];
	  if (selectedSlot && selectedSlot.item) {
		switch (selectedSlot.item.type) {
		  case 'sword':
			this.swingSword();
			break;
		  case 'shield':
			this.useShield();
			break;
		  case 'potion':
			this.usePotion(); // 仅播放动画，不直接使用
			break;
		  default:
			console.log('未知物品类型:', selectedSlot.item.type);
		}
	  }
	}
  
  // 挥动剑
  swingSword() {
	  if (this.isSwingingSword) return; // 如果剑正在挥动，则不再重复触发

	  const selectedSlot = this.toolbar.toolbarSlots[this.toolbar.selectedSlotIndex];
	  if (selectedSlot && selectedSlot.item) {
		this.isSwingingSword = true;

		// 创建剑的贴图
		const sword = this.add.sprite(this.player.x, this.player.y, 'sword_icon')
		  .setOrigin(0.5, 1) // 设置旋转中心为剑柄
		  .setDepth(1000);

		// 挥动动画
		this.tweens.add({
		  targets: sword,
		  angle: 90, // 旋转角度
		  duration: 200, // 动画时长
		  ease: 'Power2',
		  onComplete: () => {
			sword.destroy(); // 动画结束后销毁剑
			this.isSwingingSword = false;
			this.dealDamageToEnemies(); // 对敌人造成伤害
		  }
		});

		this.showMessage('使用了剑，对敌人造成 10 点伤害！', '#00FF00'); // 显示提示信息
	  }
	}
  
	// 使用药水（仅播放动画，不直接使用）
	usePotion() {
	  if (this.isUsingPotion) return; // 如果药水正在使用，则不再重复触发

	  const selectedSlot = this.toolbar.toolbarSlots[this.toolbar.selectedSlotIndex];
	  if (selectedSlot && selectedSlot.item) {
		this.isUsingPotion = true;

		// 创建药水的贴图
		const potion = this.add.sprite(this.player.x, this.player.y, 'potion_icon')
		  .setOrigin(0.5, 1) // 设置旋转中心
		  .setDepth(1000);

		// 药水使用动画
		this.tweens.add({
		  targets: potion,
		  y: this.player.y - 50, // 向上移动
		  scaleX: 1.5, // 放大
		  scaleY: 1.5, // 放大
		  duration: 300, // 动画时长
		  ease: 'Power2',
		  onComplete: () => {
			potion.destroy(); // 动画结束后销毁药水
			this.isUsingPotion = false;
			this.healPlayer(); // 恢复玩家血量
		  }
		});

		this.showMessage('使用了药水，血量恢复 20 点！', '#00FF00'); // 显示提示信息
	  }
	}

  // 恢复玩家血量（手动调用）
	healPlayer() {
	  const selectedSlot = this.toolbar.toolbarSlots[this.toolbar.selectedSlotIndex];
	  if (selectedSlot && selectedSlot.item) {
		this.playerStats.hp = Math.min(this.playerStats.hp + 20, this.playerStats.maxHp);
		selectedSlot.item.count--; // 减少药水数量
		if (selectedSlot.item.count <= 0) {
		  selectedSlot.item = null; // 如果数量为0，清空槽位
		}
		this.toolbar.updateToolbarSlot(this.toolbar.selectedSlotIndex, selectedSlot.item); // 更新槽位显示
		this.updatePlayerStatsDisplay(); // 更新玩家属性显示
		this.showMessage('使用了药水，血量恢复 20 点！', '#00FF00'); // 显示提示信息
	  }
	}
  
  // 使用盾牌
  useShield() {
	  const selectedSlot = this.toolbar.toolbarSlots[this.toolbar.selectedSlotIndex];
	  if (selectedSlot && selectedSlot.item) {
		if (!this.isShieldActive) {
		  this.isShieldActive = true;
		  this.shieldDurability = 100; // 盾牌初始耐久度

		  // 创建盾牌的贴图
		  this.shield = this.add.sprite(this.player.x, this.player.y, 'shield_icon')
			.setDepth(1000) // 显示盾牌贴图
			.setScale(0.5); // 初始缩放

		  // 盾牌激活动画
		  this.tweens.add({
			targets: this.shield,
			scaleX: 1, // 放大到正常大小
			scaleY: 1, // 放大到正常大小
			duration: 300, // 动画时长
			ease: 'Power2',
			onComplete: () => {
			  // 动画结束后，盾牌保持激活状态
			  this.showMessage('盾牌已激活，防御力提升！', '#00FF00'); // 显示提示信息
			}
		  });

		  // 更新盾牌位置的逻辑
		  this.update = () => {
			if (this.isShieldActive && this.shield) {
			  this.shield.x = this.player.x;
			  this.shield.y = this.player.y;
			}
		  };
		} else {
		  this.showMessage('盾牌已经激活！', '#FF0000'); // 显示提示信息
		}
	  }
	}

  // 对敌人造成伤害
  dealDamageToEnemies() {
    this.enemies.getChildren().forEach(enemy => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < 100) {
        enemy.stats.hp -= 10; // 假设每次攻击造成 10 点伤害
        if (enemy.stats.hp <= 0) {
          enemy.disableBody(true, true); // 如果敌人血量 <= 0，销毁敌人
        }
        this.updateEnemyStatsDisplay(enemy); // 更新敌人血条
      }
    });
  }
}

// 导出 MainScene 类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MainScene;
}