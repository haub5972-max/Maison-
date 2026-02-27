import React, { useState, useEffect } from 'react';
import { Play, Award, CheckCircle, BarChart2, Search, Lock, X } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  progress: number; // 0-100
  level: number;
  youtubeId?: string;
}

interface EmployeeProgress {
  id: string;
  name: string;
  avatar: string;
  role: string;
  overallProgress: number;
  badges: number[]; // Array of completed level IDs
}

const initialCourses: Course[] = [
  // Level 1
  { id: '1-1', title: 'Văn hóa Maison Vie', thumbnail: 'https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg', duration: '15:00', progress: 100, level: 1, youtubeId: 'M7lc1UVf-VE' },
  { id: '1-2', title: 'Quy trình phục vụ cơ bản', thumbnail: 'https://img.youtube.com/vi/tgbNymZ7vqY/maxresdefault.jpg', duration: '20:00', progress: 80, level: 1, youtubeId: 'tgbNymZ7vqY' },
  { id: '1-3', title: 'An toàn vệ sinh thực phẩm', thumbnail: 'https://img.youtube.com/vi/aqz-KE-bpKQ/maxresdefault.jpg', duration: '12:00', progress: 0, level: 1, youtubeId: 'aqz-KE-bpKQ' },
  
  // Level 2
  { id: '2-1', title: 'Kỹ năng giao tiếp khách hàng', thumbnail: 'https://img.youtube.com/vi/8aGhZQkoFbQ/maxresdefault.jpg', duration: '18:00', progress: 0, level: 2, youtubeId: '8aGhZQkoFbQ' },
  { id: '2-2', title: 'Xử lý tình huống phàn nàn', thumbnail: 'https://img.youtube.com/vi/1vxC2_5O028/maxresdefault.jpg', duration: '25:00', progress: 0, level: 2, youtubeId: '1vxC2_5O028' },

  // Level 3
  { id: '3-1', title: 'Kiến thức rượu vang', thumbnail: 'https://img.youtube.com/vi/N2ZqE1Jk2r0/maxresdefault.jpg', duration: '30:00', progress: 0, level: 3, youtubeId: 'N2ZqE1Jk2r0' },
  { id: '3-2', title: 'Upselling nghệ thuật', thumbnail: 'https://img.youtube.com/vi/Q8TXgCzxEnw/maxresdefault.jpg', duration: '22:00', progress: 0, level: 3, youtubeId: 'Q8TXgCzxEnw' },
];

const mockEmployees: EmployeeProgress[] = [
  { id: 'e1', name: 'Nguyễn Văn A', avatar: 'https://picsum.photos/seed/avatar1/100/100', role: 'Lễ tân', overallProgress: 75, badges: [1, 2] },
  { id: 'e2', name: 'Trần Thị B', avatar: 'https://picsum.photos/seed/avatar2/100/100', role: 'Phục vụ', overallProgress: 40, badges: [1] },
  { id: 'e3', name: 'Lê Văn C', avatar: 'https://picsum.photos/seed/avatar3/100/100', role: 'Bếp phụ', overallProgress: 15, badges: [] },
  { id: 'e4', name: 'Phạm Thị D', avatar: 'https://picsum.photos/seed/avatar4/100/100', role: 'Quản lý', overallProgress: 95, badges: [1, 2, 3, 4] },
];

