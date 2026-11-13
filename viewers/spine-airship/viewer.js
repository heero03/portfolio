'use strict';
(async () => {
  const canvas = document.getElementById('player');
  const progress = document.getElementById('progress');
  const retry = document.getElementById('retry');
  retry.addEventListener('click', () => location.reload());
  canvas.addEventListener('pointerdown', () => canvas.focus({preventScroll:true}));
  function fail(error) {
    document.documentElement.dataset.state = 'error';
    document.getElementById('message').textContent = '뷰어를 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
    retry.hidden = false;
    console.error(error);
  }
  try {
    const response = await fetch('build.json', {cache:'no-cache'});
    if (!response.ok) throw Error('Build manifest HTTP ' + response.status);
    const build = await response.json();
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = build.files.loader.url;
      script.onload = resolve;
      script.onerror = () => reject(Error('Could not load the WebGL player'));
      document.head.append(script);
    });
    window.airshipPlayer = await createUnityInstance(canvas, {
      dataUrl:build.files.data.url, frameworkUrl:build.files.framework.url, codeUrl:build.files.code.url,
      companyName:'Portfolio', productName:'Airship - Spine Pickup Illustration', productVersion:build.version,
      matchWebGLToCanvasSize:true, devicePixelRatio:Math.min(devicePixelRatio || 1,2),
      showBanner:(message,type) => { if (type === 'error') fail(Error(message)); }
    }, value => { progress.value = value; });
    if (document.documentElement.dataset.state !== 'error') document.documentElement.dataset.state = 'ready';
  } catch (error) { fail(error); }
})();
