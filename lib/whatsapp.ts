// Montagem dos links de contato. Ambos recebem texto digitado pelo visitante
// (o nome, no formulário do Contato), então a codificação aqui é o que impede
// que um caractere qualquer altere a estrutura da URL.

/**
 * Link do WhatsApp com mensagem pré-preenchida.
 *
 * O telefone é reduzido a dígitos: a wa.me só aceita o número no formato
 * internacional sem separadores, e um espaço ou parêntese vindo do conteúdo
 * quebraria a URL silenciosamente — o visitante cairia numa página de erro do
 * WhatsApp em vez da conversa.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Link `mailto:` com assunto e corpo pré-preenchidos.
 *
 * A codificação é feita com `encodeURIComponent`, e não com `URLSearchParams`,
 * por causa de uma diferença que passa despercebida: `URLSearchParams` segue as
 * regras de formulário HTML e converte espaço em `+`. Numa query de formulário
 * o servidor desfaz isso; numa URI `mailto:` não existe essa etapa, e o cliente
 * de e-mail mostra literalmente "Contato+via+portfólio". Com
 * `encodeURIComponent` o espaço vira `%20`, que todo cliente decodifica.
 *
 * A codificação também neutraliza tentativa de injeção de cabeçalho: um `&cc=`
 * ou uma quebra de linha digitada no nome viram `%26` e `%0A`, ficando dentro
 * do valor em vez de virarem um novo campo do e-mail.
 */
export function buildMailtoLink(
  email: string,
  subject?: string,
  body?: string
): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const query = params.join("&");
  return `mailto:${email}${query ? `?${query}` : ""}`;
}
