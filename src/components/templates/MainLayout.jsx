// components/templates/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopNavigation from "@/components/organisms/TopNavigation";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import SideBar from "@/components/organisms/SideBar";

const MainLayout = () => {
  return (
      <div className="fixed inset-0 w-full h-full bg-neutral-900">
      {/* 전체화면 컨테이너 */}

      {/* <SideBar isOpen={isDrawerOpen} onClose={handleDrawerClose} /> */}
      {/* 사이드바 컴포넌트 컨테이너 */}

      {/* <BottomNavigation onDrawerOpen={handleDrawerOpen} /> */}
      {/* Bottom GNB 컴포넌트 컨테이너 */}

      <TopNavigation />
      {/* TOP GNB 컴포넌트 컨테이너 */}
      <main>
        {/* 메인 콘텐츠 영역 - 웹 접근성과 SEO를 위한 시맨틱 태그  << 의미적으로 있는 태그*/}

        {/* <div className="fixed inset-0 w-full h-full"> */}
        {/* <div className="fixed inset-0 w-full h-full pb-16 overflow-auto"> */}
        <div
          className="fixed inset-0 w-full h-full pt-24 overflow-auto"
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
