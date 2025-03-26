// "@/pages/login/KakaoLoginPage"
import axios from "axios";
import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ErrorModal from "@/components/molecules/ErrorModal";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import { useHttpHook } from "@/hooks/useHttpHook";
import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

import { AuthContext } from "@/context/AuthContext";

const KakaoLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  // 1. 카카오 로그인 페이지 진입 > AuthCode 획득 > 리디렉팅 링크로 리턴턴
  useEffect(() => {
    const url = new URL(window.location.href);
    const authCode = url.searchParams.get("code"); // URL에서 code 추출

    if (!authCode) {
      // `code`가 없을 때만 Kakao 인증 페이지로 리디렉션
      const getAuthCode = () => {
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
          import.meta.env.VITE_KAKAO_REST_API_KEY
        }&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECTION_URL}`;
        window.location.href = kakaoAuthUrl;
      };

      getAuthCode(); // 함수 호출
    } else {
      // `code`가 있을 경우 Access Token 요청
      getAccessToken(authCode).catch((err) => {
        console.error("카카오 토큰 발급 또는 유저 정보 요청 실패:", err);
      });
    }
  }, []);

  // 2. 링크에 있는 data로 > AuthToken(AccessToken) 획득
  // 호이스팅문제로 선언 순서 문제 >> const getAccessToken = useCallback(async (authCode) => {
  async function getAccessToken(authCode) {
    try {
      const data = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
        redirect_uri: import.meta.env.VITE_KAKAO_REDIRECTION_URL,
        code: authCode,
      });

      const response = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        data, // 변환된 데이터를 전송
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      await getUserInfo(response.data.access_token);
    } catch (error) {
      console.error("토큰 발급 실패:", error);
      throw error;
    }
  }

  // 3. > 해당 유저 정보 획득
  const getUserInfo = useCallback(async (accessToken) => {
    try {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // # (profile_nickname)	카카오계정 프로필 닉네임
      // # (profile_image)	카카오계정 프로필 사진
      // # (account_email)	카카오계정 대표 이메일
      // # (name)	카카오계정 이름
      // # (gender)	카카오계정의 성별
      // # (age_range)	카카오계정의 연령대
      // # (birthday)	카카오계정의 생일
      // # (birthyear)	카카오계정의 출생 연도
      // # (phone_number)	카카오계정과 연결된 카카오톡에 등록된 전화번호
      // # (account_ci)	카카오계정의 암호화된 이용자 확인 값
      // # (friends)	카카오계정의 카카오톡 친구 정보 목록
      // # (plusfriends)	사용자와 서비스 앱에 연결된 카카오톡 채널의 친구 관계
      // # (shipping_address)	카카오계정의 배송지 정보
      // # (openid_sse)	사용자의 계정 상태 변경 이벤트 중 CAEP, RISC 카테고리 이벤트 발생 시 정보 제공

      await requestKakaoLogin({
        email: response.data.kakao_account.email,
        name: response.data.properties.nickname,
      });
    } catch (error) {
      console.error("카카오 사용자 정보 요청 실패:", error);
      throw error;
    }
  }, []);

  // 4. > BackEnd 요청 처리 > response.ok 시 메인 페이지로 리턴처리
  const requestKakaoLogin = useCallback(
    async (payload) => {
      setIsLoading(true);
      try {
        const responseData = await sendRequest({
          url: "/api/oauth/kakaoLogin",
          method: "POST",
          data: { payload },
        });

        // 응답 데이터에서 사용자 ID와 토큰 추출
        const { dbObjectId, token } = responseData;
        await authStatus.saveToken(dbObjectId, token);

        navigate("/");
      } catch (err) {
        console.error("로그인 실패:", err);
        document.getElementById("loginStat").textContent =
          "카카오 로그인 실패";
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

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <h1 id="loginStat">Kakao Login ...</h1>
      <p id="loginMessage">wait a moment please</p>
    </div>
  );
};

export default KakaoLoginPage;
