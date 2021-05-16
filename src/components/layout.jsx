import * as React from "react";
import { Link } from "gatsby";
import PrimaryNav from './primary-nav';
import SocialMenu from './social-menu';

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isHome = location.pathname === rootPath;
  const TitleTag = isHome ? 'h1' : 'p';
  
  return (
    <div data-is-root-path={isHome}>
      <header className="bg-gray-800">
        <div className="mx-auto max-w-screen-md text-gray-400 md:flex">
          <TitleTag className="font-display p-4 md:p-6">
            <Link to="/">
              <span className="font-black text-2xl text-gray-200 block tracking-wide leading-none uppercase">
                The<em className="text-green-300 not-italic">Scrupulous</em>Developer
              </span>
              <span className="font-medium italic text-lg leading-none block mt-1">Phillip Luther's Frontend Engineering Blog</span>
            </Link>
          </TitleTag>

          <nav className="md:flex justify-between flex-grow p-1 md:p-6">
            <PrimaryNav />
            <SocialMenu />
          </nav>
        </div>
      </header>

      <main className="font-body">{children}</main>

      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  );
};

export default Layout;
