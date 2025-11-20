import { redirect } from 'next/navigation';

export default function Home() {
  // Futuramente aqui entrará a verificação real de autenticação
  const usuarioEstaLogado = false; 

  if (!usuarioEstaLogado) {
    redirect('/login'); // Redireciona o usuário da Raiz para a pasta Login
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white">Destaques do FrameHub</h1>
      <p className="text-gray-400">Bem-vindo ao catálogo.</p>
      {/* Aqui virá a lista de filmes principais */}
    </div>
  );
}