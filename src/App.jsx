// App.jsx
import React, { Suspense, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoadingSpinner from './components/atoms/LoadingSpinner';

import MainLayout from "@/components/templates/MainLayout";

import { LoadingProvider } from "@/context/LoadingContext";
import { AuthContext } from "@/context/AuthContext";

// 각 페이지들
const AllProducts = React.lazy(() => import("@/pages/AllProducts"));    // 1. 전체 상품
const CompanyStory = React.lazy(() => import("@/pages/CompanyStory"));  // 2. 회사 스토리
const CustomerService = React.lazy(() => import("@/pages/CustomerService"));  // 3. 고객 서비스
const Login = React.lazy(() => import("@/pages/login/Login"));  // 4-1. 로그인 (로그아웃 상태)
                                                          // 4-2. 로그아웃 (로그인 상태) <- Page가 아닌 버튼 레벨
const Signup = React.lazy(() => import("@/pages/Signup"));  // 5-1. 회원가입 (로그아웃 상태)
const MemberInfo = React.lazy(() => import("@/pages/MemberInfo")); // 5-2. 회원정보 (로그인 상태)
const MyPage = React.lazy(() => import("@/pages/MyPage")); // 6-1. 마이 페이지 ( 로그아웃 상태 일시, Login Page 라우팅)
                                                           // 6-2. 마이 페이지 ( 로그인 상태 일시, MyPage 라우팅)
const PageExample = React.lazy(() => import("@/pages/PageExample")); // Test 및 example Page
const KakaoLoginPage = React.lazy(() => import("@/pages/login/KakaoLoginPage")); // 카카오톡 로그인 처리 페이지지
import "./App.css";

function App() {
  useEffect(() => {
    console.log(`%c
    ┏━━━━━━━━━━━━┓
    ┃    COCABOT WEBSITE     ┃
    ┃     Version: ${import.meta.env.VITE_WEB_VERSION}       ┃
    ┃   Starting System...   ┃
    ┗━━━━━━━━━━━━┛`, 
    'color: #4CAF50; font-weight: bold; font-size: 12px;'
  );
  }, []);

  const authStatus = useContext(AuthContext)
  
  let routingPages;
  if (authStatus.isLoggedIn){
    // 로그인 상태
    routingPages = (
      <React.Fragment>
        {/* Bottom GNB 영역 */}
        <Route path="/" element={<AllProducts />} />
        <Route path="/CompanyStory" element={<CompanyStory />} />
        <Route path="/CustomerService" element={<CustomerService />} />
        {/* <Route path="/Login" element={<Login />} /> */}
        {/* <Route path="/Signup" element={<Signup />} /> */}
        <Route path="/MemberInfo" element={<MemberInfo />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/PageExample" element={<PageExample />} />

        <Route path="/login/KakaoLoginPage" element={<KakaoLoginPage />} />
      </React.Fragment>
    );
  } else{
    // 로그아웃 상태
    routingPages = (
      <React.Fragment>
        {/* Bottom GNB 영역 */}
        <Route path="/" element={<AllProducts />} />
        <Route path="/CompanyStory" element={<CompanyStory />} />
        <Route path="/CustomerService" element={<CustomerService />} />
        <Route path="/login/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        {/* <Route path="/MemberInfo" element={<MemberInfo />} /> */}
        {/* <Route path="/MyPage" element={<MyPage />} /> */}
        <Route path="/PageExample" element={<PageExample />} />

        <Route path="/login/KakaoLoginPage" element={<KakaoLoginPage />} />
      </React.Fragment>
    );
  }

  return (
    <LoadingProvider>  {/*Context API(전역 상태 관리) 를 써서 앱 전체에서 로딩 상태를 공유하기 위해 최상위 컴포넌트인 App을 Provider로 감싸야함*/}

      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner/>}>  {/* React.lazy 동적 컴포넌트(Pages)들이 로딩 될때 까지 fallback 함수실행 */}
          <Routes>

            <Route element={<MainLayout />}> {/* MainLayout을 부모 Route로 설정 */}
                {routingPages}
                <Route path="*" element={<Navigate to="/" />} /> {/* Routing 하는 경로 이외의 Link 는 / <- Home 으로 리다이렉팅 */}
            </Route>

          </Routes>
        </Suspense>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
