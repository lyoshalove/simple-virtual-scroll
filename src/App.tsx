import { useEffect, useState } from 'react';
import { Post } from './types';
import { getPosts } from './api';
import './assets/styles/global.css';
import { VirtualizedList } from './components';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPostsRequest = async () => {
      const result = await getPosts();

      setPosts(result);
    };

    getPostsRequest();
  }, []);

  if (posts.length === 0) {
    return 'LOADING...';
  }

  return (
    <VirtualizedList
      width={'100%'}
      height={800}
      itemsCount={posts.length}
      itemSize={100}
      data={posts}>
      {(data, isScrolling, styles) => (
        <div key={data.id} className="row" style={styles}>
          {isScrolling ? (
            <p>Scrolling..</p>
          ) : (
            <>
              <p>Title: {data.title}</p>
              <p>{data.body}</p>
            </>
          )}
        </div>
      )}
    </VirtualizedList>
  );
}

export default App;
