// src/pages/Login.jsx
// import {
//   useEffect,
//   useState,
//   useContext,
//   useCallback,
//   useRef,
//   useMemo,
// } from "react";
import { useState, useContext, useCallback } from "react";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import ErrorModal from "@/components/molecules/ErrorModal";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { handleError } from "@/utils/errorHandler";

import LoginForm from "@/components/molecules/auth_forms/LoginForm";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

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
      <div className="absolute inline-block p-1 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg bg-inherit top-1/3 left-1/2">
        {/* 로그인창의 위치를 잡는 상위 컨테이너 */}

        {/* <div className="flex flex-col items-center justify-center p-4 space-y-2 bg-gray-900 rounded-lg shadow-lg w-[250px]"> */}
        {/* <div className="flex flex-col items-center justify-center p-4 space-y-2 bg-gray-900 rounded-lg shadow-lg w-[400px]"> */}
        <div className="flex flex-col items-center justify-center p-4 space-y-2 bg-inherit rounded-lg shadow-lg w-[600px]">
          {/* 로그인창 내의 text, Form, button 들의 위치를 잡는 하위 컨테이너 */}
          <LoginForm />
        </div>
      </div>
    </>
  );
}
