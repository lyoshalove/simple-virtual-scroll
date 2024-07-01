import { API_URL } from '../shared';

export const getPosts = async () => {
  const postsJson = await fetch(API_URL, {
    method: 'GET',
  });

  if (!postsJson.ok) {
    throw new Error('Fetch error');
  }

  return await postsJson.json();
};
