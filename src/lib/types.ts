// src/lib/types.ts (或 src/types/index.ts)

// 根據您的資料庫 schema
export interface InformationItem {
  _id: string; // 資料庫使用 _id
  user_id: string;
  type: 'link' | 'image' | 'document';
  original_content: string; // 原始連結、檔案儲存路徑或文字內容
  title: string;
  summary?: string; // LLM 生成的摘要，API 有回傳
  created_at: Date; // 在前端可以轉換成 Date 物件
  updated_at: Date; // 在前端可以轉換成 Date 物件
  tags: Tag[]; // 關聯的標籤
}

export interface Tag {
  _id: string; // 資料庫使用 _id
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// 注意：ApiInformationItem 和 ApiTag 已在 api.ts 中定義，它們處理 API 回傳的原始字串日期和 _id
// 在組件中，我們可能希望將這些轉換為更易用的格式，例如 Date 物件和 id (如果前端習慣用 id)
// 但為了簡化，我們先直接使用 ApiInformationItem 和 ApiTag 的結構，並注意 _id 和字串日期。