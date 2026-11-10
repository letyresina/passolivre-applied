import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'PassoLivre — Mais autonomia a cada passo',description:'Registre barreiras em calçadas. Protótipo acadêmico de acessibilidade urbana.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
