interface DenseListIndexProps {
  items: { id: string; title: string }[];
}

export function DenseListIndex({ items }: DenseListIndexProps) {
  return (
    /*
      As colunas seguem a largura disponivel, nao a da janela. Com `md:grid-cols-2`
      a lista virava duas colunas a partir de 768px de VIEWPORT — mas a partir do
      `lg` ela deixa de ocupar a linha inteira e passa a ser a coluna direita do
      painel de Atuacao (~484px em 1024px de tela). Duas colunas ali davam ~214px
      para titulos de ate 85 caracteres, que quebravam em cinco ou seis linhas.
      Com `auto-fill` a decisao passa a ser do espaco real: uma coluna quando o
      painel e estreito, duas assim que couberem 260px de texto em cada.
    */
    <ol className="grid list-none grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-[clamp(56px,5vw,90px)]">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex items-baseline gap-4 border-b border-ivory/10 py-6 lg:py-7"
        >
          <span className="w-8 shrink-0 font-display text-xs md:text-sm leading-none tabular-nums text-gold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[clamp(18px,1.35vw,23px)] leading-[1.35] text-ivory/90">
            {item.title}
          </span>
        </li>
      ))}
    </ol>
  );
}