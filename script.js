// 轻交互：滚动出现、返回顶部、平滑锚点、浮动爱心动画

document.addEventListener('DOMContentLoaded', function () {
  const reveals = document.querySelectorAll('.reveal');
  const topBtn = document.querySelector('.back-to-top');
  const sky = document.getElementById('sky');
  const site = document.querySelector('.site');
  const overlay = document.querySelector('.envelope-overlay');
  const startBtn = document.querySelector('.envelope__start');
  const postmark = document.querySelector('.postmark');
  
  // 背景音乐控制（播放列表）
  const backgroundMusic = document.getElementById('backgroundMusic');
  const musicToggle = document.getElementById('musicToggle');
  const playIcon = musicToggle.querySelector('.play-icon');
  const pauseIcon = musicToggle.querySelector('.pause-icon');
  const songInfo = document.querySelector('.current-song');
  let musicInitialized = false;
  
  // 播放列表配置
  const playlist = [
    { mp3: 'https://cdn3.easylink.cc/847b4ff2-dffa-49ae-b86a-fca9d9e743f8_background-sound1.mp3?e=1756442928&token=J_WyMIdhZtwb0E0QHWRqEfQrd5lVSWLffl9QxaxP:X7d5OqS6p8Wl6TPJ9NjfOsBgb8c=', ogg: 'audio/background-sound1.ogg', wav: 'audio/background-sound1.wav' },
    { mp3: 'https://cdn3.easylink.cc/9ca15ee3-35b3-4f57-9846-b7b73f615989_background-sound2.mp3?e=1756443095&token=J_WyMIdhZtwb0E0QHWRqEfQrd5lVSWLffl9QxaxP:-tIEb5_5yM5V8gweuo5wdge5Cc8=', ogg: 'audio/background-sound2.ogg', wav: 'audio/background-sound2.wav' },
    { mp3: 'https://cdn3.easylink.cc/3611bf04-e514-42a4-bdc5-200c3f793c21_background-sound3.mp3?e=1756443187&token=J_WyMIdhZtwb0E0QHWRqEfQrd5lVSWLffl9QxaxP:_Z1hcN7LbiiK2TqoP5Qp_ZafQHg=', ogg: 'audio/background-sound3.ogg', wav: 'audio/background-sound3.wav' }
  ];
  let currentSongIndex = 0;
  let userPaused = false; // 用户手动控制状态
  
  // 加载指定歌曲
  function loadSong(index) {
    if (backgroundMusic && playlist[index]) {
      const song = playlist[index];
      console.log('正在加载歌曲:', index + 1, song.mp3);
      backgroundMusic.innerHTML = `
        <source src="${song.mp3}" type="audio/mpeg">
        <source src="${song.ogg}" type="audio/ogg">
        <source src="${song.wav}" type="audio/wav">
        您的浏览器不支持音频播放。
      `;
      backgroundMusic.load();
      
      // 添加错误监听
      backgroundMusic.addEventListener('error', (e) => {
        console.error('音频加载错误:', e);
        console.error('当前音频源:', backgroundMusic.currentSrc);
      });
      
      // 添加成功加载监听
      backgroundMusic.addEventListener('canplaythrough', () => {
        console.log('音频加载成功，可以播放');
      });
      
      if (songInfo) {
        songInfo.textContent = `Song ${index + 1}/3`;
      }
    }
  }
  
  // 检查音频文件是否存在
  function checkAudioFiles() {
    console.log('检查音频文件是否存在...');
    
    const testAudio = new Audio();
    const requiredFiles = [
      'audio/background-sound1.mp3',
      'audio/background-sound2.mp3', 
      'audio/background-sound3.mp3'
    ];
    
    let filesExist = 0;
    
    requiredFiles.forEach((file, index) => {
      fetch(file, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            console.log(`✓ 文件存在: ${file}`);
            filesExist++;
          } else {
            console.error(`✗ 文件不存在: ${file}`);
          }
          
          // 检查完成后显示结果
          if (index === requiredFiles.length - 1) {
            if (filesExist === 0) {
              console.error('所有音频文件都不存在！');
              showAudioError();
            } else if (filesExist < 3) {
              console.warn(`只找到 ${filesExist}/3 个音频文件`);
            } else {
              console.log('所有音频文件都存在');
            }
          }
        })
        .catch(error => {
          console.error(`检查文件 ${file} 时出错:`, error);
        });
    });
  }
  
  // 显示音频错误提示
  function showAudioError() {
    // 创建一个可见的错误提示
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 20px;
      border-radius: 10px;
      z-index: 10000;
      text-align: center;
      font-family: 'Noto Serif SC', serif;
      max-width: 400px;
    `;
    
    errorDiv.innerHTML = `
      <h3>音频文件缺失</h3>
      <p>请在 <code>audio</code> 文件夹中添加以下文件：</p>
      <ul style="text-align: left;">
        <li>background-sound1.mp3</li>
        <li>background-sound2.mp3</li>
        <li>background-sound3.mp3</li>
      </ul>
      <button onclick="this.parentElement.remove()" style="background: white; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">关闭</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // 5秒后自动消失
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 8000);
  }
  
  // 播放下一首歌
  function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    console.log(`切换到下一首歌: ${currentSongIndex + 1}`);
    loadSong(currentSongIndex);
    // 只有在用户没有主动暂停的情况下才继续播放
    if (!backgroundMusic.paused && !userPaused) {
      backgroundMusic.play().catch(console.log);
    }
  }
  
  // 启动时检查文件
  checkAudioFiles();
  
  // 初始化背景音乐
  function initBackgroundMusic() {
    if (!musicInitialized && backgroundMusic) {
      console.log('开始初始化背景音乐...');
      musicInitialized = true;
      backgroundMusic.volume = 0.3; // 设置较低的音量
      
      // 检查音频文件是否存在
      console.log('检查音频文件是否存在...');
      
      // 加载第一首歌
      loadSong(0);
      
      // 监听歌曲结束事件，自动播放下一首
      backgroundMusic.addEventListener('ended', playNextSong);
      
      // 添加详细的事件监听
      backgroundMusic.addEventListener('loadstart', () => console.log('开始加载音频'));
      backgroundMusic.addEventListener('loadeddata', () => console.log('音频数据加载完成'));
      backgroundMusic.addEventListener('canplay', () => console.log('音频可以开始播放'));
      
      // 同步按钮状态与实际播放状态
      backgroundMusic.addEventListener('play', () => {
        console.log('音频开始播放');
        updateMusicButton(true);
      });
      
      backgroundMusic.addEventListener('pause', () => {
        console.log('音频暂停');
        updateMusicButton(false);
      });
      
      // 更积极的自动播放策略
      const attemptAutoPlay = () => {
        console.log('尝试自动播放音乐...');
        backgroundMusic.play().then(() => {
          updateMusicButton(true);
          console.log('音乐自动播放成功');
        }).catch((error) => {
          console.log('自动播放被阻止，错误信息:', error);
          console.log('尝试静音播放方法...');
          // 如果自动播放失败，尝试静音播放然后恢复音量
          backgroundMusic.muted = true;
          backgroundMusic.play().then(() => {
            console.log('静音播放成功，准备恢复声音...');
            setTimeout(() => {
              backgroundMusic.muted = false;
              updateMusicButton(true);
              console.log('通过静音方式启动播放成功');
            }, 100);
          }).catch((mutedError) => {
            console.log('静音播放也失败:', mutedError);
            console.log('所有自动播放方式都失败，等待用户交互');
          });
        });
      };
      
      // 立即尝试播放
      attemptAutoPlay();
      
      // 如果立即播放失败，在DOM完全加载后再次尝试
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attemptAutoPlay);
      }
      
      // 页面获得焦点时尝试播放
      window.addEventListener('focus', () => {
        if (backgroundMusic.paused) {
          console.log('页面获得焦点，尝试恢复播放...');
          attemptAutoPlay();
        }
      });
    }
  }
  
  // 更新音乐按钮状态
  function updateMusicButton(isPlaying) {
    if (isPlaying) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      musicToggle.classList.add('playing');
    } else {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      musicToggle.classList.remove('playing');
    }
  }
  
  // 音乐切换按钮事件
  if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止事件冒泡
      console.log('音乐按钮被点击');
      console.log('当前音乐状态 - 暂停:', backgroundMusic.paused, '静音:', backgroundMusic.muted, '音量:', backgroundMusic.volume);
      
      if (!musicInitialized) {
        console.log('音乐未初始化，现在初始化...');
        initBackgroundMusic();
        return;
      }
      
      if (backgroundMusic.paused) {
        console.log('尝试播放音乐...');
        userPaused = false; // 用户主动播放
        backgroundMusic.play().then(() => {
          updateMusicButton(true);
          console.log('手动播放成功');
        }).catch((error) => {
          console.log('手动播放失败:', error);
          // 检查是否是文件不存在的问题
          if (error.name === 'NotSupportedError' || error.message.includes('load')) {
            alert('音频文件加载失败！\n\n请检查：\n1. audio 文件夹中是否有 background-sound1.mp3, background-sound2.mp3, background-sound3.mp3\n2. 文件名是否正确\n3. 文件是否损坏');
          }
        });
      } else {
        console.log('暂停音乐...');
        userPaused = true; // 用户主动暂停
        backgroundMusic.pause();
        updateMusicButton(false);
      }
    });
  }
  
  // 用户交互时初始化音乐（如果还没有初始化）
  document.addEventListener('click', (e) => {
    // 如果点击的是音乐控制按钮，不执行自动播放逻辑
    if (e.target.closest('#musicToggle')) {
      return;
    }
    
    if (!musicInitialized) {
      initBackgroundMusic();
    } else if (backgroundMusic && backgroundMusic.paused && !userPaused) {
      // 只有在用户没有主动暂停的情况下才自动播放
      backgroundMusic.play().catch(console.log);
    }
  }, { once: false });
  
  // 多个触发点尝试启动音乐
  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('#musicToggle')) {
      return;
    }
    
    if (!musicInitialized) {
      initBackgroundMusic();
    } else if (backgroundMusic && backgroundMusic.paused && !userPaused) {
      backgroundMusic.play().catch(console.log);
    }
  });
  
  document.addEventListener('keydown', () => {
    if (!musicInitialized) {
      initBackgroundMusic();
    } else if (backgroundMusic && backgroundMusic.paused && !userPaused) {
      backgroundMusic.play().catch(console.log);
    }
  }, { once: true });
  
  // 立即尝试初始化音乐（页面加载时）
  setTimeout(() => {
    if (!musicInitialized) {
      initBackgroundMusic();
    }
  }, 500); // 等待500ms让页面稳定后尝试
  
  // 页面可见性变化时尝试播放
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && backgroundMusic && backgroundMusic.paused && musicInitialized && !userPaused) {
      // 只有在用户没有主动暂停的情况下才恢复播放
      backgroundMusic.play().catch(console.log);
    }
  });

  // 创建浮动爱心容器
  const heartsContainer = document.createElement('div');
  heartsContainer.className = 'floating-hearts';
  document.body.appendChild(heartsContainer);

  // 浮动爱心动画
  function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '♥'; // 爱心符号
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    
    heartsContainer.appendChild(heart);
    
    // 动画结束后移除元素
    heart.addEventListener('animationend', () => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    });
  }

  // 定期创建爱心
  function startHeartAnimation() {
    createFloatingHeart();
    setTimeout(startHeartAnimation, Math.random() * 3000 + 2000); // 2-5秒间隔
  }

  // 启动爱心动画
  setTimeout(startHeartAnimation, 1000);

  // 创建闪烁效果
  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.animationDelay = Math.random() * 1 + 's';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 3000);
  }

  // 点击产生闪烁效果
  document.addEventListener('click', (e) => {
    if (Math.random() < 0.3) { // 30%概率产生闪烁
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createSparkle(
            e.clientX + (Math.random() - 0.5) * 50,
            e.clientY + (Math.random() - 0.5) * 50
          );
        }, i * 100);
      }
    }
  });

  // IntersectionObserver：元素进入视口时添加可见样式
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => io.observe(el));

  // 显示/隐藏返回顶部按钮
  const toggleTopBtn = () => {
    if (window.scrollY > 380) topBtn.classList.add('show');
    else topBtn.classList.remove('show');
  };
  toggleTopBtn();
  window.addEventListener('scroll', toggleTopBtn, { passive: true });

  // 返回顶部
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 平滑滚动到锚点（兼容 Safari）
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 星空与流星
  if (sky && sky.getContext) {
    const ctx = sky.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      sky.width = Math.floor(window.innerWidth * DPR);
      sky.height = Math.floor(window.innerHeight * DPR);
    }
    resize();
    window.addEventListener('resize', resize);

    const stars = [];
    const meteors = [];
    const romanticStars = []; // 特殊的浪漫星星
    const STAR_COUNT = Math.floor((window.innerWidth * window.innerHeight) / 8000);
    
    // 创建普通星星
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * sky.width,
        y: Math.random() * sky.height,
        r: (Math.random() * 0.9 + 0.2) * DPR,
        a: Math.random() * Math.PI * 2,
        twinkle: Math.random() * 0.02 + 0.005,
        brightness: Math.random() * 0.8 + 0.2
      });
    }
    
    // 创建浪漫星星（粉色、金色等）
    for (let i = 0; i < 8; i++) {
      romanticStars.push({
        x: Math.random() * sky.width,
        y: Math.random() * sky.height,
        r: (Math.random() * 1.5 + 1) * DPR,
        a: Math.random() * Math.PI * 2,
        twinkle: Math.random() * 0.015 + 0.01,
        color: ['#ffb6c1', '#ffd700', '#ff69b4', '#dda0dd'][Math.floor(Math.random() * 4)],
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    function spawnMeteor() {
      const fromTop = Math.random() < 0.6;
      const x = Math.random() * sky.width;
      const y = fromTop ? -40 * DPR : Math.random() * (sky.height * 0.6);
      const speed = (Math.random() * 2 + 2) * DPR;
      const angle = Math.PI * (fromTop ? 0.8 : 0.9); // 右下方掠过
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const isRomantic = Math.random() < 0.3; // 30%概率产生浪漫流星
      meteors.push({ 
        x, y, vx, vy, 
        life: 0, 
        maxLife: 120 + Math.random() * 80,
        isRomantic,
        trail: []
      });
    }

    let lastSpawn = 0;
    function draw() {
      ctx.clearRect(0, 0, sky.width, sky.height);

      // 普通星星
      ctx.save();
      for (const s of stars) {
        s.a += s.twinkle;
        const alpha = (0.6 + Math.sin(s.a) * 0.4) * s.brightness;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 浪漫星星
      for (const rs of romanticStars) {
        rs.a += rs.twinkle;
        rs.pulsePhase += 0.05;
        const alpha = (0.7 + Math.sin(rs.a) * 0.3) * (0.8 + Math.sin(rs.pulsePhase) * 0.2);
        const size = rs.r * (0.9 + Math.sin(rs.pulsePhase * 1.5) * 0.1);
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = rs.color;
        ctx.beginPath();
        ctx.arc(rs.x, rs.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加光晕效果
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(rs.x, rs.y, size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 流星
      if (performance.now() - lastSpawn > 1200 + Math.random() * 1500 && meteors.length < 4) {
        spawnMeteor();
        lastSpawn = performance.now();
      }
      
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        
        // 保存轨迹
        m.trail.push({ x: m.x, y: m.y });
        if (m.trail.length > 8) m.trail.shift();
        
        m.x += m.vx;
        m.y += m.vy;
        m.life++;
        
        ctx.save();
        
        if (m.isRomantic) {
          // 浪漫流星（粉色渐变）
          const grad = ctx.createLinearGradient(m.x - m.vx * 8, m.y - m.vy * 8, m.x, m.y);
          grad.addColorStop(0, 'rgba(255,182,193,0)');
          grad.addColorStop(0.5, 'rgba(255,105,180,0.8)');
          grad.addColorStop(1, 'rgba(255,20,147,0.9)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 3 * DPR;
          
          // 绘制轨迹
          for (let j = 0; j < m.trail.length - 1; j++) {
            const alpha = j / m.trail.length;
            ctx.globalAlpha = alpha * 0.6;
            ctx.beginPath();
            ctx.moveTo(m.trail[j].x, m.trail[j].y);
            ctx.lineTo(m.trail[j + 1].x, m.trail[j + 1].y);
            ctx.stroke();
          }
        } else {
          // 普通流星
          const grad = ctx.createLinearGradient(m.x - m.vx * 6, m.y - m.vy * 6, m.x, m.y);
          grad.addColorStop(0, 'rgba(255,255,255,0)');
          grad.addColorStop(1, 'rgba(255,255,255,0.9)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2 * DPR;
          ctx.beginPath();
          ctx.moveTo(m.x - m.vx * 6, m.y - m.vy * 6);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
        
        ctx.restore();
        
        if (m.life > m.maxLife || m.x > sky.width + 50 * DPR || m.y > sky.height + 50 * DPR) {
          meteors.splice(i, 1);
        }
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  // 打字机效果函数（移除音效）
  function typewriterEffect(element, htmlContent, speed = 80) {
    return new Promise((resolve) => {
      element.innerHTML = '';
      element.classList.add('typing');
      
      // 处理HTML内容，保留换行符
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      let index = 0;
      
      function typeChar() {
        if (index < textContent.length) {
          const char = textContent.charAt(index);
          
          // 如果是换行符，创建<br>标签
          if (char === '\n') {
            const br = document.createElement('br');
            element.appendChild(br);
          } else {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            span.style.animationDelay = '0s';
            
            element.appendChild(span);
            
            // 为每个字符添加随机的出现时间，营造更自然的打字效果
            setTimeout(() => {
              span.style.opacity = '1';
              
              // 自动滚动到最新内容
              element.scrollTop = element.scrollHeight;
            }, 20);
          }
          
          index++;
          const currentSpeed = char === '。' || char === '？' || char === '！' || char === '，' ? speed * 3 : speed;
          setTimeout(typeChar, currentSpeed + Math.random() * 30); // 添加随机延迟
        } else {
          // 打字完成，移除光标
          element.classList.add('complete');
          // 确保滚动到底部
          element.scrollTop = element.scrollHeight;
          resolve();
        }
      }
      
      typeChar();
    });
  }

  // 信封打字机效果
  async function startEnvelopeAnimation() {
    const msgElement = document.querySelector('.envelope__msg');
    const startBtn = document.querySelector('.envelope__start');
    
    if (msgElement && startBtn) {
      // 获取原有的HTML内容
      const originalHTML = msgElement.innerHTML;
      
      // 等待标题动画完成后开始打字效果
      setTimeout(async () => {
        await typewriterEffect(msgElement, originalHTML, 50); // 适合长文本的速度
        
        // 文字打完后显示启程按钮
        setTimeout(() => {
          startBtn.classList.add('show');
        }, 800);
      }, 1500);
    }
  }

  // 进入时：先执行邮戳动画，完毕后按钮可用
  if (overlay) {
    overlay.classList.add('ready');
    
    // 启动信封打字机动画
    startEnvelopeAnimation();
    
    // 邮戳动画结束标记
    setTimeout(() => {
      overlay.classList.add('stamp-done');
    }, 2300);
  }

  // 启程：信封关闭并展示站点
  if (startBtn && overlay && site) {
    startBtn.addEventListener('click', () => {
      if (!overlay.classList.contains('stamp-done')) return; // 未完成邮戳则不响应
      overlay.classList.remove('ready');
      overlay.classList.add('closing');
      setTimeout(() => {
        overlay.style.display = 'none';
        site.classList.remove('is-hidden');
        const story = document.getElementById('story');
        if (story) story.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1100);
    });
  }

  // Timeline Photo Gallery Expansion
  function initTimelinePhotoGalleries() {
    const expandableCards = document.querySelectorAll('.timeline__card--expandable');
    
    expandableCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent expansion if clicking on images inside the gallery
        if (e.target.tagName === 'IMG') {
          return;
        }
        
        const isExpanded = card.classList.contains('timeline__card--expanded');
        
        // Close all other expanded cards first
        expandableCards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove('timeline__card--expanded');
          }
        });
        
        // Toggle current card
        if (isExpanded) {
          card.classList.remove('timeline__card--expanded');
          console.log('Timeline card collapsed');
        } else {
          card.classList.add('timeline__card--expanded');
          console.log('Timeline card expanded');
          
          // Load images when expanded for better performance
          loadTimelineImages(card);
          
          // Smooth scroll to show the expanded content
          setTimeout(() => {
            card.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }, 200);
        }
      });
    });
    
    // Add click handlers for images to show them in a larger view (optional)
    const timelineImages = document.querySelectorAll('.timeline__photos img');
    timelineImages.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card collapse
        
        // Create a simple image viewer overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          cursor: pointer;
        `;
        
        const enlargedImg = document.createElement('img');
        enlargedImg.src = img.src;
        enlargedImg.alt = img.alt;
        enlargedImg.style.cssText = `
          max-width: 90%;
          max-height: 90%;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          transition: transform 0.3s ease;
        `;
        
        overlay.appendChild(enlargedImg);
        document.body.appendChild(overlay);
        
        // Add entrance animation
        setTimeout(() => {
          enlargedImg.style.transform = 'scale(1)';
        }, 10);
        
        // Close on click
        overlay.addEventListener('click', () => {
          enlargedImg.style.transform = 'scale(0.8)';
          overlay.style.opacity = '0';
          setTimeout(() => {
            if (overlay.parentElement) {
              overlay.remove();
            }
          }, 300);
        });
        
        console.log('Image viewer opened:', img.alt);
      });
    });
    
    console.log('Timeline photo galleries initialized');
  }
  
  // Advanced image loading optimization
  function loadTimelineImages(card) {
    const images = card.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      }
    });
  }
  
  // Performance optimization: Preload critical images
  function preloadCriticalImages() {
    const criticalImages = [
      'assets/images/1.jpg',
      'assets/images/4.jpg',
      'assets/images/7.jpg',
      'assets/images/21.jpg'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
    
    console.log('Critical images preloaded');
  }
  
  // Initialize performance optimizations
  preloadCriticalImages();
  
  // Initialize timeline photo galleries when the envelope is closed
  setTimeout(() => {
    initTimelinePhotoGalleries();
  }, 1000);
});


