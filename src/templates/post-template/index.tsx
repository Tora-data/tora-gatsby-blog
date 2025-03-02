import React from 'react';
import { graphql } from 'gatsby';
import { NotionRenderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';
import Layout from '@/src/layout';
import Seo from '@/src/components/Seo';
import { Post } from '@/src/models/post';

const PostTemplate = ({ data }: { data: { post: Post } }) => {
  const { title, date, content, tags, categories, author } = data.post;

  return (
    <Layout>
      <Seo title={title} />
      <article>
        <h1>{title}</h1>
        <p>By {author} on {new Date(date).toLocaleDateString()}</p>
        {categories && <p>Categories: {categories.join(', ')}</p>}
        {tags && <p>Tags: {tags.join(', ')}</p>}
        <NotionRenderer recordMap={content} fullPage={true} darkMode={false} />
      </article>
    </Layout>
  );
};

export const query = graphql`
  query($id: String!) {
    post(id: { eq: $id }) {
      id
      title
      date
      content
      tags
      categories
      author
    }
  }
`;

export default PostTemplate;
