import {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Post } from 'src/types';
import { debounce } from 'src/utils';
import styles from './styles.module.css';

type VirtualizedListProps<T> = {
  width: number | string;
  // TODO: make height is resizable
  height: number;
  itemsCount: number;
  itemSize: number;
  data: T[];
  children: (data: T, isScrolling: boolean, styles: CSSProperties) => ReactNode;
};

export const VirtualizedList = <T extends { id: number } = Post>({
  width,
  height,
  itemSize,
  itemsCount,
  data,
  children,
}: VirtualizedListProps<T>) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsCountToShow = Math.round(height / itemSize) + 2; // здесь стоит 2, чтобы элементов было немного больше, чем в видимой области
  const [scrollTop, setScrollTop] = useState(0);
  const allListHeight = itemsCount * itemSize;

  const wrapperStyles: CSSProperties = {
    width,
    height,
  };

  const listStyles: CSSProperties = {
    height: allListHeight,
  };

  const Childrens = useMemo(() => {
    const itemsInTop = Math.round(scrollTop / itemSize);
    const itemsToShow = data.slice(
      itemsInTop,
      Math.min(itemsInTop + itemsCountToShow, data.length),
    );

    return itemsToShow.map((item, index) =>
      children(item, isScrolling, {
        top: (itemsInTop + index) * itemSize,
      }),
    );
  }, [children, data, isScrolling, itemSize, itemsCountToShow, scrollTop]);

  useEffect(() => {
    // TODO: think about optimization scroll handlers
    const debouncedStopScrolling = debounce(() => setIsScrolling(false), 500);

    const handleScroll = () => {
      setIsScrolling(true);

      if (typeof wrapperRef.current?.scrollTop === 'number') {
        setScrollTop(wrapperRef.current?.scrollTop);
      }

      debouncedStopScrolling();
    };

    let wrapperRefValue = null;

    if (wrapperRef.current) {
      wrapperRef.current.addEventListener('scroll', handleScroll);
      wrapperRefValue = wrapperRef.current;
    }

    return () => {
      if (wrapperRefValue) {
        wrapperRefValue.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper} style={wrapperStyles}>
      <div className={styles.list} style={listStyles}>
        {Childrens}
      </div>
    </div>
  );
};
