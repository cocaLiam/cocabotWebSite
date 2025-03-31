// hooks/useIsMobile.ts
import { useState, useEffect } from "react";

// 기본 브레이크포인트 설정 (필요에 따라 조정 가능)
const MOBILE_BREAKPOINT = 768;
const PAD_SIZE = 1024;

const useIsMobile = (breakpoint = MOBILE_BREAKPOINT) => {
  // 초기값 설정 (SSR 고려)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 모바일 여부를 체크하는 함수
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // 초기 실행
    checkIsMobile();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", checkIsMobile);

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [breakpoint]);

  return { isMobile: isMobile, windowWidth: window.innerWidth };
};

export default useIsMobile;
