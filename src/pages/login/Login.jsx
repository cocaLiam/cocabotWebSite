// src/pages/Login.jsx
// import {
//   useEffect,
//   useState,
//   useContext,
//   useCallback,
//   useRef,
//   useMemo,
// } from "react";
import { useState, useContext, useEffect } from "react";

import { useSearchParams } from "react-router-dom";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import ErrorModal from "@/components/molecules/ErrorModal";

import LoginForm from "@/components/molecules/auth_forms/LoginForm";

import useIsMobile from "@/hooks/useIsMobile";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchParams] = useSearchParams();

  const error = searchParams.get("error");
  const errorMsg = searchParams.get("errorMsg");

  // error 값이 'naverLoginFail'일 경우 처리
  useEffect(() => {
    if (error) {
      // 에러 처리 로직
      console.log(error);
      setErrorMessage(errorMsg);
      setIsErrorModalOpen(true);
    }
    // if (userProfile) {
    //   // userProfile 출력
    //   const parsedProfile = JSON.parse(userProfile);
    //   console.log("받은 사용자 프로필:", parsedProfile);
    // }
    // if (userProfile) {
    //   // 에러 처리 로직
    //   console.log(userProfile);
    //   console.log(JSON.stringify(userProfile,null,2))
    // }
  }, []);

  const { isMobile, windowWidth } = useIsMobile();
  console.log(Number(windowWidth / 2));

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      {/* // top-1/2 left-1/2 위에서 1/2, 왼쪽에서부터 1/2
      // transform -translate-x-1/2 -translate-y-1/2: 본인 컨테이너 사이즈의 1/2 만큼 (왼쪽,위로) 마이너스
      // --> 결과 : 정중앙 */}
      {/* <div className="absolute inline-block p-6 space-y-2 overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-gray-500 rounded-lg shadow-lg max-h-96 top-1/3 left-1/2"> */}
      {/* <div className="absolute inline-block p-1 transform -translate-x-1/2 -translate-y-1/2 bg-gray-500 rounded-lg shadow-lg top-1/3 left-1/2"> */}
      {/* <div className="absolute inline-block p-1 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg bg-inherit top-1/3 left-1/2"> */}
      <div className="absolute inline-block transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg bg-inherit top-1/3 left-1/2">
      {/* <div className={`absolute rounded-lg shadow-lg bg-inherit`}> */}
        {/* 로그인창의 위치를 잡는 상위 컨테이너 */}

        {/* <div className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-lg shadow-lg w-[250px]"> */}
        {/* <div className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-lg shadow-lg w-[400px]"> */}
        {/* <div className="flex flex-col items-center justify-center p-4 bg-inherit rounded-lg shadow-lg w-[600px]"> */}
        {/* <div className={`flex flex-col items-center justify-center w-full p-4 rounded-lg shadow-lg bg-inherit w-[${windowWidth/2}px]`}> */}
        <div
          className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-lg bg-inherit]`}
          style={
            isMobile
              ? { width: `${(windowWidth / 3) * 2}px` }
              : { width: `${windowWidth / 3}px` }
          }
        >
          {/* 로그인창 내의 text, Form, button 들의 위치를 잡는 하위 컨테이너 */}
          <LoginForm />
        </div>
      </div>
    </>
  );
}
