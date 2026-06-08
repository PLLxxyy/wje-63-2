import { X, Trash2, MapPin, GitCompare } from 'lucide-react';
import type { Bench, BenchTag } from '../../types/bench';
import { TAG_ICONS, TAG_COLORS } from '../../types/bench';
import { useBenchStore } from '../../store/useBenchStore';
import PhotoCarousel from '../Card/PhotoCarousel';
import Empty from '../Empty';

export default function ComparePanel() {
  const {
    compareBenchIds,
    toggleCompareMode,
    toggleCompareBench,
    clearCompare,
    getCompareBenches,
  } = useBenchStore();

  const compareBenches = getCompareBenches();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const hasMatchingTag = (tag: BenchTag, benches: Bench[]) => {
    return benches.every((b) => b.tags.includes(tag));
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm pointer-events-auto"
        onClick={toggleCompareMode}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      <div
        className="relative w-full max-w-7xl mx-4 mb-4 pointer-events-auto"
        style={{ animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-200">
          <div
            className="absolute top-0 left-0 right-0 h-3"
            style={{
              background:
                'repeating-linear-gradient(90deg, #F5F0E8, #F5F0E8 10px, #E8DCC8 10px, #E8DCC8 20px)',
            }}
          />

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                  <GitCompare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-stone-800"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    长椅对比
                  </h2>
                  <p
                    className="text-sm text-stone-500"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    已选择 {compareBenches.length}/4 张长椅
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {compareBenches.length > 0 && (
                  <button
                    onClick={clearCompare}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 text-stone-600 border border-stone-200 hover:bg-white hover:shadow-md transition-all font-medium text-sm"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    <Trash2 className="w-4 h-4" />
                    清空
                  </button>
                )}
                <button
                  onClick={toggleCompareMode}
                  className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>
            </div>

            {compareBenches.length === 0 ? (
              <Empty
                icon="🪑"
                title="点击地图上的长椅添加对比"
                subtitle="最多可以同时对比 4 张长椅"
              />
            ) : (
              <div
                className={`grid gap-4 ${
                  compareBenches.length === 1
                    ? 'grid-cols-1'
                    : compareBenches.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : compareBenches.length === 3
                    ? 'grid-cols-1 md:grid-cols-3'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {compareBenches.map((bench) => (
                  <div
                    key={bench.id}
                    className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 hover:shadow-xl transition-shadow"
                  >
                    <button
                      onClick={() => toggleCompareBench(bench.id)}
                      className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 hover:bg-red-50 rounded-full shadow-md transition-all hover:scale-110 group"
                    >
                      <X className="w-4 h-4 text-stone-500 group-hover:text-red-500" />
                    </button>

                    <div className="p-3">
                      <div
                        className="p-2 bg-stone-50 rounded-xl"
                        style={{
                          boxShadow:
                            '0 4px 12px -4px rgba(0,0,0,0.1)',
                        }}
                      >
                        <PhotoCarousel photos={bench.photos} />
                      </div>
                    </div>

                    <div className="px-4 pb-4 space-y-3">
                      <div>
                        <h3
                          className="text-lg font-bold text-stone-800 mb-1"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {bench.name}
                        </h3>
                        <div className="flex items-center gap-1 text-stone-500 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span style={{ fontFamily: "'Lora', serif" }}>
                            {bench.location}
                            {bench.city && (
                              <span className="text-amber-700">
                                {' '}
                                · {bench.city}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                          环境
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
                            compareBenches.every(
                              (b) => b.environmentType === bench.environmentType
                            )
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                          style={{ fontFamily: "'Lora', serif" }}
                        >
                          {bench.environmentType}
                          {compareBenches.every(
                            (b) => b.environmentType === bench.environmentType
                          ) && (
                            <span className="text-xs">✓ 相同</span>
                          )}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                          标签
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {bench.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                                hasMatchingTag(tag, compareBenches)
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : TAG_COLORS[tag]
                              }`}
                              style={{ fontFamily: "'Lora', serif" }}
                            >
                              <span>{TAG_ICONS[tag]}</span>
                              {tag}
                              {hasMatchingTag(tag, compareBenches) && (
                                <span className="text-xs">✓</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      {bench.description && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                            描述
                          </div>
                          <div
                            className="text-sm text-stone-600 leading-relaxed pl-3 border-l-2 border-amber-200"
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            {bench.description}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-stone-100">
                        <div
                          className="text-xs text-stone-400"
                          style={{ fontFamily: "'Lora', serif" }}
                        >
                          记录于 {formatDate(bench.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
