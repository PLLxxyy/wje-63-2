import { X, Trash2, MapPin, GitCompare, Check } from 'lucide-react';
import type { Bench, BenchTag, EnvironmentType } from '../../types/bench';
import { TAG_ICONS, TAG_COLORS, BENCH_TAGS, ENVIRONMENT_TYPES } from '../../types/bench';
import { useBenchStore } from '../../store/useBenchStore';
import PhotoCarousel from '../Card/PhotoCarousel';
import Empty from '../Empty';

export default function ComparePanel() {
  const {
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

  const hasMatchingEnvironment = (env: EnvironmentType, benches: Bench[]) => {
    return benches.every((b) => b.environmentType === env);
  };

  const getGridClass = () => {
    const count = compareBenches.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4';
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm pointer-events-auto"
        onClick={toggleCompareMode}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      <div
        className="relative w-full max-w-7xl mx-4 mb-4 pointer-events-auto max-h-[90vh] overflow-hidden"
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

          <div className="relative p-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 z-10 pb-4 -mt-2 pt-2">
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
              <div className="space-y-8">
                <section>
                  <div className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-violet-500 rounded-full" />
                    照片
                  </div>
                  <div className={`grid gap-4 ${getGridClass()}`}>
                    {compareBenches.map((bench) => (
                      <div key={bench.id} className="relative">
                        <button
                          onClick={() => toggleCompareBench(bench.id)}
                          className="absolute -top-2 -right-2 z-10 p-1.5 bg-white/90 hover:bg-red-50 rounded-full shadow-md transition-all hover:scale-110 group"
                        >
                          <X className="w-3.5 h-3.5 text-stone-500 group-hover:text-red-500" />
                        </button>
                        <div
                          className="p-2 bg-white rounded-2xl shadow-lg"
                          style={{
                            boxShadow: '0 4px 12px -4px rgba(0,0,0,0.1)',
                          }}
                        >
                          <PhotoCarousel photos={bench.photos} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    基本信息
                  </div>
                  <div className={`grid gap-4 ${getGridClass()}`}>
                    {compareBenches.map((bench) => (
                      <div key={bench.id} className="bg-white rounded-2xl p-4 shadow-lg border border-amber-100">
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
                              <span className="text-amber-700"> · {bench.city}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    环境类型
                  </div>
                  <div className={`grid gap-4 ${getGridClass()}`}>
                    {compareBenches.map((bench) => {
                      const allMatch = hasMatchingEnvironment(bench.environmentType, compareBenches);
                      return (
                        <div
                          key={bench.id}
                          className={`rounded-2xl p-4 shadow-lg border ${
                            allMatch
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-white border-stone-200'
                          }`}
                        >
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                              allMatch
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-stone-100 text-stone-600 border-stone-200'
                            }`}
                            style={{ fontFamily: "'Lora', serif" }}
                          >
                            {bench.environmentType}
                            {allMatch && (
                              <span className="flex items-center gap-1 text-xs">
                                <Check className="w-3 h-3" /> 全部相同
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <div className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    标签对比
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-amber-100">
                    <div className="space-y-3">
                      {BENCH_TAGS.map((tag) => {
                        const allHave = hasMatchingTag(tag, compareBenches);
                        return (
                          <div key={tag} className="flex items-center gap-3">
                            <span
                              className={`w-12 text-xs font-medium ${
                                allHave ? 'text-emerald-600' : 'text-stone-400'
                              }`}
                              style={{ fontFamily: "'Lora', serif" }}
                            >
                              {TAG_ICONS[tag]}
                            </span>
                            <div className={`grid gap-2 flex-1 ${getGridClass()}`}>
                              {compareBenches.map((bench) => {
                                const hasTag = bench.tags.includes(tag);
                                return (
                                  <div
                                    key={bench.id}
                                    className={`flex items-center justify-center py-1.5 rounded-lg text-sm font-medium border transition-all ${
                                      hasTag
                                        ? allHave
                                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                          : `${TAG_COLORS[tag]}`
                                        : 'bg-stone-50 text-stone-300 border-stone-100'
                                    }`}
                                    style={{ fontFamily: "'Lora', serif" }}
                                  >
                                    {hasTag ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 mr-1" />
                                        有
                                      </>
                                    ) : (
                                      '—'
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {compareBenches.some((b) => b.description) && (
                  <section>
                    <div className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-rose-500 rounded-full" />
                      描述
                    </div>
                    <div className={`grid gap-4 ${getGridClass()}`}>
                      {compareBenches.map((bench) => (
                        <div
                          key={bench.id}
                          className="bg-white rounded-2xl p-4 shadow-lg border border-amber-100"
                        >
                          {bench.description ? (
                            <div
                              className="text-sm text-stone-600 leading-relaxed pl-3 border-l-2 border-amber-300"
                              style={{ fontFamily: "'Lora', serif" }}
                            >
                              {bench.description}
                            </div>
                          ) : (
                            <span className="text-sm text-stone-300" style={{ fontFamily: "'Lora', serif" }}>
                              暂无描述
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <div className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-stone-400 rounded-full" />
                    记录时间
                  </div>
                  <div className={`grid gap-4 ${getGridClass()}`}>
                    {compareBenches.map((bench) => (
                      <div
                        key={bench.id}
                        className="bg-white rounded-2xl p-4 shadow-lg border border-amber-100"
                      >
                        <span className="text-sm text-stone-500" style={{ fontFamily: "'Lora', serif" }}>
                          {formatDate(bench.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
