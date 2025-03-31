// "@/components/molecules/KakaoLoginModal"
import axios from "axios";
import { useEffect, useState, useCallback, useContext } from "react";

import kakaoLoginImage from "@/assets/kakaoLoginLogo.png";

import useIsMobile from "@/hooks/useIsMobile";

import PropTypes from "prop-types";

const KakaoLoginModal = ({ onClose }) => {
  const { isMobile, windowWidth } = useIsMobile();
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />

        {/* 모달 내용  style={{ width: `${modalWidth}px` }}> */}
        {/* <div className="z-10 p-8 bg-white rounded-lg shadow-xl"> */}
        <div
          className="z-10 p-8 bg-white rounded-lg shadow-xl"
          style={
            isMobile
              ? { width: `${(windowWidth / 3) * 2}px` }
              : { width: `${windowWidth / 3}px` }
          }
        >
          <h2 className={`mb-4 ${isMobile ? "text-sm" : "text-4xl"} text-black`}>카카오 로그인</h2>
          {/* http://localhost:3000/login/Login?code=Bz_lJsNW-zEoMJ_Tn7vMeQTLcX_egRTAo_br4kiWKbxHNoOiXQBRwAAAAAQKDQ0hAAABla4WD8Kvm_uHqQwxKA */}
          <img
            className="cursor-pointer"
            // src="//k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
            src={kakaoLoginImage}
            width="600"
            alt="카카오 로그인 버튼"
            onClick={() =>
              (window.location.href =
                import.meta.env.VITE_KAKAO_REDIRECTION_URL)
            }
          />
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

KakaoLoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default KakaoLoginModal;
