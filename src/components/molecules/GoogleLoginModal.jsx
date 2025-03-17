// components/LoginModal.jsx
import { useEffect, useState, useCallback, useContext } from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import { useHttpHook } from "@/hooks/useHttpHook";
import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

import { AuthContext } from "@/context/AuthContext";

import PropTypes from "prop-types";

const GoogleLoginModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  const handleCredentialResponse = useCallback(
    async (response) => {
      const credential = response.credential;
      //
      setIsLoading(true);
      try {
        const responseData = await sendRequest({
          url: "/api/oauth/googleLogin",
          method: "POST",
          data: { credential },
        });

        console.log("로그인 성공:", responseData);

        // 응답 데이터에서 사용자 ID와 토큰 추출
        const { dbObjectId, token } = responseData;
        await authStatus.saveToken(dbObjectId, token);

        // if (dbObjectId && token) {
        //   // 회원가입 후 자동으로 로그인 처리
        //   await authStatus.login(userEmail, password);
        // } else {
        //   console.error("회원가입 실패:", responseData);
        //   throw new Error("회원가입에 실패했습니다.");
        // }

        onClose();
      } catch (err) {
        console.error("로그인 실패:", err);
        handleError(err, setErrorMessage, setIsErrorModalOpen);
      } finally {
        setIsLoading(false);
      }
    },
    [sendRequest, onClose]
  );

  // useEffect(() => {
  //   // window 객체에 콜백 함수 등록
  //   window.handleCredentialResponse = handleCredentialResponse;

  //   // Google OAuth 스크립트 로드
  //   const script = document.createElement("script");
  //   script.src = "https://accounts.google.com/gsi/client";
  //   script.async = true;
  //   script.defer = true; // defer 추가
  //   document.head.appendChild(script);

  //   // 클린업 함수
  //   return () => {
  //     delete window.handleCredentialResponse;
  //     if (script.parentNode) {
  //       script.parentNode.removeChild(script);
  //     }
  //   };
  // }, [handleCredentialResponse]); // 의존성 배열에 콜백 함수 추가

  useEffect(() => {
    // window 객체에 콜백 함수 등록
    window.handleCredentialResponse = handleCredentialResponse;
  
    // Google OAuth 스크립트 로드
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // 스크립트 로드 완료 후 Google 클라이언트 초기화
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: 'popup'
      });
  
      // 버튼 렌더링
      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "filled_blue", size: "large" }
      );
    };
  
    document.head.appendChild(script);
  
    return () => {
      delete window.handleCredentialResponse;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [handleCredentialResponse]);
  
  if (!isOpen) return null;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

        {/* 모달 내용 */}
        <div className="z-10 p-8 bg-white rounded-lg shadow-xl">
          <h2 className="mb-4 text-2xl font-bold text-black">구글 로그인</h2>

          {/* 새로운창 말고 모달식으로 하려면 */}
          {/* <div
            id="g_id_onload"
            data-client_id={import.meta.env.VITE_OAUTH_CLIENT_ID}
            data-auto_prompt="false"
            data-callback="handleCredentialResponse"
            data-ux_mode="redirect" // 이 속성 추가
          />

          <div
            className="g_id_signin"
            data-type="standard"
            data-theme="outline"
            data-size="large"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left"
          /> */}

          {/* 창 새로 띄워서 하고 싶으면 */}
          {/* <div
            data-client_id={import.meta.env.VITE_OAUTH_CLIENT_ID}
            data-auto_prompt="false"
            data-callback="handleCredentialResponse"
            // data-itp_support="true"
            data-context="구글 로그인 연동"
            data-ux_mode="popup" // 추가
          />
          <div
            className="g_id_signin"
            data-type="standard"
            data-theme="filled_blue"
            data-size="large"
            data-text="ontinue_with"
            data-shape="rectangular"
            data-logo_alignment="left"
          /> */}
          <div id="googleSignInDiv"></div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 mt-4 text-gray-700 transition-colors bg-gray-200 rounded hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
};

GoogleLoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GoogleLoginModal;
