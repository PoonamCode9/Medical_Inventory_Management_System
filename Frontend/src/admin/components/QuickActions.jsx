import { NavLink } from 'react-router-dom'

export default function QuickActions({ actions = [] }) {
  return (
    <div className="bb-quick-actions">
      {actions.map((a) => (
        <NavLink key={a.to} to={a.to} className="bb-quick-action">
          <span className="bb-quick-action-ico">+</span>
          <span>{a.label}</span>
        </NavLink>
      ))}
    </div>
  )
}

