import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">💍 Wedding Invite Builder</h1>
          <p className="text-gray-500 mt-2">Tùy chỉnh thiệp cưới — thay ảnh, tên, ngày, địa điểm</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/admin"
            className="px-6 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors shadow-sm"
          >
            Mở Builder →
          </Link>
          <Link
            href="/invite"
            target="_blank"
            className="px-6 py-3 border border-rose-300 text-rose-600 rounded-xl font-medium hover:bg-rose-50 transition-colors"
          >
            Xem Thiệp ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
