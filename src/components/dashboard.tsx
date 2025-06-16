"use client"

import { useState } from "react"
import Image from "next/image"; // Import Image component
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Filter, CalendarIcon, Link2, ImageIcon, FileText, X, User, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { InfoCard } from "@/components/info-card"
import { InformationItem, Tag } from "@/lib/types"; // 匯入 InformationItem 和 Tag
import { useLiff } from "@/contexts/LiffContext"; // Import useLiff hook

interface DashboardProps { // 定義 props 的介面
  items: InformationItem[];
}

export function Dashboard({ items }: DashboardProps) { // 接收 items prop
  const { profile } = useLiff(); // Get profile from LiffContext
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; itemId: string | null }>({
    open: false,
    itemId: null,
  })

  // Mock data for demonstration
  const allTags = ["技術", "新聞", "教育", "娛樂", "工作", "健康", "旅遊", "美食", "科技", "設計"]
  // const infoItems = mockData // 使用傳入的 items 替換 mockData
  const infoItems = items;

  const filteredItems = infoItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      // 使用 item.tags 替換 item.tagAssociations
      (item.tags && item.tags.some((tag: Tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesType = selectedType === "all" || item.type === selectedType

    // 使用 item.tags 替換 item.tagAssociations
    const matchesTags = selectedTags.length === 0 || (item.tags && item.tags.some(itemTag => selectedTags.includes(itemTag.name)))

    // Date range filtering logic (assuming item.date is a Date object or string that can be parsed)
    // This part needs to be implemented if date filtering is required.
    // For now, it's not affecting the 'selected' prop issue.
    // const matchesDate = !dateRange?.from || (
    //   new Date(item.date) >= dateRange.from &&
    //   (!dateRange.to || new Date(item.date) <= dateRange.to)
    // );

    return matchesSearch && matchesType && matchesTags // && matchesDate;
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedTags([])
    setDateRange(undefined)
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleDelete = (itemId: string) => {
    setDeleteDialog({ open: true, itemId })
  }

  const confirmDelete = () => {
    // Handle delete logic here
    console.log("Deleting item:", deleteDialog.itemId)
    setDeleteDialog({ open: false, itemId: null })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">資訊總覽</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {profile && profile.pictureUrl ? (
                <Image
                  src={profile.pictureUrl}
                  alt={profile.displayName || "User"}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                {profile ? profile.displayName : "使用者"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="border-b bg-muted/50 p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋標題、摘要、內容或標籤..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">篩選:</span>
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="資訊類型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="all">全部類型</SelectItem>
              <SelectItem key="link" value="link">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  連結
                </div>
              </SelectItem>
              <SelectItem key="image" value="image">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  圖片
                </div>
              </SelectItem>
              <SelectItem key="document" value="document">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  文件
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Tag Filter */}
          <Select
            value=""
            onValueChange={(tag) => {
              if (tag && !selectedTags.includes(tag)) {
                setSelectedTags([...selectedTags, tag])
              }
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="選擇標籤" />
            </SelectTrigger>
            <SelectContent>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag} disabled={selectedTags.includes(tag)}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-60 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "yyyy/MM/dd")} - {format(dateRange.to, "yyyy/MM/dd")}
                    </>
                  ) : (
                    format(dateRange.from, "yyyy/MM/dd")
                  )
                ) : (
                  <span>選擇日期範圍</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange?.from ? { from: dateRange.from, to: dateRange.to } : undefined}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
            清除篩選
          </Button>
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">已選標籤:</span>
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 hover:bg-muted-foreground/20 rounded-sm">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">沒有找到相關資訊</h3>
            <p className="text-muted-foreground mb-4">嘗試調整搜尋條件或清除篩選條件</p>
            <Button variant="outline" onClick={clearFilters}>
              清除所有篩選
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <InfoCard key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, itemId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
            <DialogDescription>此操作無法復原。確定要刪除這筆資訊嗎？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, itemId: null })}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              確認刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
