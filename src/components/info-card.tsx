"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link2, ImageIcon, FileText, Eye, Edit, Trash2, Calendar } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"
import { InformationItem as InfoItem, Tag } from "@/lib/types";
import Image from "next/image";

interface InfoCardProps {
  item: InfoItem;
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

  const isImage = item.type === 'image';
  let imageSourceForTag: string | undefined = undefined;
  let viewButtonHref: string | undefined = item.originalContent;

  if (isImage && item.originalContent) {
    if (item.originalContent.startsWith('data:image')) {
      imageSourceForTag = item.originalContent;
    } else {
      imageSourceForTag = `data:image/png;base64,${item.originalContent}`;
    }
    viewButtonHref = imageSourceForTag;
  }

  const createdAtDate = item.createdAt ? new Date(item.createdAt) : null;
  const displayDateStr = createdAtDate && !isNaN(createdAtDate.getTime())
    ? formatInTimeZone(createdAtDate, 'UTC', 'yyyy/MM/dd HH:mm')
    : "無效日期";

  const displayTags: Tag[] = Array.isArray(item.tags)
    ? item.tags.map((tag, index) =>
      typeof tag === 'string'
        ? { id: `tag-${index}-${item.id}`, name: tag }
        : tag
    )
    : [];

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {TypeIcon ? (
              <TypeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <div className="h-4 w-4 flex-shrink-0" />
            )}
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</h3>
          </div>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            {typeLabels[item.type] || "未知類型"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {item.description || "沒有介紹"}
        </p>

        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {displayTags.slice(0, 3).map((tag: Tag, index: number) => (
              <Badge key={tag.id || tag.name || `tag-${index}`} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {displayTags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{displayTags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3 w-3" />
          {displayDateStr}
        </div>

        {/* Original Content Display for non-image types */}
        {(item.type === 'link' || item.type === 'document') && item.originalContent && (
          <div className="text-xs text-muted-foreground truncate mt-1">
            <span className="font-medium">源內容: </span>
            <a href={item.originalContent} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
              {item.originalContent}
            </a>
          </div>
        )}

        {/* Image Preview - For type 'image' only */}
        {isImage && imageSourceForTag && (
          <div className="mt-2 relative aspect-video">
            <Image
              src={imageSourceForTag}
              alt={item.title}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 pt-4">
        <div className="flex gap-2 w-full">
          <Button asChild size="sm" variant="outline" className="flex-1" disabled={!viewButtonHref}>
            <a
              href={viewButtonHref || undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="h-3 w-3 mr-1" />
              查看
            </a>
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
