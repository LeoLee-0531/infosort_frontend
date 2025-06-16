// src/lib/types.ts

// 根據您的資料庫 schema (已調整為符合 API 範例的駝峰式命名)
export interface InformationItem {
  id: string;
  title: string;
  description?: string;
  type: 'link' | 'image' | 'document'; // 保持原有类型，API 範例中 type: "link"
  originalContent: string;
  userId: string;
  createdAt: string; // API 回傳字串
  updatedAt: string; // API 回傳字串
  tags: Tag[]; // API 範例中為空陣列 []
}

export interface Tag {
  id: string; // 假設 Tag 也有 id
  name: string;
  // description?: string; // API 範例中 Tag 沒有 description
  // createdAt: string; // API 範例中 Tag 沒有 createdAt
  // updatedAt: string; // API 範例中 Tag 沒有 updatedAt
}

// 注意：ApiInformationItem 和 ApiTag 已在 api.ts 中定義，它們處理 API 回傳的原始字串日期和 _id
// 在組件中，我們可能希望將這些轉換為更易用的格式，例如 Date 物件和 id (如果前端習慣用 id)
// 此處型別已調整為直接反映 API 範例的駝峰式命名和字串日期。