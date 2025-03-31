// components/organisms/TopNavigation.jsx
import { Link } from "react-router-dom";

import React, { useState, useContext, useCallback } from "react";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ErrorModal from "@/components/molecules/ErrorModal";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅
import useIsMobile from "@/hooks/useIsMobile";

import { handleError } from "@/utils/errorHandler";

const TopNavigation = (topGnbPosition) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const authStatus = useContext(AuthContext);

  const isMobile = useIsMobile();

  /**
    await createDevice(
      "AA:BB:CC:DD:EE:FF",
      "deviceType2",
      "99",
      "deviceType2"
    );
  */

  let routingPages;
  // const linkStyle = "text-lg h-full text-white px-2";
  // const linkStyle = "text-lg flex items-center h-full text-white px-2";
  // const linkStyle = "flex items-center justify-center h-full text-white px-2 text-2xl md:text-base";
  const linkStyle =
    `flex items-center justify-center h-full text-white ${isMobile ? "text-xs px-1" : "text-3xl px-2"}`;
  const bannerStyle = `w-auto ${isMobile ? "h-5" : "h-12"}`;
  authStatus.log;
  if (authStatus.isLoggedIn) {
    // 로그인 상태
    routingPages = (
      <React.Fragment>
        <div className="flex justify-between w-full h-full">
          <Link to="/Home" className={`${linkStyle}`}>
            <img
              src="/cocabotBanner.svg"
              alt="Cocabot Logo"
              className={bannerStyle}
            />
          </Link>
          <div className="flex h-full">
            <Link to="/CompanyStory" className={`${linkStyle} font-semibold`}>
              회사소개
            </Link>
            <Link to="/AllProducts" className={`${linkStyle} font-semibold`}>
              제품
            </Link>
            <Link
              to="/CustomerService"
              className={`${linkStyle} font-semibold`}
            >
              고객센터
            </Link>
          </div>
          <div className="flex h-full">
            <Link
              onClick={() => authStatus.logout()}
              className={`${linkStyle} font-mono`}
            >
              로그아웃
            </Link>
            <Link to="/MemberInfo" className={`${linkStyle} font-mono`}>
              회원정보
            </Link>
            {/* <Link to="/PageExample" className={`${linkStyle} font-mono`}>
              디버깅
            </Link> */}
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    // 로그아웃 상태
    routingPages = (
      <React.Fragment>
        <div className="flex justify-between w-full h-full">
          <Link to="/Home" className={`${linkStyle}`}>
            <img
              src="/cocabotBanner.svg"
              alt="Cocabot Logo"
              className={bannerStyle}
            />
          </Link>
          <div className="flex h-full">
            <Link to="/CompanyStory" className={`${linkStyle} font-semibold`}>
              회사소개
            </Link>
            <Link to="/AllProducts" className={`${linkStyle} font-semibold`}>
              제품
            </Link>
            <Link
              to="/CustomerService"
              className={`${linkStyle} font-semibold`}
            >
              고객센터
            </Link>
          </div>
          <div className="flex h-full">
            <Link to="/login/Login" className={`${linkStyle} font-mono`}>
              로그인
            </Link>
            <Link to="/Signup" className={`${linkStyle} font-mono`}>
              회원가입
            </Link>
            {/* <Link to="/PageExample" className={`${linkStyle} font-mono`}>
              디버깅
            </Link> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <nav
        className={`fixed top-0 z-50 w-full ${topGnbPosition} pt-4 pb-4 border-b border-white bg-inherit ${
          isMobile ? "pl-1 pr-1" : "pl-4 pr-4"
        }`}
      >
        {routingPages}
      </nav>
    </>
  );
};

export default TopNavigation;
