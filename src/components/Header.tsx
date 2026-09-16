import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'ホーム', end: true },
  { to: '/bookmarks', label: 'ブックマーク' },
  { to: '/review-mistakes', label: '苦手復習' },
  { to: '/mock-exam', label: '模擬試験' },
  { to: '/stats', label: '成績' },
  { to: '/ai-generate', label: 'AI問題生成' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-700 text-sm text-white">診</span>
          <span className="hidden sm:inline">診断士1次 過去問道場</span>
          <span className="sm:hidden">過去問道場</span>
        </NavLink>
        <nav className="flex gap-1 overflow-x-auto text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                  isActive ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
