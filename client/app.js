import React, { useEffect, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

function MetaTag({ icon, value, tone = '' }) {
  return React.createElement('span', { className: `game-meta-tag ${tone}` }, React.createElement('span', null, icon), value);
}

function GameCard({ game, comingSoon }) {
  return React.createElement('div', { className: 'game-card' },
    comingSoon && React.createElement('div', { className: 'coming-ribbon' }, '即将上线'),
    React.createElement('div', { className: 'game-icon game-icon-img' },
      game.image ? React.createElement('img', { src: game.image, alt: game.name }) : React.createElement('span', { className: 'icon-fallback' }, game.icon)
    ),
    React.createElement('h3', null, game.name),
    React.createElement('p', null, game.desc),
    React.createElement('div', { className: 'game-meta' },
      React.createElement(MetaTag, { icon: '👥', value: game.players }),
      React.createElement(MetaTag, { icon: '🕒', value: game.duration }),
      React.createElement(MetaTag, { icon: '☆', value: game.difficulty, tone: game.difficulty === '困难' ? 'danger' : game.difficulty === '中等' ? 'medium' : 'easy' }),
      game.ai ? React.createElement(MetaTag, { icon: '◌', value: game.ai, tone: game.ai === '暂无AI' ? 'neutral' : 'easy' }) : null
    ),
    React.createElement('button', { className: `btn ${comingSoon ? 'btn-disabled' : 'btn-primary'}` }, game.cta)
  );
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard').then((r) => r.json()).then(setData);
  }, []);

  if (!data) return React.createElement('div', { className: 'loading' }, '加载中...');

  return React.createElement(React.Fragment, null,
    React.createElement('header', { className: 'navbar' },
      React.createElement('div', { className: 'container nav-inner' },
        React.createElement('a', { className: 'nav-brand', href: '#' },
          React.createElement('img', { src: 'https://gamegeeking.com/static/img/brand/v3/logo.png', alt: '游极GameGeeking', className: 'nav-brand-logo' })
        ),
        React.createElement('nav', { className: 'nav-menu' },
          ...data.nav.map((item, index) => React.createElement('a', { key: item, className: `nav-link ${index === 1 ? 'active' : ''}`, href: '#' }, item)),
          React.createElement('div', { className: 'nav-auth-buttons' },
            React.createElement('button', { className: 'btn btn-outline' }, '登录'),
            React.createElement('button', { className: 'btn btn-primary' }, '注册')
          )
        )
      )
    ),
    React.createElement('main', { className: 'dashboard' },
      React.createElement('div', { className: 'container' },
        React.createElement('div', { className: 'dashboard-header' }, React.createElement('h2', null, '游戏大厅'), React.createElement('p', null, '登录后即可加入多人实时对战')),
        ...data.sections.map((section) => React.createElement('section', { className: 'dashboard-section', key: section.title },
          React.createElement('div', { className: 'dashboard-section-header' },
            React.createElement('h3', { className: 'dashboard-section-title' }, section.title),
            React.createElement('span', { className: 'dashboard-section-count' }, section.subtitle)
          ),
          React.createElement('div', { className: 'games-grid' },
            ...section.games.map((game) => React.createElement(GameCard, { key: game.name, game, comingSoon: section.comingSoon }))
          )
        ))
      )
    ),
    React.createElement('footer', { className: 'site-footer' },
      React.createElement('img', { src: 'https://gamegeeking.com/static/img/brand/v3/logo.png', alt: 'logo' }),
      React.createElement('p', null, '© 2026 游戏GameGeeking. All rights reserved.')
    )
  );
}

createRoot(document.getElementById('root')).render(React.createElement(App));
