import type { Metadata } from "next";
import { siteData } from "@/content/site-data";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso | Telma Santos",
  description:
    "Termos de Uso do portfólio profissional de Telma Santos — condições de uso do site e proteção do conteúdo.",
  alternates: { canonical: "/termos" },
  openGraph: {
    title: "Termos de Uso | Telma Santos",
    description:
      "Condições de uso do portfólio profissional de Telma Santos.",
    url: "/termos",
  },
};

const { contato } = siteData;
const email = contato.channels.find((channel) => channel.type === "email");
const whatsapp = contato.channels.find((channel) => channel.type === "whatsapp");

export default function TermosPage() {
  return (
    <LegalPage
      eyebrow="Termos de Uso"
      title="Termos de Uso"
      updatedAt="27 de agosto de 2026"
      intro={
        <>
          Estes termos descrevem as condições de utilização do site profissional de{" "}
          {siteData.meta.name}. Ao navegar por este site, o visitante concorda com as
          condições apresentadas a seguir.
        </>
      }
      sections={[
        {
          title: "Finalidade do site",
          paragraphs: [
            <>
              Este site tem finalidade institucional e informativa: apresentar a trajetória
              e as áreas de atuação da Telma Santos, além de oferecer um canal de contato
              para serviços educacionais, como formação, assessoria pedagógica, oficinas,
              palestras e diálogos formativos.
            </>,
          ],
        },
        {
          title: "Conteúdo e propriedade intelectual",
          paragraphs: [
            <>
              Os textos, fotografias, marca, identidade visual e demais materiais exibidos
              neste site são protegidos conforme a legislação aplicável, respeitados os
              direitos de seus respectivos titulares. A reprodução, distribuição ou uso
              comercial de qualquer conteúdo sem autorização prévia são vedados.
            </>,
            <>
              A menção a programas, políticas públicas, instituições e outras referências
              educacionais é feita em caráter informativo, e os direitos sobre esses
              conteúdos pertencem aos seus respectivos titulares.
            </>,
          ],
        },
        {
          title: "Uso permitido",
          paragraphs: [
            <>
              O site pode ser utilizado para consulta pessoal e informativa, e para
              estabelecer contato profissional com a Telma Santos. Não é permitido utilizar
              o conteúdo do site para fins comerciais não autorizados, modificar os materiais
              ou utilizá-los de forma que prejudique a imagem da profissional.
            </>,
          ],
        },
        {
          title: "Links e plataformas externas",
          paragraphs: [
            <>
              O site contém links para plataformas externas, como WhatsApp, Instagram e
              LinkedIn. O acesso a essas plataformas é feito por conta e responsabilidade do
              visitante, e está sujeito às políticas e aos termos de uso de cada plataforma.
            </>,
          ],
        },
        {
          title: "Disponibilidade e atualizações",
          paragraphs: [
            <>
              O conteúdo deste site pode ser atualizado, complementado ou removido a qualquer
              momento, sem aviso prévio. O site não garante disponibilidade ininterrupta ou
              permanente do acesso.
            </>,
          ],
        },
        {
          title: "Limitação de responsabilidade",
          paragraphs: [
            <>
              Este site é de caráter informativo. A Telma Santos não se responsabiliza por
              decisões tomadas com base exclusiva no conteúdo aqui apresentado, nem pelo uso
              que terceiros façam das informações divulgadas.
            </>,
          ],
        },
        {
          title: "Alterações destes termos",
          paragraphs: [
            <>
              Estes termos podem ser atualizados sempre que necessário. A versão vigente é a
              publicada nesta página, com a data de última atualização indicada no topo.
            </>,
          ],
        },
        {
          title: "Contato",
          paragraphs: [
            <>
              Dúvidas sobre estes termos podem ser enviadas por e-mail para{" "}
              <a
                href={email?.href}
                className="link-draw pb-0.5 text-ivory transition-colors hover:text-gold"
              >
                {email?.value}
              </a>{" "}
              ou pelo WhatsApp{" "}
              <a
                href={whatsapp?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw pb-0.5 text-ivory transition-colors hover:text-gold"
              >
                {whatsapp?.value}
              </a>
              .
            </>,
          ],
        },
      ]}
    />
  );
}