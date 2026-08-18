import Image from "next/image";
import { siteData } from "@/content/site-data";
import { logo } from "@/lib/photos";
import { Reveal } from "@/components/motion/Reveal";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-warm-gray/20">
      <Reveal className="mx-auto max-w-7xl px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            src={logo.mark.src}
            alt={logo.mark.alt}
            width={28}
            height={Math.round((28 * logo.mark.height) / logo.mark.width)}
          />
          <p className="text-sm text-warm-gray">
            {siteData.footer.copyrightName} · {siteData.footer.role}
          </p>
        </div>
        <nav aria-label="Links de contato">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {siteData.contato.channels.map((channel) => (
              <li key={channel.type}>
                <a
                  href={channel.href}
                  target={channel.type === "email" ? undefined : "_blank"}
                  rel={channel.type === "email" ? undefined : "noopener noreferrer"}
                  className="link-draw text-sm text-ivory/70 pb-0.5 hover:text-gold transition-colors"
                >
                  {channel.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-warm-gray">© {year} {siteData.footer.copyrightName}</p>
      </Reveal>
    </footer>
  );
}
