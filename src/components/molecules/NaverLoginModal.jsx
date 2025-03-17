// components/NaverLoginModal.jsx
import { useEffect, useState, useCallback, useContext } from "react";
import ErrorModal from "@/components/molecules/ErrorModal";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { useHttpHook } from "@/hooks/useHttpHook";
import { handleError } from "@/utils/errorHandler";
import { AuthContext } from "@/context/AuthContext";
import PropTypes from "prop-types";

const NaverLoginModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  const handleNaverLogin = useCallback(
    async (naverUser) => {
      console.log(naverUser);
      setIsLoading(true);
      try {
        const responseData = await sendRequest({
          url: "/api/oauth/naverLogin",
          method: "POST",
          data:{naverUser}
          // data: {
          //   email: naverUser.email,
          //   name: naverUser.name,
          //   id: naverUser.id,
          // },
        });

        const { dbObjectId, token } = responseData;
        await authStatus.saveToken(dbObjectId, token);
        onClose();
      } catch (err) {
        console.error("네이버 로그인 실패:", err);
        handleError(err, setErrorMessage, setIsErrorModalOpen);
      } finally {
        setIsLoading(false);
      }
    },
    [sendRequest, onClose, authStatus]
  );

  const loadNaverScript = useCallback(() => {
    // babel-polyfill 중복 로드 방지
    if (!window._babelPolyfill) {
      const script = document.createElement("script");
      script.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";
      script.async = true;
      script.defer = true;
      return script;
    }
    return null;
  }, []);

  useEffect(() => {
    if (isOpen) {
      const script = loadNaverScript();
      if (script) {
        script.onload = () => {
          const naverLogin = new window.naver.LoginWithNaverId({
            clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
            callbackUrl: import.meta.env.VITE_NAVER_CALLBACK_URL,
            isPopup: false,
            loginButton: { color: "green", type: 3, height: 60 }
          });

          const loginButton = document.getElementById("naverIdLogin");
          if (loginButton) {
            naverLogin.init();
            naverLogin.getLoginStatus((status) => {
              if (status) {
                handleNaverLogin(naverLogin.user);
              }
            });
          }
        };
        document.head.appendChild(script);
      }

      return () => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [isOpen, loadNaverScript, handleNaverLogin]);

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
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className="z-10 p-8 bg-white rounded-lg shadow-xl">
          <h2 className="mb-4 text-2xl font-bold text-black">네이버 로그인</h2>
          <div id="naverIdLogin" className="flex justify-center"></div>
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

NaverLoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NaverLoginModal;
