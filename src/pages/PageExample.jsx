// src/pages/PageExample.jsx
// import {
//   useEffect,
//   useState,
//   useContext,
//   useCallback,
//   useRef,
//   useMemo,
// } from "react";
import {
  useState,
  useContext,
  useCallback,
} from "react";
import PropTypes from 'prop-types';

import LoadingSpinner from "@/components/atoms/LoadingSpinner";

import ErrorModal from "@/components/molecules/ErrorModal";

import { AuthContext } from "@/context/AuthContext";

import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅

import { handleError } from "@/utils/errorHandler";

export default function PageExample({ a={status:11,msg:"msg"}, b, c, d, e = "text-gray-700" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();
  const authStatus = useContext(AuthContext);

  const exampleBackRequest = useCallback(
    async (macAddress, deviceType, battery, selectedGroup) => {
      try {
        setIsLoading(true); // 로딩 상태 시작
        await sendRequest({
          url: `/api/device/${authStatus.dbObjectId}/deviceCreate`, // API 엔드포인트
          method: "POST", // HTTP 메서드
          headers: { Authorization: `Bearer ${authStatus.token}` }, // 현재 토큰을 Authorization 헤더에 포함
          data: {
            deviceGroup: selectedGroup,
            macAddress, deviceType, battery
          }, // 요청 데이터
        });
        // await fetchDeviceList();
      } catch (err) {
        handleError(err, setErrorMessage, setIsErrorModalOpen); // 공통 에러 처리 함수 호출
        console.log(`에러 처리`);
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    },
    [authStatus.dbObjectId, authStatus.token, sendRequest]
  );
  /**
    await createDevice(
      "AA:BB:CC:DD:EE:FF",
      "deviceType2",
      "99",
      "deviceType2"
    );
  */

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        content={errorMessage}
      />
      <h1>PageExample</h1>
    </>
  );
}


PageExample.propTypes = {
  a: PropTypes.shape({
    status: PropTypes.number,
    msg: PropTypes.string,
  }).isRequired,
  b: PropTypes.elementType,
  c: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  d: PropTypes.func.isRequired,
  e: PropTypes.string,
};