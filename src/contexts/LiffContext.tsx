"use client";

import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import liff, { Liff } from '@line/liff';
import { Profile } from '@liff/get-profile'; // 引入 Profile 的型別
import { InformationItem } from '@/lib/types'; // 匯入 InformationItem

// 定義 Context 要提供的值的型別
interface LiffContextType {
  liffObject: Liff | null;
  profile: Profile | null;
  error: string;
  isLoggedIn: boolean;
  items: InformationItem[]; // 新增 items 狀態
  fetchItems: () => Promise<void>; // 新增 fetchItems 函數以供外部調用刷新
}

// 建立 Context，並給予初始值
const LiffContext = createContext<LiffContextType>({
  liffObject: null,
  profile: null,
  error: '',
  isLoggedIn: false,
  items: [], // 初始化 items
  fetchItems: async () => { }, // 初始化 fetchItems
});

// 建立 Provider 元件
export const LiffProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [items, setItems] = useState<InformationItem[]>([]); // 新增 items 狀態管理

  const fetchItemsInternal = async (token: string, userId: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in environment variables');
      }
      const response = await fetch(`${apiBaseUrl}/items?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch items, status: ${response.status}`);
      }

      const fetchedItems = await response.json();
      setItems(fetchedItems);
    } catch (e: unknown) {
      console.error("Failed to fetch items:", e);
      if (e instanceof Error) {
        setError(prevError => prevError ? `${prevError}; ${e.message}` : e.message);
      } else {
        setError(prevError => prevError ? `${prevError}; ${String(e)}` : String(e));
      }
    }
  };

  // 公開的 fetchItems 函數，用於手動刷新
  const fetchItems = async () => {
    const token = localStorage.getItem('authToken');
    if (token && profile?.userId) {
      await fetchItemsInternal(token, profile.userId);
    } else {
      console.log("Cannot fetch items: Auth token or profile not available.");
      // setError("Cannot fetch items: Auth token or profile not available.");
    }
  };


  useEffect(() => {
    const initializeLiff = async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
          throw new Error('NEXT_PUBLIC_LIFF_ID 未在環境變數中定義');
        }

        await liff.init({ liffId });
        setLiffObject(liff);

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const userProfile = await liff.getProfile();
          setProfile(userProfile);

          const idToken = liff.getIDToken();
          if (idToken) {
            // 直接將 userProfile 傳遞給 verifyWithBackend
            await verifyWithBackend(idToken, userProfile);
            // 登入並驗證成功後，獲取 authToken 並抓取資料
            const authToken = localStorage.getItem('authToken');
            if (authToken && userProfile.userId) {
              await fetchItemsInternal(authToken, userProfile.userId);
            }
          }
        } else {
          // 如果未登入，則導向登入頁面
          liff.login();
        }
      } catch (e: unknown) {
        console.error(e);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
      }
    };

    initializeLiff();
  }, []);

  // 修改 verifyWithBackend 以接收 userProfile 參數
  const verifyWithBackend = async (idToken: string, currentUserProfile: Profile) => {
    console.log("NEXT_PUBLIC_API_BASE_URL from env:", process.env.NEXT_PUBLIC_API_BASE_URL);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in environment variables');
      }
      // 使用傳入的 currentUserProfile 而不是組件狀態的 profile
      if (!currentUserProfile || !currentUserProfile.userId) {
        console.error("Error: currentUserProfile or currentUserProfile.userId is not available.", currentUserProfile);
        throw new Error('User profile or userId is not available for backend verification.');
      }

      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 使用 currentUserProfile.userId
        body: JSON.stringify({ lineUserId: currentUserProfile.userId }),
      });

      if (!response.ok) {
        // 在解析為 JSON 前檢查內容類型
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || `後端驗證失敗，狀態碼: ${response.status}`);
        } else {
          // 處理非 JSON 回應 (例如 HTML 錯誤頁面)
          const errorText = await response.text();
          throw new Error(`後端驗證失敗。伺服器回應: ${errorText.substring(0, 100)}...`); // 顯示部分回應內容
        }
      }

      const data = await response.json();
      // 儲存後端回傳的 session token
      localStorage.setItem('authToken', data.token);
      // 驗證成功後，不需要在這裡立即抓取 items，因為 initializeLiff 中會處理
      // 或者，如果希望在 verifyWithBackend 完成後立即抓取，可以這樣做：
      // if (currentUserProfile.userId) {
      //   await fetchItemsInternal(data.token, currentUserProfile.userId);
      // }
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e)); // Handle cases where e might not be an Error instance
      }
    }
  };

  return (
    <LiffContext.Provider value={{ liffObject, profile, error, isLoggedIn, items, fetchItems }}>
      {children}
    </LiffContext.Provider>
  );
};

// 建立一個 custom hook，方便其他元件使用
export const useLiff = () => useContext(LiffContext);