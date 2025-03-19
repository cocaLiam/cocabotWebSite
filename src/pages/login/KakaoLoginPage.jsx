// "@/pages/login/KakaoLoginPage"
import axios from "axios";
import { useEffect, useState, useCallback, useContext } from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import { useHttpHook } from "@/hooks/useHttpHook";
import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

import { AuthContext } from "@/context/AuthContext";

import PropTypes from "prop-types";

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${
  import.meta.env.VITE_KAKAO_REST_API_KEY
}&redirect_uri=${
  import.meta.env.VITE_KAKAO_REDIRECTION_URL
}&response_type=code`;

const KakaoLoginPage = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  // // 2. 링크에 있는 data로 > AuthToken(AccessToken) 획득
  // const getAccessToken = useCallback(async (authCode) => {
  //   console.log(`authCode : ${authCode}`);
  //   try {
  //     const data = new URLSearchParams({
  //       grant_type: "authorization_code",
  //       client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
  //       redirect_uri: import.meta.env.VITE_KAKAO_REDIRECTION_URL,
  //       code: authCode,
  //     });

  //     const response = await axios.post(
  //       "https://kauth.kakao.com/oauth/token",
  //       data, // 변환된 데이터를 전송
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  //         },
  //       }
  //     );

  //     console.log("토큰 응답:", response.data);
  //     await getUserInfo(response.data.access_token);
  //   } catch (error) {
  //     console.error("토큰 발급 실패:", error);
  //     throw error;
  //   }
  // }, []);

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
    console.log(`authCode : ${authCode}`);
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

      console.log("토큰 응답:", response.data);
      await getUserInfo(response.data.access_token);
    } catch (error) {
      console.error("토큰 발급 실패:", error);
      throw error;
    }
  }

  // 3. > 해당 유저 정보 획득
  const getUserInfo = useCallback(async (accessToken) => {
    try {
      console.log(`accessToken : ${accessToken}`);
      // const response = await axios.post(
      //   "https://kapi.kakao.com/v2/user/me",
      //   {
      //     property_keys: ["kakao_account.email"],
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("카카오 사용자 정보:", response);
      console.log("카카오 사용자 정보:", response.id);
      console.log("카카오 사용자 정보:", response.kakao_account);
      console.log("카카오 사용자 정보:", response.data);
      console.log("카카오 사용자 정보:", response.data.id);
      console.log("카카오 사용자 정보:", response.data.id.kakao_account);
      return response.data;
    } catch (error) {
      console.error("카카오 사용자 정보 요청 실패:", error);
      throw error;
    }
  }, []);

  // 4. > BackEnd 요청 처리 > response.ok 시 메인 페이지로 리턴처리
  const handleCredentialResponse = useCallback(
    async (response) => {
      const credential = response.credential;

      setIsLoading(true);
      try {
        const responseData = await sendRequest({
          url: "/api/oauth/kakaoLogin",
          method: "POST",
          data: { credential },
        });

        console.log("로그인 성공:", responseData);

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

  return (
    <div>
      <h1>카카오톡 로그인중 ...</h1>
    </div>
  );
};

export default KakaoLoginPage;
