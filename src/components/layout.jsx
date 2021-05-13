import * as React from "react";
import { Link } from "gatsby";

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isHome = location.pathname === rootPath;
  const TitleTag = isHome ? 'h1' : 'p';
  
  return (
    <div data-is-root-path={isHome}>
      <header className="bg-gray-800">
        <div className="mx-auto max-w-screen-sm text-gray-50">
          <TitleTag className="font-display font-extrabold text-2xl">
            <Link to="/">
              Phillip Luther
              <em className="text-gray-200">Frontend Engineer</em>
            </Link>
          </TitleTag>
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
