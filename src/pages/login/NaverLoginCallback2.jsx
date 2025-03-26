// src/pages/login/NaverLoginCallback2.jsx

import { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import ErrorModal from "@/components/molecules/ErrorModal";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { handleError } from "@/utils/errorHandler";

const NaverLoginCallback2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  const requestNaverLogin = useCallback(
    async (payload) => {
      setIsLoading(true);
      try {
        const responseData = await sendRequest({
          url: "/api/oauth/naverLogin",
          method: "POST",
          data: { payload },
        });

        // 응답 데이터에서 사용자 ID와 토큰 추출
        const { dbObjectId, token } = responseData;
        await authStatus.saveToken(dbObjectId, token);

        navigate("/");
      } catch (err) {
        console.error("로그인 실패:", err);
        document.getElementById("loginStat").textContent = "네이버 로그인 실패";
        document.getElementById(
          "loginMessage"
        ).innerHTML = `${err.response.data.message}`;
        handleError(err, setErrorMessage, setIsErrorModalOpen);
      } finally {
        setIsLoading(false);
      }
    },
    [sendRequest, authStatus]
  );

  useEffect(() => {
    let naver_id_login = new window.naver_id_login(
      import.meta.env.VITE_NAVER_CLIENT_ID,
      import.meta.env.VITE_NAVER_CALLBACK_URL
    );

    naver_id_login.get_naver_userprofile("naverSignInCallback()");

    window.naverSignInCallback = async () => {
      const email = naver_id_login.getProfileData("email");
      // const nickname = naver_id_login.getProfileData("nickname");
      // const profileImage = naver_id_login.getProfileData("profile_image");
      // const age = naver_id_login.getProfileData("age");
      // const gender = naver_id_login.getProfileData("gender");
      // const id = naver_id_login.getProfileData("id");
      const name = naver_id_login.getProfileData("name");
      // const birthday = naver_id_login.getProfileData("birthday");

      // const userProfile = {
      //   email,
      //   nickname,
      //   profileImage,
      //   age,
      //   gender,
      //   id,
      //   name,
      //   birthday,
      //   idToken: naver_id_login.oauthParams.access_token,
      // };

      try {
        await requestNaverLogin({
          email: email,
          name: name,
        });
      } catch (error) {
        console.error("요청 중 에러 발생:", error);
      }
    };
  }, []);

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <h1 id="loginStat">Naver Login ...</h1>
      <p id="loginMessage">wait a moment please</p>
    </div>
  );
};

export default NaverLoginCallback2;
