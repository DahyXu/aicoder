import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.resolve(__dirname, '../client');

const dashboardData = {
  nav: ['首页', '游戏大厅', '社区', '关于我们'],
  sections: [
    { title: '🎮 线上对决', subtitle: '登录后可进入游戏', games: [
      { name: '阿瓦隆', desc: '经典的社交推理游戏，善恶阵营斗智斗勇', players: '5-10人', duration: '20-40分钟', difficulty: '中等', ai: 'AI队友', image: 'https://gamegeeking.com/static/img/game/v4/avalon.png', cta: '登录后进入' },
      { name: '欢乐搜打撤', desc: '与同事们一起进行职场大乱斗', players: '3-8人', duration: '15-30分钟', difficulty: '简单', ai: 'AI队友', image: 'https://gamegeeking.com/static/img/game/v4/happysearch.png', cta: '登录后进入' },
      { name: '大厂拆弹手', desc: '有限时间内拆掉你同事们的所有炸弹', players: '4-8人', duration: '10-20分钟', difficulty: '简单', ai: '暂无AI', image: 'https://gamegeeking.com/static/img/game/v4/bomb.png', cta: '登录后进入' }
    ]},
    { title: '🎉 线下聚会', subtitle: '面对面的欢乐时光', games: [
      { name: '谁是卧底', desc: '经典线下聚会游戏，找出隐藏在人群中的卧底', players: '4-12人', duration: '10-20分钟', difficulty: '简单', ai: '', image: 'https://gamegeeking.com/static/img/game/v4/undercover.png', cta: '登录后进入' }
    ]},
    { title: '🚀 即将上线', subtitle: '更多精彩游戏开发中', comingSoon: true, games: [
      { name: '大富翁', desc: '经典大富翁游戏，策略与运气并存', players: '2-6人', duration: '30-60分钟', difficulty: '中等', ai: '规划中', icon: '🎲', cta: '敬请期待' },
      { name: '五子棋', desc: '经典五子棋，考验你的策略思维', players: '2人', duration: '10-20分钟', difficulty: '简单', ai: '规划中', icon: '🎯', cta: '敬请期待' },
      { name: '职场鹅鸭杀', desc: '职场版鹅鸭杀，在办公室中展开激烈的推理对决', players: '4-12人', duration: '20-40分钟', difficulty: '中等', ai: '规划中', icon: '🦆', cta: '敬请期待' },
      { name: '骆驼大赛', desc: '策略与运气的完美结合', players: '2-8人', duration: '15-30分钟', difficulty: '简单', ai: '规划中', icon: '🐪', cta: '敬请期待' },
      { name: '大厂跑团（DND）', desc: '在职场中展开你的冒险之旅', players: '3-6人', duration: '60-120分钟', difficulty: '困难', ai: '规划中', icon: '🎲', cta: '敬请期待' }
    ]}
  ]
};

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function sendFile(res, filePath) {
  const ext = path.extname(filePath);
  const type = mime[ext] || 'text/plain; charset=utf-8';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/dashboard') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(dashboardData));
    return;
  }

  const staticPath = path.normalize(path.join(clientDir, url.pathname === '/' ? 'index.html' : url.pathname));
  if (staticPath.startsWith(clientDir) && fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
    sendFile(res, staticPath);
    return;
  }

  sendFile(res, path.join(clientDir, 'index.html'));
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
