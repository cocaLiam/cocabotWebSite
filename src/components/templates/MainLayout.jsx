// components/templates/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopNavigation from "@/components/organisms/TopNavigation";
// import BottomNavigation from "@/components/organisms/BottomNavigation";
// import SideBar from "@/components/organisms/SideBar";

const MainLayout = () => {
  return (
      <div className="fixed inset-0 w-full h-full bg-neutral-900">
      {/* 전체화면 컨테이너 */}

      {/* <SideBar isOpen={isDrawerOpen} onClose={handleDrawerClose} /> */}
      {/* 사이드바 컴포넌트 컨테이너 */}

      {/* <BottomNavigation onDrawerOpen={handleDrawerOpen} /> */}
      {/* Bottom GNB 컴포넌트 컨테이너 */}

      <TopNavigation topGnbPosition="h-1/12"/>
      {/* TOP GNB 컴포넌트 컨테이너 */}
      {/* <main> */}
      {/* <main className="pt-1/12"> */}
      <main className="relative w-full mt-[8.33vh] inset-0" style={{ height: "calc(100% - 8.33vh)" }}> {/* h-11/12는 남은 공간, mt-[8.33vh]는 TopNav 높이만큼 마진 */}
        {/* 메인 콘텐츠 영역 - 웹 접근성과 SEO를 위한 시맨틱 태그  << 의미적으로 있는 태그*/}

        {/* <div className="fixed inset-0 w-full h-full"> */}
        {/* <div className="fixed inset-0 w-full h-full pb-16 overflow-auto"> */}
        <div
          // className="fixed inset-0 w-full h-full pt-12 overflow-auto"
          className="absolute w-full h-full overflow-auto bg-gray-200"
          style={{ paddingBottom: "64px" }}
        >
          {/* Pages 들이 사용하는 컨테이너 정의 */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
