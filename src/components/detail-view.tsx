"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Save,
  Trash2,
  Edit,
  ExternalLink,
  Link2,
  ImageIcon,
  FileText,
  Calendar,
  Clock,
  Tag,
  Plus,
  X,
} from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface InfoItem {
  id: string
  title: string
  summary: string
  content?: string
  type: "link" | "image" | "document"
  tags: string[]
  createdAt: Date
  updatedAt?: Date
  thumbnail?: string
  url?: string
  notes?: string
}

interface DetailViewProps {
  item: InfoItem
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

export function DetailView({ item }: DetailViewProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [tags, setTags] = useState(item.tags)
  const [newTag, setNewTag] = useState("")
  const [notes, setNotes] = useState(item.notes || "")
  const [deleteDialog, setDeleteDialog] = useState(false)

  const TypeIcon = typeIcons[item.type]

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes:", { tags, notes })
    setIsEditing(false)
  }

  const handleDelete = () => {
    // Handle delete logic here
    console.log("Deleting item:", item.id)
    router.push("/")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTag()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <TypeIcon className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-semibold">資訊詳情</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  取消
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  儲存變更
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  編輯
                </Button>
                <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      刪除
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>確認刪除</DialogTitle>
                      <DialogDescription>此操作無法復原。確定要刪除這筆資訊嗎？</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                        取消
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        確認刪除
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Type */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  {typeLabels[item.type]}
                </Badge>
                <h1 className="text-3xl font-bold leading-tight">{item.title}</h1>
              </div>

              {item.url && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="h-4 w-4" />
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.url}
                  </a>
                </div>
              )}
            </div>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>完整內容</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Thumbnail for images */}
                {item.type === "image" && item.thumbnail && (
                  <div className="w-full">
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full max-w-2xl mx-auto rounded-lg border bg-muted"
                    />
                  </div>
                )}

                {/* Content based on type */}
                <div className="prose prose-sm max-w-none">
                  {item.type === "link" && (
                    <p className="text-muted-foreground">
                      這是一個網頁連結。點擊上方的連結可以在新分頁中開啟原始頁面。 以下是從網頁中提取的主要內容摘要。
                    </p>
                  )}

                  {item.type === "document" && (
                    <p className="text-muted-foreground">
                      這是從文件中提取的純文字內容。原始檔案格式可能包含更多的格式資訊。
                    </p>
                  )}

                  <p>
                    這裡會顯示完整的內容文字。在實際應用中，這裡會顯示從網頁、圖片或文件中
                    提取出的完整文字內容。內容會保持原始的段落結構，讓使用者能夠完整閱讀。
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card>
              <CardHeader>
                <CardTitle>AI 生成摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{item.summary}</p>
              </CardContent>
            </Card>

            {/* Personal Notes */}
            <Card>
              <CardHeader>
                <CardTitle>個人筆記</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    placeholder="在此添加個人筆記或註解..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                ) : (
                  <div className="min-h-[120px] p-3 rounded-md border bg-muted/50">
                    {notes ? (
                      <p className="text-sm whitespace-pre-wrap">{notes}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">尚未添加個人筆記</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">資訊詳情</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">建立時間:</span>
                  <span>{format(item.createdAt, "yyyy年MM月dd日 HH:mm")}</span>
                </div>

                {item.updatedAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">更新時間:</span>
                    <span>{format(item.updatedAt, "yyyy年MM月dd日 HH:mm")}</span>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">標籤管理</span>
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="輸入新標籤"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={addTag}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        {isEditing && (
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:bg-muted-foreground/20 rounded-sm"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {tags.length === 0 && <p className="text-xs text-muted-foreground italic">尚未添加標籤</p>}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回總覽
                </Button>

                {item.url && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      開啟原始連結
                    </a>
                  </Button>
                )}

                <Button variant="outline" className="w-full justify-start">
                  <Tag className="h-4 w-4 mr-2" />
                  查看相似內容
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
