# PassoLivre — Applied Computer Vision

**Mais autonomia a cada passo.** Protótipo acadêmico da FIAP (Global Solution CitizenTech, 2026) para registrar elementos e barreiras presentes em calçadas, com detecção experimental por visão computacional.

## Equipe

- **Leticia Resina** — RM 98069
- **Sabrina Flores** — RM 550781
- **Gabriel Riquetto** — RM 98685

## Demonstração

Há duas interfaces neste repositório:

1. **Aplicação React** (`app/page.tsx`): câmera, envio de imagens, detecção YOLOv8, registros manuais e histórico local.
2. **Demonstração estática** (`demo/index.html`): página independente feita para testar e gravar a detecção real no navegador, inclusive com **fotos do dataset de teste** e **análise contínua de quadros da câmera**.

**Para publicar a demonstração via GitHub Pages:** no repositório, abra **Settings → Pages → Build and deployment → Deploy from a branch** e escolha **main / (root)**, depois **Save**. Após a ativação, acesse:

https://letyresina.github.io/passolivre-applied/demo/

> O endereço só funciona após o GitHub Pages estar configurado e terminar a publicação. A versão privada anterior de chatgpt.site e o site Netlify de outro responsável **não** são atualizados automaticamente quando mudamos este repositório.

## Visão computacional de verdade

O detector é um **YOLOv8n customizado**, treinado anteriormente para auditoria visual de calçadas e reutilizado aqui como base experimental. O treinamento, o dataset, o notebook e as métricas estão documentados em:

https://github.com/letyresina/auditoria-calcadas-yolov8

O modelo original `models/best.pt` é convertido automaticamente em `public/models/calcadas.onnx` pelo workflow `.github/workflows/exportar-modelo.yml`. O arquivo ONNX é **executado no navegador** com ONNX Runtime Web. O código realiza:

1. Carregamento de foto, captura por câmera ou seleção de exemplos;
2. Redimensionamento proporcional com preenchimento (*letterbox*) para 512 × 512 pixels;
3. Conversão RGB para tensor `float32` no formato `[1, 3, 512, 512]`;
4. Inferência do modelo treinado e leitura de caixas, classe e confiança;
5. Filtro de confiança de 25%, supressão de não máximos (NMS) por classe com IoU de 0,45;
6. Conversão das coordenadas para a imagem original e desenho das **caixas reais** com classe e confiança.

**As classes de detecção são** `buraco`, `desnivel` e `piso_tatil`. O formulário manual inclui outras categorias, mas isso **não** significa que o detector foi treinado para elas. **Piso tátil é um recurso de acessibilidade**, não é um defeito por si só. A identificação visual não permite atestar conformidade com normas de acessibilidade.

### Dados e limitações

O conjunto original possui **129 imagens de treino, 11 de validação e 6 de teste** (146 imagens após exportação e aumento de dados). A quantidade de imagens é pequena, com distribuição desigual entre classes; portanto, há risco de falsos positivos, falsos negativos e generalização limitada. O desempenho da detecção deve ser interpretado junto com as métricas e exemplos do projeto de treinamento, sem alegar segurança ou acessibilidade automática de rotas.

Os exemplos presentes em `public/exemplos/` provêm do conjunto de teste do repositório de auditoria de calçadas. **As caixas mostradas são predições geradas na hora**, não anotações desenhadas previamente. O algoritmo pode retornar nenhuma caixa se a confiança for baixa.

## Executar localmente

Pré-requisito: Node.js 22.13+ e npm.

```bash
git clone https://github.com/letyresina/passolivre-applied.git
cd passolivre-applied
npm run install:ci
npm run dev
```

Abra o endereço informado no terminal. O acesso à câmera requer **HTTPS ou localhost**.

Para teste rápido sem instalar o framework, sirva a raiz do repositório por um servidor HTTP local, por exemplo:

```bash
python -m http.server 8000
```

Então abra `http://localhost:8000/demo/` no mesmo computador. Para usar a câmera do celular, prefira GitHub Pages por oferecer HTTPS.

## Teste e gravação da apresentação

1. Entre na demonstração estática publicada pelo GitHub Pages (ou na aplicação React já implantada).
2. Clique em **Exemplo: piso tátil** ou **Exemplo: desnível** para carregar uma imagem de teste.
3. Clique em **Detectar com inteligência artificial**.
4. Mostre as **caixas** sobre a foto e as porcentagens de confiança retornadas pelo YOLOv8.
5. Explique o treinamento customizado, as três classes, o pré-processamento, as métricas e as limitações.
6. Opcionalmente, abra a câmera e clique em **Iniciar detecção ao vivo**. A página processa sucessivos quadros, respeitando o tempo de inferência do dispositivo.

Veja também [GUIA_DE_GRAVACAO.md](GUIA_DE_GRAVACAO.md).

## Estrutura

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| `app/page.tsx` | Interface principal, câmera, upload, análise e histórico |
| `lib/yolo-client.ts` | Pré-processamento, inferência ONNX, NMS e desenho de caixas |
| `app/globals.css` | Estilos responsivos |
| `demo/index.html` | Página independente para a demonstração |
| `public/models/calcadas.onnx` | Modelo YOLOv8 treinado convertido |
| `public/exemplos/` | Imagens de teste para gravar em ambiente interno |
| `.github/workflows/exportar-modelo.yml` | Conversão e publicação do ONNX e exemplos |
| `public/passolivre-logo.png` | Identidade visual |

## Privacidade

O modelo e as imagens são processados no próprio navegador, sem API de inferência ou upload para um backend. O histórico da aplicação principal fica em `localStorage` no dispositivo; não há sincronização entre aparelhos. O ONNX Runtime Web e fontes podem ser carregados de redes de distribuição (CDN), portanto o primeiro carregamento requer internet. Evite capturar rostos e dados pessoais.

## Entregáveis de Applied

Segundo o desafio acadêmico, são necessários o **link do GitHub** com documentação e código completo, o **PDF** com título, integrantes, resumo, introdução, objetivo, explicação técnica, metodologia, resultados e conclusão, além do **vídeo de demonstração funcionando**. O repositório reúne o código e a documentação; PDF final e vídeo devem ser conferidos antes da submissão.
