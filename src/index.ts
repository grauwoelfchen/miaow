import { CanvasUtility } from './canvas';
import { Shot } from './shot';
import { User } from './user';

import './style.styl';

declare global {
  interface Window {
    KeyDown: { [key: string]: boolean };
  }
}

(() => {
  window.KeyDown = {};

  const CANVAS_WIDTH: number = 640;
  const CANVAS_HEIGHT: number = 480;

  const SHOT_MAX: number = 6;

  let util: CanvasUtility;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let user: User;

  // shots
  const hearts: Shot[] = [];
  const winks: { left: Shot[], right: Shot[] } = {
    left:  []
  , right: []
  };

  window.addEventListener('load', () => {
    util = new CanvasUtility(document.querySelector('#canvas'));

    if (util.canvas != null) {
      canvas = util.canvas;
    }
    if (util.context != null) {
      ctx = util.context;
    }

    initialize();
    loaded();
  }, false);

  function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const check = document.getElementById('stats_check') as HTMLInputElement;
    if (check != null) {
      check.checked = false;
      const stats = document.getElementById('stats');
      if (stats != null) {
        stats.hidden = true;
        check.addEventListener('change', () => {
          if (check.checked) {
            stats.hidden = false;
          } else {
            stats.hidden = true;
          }
        });
      }
    }

    user = new User(ctx, 0, 0, 64, 64, './img/user.png');
    const x = (CANVAS_WIDTH / 2);
    user.setComming(
      x
    , CANVAS_HEIGHT
    , x
    , CANVAS_HEIGHT - 100
    );

    for (let i = 0; i < SHOT_MAX; ++i) {
      hearts[i] = new Shot(ctx, 0, 0, 32, 32, './img/heart.png');
      winks.left[i]  = new Shot(ctx, 0, 0, 16, 16, './img/wink.png');
      winks.right[i] = new Shot(ctx, 0, 0, 16, 16, './img/wink.png');
    }
    user.setHearts(hearts);
    user.setWinks(winks);
  }

  function loaded() {
    let ready = true;
    ready = ready && user.isReady();

    hearts.map((h) => {
      ready = ready && h.isReady();
    });

    winks.left.map((w) => {
      ready = ready && w.isReady();
    });
    winks.right.map((w) => {
      ready = ready && w.isReady();
    });

    if (ready === true) {
      eventSetting();
      render();
    } else {
      setTimeout(loaded, 100);
    }
  }

  function eventSetting() {
    window.addEventListener('keydown', (e) => {
      window.KeyDown[e.key] = true;
    }, false);
    window.addEventListener('keyup', (e) => {
      window.KeyDown[e.key] = false;
    }, false);
  }

  function render() {
    ctx.globalAlpha = 1.0;
    util.drawRect(0, 0, canvas.width, canvas.height, '#f3f3f3');

    user.update();

    hearts.map((h) => {
      h.update();
    });

    winks.left.map((w) => {
      w.update();
    });
    winks.right.map((w) => {
      w.update();
    });

    const t = document.getElementById('time');
    if (t != null) {
      t.innerText = user.totalTime();
    }

    const ts = document.getElementById('total_shots');
    if (ts != null) {
      ts.innerText = user.totalShotsCount();
    }

    const as = document.getElementById('active_shots');
    if (as != null) {
      as.innerText = user.activeShotsCount();
    }

    const d = document.getElementById('distance');
    if (d != null) {
      d.innerText = user.totalDistance();
    }

    // e.g. 60 times per 1 seconds
    requestAnimationFrame(render);
  }
})();
