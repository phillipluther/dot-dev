module.exports = {
  siteMetadata: {
    title: 'The Principled Engineer',
    author: {
      name: 'Phillip Luther',
      email: 'dev@phillipluther.com',
      bio:
        "My name is Phil. I've been doing the frontend thing for about 20 years now. I cut my teeth on `MM_` prefixes and sliding door jelly buttons. I remember when jQuery was brand new. In a forced-choice question I'd pick Vue over React, but only by an inch or two. You're invited to ask me why. I'm currently living the developer lifestyle in San Francisco, CA where I work as an engineering manager and maker of web apps.",
    },
    description:
      "(Hopefully) Cool HTML/CSS/JavaScript tutorials, modern engineering techniques, and stories from 20 years in the frontend trenches",
    siteUrl: "https://principledengineer.com",
    social: {
      twitter: "phillipluther",
      youtube: "phillipluther",
    },
  },
  plugins: [
    "gatsby-plugin-image",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/blog`,
        name: "blog",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: {
              wrapperStyle: "margin-bottom: 1.0725rem",
            },
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
        ],
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    // {
    //   resolve: 'gatsby-plugin-google-analytics',
    //   options: {
    //     trackingId: 'ADD YOUR TRACKING ID HERE',
    //   },
    // },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map((node) => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'The Principled Engineer',
        short_name: 'principledengineer.com',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#292929',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-gatsby-cloud',
    'gatsby-plugin-postcss',
  ],
};
