# Guia de gravação — PassoLivre (Applied Computer Vision)

## Antes de gravar

1. Confira se o repositório contém `public/models/calcadas.onnx` e `public/exemplos/`.
2. Ative o GitHub Pages em **Settings → Pages → Deploy from a branch → main / (root)**. Aguarde o GitHub mostrar o link publicado.
3. Acesse **https://letyresina.github.io/passolivre-applied/demo/** e verifique se a imagem de exemplo e o modelo carregam.
4. Teste primeiro **Exemplo: piso tátil**. Depois teste **Exemplo: desnível**. As detecções dependem da confiança e podem variar; se uma imagem não apresentar caixas, use a outra e não simule resultados.
5. No computador, grave a tela com OBS ou a ferramenta nativa do sistema; no celular, use a gravação de tela do aparelho.
6. Se o navegador pedir permissão da câmera, aceite apenas se for utilizá-la.

## Sequência sugerida para o vídeo (aproximadamente 90 segundos)

**Abertura:** “Somos Leticia Resina, Sabrina Flores e Gabriel Riquetto. O PassoLivre é uma proposta CitizenTech para apoiar a observação de barreiras em calçadas.”

**Problema e tecnologia:** “Buracos e desníveis podem dificultar a mobilidade. Treinamos um detector YOLOv8 customizado para reconhecer buracos, desníveis e a presença de piso tátil. Piso tátil é um recurso de acessibilidade, não um problema em si.”

**Demonstração:** Mostre a página, clique em **Exemplo: piso tátil**, depois em **Detectar com inteligência artificial**. Mostre as caixas e o valor de confiança que realmente aparecerem. Repita com **Exemplo: desnível** se houver resultado detectado. Se não houver, explique que a imagem não atingiu o limiar de confiança.

**Como funciona:** “A imagem é adaptada para 512 por 512 pixels, transformada em tensor RGB e passada pelo modelo ONNX, que é executado no navegador. Aplicamos filtragem de confiança e supressão de caixas repetidas para desenhar as detecções sobre a imagem.”

**Limitações e encerramento:** “É um protótipo acadêmico treinado com um dataset reduzido, portanto pode apresentar erros e não certifica a acessibilidade de uma rota. Nosso foco é demonstrar a identificação visual automatizada e sua possível aplicação à mobilidade urbana.”

## O que deve aparecer na gravação

- Nome do projeto e identificação da equipe;
- A página do PassoLivre aberta no navegador;
- Foto ou captura por câmera;
- Clique no botão de detecção;
- Caixas, classes e confiança calculadas pelo modelo **real**, quando detectadas;
- Breve explicação das limitações.

## Observações importantes

- A interface principal do PassoLivre salva registros manuais no navegador. O detector não substitui a avaliação humana.
- A **demonstração estática do GitHub Pages** é uma interface separada da versão original hospedada no domínio privado. Atualizar o GitHub não atualiza automaticamente a hospedagem privada anterior.
- Esta versão processa uma **imagem ou quadro capturado por câmera** por vez; ainda não executa detecção continuamente sobre todos os quadros de um vídeo ao vivo. Não descreva a implementação como detecção contínua em tempo real.
- O trabalho também pede **PDF técnico** (resumo, introdução, objetivo, ferramentas, metodologia, resultados, conclusão) e link do repositório. Inclua esses itens na submissão.

## Links

- Repositório: https://github.com/letyresina/passolivre-applied
- Demonstração (após ativar Pages): https://letyresina.github.io/passolivre-applied/demo/
- Modelo e notebook de treinamento: https://github.com/letyresina/auditoria-calcadas-yolov8
