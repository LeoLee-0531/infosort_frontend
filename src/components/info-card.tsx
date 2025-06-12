"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link2, ImageIcon, FileText, Eye, Edit, Trash2, Calendar } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"
import { InformationItem as InfoItem } from "@/lib/types";

interface InfoCardProps {
  item: InfoItem; // item 的型別現在是從 @/lib/types 匯入的 InformationItem
  onDelete: () => void;
}

const typeIcons = {
  link: Link2,
  image: ImageIcon,
  document: FileText,
}

const typeLabels = {
  link: "連結",
  image: "圖片",
  document: "文件",
}

export function InfoCard({ item, onDelete }: InfoCardProps) {
  const TypeIcon = typeIcons[item.type];

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <TypeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</h3>
          </div>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            {typeLabels[item.type]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {item.summary ? item.summary : "沒有摘要"} {/* 添加空值檢查 */}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.name} variant="secondary" className="text-xs"> {/* 使用 tag.name 作為 key 和顯示 */}
              {tag.name}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{item.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {item.created_at && item.created_at instanceof Date && !isNaN(item.created_at.getTime())
            ? formatInTimeZone(item.created_at, 'UTC', 'yyyy/MM/dd HH:mm')
            : "無效日期"}
        </div>

        {/* Image Preview - For type 'image' only */}
        {item.type === 'image' && item.original_content && (
          <div className="mt-2">
            <img src={item.original_content} alt={item.title} className="max-w-full h-auto rounded" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 pt-4">
        <div className="flex gap-2 w-full">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            查看
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-3 w-3 mr-1" />
            編輯
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="h-3 w-3 mr-1" />
            刪除
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