const levels = [
  { id: 1, name: 'Level 1: Nhập môn', color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { id: 2, name: 'Level 2: Cơ bản', color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 3, name: 'Level 3: Nâng cao', color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 4, name: 'Level 4: Chuyên sâu', color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 5, name: 'Level 5: Quản lý', color: 'text-red-500', bg: 'bg-red-100' },
];

export default function TrainingPortal() {
  const [activeTab, setActiveTab] = useState<'learn' | 'report'>('learn');
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [playingCourse, setPlayingCourse] = useState<Course | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCompleteVideo = () => {
    if (playingCourse) {
      setCourses(courses.map(c => c.id === playingCourse.id ? { ...c, progress: 100 } : c));
      setPlayingCourse(null);
    }
  };

  const renderMobileView = () => (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0 z-10">
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm khóa học..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'learn' ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500'
            }`}
          >
            <Play className="w-4 h-4" />
            Khóa học
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'report' ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Báo cáo
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {activeTab === 'learn' ? (
          <div className="space-y-6">
            {/* Compact Badges */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Thành tích
              </h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {levels.map((lvl) => {
                  const isUnlocked = lvl.id <= 2;
                  return (
                    <div 
                      key={lvl.id} 
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-lg border ${
                        isUnlocked ? `${lvl.bg} border-transparent` : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}
                    >
                      <div className={`text-xs font-bold ${isUnlocked ? lvl.color : 'text-gray-400'}`}>
                        Lvl {lvl.id}
                      </div>
                      {isUnlocked ? <Award className={`w-5 h-5 ${lvl.color}`} /> : <Lock className="w-4 h-4 text-gray-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compact Course List */}
            {[1, 2, 3].map((levelId) => {
              const levelCourses = courses.filter(c => c.level === levelId);
              if (levelCourses.length === 0) return null;
              const levelInfo = levels.find(l => l.id === levelId);

              return (
                <section key={levelId}>
                  <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className={`w-1.5 h-5 rounded-full ${levelInfo?.bg.replace('bg-', 'bg-')}`}></span>
                    {levelInfo?.name}
                  </h3>
                  
                  <div className="space-y-3">
                    {levelCourses.map((course) => (
                      <div 
                        key={course.id} 
                        onClick={() => setPlayingCourse(course)}
                        className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm flex gap-3 active:bg-gray-50"
                      >
                        {/* Thumbnail (Left) */}
                        <div className="relative w-24 h-16 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                              <Play className="w-3 h-3 text-teal-600 ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Info (Right) */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
                            {course.title}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {course.duration}
                            </span>
                            <div className="flex items-center gap-2 flex-1 justify-end max-w-[80px]">
                              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-teal-500'}`}
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // Mobile Report View
          <div className="space-y-4">
             {mockEmployees.map((emp) => (
               <div key={emp.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                 <div className="flex items-center gap-3 mb-3">
                   <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                   <div>
                     <div className="font-bold text-gray-900">{emp.name}</div>
                     <div className="text-xs text-gray-500">{emp.role}</div>
                   </div>
                   <div className="ml-auto text-right">
                     <span className={`text-sm font-bold ${emp.overallProgress >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                       {emp.overallProgress}%
                     </span>
                   </div>
                 </div>
                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                   <div 
                     className={`h-full rounded-full ${emp.overallProgress >= 80 ? 'bg-green-500' : 'bg-blue-500'}`}
                     style={{ width: `${emp.overallProgress}%` }}
                   ></div>
                 </div>
                 <div className="flex gap-1">
                   {emp.badges.map((badgeId) => {
                      const lvl = levels.find(l => l.id === badgeId);
                      return (
                        <div key={badgeId} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${lvl?.bg.replace('bg-', 'bg-').replace('100', '500')}`}>
                          {badgeId}
                        </div>
                      );
                   })}
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="h-[calc(100vh-64px)] bg-gray-50 flex flex-col relative">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold text-gray-800">Đào tạo nội bộ</h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'learn' ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Play className="w-4 h-4" />
              Khóa học của tôi
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'report' ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Báo cáo tiến độ
            </button>
          </div>
        </div>
        
        {activeTab === 'learn' && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm khóa học..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-64"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'learn' ? (
          <div className="space-y-10 max-w-7xl mx-auto">
            {/* Badges / Gamification Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Thành tích của bạn
              </h3>
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {levels.map((lvl) => {
                  const isUnlocked = lvl.id <= 2; // Mock unlocked status
                  return (
                    <div 
                      key={lvl.id} 
                      className={`flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-xl border transition-all ${
                        isUnlocked 
                          ? `${lvl.bg} border-transparent` 
                          : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
                      }`}
                    >
                      <div className={`p-3 rounded-full bg-white shadow-sm ${isUnlocked ? lvl.color : 'text-gray-400'}`}>
                        {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <span className={`text-xs font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                        Level {lvl.id}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Lists by Level */}
            {[1, 2, 3].map((levelId) => {
              const levelCourses = courses.filter(c => c.level === levelId);
              if (levelCourses.length === 0) return null;
              
              const levelInfo = levels.find(l => l.id === levelId);

              return (
                <section key={levelId}>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className={`w-2 h-8 rounded-full ${levelInfo?.bg.replace('bg-', 'bg-')}`}></span>
                    {levelInfo?.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {levelCourses.map((course) => (
                      <div 
                        key={course.id} 
                        onClick={() => setPlayingCourse(course)}
                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-gray-100 overflow-hidden">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-5 h-5 text-teal-600 ml-1" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                            {course.duration}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800 line-clamp-2 mb-3 h-10 leading-tight">
                            {course.title}
                          </h4>
                          
                          {/* Progress Bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{course.progress === 100 ? 'Hoàn thành' : `${course.progress}%`}</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  course.progress === 100 ? 'bg-green-500' : 'bg-teal-500'
                                }`}
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // Report Tab
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">Nhân viên</th>
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4 text-center">Tiến độ tổng</th>
                    <th className="px-6 py-4">Huy hiệu đạt được</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={emp.avatar} 
                            alt={emp.name} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-medium text-gray-900">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.role}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 max-w-[140px] mx-auto">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                emp.overallProgress >= 80 ? 'bg-green-500' : 
                                emp.overallProgress >= 50 ? 'bg-blue-500' : 'bg-orange-400'
                              }`}
                              style={{ width: `${emp.overallProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-600 w-8 text-right">
                            {emp.overallProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {emp.badges.map((badgeId) => {
                            const lvl = levels.find(l => l.id === badgeId);
                            return (
                              <div 
                                key={badgeId} 
                                className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                                  lvl?.bg.replace('bg-', 'bg-').replace('100', '500')
                                }`}
                                title={lvl?.name}
                              >
                                {badgeId}
                              </div>
                            );
                          })}
                          {emp.badges.length === 0 && <span className="text-xs text-gray-400 italic">Chưa có</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium hover:underline">
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}

      {/* Video Player Modal (Shared) */}
      {playingCourse && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
          onClick={() => setPlayingCourse(null)}
        >
          <div 
            className="w-full max-w-5xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{playingCourse.title}</h3>
                  <p className="text-gray-400 text-sm">Level {playingCourse.level} • {playingCourse.duration}</p>
                </div>
              </div>
              <button 
                onClick={() => setPlayingCourse(null)} 
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              {playingCourse.youtubeId ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${playingCourse.youtubeId}?autoplay=1&rel=0`}
                  title={playingCourse.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Video không khả dụng
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-900 flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                Hãy xem hết video để hoàn thành bài học này nhé!
              </p>
              <button 
                onClick={handleCompleteVideo}
                className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-teal-900/20"
              >
                <CheckCircle className="w-5 h-5" />
                Tôi đã xem xong
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
