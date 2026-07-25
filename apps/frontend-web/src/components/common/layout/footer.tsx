import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const footerLinks = [
  {
    title: "CinePremium",
    links: [
      { label: "Giới thiệu", href: "/about" },
      { label: "Tuyển dụng", href: "/careers" },
      { label: "Liên hệ", href: "/contact" },
    ],
  },
  {
    title: "Dịch vụ",
    links: [
      { label: "Phim đang chiếu", href: "/movies" },
      { label: "Lịch chiếu", href: "/showtimes" },
      { label: "Hệ thống rạp", href: "/theaters" },
      { label: "Khuyến mãi", href: "/promotions" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Điều khoản sử dụng", href: "/terms" },
      { label: "Chính sách bảo mật", href: "/privacy" },
      { label: "Câu hỏi thường gặp", href: "/faq" },
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebook,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: FaYoutube,
  },
];

export function FooterLayout() {
  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-950 transition-colors dark:border-white/10 dark:bg-[#050606] dark:text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-10 xl:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm space-y-5">
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold uppercase text-[#e50914]"
            >
              CinePremium
            </Link>

            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Không gian điện ảnh hiện đại, nơi mỗi bộ phim trở thành một trải nghiệm đáng nhớ.
            </p>

            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center border border-zinc-200 text-zinc-500 transition hover:border-[#e50914] hover:bg-[#e50914] hover:text-white dark:border-white/10 dark:text-zinc-400"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-zinc-950 dark:text-white">
                  {group.title}
                </h2>

                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-600 transition hover:text-[#e50914] dark:text-zinc-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-zinc-200 pt-7 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between dark:border-white/10">
          <p>&copy; {new Date().getFullYear()} CinePremium. All rights reserved.</p>
          <p>Hotline: 1900 0000 &middot; support@cinepremium.vn</p>
        </div>
      </div>
    </footer>
  );
}
