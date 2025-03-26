// "@/components/molecules/KakaoLoginModal"
import axios from "axios";
import { useEffect, useState, useCallback, useContext } from "react";

import kakaoLoginImage from "@/assets/kakaoLoginLogo.png";

import ErrorModal from "@/components/molecules/ErrorModal";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import { useHttpHook } from "@/hooks/useHttpHook";
import { handleError } from "@/utils/errorHandler"; // 에러 처리 함수 import

import { AuthContext } from "@/context/AuthContext";

import PropTypes from "prop-types";

const KakaoLoginModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
          <h2 className="mb-4 text-4xl text-black">카카오 로그인</h2>
          {/* http://localhost:3000/login/Login?code=Bz_lJsNW-zEoMJ_Tn7vMeQTLcX_egRTAo_br4kiWKbxHNoOiXQBRwAAAAAQKDQ0hAAABla4WD8Kvm_uHqQwxKA */}
          <img
            className="cursor-pointer"
            // src="//k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
            src={kakaoLoginImage}
            width="400"
            alt="카카오 로그인 버튼"
            onClick={() => window.location.href = import.meta.env.VITE_KAKAO_REDIRECTION_URL}
          />

          <div id="googleSignInDiv" className="w-96"></div>

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

KakaoLoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default KakaoLoginModal;
