import { Key } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import Hero from "@/components/blog/Hero";
import Post from "@/components/blog/Post";
import { getNotionData } from "@/lib/notion";
import { getSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import Container from "@/components/theme/Container";
export const databaseId = process.env.NOTION_DATABASE_ID as string;

type Props = {
  loggedIn: boolean;
  posts: Array<PostProps>;
};

type PostProps = {
  id: string;
  properties: {
    "Cover Image": {
      files: [
        {
          type: "file" | "external";
          file?: {
            url: string;
          };
          external?: {
            url: string;
          };
        },
      ];
    };

    Slug: {
      rich_text: [
        {
          plain_text: string;
        },
      ];
    };

    Post: {
      title: [
        {
          plain_text: string;
        },
      ];
    };

    Date: {
      date: {
        start: string;
      };
    };
  };
};

const Blog: React.FC<Props> = ({ loggedIn, posts }) => {
  const menu = [
    {
      name: "Docs",
      href: "/docs",
    },
  ];

  return (
    <>
      <NextSeo
        title="Envless Blog - Tutorials and articles about Envless, security, and more."
        description="OpenSource, frictionless and secure way to share and manage app secrets across teams."
        canonical="https://envless.dev/blog"
        themeColor="#111"
        openGraph={{
          url: "https://envless.dev/blog",
          title:
            "Envless Blog - Tutorials and articles about Envless, security, and more.",
          description:
            "OpenSource, frictionless and secure way to share and manage app secrets across teams.",
          images: [{ url: "https://envless.dev/og.png" }],
          siteName: "Envless",
        }}
        twitter={{
          handle: "@envless",
          site: "@envless",
          cardType: "summary_large_image",
        }}
      />

      <Container>
        <Navigation loggedIn={loggedIn} menu={menu} />
        <Hero />
      </Container>

      <Container>
        <section className="md:px-32">
          <section className="my-24 grid gap-10 md:grid-cols-2 lg:gap-12 lg:gap-y-16">
            {posts.map((post) => (
              <div key={post.id}>
                <Post post={post} />
              </div>
            ))}
          </section>
        </section>
      </Container>
    </>
  );
};

export const getStaticProps = async () => {
  const database = await getNotionData(databaseId);
  return {
    props: {
      posts: database,
    },
    revalidate: 60, // In seconds
  };
};

export default Blog;
