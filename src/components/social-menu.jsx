import * as React from 'react';
import { FaTwitter, FaGithub } from 'react-icons/fa';

const socialLinks = [
  {
    label: 'Follow @phillipluther on Twitter',
    icon: FaTwitter,
    href: 'https://twitter.com/phillipluther',
  },
  {
    label: 'Follow @phillipluther on GitHub',
    icon: FaGithub,
    href: 'https://github.com/phillipluther',
  },
];

export default ({ className, children }) => (
  <ul className={`flex text-2xl ${className || ''}`}>
    {socialLinks.map(({ label, icon: Icon, href }) => (
      <li>
        <a href={href} className="p-3 block">
          <span className="sr-only">{label}</span>
          <Icon role="presentation" aria-hidden="true" />
        </a>
      </li>
    ))}
  </ul>
);
