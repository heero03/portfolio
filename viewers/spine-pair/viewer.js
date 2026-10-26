'use strict';
(() => {
  const canvas = document.getElementById('player');
  const progress = document.getElementById('progress');
  const message = document.getElementById('message');
  document.getElementById('retry').addEventListener('click', () => location.reload());
  canvas.addEventListener('pointerdown', () => canvas.focus({preventScroll:true}));
  function fail(error) {
    document.documentElement.dataset.state = 'error';
    message.textContent = '뷰어를 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
    document.getElementById('retry').hidden = false;
    console.error(error);
  }
  async function start() {
    const response = await fetch('build.json', {cache:'no-cache'});
    if (!response.ok) throw Error('Build manifest HTTP ' + response.status);
    const build = await response.json();
    for (const kind of ['loader','data','framework','code']) {
      if (!/^Build\/[a-zA-Z0-9.]+$/.test(build.files[kind]?.url)) throw Error('Invalid build file');
    }
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = build.files.loader.url;
      script.onload = resolve;
      script.onerror = () => reject(Error('Player loader failed'));
      document.head.append(script);
    });
    await createUnityInstance(canvas, {
      dataUrl:build.files.data.url,frameworkUrl:build.files.framework.url,codeUrl:build.files.code.url,
      companyName:'Portfolio',productName:'Spine Illustration Pair Viewer',productVersion:build.version,
      matchWebGLToCanvasSize:true,devicePixelRatio:Math.min(window.devicePixelRatio || 1,2),
      showBanner:(text,type) => { if(type === 'error') fail(Error(text)); }
    }, value => { progress.value = value; });
    if (document.documentElement.dataset.state !== 'error') document.documentElement.dataset.state = 'ready';
  }
  start().catch(fail);
})();
