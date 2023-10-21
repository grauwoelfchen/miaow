import { CanvasUtility } from './canvas';
import { Shot } from './shot';
import { User } from './user';
import { Friend } from './friend';
import { Dispersion } from './effect';
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

  const DISPERSION_MAX: number = 10;

  let _util: CanvasUtility;
  let _canvas: HTMLCanvasElement;
  let _ctx: CanvasRenderingContext2D;

  let _manager: Manager;

  let restart: boolean = false;

  // user
  let _user: User;
  const _userBites: Shot[] = [];
  const _userWinks: { left: Shot[], right: Shot[] } = {
    left:  []
  , right: []
  };

  // friends
  let _friends: Friend[];
  const _friendBites: Shot[] = [];

  // effects
  const _dispersions: Dispersion[] = [];

  window.addEventListener('load', () => {
    _util = new CanvasUtility(document.querySelector('#canvas'));

    if (_util.canvas != null) {
      _canvas = _util.canvas;
    }
    if (_util.context != null) {
      _ctx = _util.context;
    }

    initialize();
    loaded();
  }, false);

  function initialize() {
    _canvas.width = CANVAS_WIDTH;
    _canvas.height = CANVAS_HEIGHT;

    _manager = new Manager();

    const audio = new Audio('./music.mp3');
    audio.loop = true;
    audio.volume = 0.6;

    const soundCheck =
      document.getElementById('sound_check') as HTMLInputElement;
    if (soundCheck != null) {
      soundCheck.checked = false;
      const sound = document.getElementById('sound');
      if (sound != null) {
        sound.hidden = true;

        const play = document.querySelector('#sound button#play')
            , pause = document.querySelector('#sound button#pause')
            ;
        if ((play != null) && (pause != null)) {
          play.addEventListener('click', () => {
            audio.play();
            play.setAttribute('disabled', 'true');
            pause.removeAttribute('disabled');
          });

          pause.addEventListener('click', () => {
            play.removeAttribute('disabled');
            pause.setAttribute('disabled', 'true');
            audio.pause();
          });
        }

        const volume =
          document.querySelector('#sound input#volume') as HTMLInputElement;
        if (volume != null) {
          volume.addEventListener('input', () => {
            const v = parseInt(volume.value, 10);
            audio.volume = (v / 100);
          });
        }

        soundCheck.addEventListener('change', () => {
          if (soundCheck.checked) {
            sound.hidden = false;
          } else {
            sound.hidden = true;
          }
        });
      }
    }

    const statsCheck =
      document.getElementById('stats_check') as HTMLInputElement;
    if (statsCheck != null) {
      statsCheck.checked = false;
      const stats = document.getElementById('stats');
      if (stats != null) {
        stats.hidden = true;
        statsCheck.addEventListener('change', () => {
          if (statsCheck.checked) {
            stats.hidden = false;
          } else {
            stats.hidden = true;
          }
        });
      }
    }

    // effects
    for (let l = 0; l < DISPERSION_MAX; ++l) {
      _dispersions[l] = new Dispersion(_ctx, 50.0, 15, 30.0, 0.25);
    }

    _user = new User(_ctx, 0, 0, 64, 64, './img/cat.png');
    const x = (CANVAS_WIDTH / 2);
    _user.setComming(
      x
    , CANVAS_HEIGHT
    , x
    , CANVAS_HEIGHT - 100
    );

    // friends
    _friends = [];
    for (let k = 0; k < FRIEND_SHOT_MAX; ++k) {
      _friendBites[k] = new Shot(_ctx, 0, 0, 32, 32, './img/heart.png');
      _friendBites[k].setTargets([_user]);
      _friendBites[k].setEffects(_dispersions);
    }

    for (let j = 0; j < FRIEND_MAX; ++j) {
      _friends[j] = new Friend(_ctx, 0, 0, 48, 48, './img/friend.png');
      _friends[j].setBites(_friendBites);
    }

    // shots
    for (let i = 0; i < USER_SHOT_MAX; ++i) {
      _userBites[i] = new Shot(_ctx, 0, 0, 32, 32, './img/heart.png');
      _userBites[i].setTargets(_friends);
      _userBites[i].setEffects(_dispersions);
      _userWinks.left[i]  = new Shot(_ctx, 0, 0, 16, 16, './img/wink.png');
      _userWinks.left[i].setTargets(_friends);
      _userWinks.left[i].setEffects(_dispersions);
      _userWinks.right[i] = new Shot(_ctx, 0, 0, 16, 16, './img/wink.png');
      _userWinks.right[i].setTargets(_friends);
      _userWinks.right[i].setEffects(_dispersions);
    }
    _user.setBites(_userBites);
    _user.setWinks(_userWinks);
  }

  function loaded() {
    let ready = true;
    ready = ready && _user.isReady();

    // shots

    // user
    _userBites.map((b: Shot) => {
      ready = ready && b.isReady();
    });
    _userWinks.left.map((w: Shot) => {
      ready = ready && w.isReady();
    });
    _userWinks.right.map((w: Shot) => {
      ready = ready && w.isReady();
    });

    // friends
    _friendBites.map((b: Shot) => {
      ready = ready && b.isReady();
    });
    _friends.map((f: Friend) => {
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
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      window.KeyDown[e.key] = true;
    }, false);
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      window.KeyDown[e.key] = false;
    }, false);
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      window.KeyDown[e.key] = true;
      console.log(e.key);
      if (e.key === 'Enter') {
        if (_user.getLife() <= 0) {
          restart = true;
        }
      }
    }, false);
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      window.KeyDown[e.key] = false;
    }, false);
  }

  function configureScenes() {
    _manager.registerScene('gameover', (_: number) => {
      const textWidth = CANVAS_WIDTH / 2;
      const textHeight = CANVAS_HEIGHT / 1.85;

      const x: number = (CANVAS_WIDTH - textWidth) / 2;
      let y: number = CANVAS_HEIGHT - (_manager.frame * 2);
      if (y <= textHeight) {
        y = textHeight;
      }

      _ctx.font = 'bold 64px monospace';
      _util.drawText('GAME OVER', x, y, '#6ea2bd', textWidth);

      if (restart) {
        restart = false;
        _user.setComming(
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT + 50,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT - 100,
        );
        _manager.switchScene('start');
      }
    });
    _manager.registerScene('start', (_: number) => {
      if (_user.isAllSet()) {
        _manager.switchScene('stroll');
      }
    });
    _manager.registerScene('stroll', (_: number) => {
      if (_manager.frame === 0) {
        for (let i = 0; i < FRIEND_MAX; ++i) {
          // encounter
          if (_friends[i].isCharmed()) {
            const f = _friends[i];

            f.set(CANVAS_WIDTH / 2, -f.height, 2);
            f.setVector(0.0, 1.0);

            break;
          }
        }
      } else if (_manager.frame >= 128) {
        _manager.switchScene('stroll');
      } else if (_user.getLife() <= 0) {
        _manager.switchScene('gameover');
      }
    });
    _manager.switchScene('start');
  }

  function render() {
    _ctx.globalAlpha = 1.0;
    _util.drawRect(0, 0, _canvas.width, _canvas.height, '#f3f3f3');

    _dispersions.map((e: Dispersion) => {
      e.update();
    });

    _user.update();

    _userBites.map((b: Shot) => {
      b.update();
    });

    _userWinks.left.map((w: Shot) => {
      w.update();
    });
    _userWinks.right.map((w: Shot) => {
      w.update();
    });

    _friends.map((f: Friend) => {
      f.update();
    });
    _friendBites.map((b: Shot) => {
      b.update();
    });

    _manager.update();

    const s = document.getElementById('scene');
    if (s != null) {
      s.innerText = _manager.getCurrentSceneName();
    }

    const t = document.getElementById('time');
    if (t != null) {
      t.innerText = _user.totalTime();
    }

    const ts = document.getElementById('total_shots');
    if (ts != null) {
      ts.innerText = _user.totalShotsCount();
    }

    const as = document.getElementById('active_shots');
    if (as != null) {
      as.innerText = _user.activeShotsCount();
    }

    const d = document.getElementById('distance');
    if (d != null) {
      d.innerText = _user.totalDistance();
    }

    // e.g. 60 times per 1 seconds
    requestAnimationFrame(render);
  }
})();
