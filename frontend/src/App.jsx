
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000/livros'

const moeda = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

function App() {
  const [livros, setLivros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [indiceDestaque, setIndiceDestaque] = useState(0)
  const [livroSelecionado, setLivroSelecionado] = useState(null)
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [checkoutAberto, setCheckoutAberto] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const [carrinho, setCarrinho] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tracinha-carrinho')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    async function buscarLivros() {
      try {
        const resposta = await fetch(API_URL)

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os livros.')
        }

        const dados = await resposta.json()
        setLivros(Array.isArray(dados) ? dados : dados.livros || [])
      } catch (erro) {
        setErro(erro.message)
      } finally {
        setCarregando(false)
      }
    }

    buscarLivros()
  }, [])

  useEffect(() => {
    localStorage.setItem('tracinha-carrinho', JSON.stringify(carrinho))
  }, [carrinho])

  useEffect(() => {
    if (!mensagem) return

    const temporizador = setTimeout(() => setMensagem(''), 2500)
    return () => clearTimeout(temporizador)
  }, [mensagem])

  const livrosFiltrados = livros.filter((livro) => {
    const termo = busca.trim().toLowerCase()
    return (
      (livro.titulo || '').toLowerCase().includes(termo) ||
      (livro.autor || '').toLowerCase().includes(termo)
    )
  })

  const livroDestaque =
    livros.length > 0 ? livros[indiceDestaque % livros.length] : null

  const quantidadeCarrinho = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  )

  const totalCarrinho = carrinho.reduce(
    (total, item) => total + Number(item.preco) * item.quantidade,
    0
  )

  function abrirLivro(id) {
    const livro = livros.find((item) => String(item.id) === String(id))
    if (livro) setLivroSelecionado(livro)
  }

  function adicionarAoCarrinho(livro) {
    if (Number(livro.quantidade) <= 0) {
      setMensagem('Este livro está esgotado.')
      return
    }

    const existente = carrinho.find(
      (item) => String(item.id) === String(livro.id)
    )

    if (existente && existente.quantidade >= Number(livro.quantidade)) {
      setMensagem('Você já adicionou todo o estoque disponível.')
      return
    }

    setCarrinho((atual) => {
      const itemExiste = atual.some(
        (item) => String(item.id) === String(livro.id)
      )

      if (itemExiste) {
        return atual.map((item) =>
          String(item.id) === String(livro.id)
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      }

      return [
        ...atual,
        {
          id: livro.id,
          titulo: livro.titulo,
          autor: livro.autor,
          preco: Number(livro.preco),
          estoque: Number(livro.quantidade),
          quantidade: 1,
        },
      ]
    })

    setMensagem('Livro adicionado ao carrinho!')
    setLivroSelecionado(null)
  }

  function alterarQuantidade(id, variacao) {
    setCarrinho((atual) =>
      atual
        .map((item) => {
          if (String(item.id) !== String(id)) return item

          const novaQuantidade = item.quantidade + variacao

          if (novaQuantidade > item.estoque) {
            setMensagem('Quantidade máxima disponível atingida.')
            return item
          }

          return { ...item, quantidade: novaQuantidade }
        })
        .filter((item) => item.quantidade > 0)
    )
  }

  function removerDoCarrinho(id) {
    setCarrinho((atual) =>
      atual.filter((item) => String(item.id) !== String(id))
    )
    setMensagem('Livro removido do carrinho.')
  }

  function fecharJanelas() {
    setLivroSelecionado(null)
    setCarrinhoAberto(false)
  }

  return (
    <div className="loja">
      <header className="cabecalho">
        <a className="marca" href="#inicio" aria-label="Tracinha de Óculos - início">
          <img
            src="/mascote.png"
            alt=""
            className="logo-cabecalho"
          />
          <div>
            <h1>Tracinha de Óculos</h1>
            <p>Histórias esperando por você</p>
          </div>
        </a>

        <nav className="menu" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#categorias">Explore</a>
          <a href="#livros">Acervo</a>
        </nav>

        <button
          className="botao-carrinho"
          type="button"
          onClick={() => setCarrinhoAberto(true)}
        >
          <span aria-hidden="true">🛒</span>
          Carrinho
          <span className="contador-carrinho">{quantidadeCarrinho}</span>
        </button>
      </header>

      <main>
        <section className="destaque" id="inicio">
          <div className="destaque-texto">
            <span className="etiqueta">UM UNIVERSO ENTRE PÁGINAS</span>

            <h2>
              Grandes histórias.
              <br />
              Novas descobertas.
            </h2>

            <p>
              Garimpe sua próxima leitura, redescubra clássicos
              e encontre histórias que merecem um lugar na sua estante.
            </p>

            <a href="#livros" className="botao-principal">
              Explorar o acervo <span aria-hidden="true">→</span>
            </a>

            <p className="frase-destaque">
              Cada livro guarda um mundo. Qual será o seu próximo?
            </p>
          </div>

          <div className="destaque-ilustracao">
            {carregando ? (
              <p className="estado-destaque">Preparando nossa seleção...</p>
            ) : erro ? (
              <p className="estado-destaque">Nossa estante está indisponível.</p>
            ) : livroDestaque ? (
              <>
                <span className="selo-destaque">UMA LEITURA PARA DESCOBRIR</span>

                <button
                  type="button"
                  className="seta-carrossel anterior"
                  onClick={() =>
                    setIndiceDestaque((i) =>
                      i === 0 ? livros.length - 1 : i - 1
                    )
                  }
                  aria-label="Livro anterior"
                  disabled={livros.length < 2}
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="capa-destaque"
                  onClick={() => abrirLivro(livroDestaque.id)}
                  aria-label={`Ver detalhes de ${livroDestaque.titulo}`}
                >
                  <span className="capa-selo">TRACINHA DE ÓCULOS</span>
                  <strong className="capa-titulo">{livroDestaque.titulo}</strong>
                  <span className="capa-autor">{livroDestaque.autor}</span>
                  <span className="capa-ornamento">✦</span>
                </button>

                <button
                  type="button"
                  className="seta-carrossel proximo"
                  onClick={() =>
                    setIndiceDestaque((i) => (i + 1) % livros.length)
                  }
                  aria-label="Próximo livro"
                  disabled={livros.length < 2}
                >
                  ›
                </button>

                <div className="resumo-destaque">
                  <p className="titulo-resumo">{livroDestaque.titulo}</p>
                  <p className="preco-resumo">{moeda(livroDestaque.preco)}</p>
                  <button
                    className="link-detalhes"
                    onClick={() => abrirLivro(livroDestaque.id)}
                    type="button"
                  >
                    Conhecer livro →
                  </button>
                </div>

                <div className="indicadores-carrossel">
                  {livros.map((livro, indice) => (
                    <button
                      key={livro.id}
                      type="button"
                      className={indice === indiceDestaque ? 'ativo' : ''}
                      onClick={() => setIndiceDestaque(indice)}
                      aria-label={`Destacar ${livro.titulo}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="estado-destaque">Nosso acervo está sendo preparado.</p>
            )}
          </div>
        </section>

        <section className="categorias" id="categorias">
          <div className="titulo-secao">
            <span className="etiqueta">ENCONTRE SUA PRÓXIMA LEITURA</span>
            <h2>Um mundo de histórias</h2>
            <p>Pesquise por título ou autor e explore o que temos na estante.</p>
          </div>

          <div className="lista-categorias">
            <button type="button" onClick={() => setBusca('')}>
              <span>✦</span> Todo o acervo
            </button>
            <button type="button" onClick={() => setBusca('Tolkien')}>
              <span>✧</span> Tolkien
            </button>
            <button type="button" onClick={() => setBusca('Romance')}>
              <span>♡</span> Romance
            </button>
            <button type="button" onClick={() => setBusca('Machado')}>
              <span>❧</span> Machado de Assis
            </button>
          </div>
        </section>

        <section className="livros" id="livros">
          <div className="acervo-cabecalho">
            <div>
              <span className="etiqueta">ESCOLHIDOS PARA VOCÊ</span>
              <h2>Nossos livros</h2>
              <p>Novas histórias esperam para ser descobertas.</p>
            </div>
            <span className="contador-livros">
              {livrosFiltrados.length} {livrosFiltrados.length === 1 ? 'livro' : 'livros'}
            </span>
          </div>

          <label className="campo-busca">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Buscar por título ou autor..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
            {busca && (
              <button type="button" onClick={() => setBusca('')} aria-label="Limpar busca">
                ×
              </button>
            )}
          </label>

          {carregando && (
            <p className="mensagem-acervo">Preparando os livros da nossa estante...</p>
          )}

          {!carregando && erro && (
            <div className="mensagem-acervo">
              <p>Não conseguimos carregar o acervo.</p>
              <p>{erro}</p>
              <button type="button" onClick={() => window.location.reload()}>
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando && !erro && livrosFiltrados.length === 0 && (
            <div className="vazio-acervo">
              <span>📚</span>
              <h3>Nenhum livro encontrado</h3>
              <p>Tente buscar por outro título ou autor.</p>
              <button type="button" onClick={() => setBusca('')}>
                Ver todos os livros
              </button>
            </div>
          )}

          {!carregando && !erro && livrosFiltrados.length > 0 && (
            <div className="grade-livros">
              {livrosFiltrados.map((livro, indice) => (
                <article className="card-livro" key={livro.id}>
                  <button
  type="button"
  className={`capa-livro capa-variante-${indice % 4}`}
  onClick={() => abrirLivro(livro.id)}
  aria-label={`Ver detalhes de ${livro.titulo}`}
>
  {livro.capa_url && (
    <img
      src={livro.capa_url}
      alt={`Capa do livro ${livro.titulo}`}
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.nextElementSibling.style.display = "inline";
      }}
    />
  )}

  <span
    aria-hidden="true"
    style={{ display: livro.capa_url ? "none" : "inline" }}
  >
    📖
  </span>

  <small>TRACINHA DE ÓCULOS</small>
  <span className="capa-link">Ver detalhes ↗</span>
</button>

                  <div className="informacoes-livro">
                    <p className="tipo-livro">LIVRO DO ACERVO</p>
                    <h3>{livro.titulo}</h3>
                    <p className="autor-livro">{livro.autor}</p>

                    <div className="linha-preco">
                      <p className="preco-livro">{moeda(livro.preco)}</p>
                      <span
                        className={`status-estoque ${
                          Number(livro.quantidade) > 0 ? 'disponivel' : 'esgotado'
                        }`}
                      >
                        {Number(livro.quantidade) > 0 ? 'Disponível' : 'Esgotado'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="botao-adicionar-card"
                      disabled={Number(livro.quantidade) <= 0}
                      onClick={() => adicionarAoCarrinho(livro)}
                    >
                      {Number(livro.quantidade) > 0
                        ? 'Adicionar ao carrinho +'
                        : 'Indisponível'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {livroSelecionado && (
        <div className="fundo-detalhes" onClick={fecharJanelas}>
          <section
            className="janela-detalhes"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-detalhes"
            onClick={(evento) => evento.stopPropagation()}
          >
            <button
              type="button"
              className="fechar-detalhes"
              onClick={() => setLivroSelecionado(null)}
              aria-label="Fechar detalhes"
            >
              ×
            </button>

            <div className="capa-detalhes">
              <span aria-hidden="true">📖</span>
              <small>TRACINHA DE ÓCULOS</small>
              <strong>{livroSelecionado.titulo}</strong>
              <span className="ornamento-detalhes">✦</span>
            </div>

            <div className="conteudo-detalhes">
              <span className="etiqueta">UM EXEMPLAR DA NOSSA ESTANTE</span>
              <h2 id="titulo-detalhes">{livroSelecionado.titulo}</h2>
              <p className="autor-detalhes">por {livroSelecionado.autor}</p>
              <p className="preco-livro preco-detalhes">
                {moeda(livroSelecionado.preco)}
              </p>

              <p className="texto-estoque">
                {Number(livroSelecionado.quantidade) > 0
                  ? `${livroSelecionado.quantidade} unidade(s) disponível(is) no estoque.`
                  : 'Este exemplar está esgotado no momento.'}
              </p>

              <button
                type="button"
                className="botao-principal botao-comprar"
                disabled={Number(livroSelecionado.quantidade) <= 0}
                onClick={() => adicionarAoCarrinho(livroSelecionado)}
              >
                {Number(livroSelecionado.quantidade) > 0
                  ? 'Adicionar ao carrinho'
                  : 'Indisponível'}
              </button>

              <button
                type="button"
                className="botao-voltar"
                onClick={() => setLivroSelecionado(null)}
              >
                Continuar explorando
              </button>
            </div>
          </section>
        </div>
      )}

      {carrinhoAberto && (
        <div className="fundo-detalhes fundo-carrinho" onClick={fecharJanelas}>
          <section
            className="janela-carrinho"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-carrinho"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="cabecalho-carrinho">
              <div>
                <span className="etiqueta">SUA PRÓXIMA LEITURA</span>
                <h2 id="titulo-carrinho">Meu carrinho</h2>
              </div>
              <button
                type="button"
                className="fechar-detalhes"
                onClick={() => setCarrinhoAberto(false)}
                aria-label="Fechar carrinho"
              >
                ×
              </button>
            </div>

            {carrinho.length === 0 ? (
              <div className="carrinho-vazio">
                <span>🛍️</span>
                <h3>Sua sacola está esperando histórias</h3>
                <p>Explore nosso acervo e adicione um livro que combine com você.</p>
                <button
                  type="button"
                  className="botao-principal"
                  onClick={() => {
                    setCarrinhoAberto(false)
                    document.getElementById('livros')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Explorar livros
                </button>
              </div>
            ) : (
              <>
                <div className="itens-carrinho">
                  {carrinho.map((item) => (
                    <article className="item-carrinho" key={item.id}>
                      <div className="mini-capa">📖</div>
                      <div className="dados-item">
                        <h3>{item.titulo}</h3>
                        <p>{item.autor}</p>
                        <strong>{moeda(item.preco)}</strong>
                        <div className="controle-quantidade">
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(item.id, -1)}
                            aria-label={`Diminuir quantidade de ${item.titulo}`}
                          >
                            −
                          </button>
                          <span>{item.quantidade}</span>
                          <button
                            type="button"
                            onClick={() => alterarQuantidade(item.id, 1)}
                            disabled={item.quantidade >= item.estoque}
                            aria-label={`Aumentar quantidade de ${item.titulo}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="subtotal-item">
                        <strong>{moeda(item.preco * item.quantidade)}</strong>
                        <button
                          type="button"
                          className="remover-item"
                          onClick={() => removerDoCarrinho(item.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="resumo-carrinho">
                  <div>
                    <span>Subtotal</span>
                    <strong>{moeda(totalCarrinho)}</strong>
                  </div>
                  <p>Frete e pagamento serão definidos na finalização do pedido.</p>
                  <button
                    type="button"
                    className="botao-principal botao-finalizar"
                    onClick={() => {
  setCarrinhoAberto(false)
  setCheckoutAberto(true)
}}
                  >
                    Continuar para finalizar
                  </button>
                  <button
                    type="button"
                    className="botao-voltar"
                    onClick={() => setCarrinhoAberto(false)}
                  >
                    Continuar comprando
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
          {checkoutAberto && (
        <div className="fundo-detalhes fundo-checkout">
          <section className="janela-checkout">
            <div className="cabecalho-carrinho">
              <div>
                <span className="etiqueta">QUASE LÁ!</span>
                <h2>Finalizar pedido</h2>
                <p>Preencha seus dados para continuar.</p>
              </div>

              <button
                type="button"
                className="fechar-detalhes"
                onClick={() => setCheckoutAberto(false)}
                aria-label="Fechar finalização"
              >
                ×
              </button>
            </div>

            <form className="formulario-checkout">
              <h3>Seus dados</h3>

              <label>
                Nome completo
                <input
                  type="text"
                  name="nome"
                  placeholder="Digite seu nome"
                  required
                />
              </label>

              <label>
                Telefone / WhatsApp
                <input
                  type="tel"
                  name="telefone"
                  placeholder="(11) 99999-9999"
                  required
                />
              </label>

              <label>
                CEP
                <input
                  type="text"
                  name="cep"
                  placeholder="00000-000"
                  required
                />
              </label>

              <label>
                Endereço
                <input
                  type="text"
                  name="endereco"
                  placeholder="Rua, avenida..."
                  required
                />
              </label>

              <label>
                Número e complemento
                <input
                  type="text"
                  name="complemento"
                  placeholder="Número, apartamento..."
                  required
                />
              </label>

              <div className="resumo-checkout">
                <span>Total dos livros</span>
                <strong>{moeda(totalCarrinho)}</strong>
              </div>

              <button type="submit" className="botao-principal">
                Confirmar pedido
              </button>

              <button
                type="button"
                className="botao-voltar"
                onClick={() => {
                  setCheckoutAberto(false)
                  setCarrinhoAberto(true)
                }}
              >
                Voltar ao carrinho
              </button>
            </form>
          </section>
        </div>
      )}
      {mensagem && (
        <div className="notificacao" role="status">
          {mensagem}
        </div>
      )}

      <footer className="rodape">
        <p>Tracinha de Óculos © 2026</p>
        <span>Cada livro tem uma história. Encontre a sua.</span>
      </footer>
    </div>
  )
}

export default App
