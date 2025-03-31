// "@/components/molecules/GoogleLoginModal"
import { useEffect, useState, useCallback, useContext } from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import { useHttpHook } from "@/hooks/useHttpHook";
import useIsMobile from "@/hooks/useIsMobile";

import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

import { AuthContext } from "@/context/AuthContext";

import PropTypes from "prop-types";

const GoogleLoginModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  const { isMobile, windowWidth } = useIsMobile();

  const handleCredentialResponse = useCallback(
    async (response) => {
      const credential = response.credential;

      setIsLoading(true);
      try {
        const responseData = await sendRequest({
          url: "/api/oauth/googleLogin",
          method: "POST",
          data: { credential },
        });

        // 응답 데이터에서 사용자 ID와 토큰 추출
        const { dbObjectId, token } = responseData;
        await authStatus.saveToken(dbObjectId, token);

        onClose();
      } catch (err) {
        console.error("로그인 실패:", err);
        handleError(err, setErrorMessage, setIsErrorModalOpen);
      } finally {
        setIsLoading(false);
      }
    },
    [sendRequest, onClose, authStatus]
  );

  // 스크립트 로드 로직을 분리하여 재사용 가능하게 만들기
  const loadGoogleScript = useCallback(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    return script;
  }, []);

  // 구글 초기화 로직을 별도 함수로 분리
  const initializeGoogleLogin = useCallback(() => {
    if (!window.google || !document.getElementById("googleSignInDiv")) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
      callback: handleCredentialResponse,
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        type: "standard",
        theme: "filled_blue",
        size: isMobile ? "small" : "large",
        shape: "rectangular",
        width: isMobile ? ((windowWidth / 3) * 2 - 65) : 400,
        // width: isMobile ? ((windowWidth / 3) * 2 - 65) : ((windowWidth / 3)),
        // width: "200",
        logo_alignment: "left",
      }
    );
  }, [isMobile,windowWidth,handleCredentialResponse]);

  useEffect(() => {
    // 구글 스크립트 로드
    const script = loadGoogleScript();
    // 구글 로그인창 렌더링 및 초기화화
    script.onload = initializeGoogleLogin;

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [initializeGoogleLogin, loadGoogleScript]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <div className="fixed inset-0 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

        {/* 모달 내용 */}
        <div
          className="z-10 p-8 bg-white rounded-lg shadow-xl"
          style={
            isMobile
              ? { width: `${(windowWidth / 3) * 2}px` }
              : { width: `463px` }
              // : { width: `${(windowWidth / 3)}px` }
          }
        >
          <h2 className={`mb-4 ${isMobile ? "text-sm" : "text-4xl"} text-black`}>구글 로그인</h2>

          <div id="googleSignInDiv" className="w-96"></div>

          <button
            onClick={onClose}
            className={`w-full px-4 py-2 mt-4 text-gray-700 transition-colors bg-gray-200 rounded hover:bg-gray-300 ${isMobile ? "text-xs" : "text-1xl"}`}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
};

GoogleLoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default GoogleLoginModal;
