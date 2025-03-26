// src/pages/NaverLoginCallback2.jsx

import React, { useEffect } from "react";
import jwtDecode from "jwt-decode";

const NaverLoginCallback2 = () => {
  useEffect(() => {
    const naver_id_login = new window.naver_id_login(
      import.meta.env.VITE_NAVER_CLIENT_ID,
      import.meta.env.VITE_NAVER_CALLBACK_URL
    );

    console.log("----------------------------------------------1");
    naver_id_login.get_naver_userprofile("naverSignInCallback()");

    window.naverSignInCallback = async () => {
      console.log("----------------------------------------------2");
      const email = naver_id_login.getProfileData("email");
      const nickname = naver_id_login.getProfileData("nickname");
      const profileImage = naver_id_login.getProfileData("profile_image");
      const age = naver_id_login.getProfileData("age");
      const gender = naver_id_login.getProfileData("gender");
      const id = naver_id_login.getProfileData("id");
      const name = naver_id_login.getProfileData("name");
      const birthday = naver_id_login.getProfileData("birthday");

      const userProfile = {
        email,
        nickname,
        profileImage,
        age,
        gender,
        id,
        name,
        birthday,
        idToken: naver_id_login.oauthParams.access_token,
      };

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER}/api/oauth/naverLogin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ payload: userProfile }),
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          const { dbObjectId, token } = responseData;
          const newTokenExpiration = new Date(jwtDecode(token).exp * 1000);
          localStorage.setItem(
            "tokenData",
            JSON.stringify({
              dbObjectId,
              token,
              expiration: newTokenExpiration,
            })
          );

          window.location.href = "/";
        } else {
          console.error("서버 에러:", responseData.message || "로그인 실패");
          window.location.href = `/login/Login?error=NaverLoginFail&errorMsg=${responseData.message}`;
        }
      } catch (error) {
        console.error("요청 중 에러 발생:", error);
      }
    };
  }, []);

  return (
    <div>
      <h1 id="loginStatus">Naver Login ...</h1>
      <p id="loginMessage">wait a moment please</p>
    </div>
  );
};

export default NaverLoginCallback2;
