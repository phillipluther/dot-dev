/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            bio
            email
          }
          social {
            twitter
            youtube
          }
        }
      }
    }
  `);

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author;
  const social = data.site.siteMetadata?.social;

  return (
    <div className="bio">
      {/* <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["AUTO", "WEBP", "AVIF"]}
        src="../images/profile-pic.png"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
      /> */}
      {author?.name && (
        <>
          <p>{author?.bio || null}</p>
          <ul>
            {social.twitter ? (
              <li>
                <a href={`https://twitter.com/${social.twitter}`}>
                  {`@${social.twitter}`} on Twitter
                </a>
              </li>
            ) : null}

            {social.youtube ? (
              <li>
                <a href={`https://youtube.com/${social.youtube}`}>
                  {social.youtube} on YouTube
                </a>
              </li>
            ) : null}
          </ul>
        </>
      )}
    </div>
  );
};

export default Bio;
