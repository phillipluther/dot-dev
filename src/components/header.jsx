import * as React from 'react';
import { Link } from "gatsby";

export default ({ isHome, title }) => {
  const TitleTag = isHome ? 'h1' : 'p';

  return (
    <header className="" id="header">
      <TitleTag className="font-display">
        <Link to="/">{title}</Link>
      </TitleTag>
    </header>
  );
}
