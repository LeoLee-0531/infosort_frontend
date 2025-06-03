import { DetailView } from "@/components/detail-view"
import { mockData } from "@/lib/mock-data"
import { notFound } from "next/navigation"

interface PageProps {
  params: { id: string }
}

export default function DetailPage({ params }: PageProps) {
  const item = mockData.find((item) => item.id === params.id)

  if (!item) {
    notFound()
  }

  return <DetailView item={item} />
}
