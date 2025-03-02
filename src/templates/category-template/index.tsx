import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '@/src/layout';
import Seo from '@/src/components/Seo';

const CategoryTemplate = ({ pageContext, data }) => {
  const { category } = pageContext;
  const posts = data.allPost.nodes;

  return (
    <Layout>
      <Seo title={`Category: ${category}`} />
      <h1>Category: {category}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post.slug}/`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export const query = graphql`
  query($category: String!) {
    allPost(filter: { categories: { in: [$category] } }) {
      nodes {
        id
        title
        slug
      }
    }
  }
`;

export default CategoryTemplate;
