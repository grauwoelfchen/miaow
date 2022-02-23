import { CanvasUtility } from './canvas';
import { Shot } from './shot';
import { User } from './user';
import { Friend } from './friend';
import { Manager } from './manager';

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

  const USER_SHOT_MAX: number = 6;
  const FRIEND_MAX: number = 9;
  const FRIEND_SHOT_MAX: number = 55;

  let util: CanvasUtility;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let manager: Manager;

  let user: User;

  // shots
  const hearts: Shot[] = [];
  const winks: { left: Shot[], right: Shot[] } = {
    left:  []
  , right: []
  };

  // friends
  const friends: Friend[] = [];
  const friendHearts: Shot[] = [];

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

    manager = new Manager();

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

    user = new User(ctx, 0, 0, 64, 64, './img/cat.png');
    const x = (CANVAS_WIDTH / 2);
    user.setComming(
      x
    , CANVAS_HEIGHT
    , x
    , CANVAS_HEIGHT - 100
    );

    // shots
    for (let i = 0; i < USER_SHOT_MAX; ++i) {
      hearts[i] = new Shot(ctx, 0, 0, 32, 32, './img/heart.png');
      winks.left[i]  = new Shot(ctx, 0, 0, 16, 16, './img/wink.png');
      winks.right[i] = new Shot(ctx, 0, 0, 16, 16, './img/wink.png');
    }
    user.setHearts(hearts);
    user.setWinks(winks);

    for (let k = 0; k < FRIEND_SHOT_MAX; ++k) {
      friendHearts[k] = new Shot(ctx, 0, 0, 32, 32, './img/heart.png');
    }

    // friends
    for (let j = 0; j < FRIEND_MAX; ++j) {
      friends[j] = new Friend(ctx, 0, 0, 48, 48, './img/friend.png');
      friends[j].setHearts(friendHearts);
    }
  }

  function loaded() {
    let ready = true;
    ready = ready && user.isReady();

    // shots
    hearts.map((h) => {
      ready = ready && h.isReady();
    });
    winks.left.map((w) => {
      ready = ready && w.isReady();
    });
    winks.right.map((w) => {
      ready = ready && w.isReady();
    });

    friendHearts.map((fh) => {
      ready = ready && fh.isReady();
    });

    friends.map((f) => {
      ready = ready && f.isReady();
    });

    if (ready === true) {
      configureEvents();
      configureScenes();
      render();
    } else {
      setTimeout(loaded, 100);
    }
  }

  function configureEvents() {
    window.addEventListener('keydown', (e) => {
      window.KeyDown[e.key] = true;
    }, false);
    window.addEventListener('keyup', (e) => {
      window.KeyDown[e.key] = false;
    }, false);
  }

  function configureScenes() {
    manager.registerScene('start', (_: number) => {
      if (user.isAllSet()) {
        manager.switchScene('stroll');
      }
    });
    manager.registerScene('stroll', (_: number) => {
      if (manager.frame === 0) {
        for (let i = 0; i < FRIEND_MAX; ++i) {
          // encounter
          if (friends[i].isCharmed()) {
            const c = friends[i];
            const h = c.getHeight();

            // TODO
            c.set(CANVAS_WIDTH / 2, -h, 1);
            c.setVector(0.0, 1.0);

            break;
          }
        }
      } else if (manager.frame >= 128) {
        manager.switchScene('stroll');
      }
    });
    manager.switchScene('start');
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

    friends.map((f) => {
      f.update();
    });

    friendHearts.map((fh) => {
      fh.update();
    });

    manager.update();

    const s = document.getElementById('scene');
    if (s != null) {
      s.innerText = manager.getCurrentSceneName();
    }

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
