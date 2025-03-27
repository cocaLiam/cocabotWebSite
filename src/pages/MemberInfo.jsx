// src/pages/MemberInfo.jsx
// import {
//   useEffect,
//   useState,
//   useContext,
//   useCallback,
//   useRef,
//   useMemo,
// } from "react";
import { useState, useContext, useCallback, useEffect } from "react";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import UserInfoEdit from "@/components/molecules/member_info_forms/UserInfoEdit";

import ErrorModal from "@/components/molecules/ErrorModal";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { handleError } from "@/utils/errorHandler";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [userInfo, setUserInfo] = useState(null);

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest({
        url: "/api/user/getUserInfo",
        method: "GET",
        headers: { Authorization: `Bearer ${authStatus.token}` },
      });
      setUserInfo(responseData.userInfo);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen);
    } finally {
      setIsLoading(false);
    }
  }, [authStatus.token, sendRequest]);

  useEffect(() => {
    const tt = async () => {
      await fetchData();
    };
    tt();
  }, [fetchData]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <div className="w-full pl-6 pr-6">
        <div className="flex flex-row pt-32">
          <h1>회원 정보</h1>
        </div>
        <div className="pt-8">
          {/* {userInfo && (console.log(userInfo))} */}
          {userInfo && (
            <UserInfoEdit userInfo={userInfo} fetchData={fetchData}/>
          )}
        </div>
        <div className="flex flex-row pt-32">
          <h1>제목 2</h1>
        </div>
        <div className="flex flex-row pt-8">
          <h1>내용 2</h1>
        </div>
        <div className="flex flex-row pt-32">
          <h1>제목 3</h1>
        </div>
        <div className="flex flex-row pt-8">
          <h1>내용 3</h1>
        </div>
      </div>
    </>
  );
}
