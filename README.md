# PassoLivre

**Mais autonomia a cada passo.**

Projeto acadêmico CitizenTech da Global Solution FIAP — Engenharia de Software, 4º ano, 2º semestre de 2026. Aplicação web para apoiar o registro de barreiras em calçadas e recursos de acessibilidade.

## Integrantes

- Leticia Resina - RM 98069
- Sabrina Flores - RM 550781
- Gabriel Riquetto - RM 98685

## Estado atual

Esta versão contém a interface funcional da PassoLivre. **A classificação é manual: ainda não existe modelo treinado ou detecção automática integrada.** A aplicação não certifica a acessibilidade de um caminho.

### Funcionalidades implementadas

- Abertura da câmera, preferindo a câmera traseira quando disponível.
- Captura e envio de fotos, incluindo arrastar e soltar.
- Registro manual de buraco, desnível, obstáculo na passagem, piso tátil e outras observações.
- Local e descrição opcionais, informados pelo usuário.
- Histórico salvo no navegador com `localStorage`.
- Exclusão de registros e exportação em JSON.
- Interface responsiva em português com a identidade visual da PassoLivre.

Piso tátil é um recurso de acessibilidade e não é tratado como barreira.

## Executar localmente

Requisitos: Node.js 22.13 ou superior e npm.

```bash
git clone https://github.com/letyresina/-passolivre-applied.git
cd -- -passolivre-applied
npm run install:ci
npm run dev
```

Abra a URL exibida no terminal. A câmera depende da permissão do navegador e de um contexto seguro: HTTPS ou localhost. Abrir um endereço HTTP da rede local pelo celular pode impedir o acesso à câmera.

### Verificações

```bash
npx tsc --noEmit
npm run build
```

Na versão inicial, a verificação de tipos e a compilação passaram. A interface e a navegação para o histórico foram conferidas no navegador; o fluxo de câmera ainda precisa ser validado nos celulares utilizados pelo grupo.

## Estrutura principal

| Caminho | Responsabilidade |
| --- | --- |
| `app/page.tsx` | Câmera, upload, formulário, histórico e exportação |
| `app/globals.css` | Identidade visual e layout responsivo |
| `app/layout.tsx` | Idioma e metadados |
| `public/passolivre-logo.png` | Logo da PassoLivre |
| `public/favicon.svg` | Ícone do site |
| `scripts/`, `worker/`, `vite.config.ts` | Execução e build da base Vinext/Cloudflare |

A aplicação usa React, TypeScript, Vinext/Vite e Lucide React. O repositório também mantém componentes e arquivos de infraestrutura do template de origem; sua presença não significa que todos sejam utilizados pela interface.

## Privacidade e limitações

As fotos, locais e descrições dos registros ficam neste navegador; a implementação atual não os envia a uma API de armazenamento. Não há sincronização entre dispositivos. Limpar os dados do navegador remove o histórico: exporte o JSON para guardar uma cópia. Esse arquivo inclui as imagens e os dados informados.

Evite fotografar rostos e outros dados pessoais. O navegador pode limitar o armazenamento; arquivos HEIC dependem do suporte do dispositivo. As fontes são carregadas do Google Fonts, com alternativas locais quando indisponíveis.

## Próximas etapas de Applied Computer Vision

1. Definir as classes e reunir imagens com autorização de uso.
2. Anotar e revisar o dataset; separar treino, validação e teste sem vazamento de imagens semelhantes.
3. Treinar um detector customizado compatível com o problema.
4. Avaliar resultados por classe, erros, limitações e tempo de processamento.
5. Integrar as detecções reais à aplicação e demonstrar a execução em tempo real.
6. Publicar código de treinamento, documentação, resultados, relatório PDF e vídeo demonstrativo.

Não há métricas ou resultados de IA nesta versão. Esta base, sozinha, ainda não representa a entrega completa de Applied.

## Identidade visual

| Uso | Cor |
| --- | --- |
| Principal | `#6D28D9` |
| Verde-petróleo | `#0F766E` |
| Texto | `#172033` |
| Lavanda | `#F3EEFF` |
| Fundo | `#F8FAFC` |

Tipografia: Readex Pro e Open Sans, com fallback Arial.

## Publicação

A versão inicial está em https://passolivre-lety.juicybloom1.chatgpt.site e tem acesso privado à proprietária. O acesso para a banca ainda deve ser configurado e testado antes da entrega. O clone deste repositório não inclui o identificador da publicação privada.

