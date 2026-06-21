import Link from "next/link";
import { cookies } from "next/headers";
import { Film, LogIn, ChevronRight, Ticket, Popcorn, Video } from "lucide-react";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  const isLoggedIn = !!token;
  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-50 overflow-hidden">
      {/* Left side: Cinematic Hero */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-12 overflow-hidden bg-zinc-900">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent opacity-80" />
        
        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            CinemaChain Admin
          </span>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 mb-20">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Quản lý hệ thống rạp <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              của bạn dễ dàng.
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
            Bảng điều khiển quản trị tối ưu để quản lý phim, lịch chiếu, cụm rạp và đặt vé của người dùng tất cả tại một nơi.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-md">
              <Ticket className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Bán Vé</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-md">
              <Video className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Lịch Chiếu</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-md">
              <Popcorn className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Bắp Nước</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="relative z-10 text-sm text-zinc-500 font-medium">
          &copy; {new Date().getFullYear()} Cinema Chain. Version 2.0
        </div>
      </div>

      {/* Right side: Action Area */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8 sm:p-12 lg:p-24 bg-white dark:bg-zinc-950 relative">
        {/* Abstract Background Shapes for Right Side */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              CinemaChain
            </span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Chào mừng trở lại
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Đăng nhập vào tài khoản quản trị để tiếp tục quản lý hệ thống.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-2">
                <LogIn className="w-8 h-8 text-zinc-500 dark:text-zinc-400 ml-1" />
              </div>
              
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Xác Thực Quản Trị
              </h3>
              
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px]">
                Bạn đang chuẩn bị truy cập vào cổng quản trị bảo mật.
              </p>

              <Link 
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 px-6 py-4 text-white font-semibold transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 shadow-lg shadow-indigo-500/30 mt-4"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoggedIn ? "Đến Dashboard" : "Đăng Nhập"}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center flex items-center justify-center gap-2 text-sm text-zinc-500">
            <span>Bảo mật bởi</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">CinemaAuth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
