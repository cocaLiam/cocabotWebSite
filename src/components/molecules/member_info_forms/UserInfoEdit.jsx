// @/components/molecules/member_info_forms/UserInfoEdit.jsx
// import {
//   useEffect,
//   useState,
//   useContext,
//   useCallback,
//   useRef,
//   useMemo,
// } from "react";
import { useState, useContext, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import ErrorModal from "@/components/molecules/ErrorModal";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { handleError } from "@/utils/errorHandler";

export default function UserInfoEdit({ userInfo, onFormDataChange }) {
  const [inputPassword, setInputPassword] = useState(""); // 입력 값을 저장할 상태 추가

  // 초기 formData 상태 설정
  // userInfo에서 받아온 데이터로 초기값을 설정하며, 값이 없을 경우 빈 문자열로 초기화
  const [formData, setFormData] = useState({
    userName: userInfo.userName || "",
    loginType: userInfo.loginType || "",
    userEmail: userInfo.userEmail || "",
    homeAddress: userInfo.homeAddress || "",
    phoneNumber: userInfo.phoneNumber || "",
  });

  // 상위 컴포넌트인 MemberInfo.jsx 에서 오는 인자 "userInfo" 값이 바뀌면 새로 갱신처리
  // 용도 : BackEnd 업데이트 후 갱신처리
  useEffect(() => {
    setFormData({
      userName: userInfo.userName || "",
      loginType: userInfo.loginType || "",
      userEmail: userInfo.userEmail || "",
      homeAddress: userInfo.homeAddress || "",
      phoneNumber: userInfo.phoneNumber || "",
    });
  }, [userInfo]);

  // formData가 변경될 때마다 부모 컴포넌트에 데이터 전달
  // 자식 컴포넌트의 상태 변화를 부모 컴포넌트에 실시간으로 알림
  useEffect(() => {
    onFormDataChange(formData);
  }, [formData, onFormDataChange]);

  // 폼 제출 시 기본 동작(페이지 새로고침) 방지
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 정상적인 폼 처리 로직
    console.log("폼 제출 성공:", formData);
  };

  // 입력 필드 값이 변경될 때마다 formData 상태 업데이트
  // 이전 상태를 유지하면서(prev) 변경된 필드만 새로운 값으로 업데이트
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formField = ({
    /* 입력 필드 */
    label = "label",
    type = "text",
    pattern = "",
    placeholder = "",
    value = "",
    description = "",
    onChange = () => {},
    disabled = false,
  }) => {
    return (
      <div className="flex flex-row w-full border border-gray-800">
        <div className="flex items-center justify-center text-3xl bg-gray-700 min-w-60">
          {label}
        </div>
        <div className="flex w-full pt-3 pb-3 text-3xl bg-inherit">
          <input
            className="ml-4 text-white appearance-none w-80 bg-inherit border-inherit"
            type={type}
            pattern={pattern}
            placeholder={placeholder}
            onChange={onChange}
            {...(value ? { value } : {})} // value가 있을 때만 적용
            disabled={disabled}
            required
            autoFocus
          />
          <span className="flex items-center ml-2 text-base text-gray-500">
            {description}
          </span>
        </div>
      </div>
    );
  };

  return (
    // <div>
    //   {userInfo && Object.entries(userInfo).map(([key, value]) => (
    //     <p key={key}>
    //       {key}: {value + ` : ${Object.prototype.toString.call(value)}`}
    //     </p>
    //   ))}
    // </div>

    // <div className="flex flex-col border border-white">
    <div className="flex flex-col">
      {/* 회원정보 입력 폼 */}

      <form onSubmit={handleSubmit}>
        {formField({
          label: "이메일",
          type: "email",
          pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
          placeholder: "",
          value: userInfo.userEmail,
          description: "",
          // onChange: (e) => handleEmailChange(e),
          disabled: true,
        })}
        {userInfo.loginType === "email"
          ? formField({
              label: "변경할 비밀번호",
              type: "password",
              pattern: "^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{6,20}$",
              description: "(영문자/숫자, 6~20자) 특수문자 가능",
              placeholder: "",
              value: "",
              onChange: (e) => setInputPassword(e.target.value),
              disabled: false,
            })
          : formField({
              label: "변경할 비밀번호",
              description: "(영문자/숫자, 6~20자)",
              value: `${userInfo.loginType} 로그인 유저`,
              disabled: true,
            })}
        {userInfo.loginType === "email"
          ? formField({
              label: "비밀번호 확인",
              type: "password",
              pattern: "^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{6,20}$",
              placeholder: "",
              value: "",
              description: "(영문자/숫자, 6~20자) 특수문자 가능",
              onChange: (e) => {
                if (inputPassword == e.target.value) {
                  handleChange("newPassword", e.target.value);
                }
              },
              disabled: false,
            })
          : formField({
              label: "비밀번호 확인",
              value: `${userInfo.loginType} 로그인 유저`,
              disabled: true,
            })}
        {formField({
          label: "이름",
          type: "text",
          pattern: "^[가-힣a-zA-Z\\s]{2,20}$",
          placeholder: userInfo.userName,
          value: "",
          description: "(영문/한글/공백, 2~20자)",
          onChange: (e) => handleChange("userName", e.target.value),
          disabled: false,
        })}
        {formField({
          label: "주소",
          type: "text",
          pattern: "^[가-힣a-zA-Z0-9\\s,-]{2,100}$", // 한글, 영문, 숫자, 공백, 쉼표, 하이픈 허용
          placeholder: userInfo.homeAddress,
          value: "",
          description: "(한글/영문/숫자/공백/쉼표/하이픈 허용)",
          onChange: (e) => handleChange("homeAddress", e.target.value),
          disabled: false,
        })}
        {formField({
          label: "전화번호",
          type: "tel", // 전화번호 입력에 적합한 type
          pattern: "^\\d{2,3}-\\d{3,4}-\\d{4}$", // 전화번호 형식 (예: 010-1234-5678)
          placeholder: userInfo.phoneNumber,
          value: "",
          description: "(예: 010-1234-5678)",
          onChange: (e) => handleChange("phoneNumber", e.target.value),
          disabled: false,
        })}
        {/* <input type="submit" value="전송" onClick={() => {console.log(11111111111)}}/> */}
      </form>
    </div>
  );
}

UserInfoEdit.propTypes = {
  userInfo: PropTypes.shape({
    userName: PropTypes.string,
    loginType: PropTypes.string,
    userEmail: PropTypes.string,
    homeAddress: PropTypes.string,
    phoneNumber: PropTypes.string,
    deviceList: PropTypes.array,
    deviceGroupList: PropTypes.array,
  }),
  onFormDataChange: PropTypes.func.isRequired,
};
