import { Card, CardContent } from "@/components/ui/card"

export default function TotalProductCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Product In This Month</h3>
          <p className="text-2xl font-bold">2.213</p>
          <div className="mt-2 text-sm">
            <p>
              JNP <span className="font-medium">1.321</span>
            </p>
            <p>
              GRP <span className="font-medium">892</span>
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Product</h3>
          <p className="text-2xl font-bold">3,250,00</p>
        </CardContent>
      </Card>
    </div>
  )
}

