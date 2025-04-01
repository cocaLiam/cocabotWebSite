// @/components/molecules/auth_forms/LoginForm.jsx
import { useState, useContext, useCallback, useEffect } from "react";

import ErrorModal from "@/components/molecules/ErrorModal";
import InputModal from "@/components/molecules/InputModal";
import GoogleLoginModal from "@/components/molecules/GoogleLoginModal";
import NaverLoginModal from "@/components/molecules/NaverLoginModal";
import KakaoLoginModal from "@/components/molecules/KakaoLoginModal";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si"; // Naver 아이콘
import { RiKakaoTalkFill } from "react-icons/ri"; // Kakao 아이콘

import { useHttpHook } from "@/hooks/useHttpHook";
import useIsMobile from "@/hooks/useIsMobile";

import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

import { AuthContext } from "@/context/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const authStatus = useContext(AuthContext);

  const [isInputModalOpen, setInputModalOpen] = useState(false);
  const [isGoogleModalOpen, setGoogleModal] = useState(false); // Google Modal
  const [isNaverModalOpen, setNaverModal] = useState(false); // Naver Modal
  const [isKakaoModalOpen, setKakaoModal] = useState(false); // Kakao Modal

  const { sendRequest } = useHttpHook();

  const passwordReset = useCallback(
    async (userEmail) => {
      setIsLoading(true);
      try {
        const responseData = await sendRequest({
          url: "/api/oauth/passwordReset",
          method: "POST",
          data: { userEmail },
        });
        console.log(`responseData : ${JSON.stringify(responseData, null, 2)}`);
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen);
      } finally {
        setIsLoading(false);
      }
    },
    [sendRequest]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authStatus.login(formData.userEmail, formData.password);
      // const res = await authStatus.login(formData.userEmail, formData.password);
      // console.log(`Login 성공 :`, res);
    } catch (err) {
      handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  const handleInputConfirm = (inputValue) => {
    console.log("Input 입력값 : ", inputValue);
    passwordReset(inputValue);
    setInputModalOpen(false);
  };

  const { isMobile, windowWidth } = useIsMobile();
  const textStyle3xl = isMobile ? "text-sm" : "text-3xl";
  const textStyle2xl = isMobile ? "text-xs" : "text-2xl";
  const logoStyle = `w-auto ${isMobile ? "h-6" : "h-12"}`;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <InputModal
        isOpen={isInputModalOpen}
        onConfirm={handleInputConfirm}
        setClose={() => setInputModalOpen(false)}
        title="비밀번호 찾기"
        content="가입하신 이메일 주소를 입력해 주세요. 임시 비밀번호를 이메일로 발송해 드립니다."
        inputTextType="userEmail"
        placeHolder="help@cocabot.com"
        setPasswordCheck={false}
      />
      {isGoogleModalOpen && (
        <GoogleLoginModal onClose={() => setGoogleModal(false)} />
      )}
      {isNaverModalOpen && (
        <NaverLoginModal onClose={() => setNaverModal(false)} />
      )}
      {isKakaoModalOpen && (
        <KakaoLoginModal onClose={() => setKakaoModal(false)} />
      )}
      <form onSubmit={handleSubmit} className="w-full space-y-2">
        <div>
          <input
            // className="w-full p-4 text-3xl text-white bg-gray-800 rounded"
            className={`w-full p-4 ${textStyle3xl} text-white bg-gray-800 rounded`}
            name="userEmail"
            type="email"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="이메일"
            required
          />
        </div>
        <div>
          <input
            // className="w-full p-4 text-3xl text-white bg-gray-800 rounded"
            className={`w-full p-4 ${textStyle3xl} text-white bg-gray-800 rounded`}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          // className="w-full p-4 text-2xl text-white bg-blue-600 rounded hover:bg-blue-500 disabled:bg-blue-300"
          className={`w-full p-4 ${textStyle2xl} text-white bg-blue-600 rounded hover:bg-blue-500 disabled:bg-blue-300`}
        >
          로그인
        </button>
        {/* <div className="grid grid-cols-3 gap-x-4"> */}
        {/* <div className="flex justify-between"> */}
        <div className="flex flex-row">
          <FcGoogle
            // className="w-20 h-20 cursor-pointer"
            className={`${logoStyle} cursor-pointer`}
            onClick={() => setGoogleModal(true)}
          />
          <SiNaver
            className={`${logoStyle} text-green-500 cursor-pointer`}
            onClick={() => setNaverModal(true)}
          />
          <RiKakaoTalkFill
            className={`${logoStyle} text-yellow-400 cursor-pointer"`}
            onClick={() => setKakaoModal(true)}
          />
        </div>
        <div className="text-sm">
          <span>
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => console.log("Email clicked")}
            >
              Email
            </span>{" "}
            찾기
            {/* 줄바꿈 */}
            <br />
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                console.log("Password clicked");
                setInputModalOpen(true);
              }}
            >
              Password
            </span>
            초기화
          </span>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
