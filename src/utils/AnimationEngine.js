import { BlockTypes } from '../components/BlockSystem';

export class AnimationEngine {
  constructor(dispatch, state) {
    this.dispatch = dispatch;
    this.state = state;
    this.animationIntervals = new Map();
    this.speechBubbles = new Map();
  }

  // Execute a single block
  async executeBlock(spriteId, block) {
    const sprite = this.state.sprites.find(s => s.id === spriteId);
    if (!sprite) return;

    const blockConfig = Object.values(BlockTypes)
      .flatMap(category => Object.values(category))
      .find(config => config.id === block.type);

    if (!blockConfig) return;

    switch (block.type) {
      case 'move_steps':
        await this.moveSteps(spriteId, block.inputs[0]);
        break;
      case 'turn_degrees':
        await this.turnDegrees(spriteId, block.inputs[0]);
        break;
      case 'turn_degrees_counter':
        await this.turnDegrees(spriteId, -block.inputs[0]);
        break;
      case 'go_to_xy':
        await this.goToXY(spriteId, block.inputs[0], block.inputs[1]);
        break;
      case 'say_for_seconds':
        await this.sayForSeconds(spriteId, block.inputs[0], block.inputs[1]);
        break;
      case 'think_for_seconds':
        await this.thinkForSeconds(spriteId, block.inputs[0], block.inputs[1]);
        break;
      case 'repeat':
        await this.repeatBlocks(spriteId, block.inputs[0], block.nestedBlocks || []);
        break;
    }
  }

  // Execute all blocks for a sprite
  async executeSpriteBlocks(spriteId) {
    const sprite = this.state.sprites.find(s => s.id === spriteId);
    if (!sprite || sprite.blocks.length === 0) return;

    this.dispatch({
      type: 'SET_SPRITE_ANIMATING',
      payload: { spriteId, isAnimating: true }
    });

    try {
      await this.executeBlocksSequentially(spriteId, sprite.blocks);
    } finally {
      this.dispatch({
        type: 'SET_SPRITE_ANIMATING',
        payload: { spriteId, isAnimating: false }
      });
    }
  }

  // Execute blocks sequentially
  async executeBlocksSequentially(spriteId, blocks) {
    for (const block of blocks) {
      if (block.type === 'repeat') {
        await this.repeatBlocks(spriteId, block.inputs[0], block.nestedBlocks || []);
      } else {
        await this.executeBlock(spriteId, block);
      }
      
      // Check for collisions after each block
      this.checkCollisions();
      
      // Small delay between blocks for smooth animation
      await this.delay(100);
    }
  }

  // Motion animations
  async moveSteps(spriteId, steps) {
    const sprite = this.state.sprites.find(s => s.id === spriteId);
    if (!sprite) return;

    const radians = (sprite.direction * Math.PI) / 180;
    const newX = sprite.x + steps * Math.cos(radians);
    const newY = sprite.y + steps * Math.sin(radians);

    // Animate the movement
    const duration = 500; // 500ms
    const stepsCount = 20;
    const stepDuration = duration / stepsCount;
    const deltaX = (newX - sprite.x) / stepsCount;
    const deltaY = (newY - sprite.y) / stepsCount;

    for (let i = 0; i < stepsCount; i++) {
      this.dispatch({
        type: 'UPDATE_SPRITE_POSITION',
        payload: {
          spriteId,
          x: sprite.x + deltaX * (i + 1),
          y: sprite.y + deltaY * (i + 1)
        }
      });
      await this.delay(stepDuration);
    }
  }

  async turnDegrees(spriteId, degrees) {
    const sprite = this.state.sprites.find(s => s.id === spriteId);
    if (!sprite) return;

    const newDirection = (sprite.direction + degrees) % 360;
    
    // Animate the turn
    const duration = 300;
    const stepsCount = 15;
    const stepDuration = duration / stepsCount;
    const deltaDegrees = degrees / stepsCount;

    for (let i = 0; i < stepsCount; i++) {
      this.dispatch({
        type: 'UPDATE_SPRITE_DIRECTION',
        payload: {
          spriteId,
          direction: sprite.direction + deltaDegrees * (i + 1)
        }
      });
      await this.delay(stepDuration);
    }
  }

