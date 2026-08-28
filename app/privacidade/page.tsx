import type { Metadata } from "next";
import { siteData } from "@/content/site-data";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade | Telma Santos",
  description:
    "Política de Privacidade do portfólio profissional de Telma Santos — como as informações fornecidas pelo visitante são tratadas.",
  alternates: { canonical: "/privacidade" },
  openGraph: {
    title: "Política de Privacidade | Telma Santos",
    description:
      "Como as informações fornecidas pelo visitante do portfólio de Telma Santos são tratadas.",
    url: "/privacidade",
  },
};

const { contato } = siteData;
const email = contato.channels.find((channel) => channel.type === "email");
const whatsapp = contato.channels.find((channel) => channel.type === "whatsapp");

export default function PrivacidadePage() {
  return (
    <LegalPage
      eyebrow="Política de Privacidade"
      title="Política de Privacidade"
      updatedAt="27 de agosto de 2026"
      intro={
        <>
          Esta política descreve como as informações fornecidas pelo visitante são tratadas
          ao utilizar o site profissional de {siteData.meta.name}, em linha com os princípios
          da Lei Geral de Proteção de Dados Pessoais — LGPD (Lei nº 13.709/2018).
        </>
      }
      sections={[
        {
          title: "Sobre esta política",
          paragraphs: [
            <>
              Este site é um portfólio institucional e informativo. Ele apresenta a trajetória,
              as áreas de atuação e os serviços da Telma Santos, e oferece um canal de contato
              para conversas sobre formação, assessoria, palestras, oficinas e projetos
              educacionais.
            </>,
            <>
              Esta política se aplica exclusivamente ao funcionamento deste site. Plataformas
              externas acessadas a partir dele possuem políticas próprias, descritas na seção
              “Serviços externos”.
            </>,
          ],
        },
        {
          title: "Informações fornecidas pelo visitante",
          paragraphs: [
            <>
              Na seção de contato, o visitante pode informar, de forma voluntária e opcional,
              o próprio nome, e pode escolher um interesse entre as opções apresentadas
              (formação, assessoria pedagógica, oficina, palestra, diálogo formativo ou outro).
              O preenchimento do nome não é obrigatório.
            </>,
          ],
        },
        {
          title: "Uso das informações",
          paragraphs: [
            <>
              As informações fornecidas são utilizadas apenas para compor a mensagem de
              contato que o próprio visitante decide enviar, pelo WhatsApp ou por e-mail,
              ao acionar os respectivos botões. O interesse selecionado é usado para
              contextualizar a conversa no texto da mensagem.
            </>,
            <>
              Este site não armazena, em banco de dados, arquivo ou qualquer outro meio, o
              nome ou o interesse informado. Os dados não são vendidos, comercializados nem
              compartilhados com terceiros, exceto pelos canais de comunicação escolhidos
              pelo próprio visitante, descritos a seguir.
            </>,
          ],
        },
        {
          title: "WhatsApp e e-mail",
          paragraphs: [
            <>
              Ao clicar em “Conversar pelo WhatsApp”, o visitante é direcionado ao aplicativo
              WhatsApp, onde a mensagem composta no site é preenchida. Ao clicar em
              “Enviar mensagem” (e-mail), o visitante é direcionado ao aplicativo de e-mail
              do próprio dispositivo.
            </>,
            <>
              O WhatsApp e o provedor de e-mail possuem políticas de privacidade próprias e
              tratam as mensagens conforme os seus termos. Este site não tem acesso ao
              conteúdo das conversas nem às contas utilizadas.
            </>,
          ],
        },
        {
          title: "Serviços externos",
          paragraphs: [
            <>
              O site contém links para plataformas externas, como WhatsApp, Instagram e
              LinkedIn, além de endereços de e-mail. Ao acessar essas plataformas, aplicam-se
              as políticas de privacidade e os termos de uso de cada uma delas.
            </>,
          ],
        },
        {
          title: "Armazenamento e retenção",
          paragraphs: [
            <>
              Este site não possui banco de dados, formulários enviados a servidores próprios
              nem mecanismos de armazenamento de dados pessoais. As mensagens de contato
              existem apenas na conversa iniciada pelo visitante em seu próprio aplicativo de
              WhatsApp ou e-mail.
            </>,
            <>
              Este site não utiliza cookies de rastreamento, ferramentas de análise de dados
              ou publicidade direcionada. Por esse motivo, não há necessidade de banner de
              consentimento de cookies.
            </>,
          ],
        },
        {
          title: "Direitos do titular",
          paragraphs: [
            <>
              Nos termos da LGPD, o visitante pode, a qualquer momento, solicitar informações
              sobre o tratamento de seus dados, bem como solicitar a correção ou a exclusão de
              dados eventualmente fornecidos em mensagens de contato.
            </>,
            <>
              Para exercer esses direitos, basta entrar em contato pelos canais indicados na
              seção seguinte.
            </>,
          ],
        },
        {
          title: "Alterações desta política",
          paragraphs: [
            <>
              Esta política pode ser atualizada sempre que o funcionamento do site mudar ou
              quando necessário para refletir obrigações legais. A data da última atualização
              é indicada no topo desta página.
            </>,
          ],
        },
        {
          title: "Contato",
          paragraphs: [
            <>
              Dúvidas sobre esta política podem ser enviadas por e-mail para{" "}
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