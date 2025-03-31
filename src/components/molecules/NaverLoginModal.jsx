import React, { useEffect } from "react";
import useIsMobile from "@/hooks/useIsMobile";

import PropTypes from "prop-types";

const NaverLoginModal = ({ onClose }) => {
  useEffect(() => {
    /* index.html 에서 따로 해서 주석처리함 */
    // const script = document.createElement("script");
    // script.src = "https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js";
    // script.async = true;
    // document.head.appendChild(script);

    // script.onload = () => {
    //   const naver_id_login = new window.naver_id_login(
    //     import.meta.env.VITE_NAVER_CLIENT_ID,
    //     import.meta.env.VITE_NAVER_CALLBACK_URL
    //   );
    //   const state = naver_id_login.getUniqState();
    //   naver_id_login.setButton("green", 4, 80);
    //   naver_id_login.setDomain(import.meta.env.VITE_NAVER_SERVICE_URL);
    //   naver_id_login.setState(state);
    //   // naver_id_login.setPopup();
    //   naver_id_login.init_naver_id_login();
    // };

    // return () => {
    //   document.head.removeChild(script);
    // };
    const naver_id_login = new window.naver_id_login(
      import.meta.env.VITE_NAVER_CLIENT_ID,
      import.meta.env.VITE_NAVER_CALLBACK_URL
    );
    const state = naver_id_login.getUniqState();
    naver_id_login.setButton("green", 4, 120);
    naver_id_login.setDomain(import.meta.env.VITE_NAVER_SERVICE_URL);
    naver_id_login.setState(state);
    // naver_id_login.setPopup();
    naver_id_login.init_naver_id_login();
  }, []);

  const { isMobile, windowWidth } = useIsMobile();

  return (
    <>
      {/* {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      /> */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

        {/* 모달 내용 */}
        <div
          className="z-10 p-8 bg-white rounded-lg shadow-xl"
          style={
            isMobile
              ? { width: `${(windowWidth / 3) * 2}px` }
              : { width: `${windowWidth / 3}px` }
          }
        >
          <h2 className="mb-4 text-2xl font-bold text-black">네이버 로그인</h2>

          <div id="naver_id_login"></div>

          <button
            onClick={onClose}
            className={`w-full px-4 py-2 mt-4 text-gray-700 transition-colors bg-gray-200 rounded hover:bg-gray-300 ${
              isMobile ? "text-xs" : "text-1xl"
            }`}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
};

NaverLoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default NaverLoginModal;