  async goToXY(spriteId, x, y) {
    const sprite = this.state.sprites.find(s => s.id === spriteId);
    if (!sprite) return;

    // Animate the movement to target position
    const duration = 800;
    const stepsCount = 25;
    const stepDuration = duration / stepsCount;
    const deltaX = (x - sprite.x) / stepsCount;
    const deltaY = (y - sprite.y) / stepsCount;

    for (let i = 0; i < stepsCount; i++) {
      this.dispatch({
        type: 'UPDATE_SPRITE_POSITION',
        payload: {
          spriteId,
          x: sprite.x + deltaX * (i + 1),
          y: sprite.y + deltaY * (i + 1)
        }
      });
      await this.delay(stepDuration);
    }
  }

  // Looks animations
  async sayForSeconds(spriteId, message, seconds) {
    this.showSpeechBubble(spriteId, message, 'say');
    await this.delay(seconds * 1000);
    this.hideSpeechBubble(spriteId);
  }

  async thinkForSeconds(spriteId, message, seconds) {
    this.showSpeechBubble(spriteId, message, 'think');
    await this.delay(seconds * 1000);
    this.hideSpeechBubble(spriteId);
  }

  // Control blocks
  async repeatBlocks(spriteId, times, nestedBlocks) {
    for (let i = 0; i < times; i++) {
      await this.executeBlocksSequentially(spriteId, nestedBlocks);
    }
  }

  // Utility methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showSpeechBubble(spriteId, message, type) {
    this.speechBubbles.set(spriteId, { message, type, visible: true });
  }

  hideSpeechBubble(spriteId) {
    this.speechBubbles.set(spriteId, { visible: false });
  }

  getSpeechBubble(spriteId) {
    return this.speechBubbles.get(spriteId);
  }

  // Collision detection
  checkCollisions() {
    const sprites = this.state.sprites;
    const collisions = [];

    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        const sprite1 = sprites[i];
        const sprite2 = sprites[j];

        const distance = Math.sqrt(
          Math.pow(sprite1.x - sprite2.x, 2) + Math.pow(sprite1.y - sprite2.y, 2)
        );

        // Touch-based collision threshold (more sensitive)
        const collisionThreshold = 65; // Increased for easier touching

        if (distance < collisionThreshold) {
          // Check if this collision hasn't been processed recently
          const collisionKey = `${sprite1.id}-${sprite2.id}`;
          const lastCollision = this.lastCollisionTime?.get(collisionKey);
          const now = Date.now();
          
          if (!lastCollision || now - lastCollision > 2000) { // 2 second cooldown
            collisions.push({ sprite1: sprite1.id, sprite2: sprite2.id });
            
            if (!this.lastCollisionTime) {
              this.lastCollisionTime = new Map();
            }
            this.lastCollisionTime.set(collisionKey, now);
          }
        }
      }
    }

    if (collisions.length > 0) {
      this.dispatch({
        type: 'DETECT_COLLISION',
        payload: collisions
      });

      // Trigger animation swap for each collision
      collisions.forEach(collision => {
        this.swapAnimations(collision.sprite1, collision.sprite2);
      });
    }
  }

  swapAnimations(sprite1Id, sprite2Id) {
    this.dispatch({
      type: 'SWAP_ANIMATIONS',
      payload: { sprite1Id, sprite2Id }
    });
  }

  // Start all animations
  async startAllAnimations() {
    const sprites = this.state.sprites.filter(sprite => sprite.blocks.length > 0);
    
    // Execute all sprite animations in parallel
    const promises = sprites.map(sprite => this.executeSpriteBlocks(sprite.id));
    await Promise.all(promises);
  }

  // Stop all animations
  stopAllAnimations() {
    this.animationIntervals.forEach(interval => clearInterval(interval));
    this.animationIntervals.clear();
    this.speechBubbles.clear();
  }
}
