type UpdateTween = () => void;
class Tweener {
  private tweens: UpdateTween[] = [];

  tweenProperty(
    totalFrames: number,
    startValue: number,
    endValue: number,
    ease: (x: number) => number,
    update: (x: number) => void,
    onComplete?: () => void,
  ): void {
    const { tweens } = this;
    let frameCounter = 0;
    const tween = () => {
      if (frameCounter < totalFrames) {
        const normalizedTime = frameCounter / totalFrames,
          curvedTime = ease(normalizedTime);
        update(endValue * curvedTime + startValue * (1 - curvedTime));
        frameCounter += 1;
      } else {
        if (onComplete) onComplete();
        tweens.splice(tweens.indexOf(tween), 1);
      }
    };
    tweens.push(tween);
  }

  update(dt: number): void {
    const { tweens } = this;
    if (tweens.length > 0) {
      for (let updateTween: UpdateTween, i = tweens.length - 1; i >= 0; i--) {
        updateTween = tweens[i];
        if (updateTween) updateTween();
      }
    }
  }
}

export const tweener = new Tweener();
