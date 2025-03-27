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
  const [formData, setFormData] = useState({}); // UserInfoEdit에서 받은 데이터를 저장하는 상태

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
      return responseData.userInfo;
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen);
    } finally {
      setIsLoading(false);
    }
  }, [authStatus.token, sendRequest]);

  const updateData = useCallback(
    async ({ ...kwargs }) => {
      setIsLoading(true);
      try {
        await sendRequest({
          url: "/api/user/updateUserInfo", // 로그인 엔드포인트
          method: "PATCH", // HTTP 메서드
          data: {
            ...kwargs,
          }, // 요청 데이터
          headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
        });

        setUserInfo(null);
        // 업데이트된 데이터를 userInfo에 반영
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          ...kwargs,
        }));
        alert("회원 정보 수정 성공");
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    },
    [authStatus.token, authStatus.dbObjectId, sendRequest]
  );

  useEffect(() => {
    const tt = async () => {
      const qq = await fetchData();
      setUserInfo(qq);
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
            <UserInfoEdit userInfo={userInfo} onFormDataChange={setFormData} />
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
      <div className="flex flex-row justify-center pt-8 space-x-2">
        <button
          className="text-3xl text-white bg-gray-800 min-w-60 hover:bg-gray-500"
          onClick={() => {
            console.log("회원정보 수정");
            console.log(formData);
            updateData(formData);
          }}
        >
          회원정보 수정
        </button>
        <button
          className="text-3xl text-white bg-gray-800 min-w-60 hover:bg-gray-500"
          onClick={() => {
            console.log("취소");
          }}
        >
          취소
        </button>
      </div>
    </>
  );
}
