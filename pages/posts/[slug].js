import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: "blogPost",
  });

  const paths = res.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { items } = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": params.slug,
  });

  if (!items.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { post: items[0] },
    revalidate: 1,
  };
};

export default function Post({ post }) {
  console.log(post);
  return (
    <div>
      <h1>{post.fields.title}</h1>
      <Image
        src={"https:" + post.fields.heroImage.fields.file.url}
        height={200}
        width={300}
        alt="Hero image"
      />
      <div>{documentToReactComponents(post.fields.body)}</div>
    </div>
  );
}
