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
import useIsMobile from "@/hooks/useIsMobile";
import useParentSize from "@/hooks/useParentSize";

import { handleError } from "@/utils/errorHandler";

export default function UserInfoEdit({ userInfo, fetchData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [inputPassword, setInputPassword] = useState(""); // 입력 값을 저장할 상태 추가
  const [checkPassword, setCheckPassword] = useState(true);

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  // 초기 formData 상태 설정
  // userInfo에서 받아온 데이터로 초기값을 설정하며, 값이 없을 경우 빈 문자열로 초기화
  const [formData, setFormData] = useState({
    userName: userInfo.userName,
    loginType: userInfo.loginType,
    userEmail: userInfo.userEmail,
    homeAddress: userInfo.homeAddress,
    phoneNumber: userInfo.phoneNumber,
  });

  // 상위 컴포넌트인 MemberInfo.jsx 에서 오는 인자 "userInfo" 값이 바뀌면 새로 갱신처리
  // 용도 : BackEnd 업데이트 후 갱신처리
  useEffect(() => {
    setFormData({
      userName: userInfo.userName,
      loginType: userInfo.loginType,
      userEmail: userInfo.userEmail,
      homeAddress: userInfo.homeAddress,
      phoneNumber: userInfo.phoneNumber,
    });
  }, [userInfo]);

  // 폼 제출 시 기본 동작(페이지 새로고침) 방지
  const handleSubmit = async (e) => {
    e.preventDefault();

    // onChange: (e) => {
    //   if (inputPassword == e.target.value) {
    //     handleChange("newPassword", e.target.value);
    //   } else {
    //     handleChange("newPassword", "");
    //   }
    // },

    if (checkPassword === true && inputPassword.length > 0) {
      const formDataWithPassword = {
        ...formData,
        newPassword: inputPassword,
      };
      console.log("폼 제출 성공(Password):", formDataWithPassword);
      handleChange("newPassword", inputPassword);
      await updateData(formDataWithPassword);
    } else {
      console.log("폼 제출 성공:", formData);
      await updateData(formData);
    }

    await fetchData();

    // 정상적인 폼 처리 로직
  };

  // 입력 필드 값이 변경될 때마다 formData 상태 업데이트
  // 이전 상태를 유지하면서(prev) 변경된 필드만 새로운 값으로 업데이트
  // const handleChange = (field, value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };
  const handleChange = (field, value) => {
    console.log(field, value);
    setFormData((prev) => {
      // 값이 비어있으면 해당 필드를 제거한 새로운 객체 반환
      if (!value) {
        const newFormData = { ...prev };
        delete newFormData[field];
        return newFormData;
      }
      // 값이 있으면 기존처럼 업데이트
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const updateData = useCallback(
    async ({ ...kwargs }) => {
      setIsLoading(true);
      try {
        await sendRequest({
          url: "/api/user/updateUserInfo", // 로그인 엔드포인트
          method: "PATCH", // HTTP 메서드
          data: {
            ...kwargs,
          }, // 요청 데이터
          headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
        });

        console.log("회원 정보 수정 성공");
        alert("회원정보를 성공적으로 수정하였습니다.");
      } catch (err) {
        console.log("회원 정보 수정 실패");
        handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    },
    [authStatus.token, sendRequest]
  );

  const { isMobile, windowWidth } = useIsMobile();
  const { targetRef, parentSize } = useParentSize();
  const textStyle3xl = isMobile ? "text-sm" : "text-3xl";
  const textStyle2xl = isMobile ? "text-xs" : "text-2xl";
  const logoStyle = `w-auto ${isMobile ? "h-6" : "h-12"}`;

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
      <div
        // className="flex flex-row w-full h-full border border-gray-800"
        className="flex flex-row w-full h-full border border-white"
        ref={targetRef}
      >
        <div
          className={`flex items-center justify-center ${textStyle3xl} bg-gray-700`}
          style={{ width: `${parentSize.width / 3}px` }}
        >
          {label}
        </div>
        <div className={`flex w-full pt-3 pb-3 ${textStyle3xl} bg-inherit`}>
          <div className="flex flex-col">
            <input
              className="ml-4 text-white appearance-none bg-inherit border-inherit"
              style={
                isMobile
                  ? { width: `${(parentSize.width / 3) * 2}px` }
                  : { width: `${parentSize.width / 3}px` }
              }
              type={type}
              pattern={pattern}
              placeholder={placeholder}
              onChange={onChange}
              {...(value ? { value } : {})} // value가 있을 때만 적용
              disabled={disabled}
              autoFocus
            />
            {label == "비밀번호 확인"
              ? checkPassword || (
                  <p
                    className={`flex items-center ml-4 ${textStyle2xl} text-red-700`}
                  >
                    비밀번호가 다릅니다.
                  </p>
                )
              : null}
          </div>
          {isMobile ? null : (
            <span
              className={`flex items-center ml-2 ${textStyle2xl} text-gray-500`}
            >
              {description}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />

      {/* <div className="flex flex-col border border-white"> */}
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
                // pattern: "^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{6,20}$",
                // pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()]{6,20}$",
                pattern:
                  "^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()]{6,20}$",
                description: "(영문자/숫자, 6~20자) 특수문자 가능",
                placeholder: "",
                value: "",
                onChange: (e) => {
                  setInputPassword(e.target.value);
                  if (e.target.value.length == 0) setCheckPassword(true);
                },
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
                // pattern: "^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{6,20}$",
                // pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!@#$%^&*()]{6,20}$",
                pattern:
                  "^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()]{6,20}$",
                placeholder: "",
                value: "",
                description: "(영문자/숫자, 6~20자) 특수문자 가능",
                onChange: (e) => {
                  if (inputPassword == e.target.value) {
                    setCheckPassword(true);
                  } else {
                    setCheckPassword(false);
                  }
                },
                // onChange: (e) => {
                //   if (inputPassword == e.target.value) {
                //     handleChange("newPassword", e.target.value);
                //   } else {
                //     handleChange("newPassword", "");
                //   }
                // },
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
            // pattern: "^[가-힣a-zA-Z0-9\\s,-]{2,100}$",    // 한글, 영문, 숫자, 공백, 쉼표, 하이픈 허용
            pattern: "^[가-힣a-zA-Z0-9\\s,\\-]{2,100}$", // `-`를 이스케이프 처리
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
          <div className="flex flex-row items-center justify-center pt-8 space-x-2">
            <button
              // className="text-3xl text-white bg-gray-800 min-w-60 hover:bg-gray-500"
              className={`text-white bg-gray-800 min-w-60 hover:bg-gray-500 ${textStyle3xl}`}
            >
              회원정보 수정
            </button>
            {/* <button
              className="text-3xl text-white bg-gray-800 min-w-60 hover:bg-gray-500"
              onClick={() => {
                console.log("취소");
              }}
            >
              취소
            </button> */}
          </div>
        </form>
      </div>
    </>
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
  fetchData: PropTypes.func,
};
