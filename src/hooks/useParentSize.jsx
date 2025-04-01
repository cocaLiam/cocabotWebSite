// hooks/useParentSize.js
import { useState, useEffect, useRef } from 'react';

const useParentSize = () => {
  const targetRef = useRef(null);
  const [parentSize, setParentSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const updateSize = () => {
      if (targetRef.current) {
        const { offsetWidth, offsetHeight } = targetRef.current;
        setParentSize({
          width: offsetWidth,
          height: offsetHeight
        });
      }
    };

    // ResizeObserver를 사용하여 요소 크기 변화 감지
    const resizeObserver = new ResizeObserver(updateSize);
    
    if (targetRef.current) {
      resizeObserver.observe(targetRef.current);
    }

    // 초기 크기 설정
    updateSize();

    // 클린업 함수
    return () => {
      if (targetRef.current) {
        resizeObserver.unobserve(targetRef.current);
      }
    };
  }, []);

  return { targetRef, parentSize };
};

export default useParentSize;
