import * as React from 'react';
import { Link } from 'gatsby';

const links = [
  {
    label: 'All Posts',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export default ({ className, children }) => (
  <ul className={`flex font-display font-medium ${className || ''}`}>
    {links.map(({ label, href }) => (
      <li key={href} className="leading-none">
        <Link to={href} className="block p-3 leading-6">{label}</Link>
      </li>
    ))}

    {children || null}
  </ul>
);
