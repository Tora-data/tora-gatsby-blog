import path from 'path';
import { GatsbyNode } from 'gatsby';
import { NotionAPI } from 'notion-client';
import getAllPageIds from './src/libs/utils/notion/getAllPageIds';
import getPageProperties from './src/libs/utils/notion/getPageProperties';

export const createPages: GatsbyNode['createPages'] = async ({ actions }) => {
  const { createPage } = actions;
  const notionApi = new NotionAPI();
  const notionPageId = process.env.NOTION_PAGE_ID;

  if (!notionPageId) {
    throw new Error('Missing NOTION_PAGE_ID in environment variables');
  }

  const response = await notionApi.getPage(notionPageId);
  const pageIds = getAllPageIds(response);
  const wholeBlocks = await notionApi.getBlocks(pageIds);
  const schema = response.collection[Object.keys(response.collection)[0]].value.schema;

  const categorySet = new Set();

  for (const id of pageIds) {
    const properties = await getPageProperties(id, wholeBlocks.recordMap.block, schema);
    if (!properties) continue;

    if (properties.categories) {
      properties.categories.forEach((category) => categorySet.add(category));
    }

    createPage({
      path: `/post/${properties.slug}/`,
      component: path.resolve('./src/templates/post-template/index.tsx'),
      context: {
        id,
        title: properties.title,
        date: properties.createdTime,
        content: wholeBlocks.recordMap.block[id],
        tags: properties.tags || [],
        categories: properties.categories || [],
        author: properties.author || 'Unknown',
      },
    });
  }

  // 카테고리 페이지 생성
  const categories = ['All', ...Array.from(categorySet)];
  categories.forEach((category) => {
    createPage({
      path: `/category/${category}/`,
      component: path.resolve('./src/templates/category-template/index.tsx`),
      context: { category },
    });
  });
};
