-- ==========================================
-- SOLUTIA CORE - SUPABASE INITIAL SCHEMA
-- Execute este script no SQL Editor do seu projeto Supabase
-- ==========================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE CLIENTES (Tenants)
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL, -- Ex: agersinop, stoantleste, cliente1
    nome VARCHAR(100) NOT NULL,
    dominio VARCHAR(100) UNIQUE, -- (Opcional) ami-eng.vercel.app
    logo_url TEXT,
    tema_primario VARCHAR(20) DEFAULT '#0d2d5b',
    tema_secundario VARCHAR(20) DEFAULT '#1b4a93',
    largura_sidebar VARCHAR(20) DEFAULT '250px',
    altura_bi VARCHAR(20) DEFAULT '60%',
    altura_workflow VARCHAR(20) DEFAULT '40%',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE PERFIS DE USUÁRIOS
-- Vincula os usuários do auth.users aos Clientes e define o nível de acesso
CREATE TABLE IF NOT EXISTS public.perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE RESTRICT,
    nome VARCHAR(100),
    email VARCHAR(150) NOT NULL,
    nivel_acesso VARCHAR(20) CHECK (nivel_acesso IN ('admin', 'editor', 'leitor')) DEFAULT 'leitor',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- RLS (ROW LEVEL SECURITY)
-- Mantém os dados seguros e isolados entre clientes
-- ==========================================

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- CLIENTES: 
-- Qualquer pessoa (mesmo sem login) pode LER a identidade visual do cliente pela tela de login,
-- mas ninguém (além do admin via painel) pode INSERIR ou DELETAR
CREATE POLICY "Clientes visíveis para todos publicamente" 
ON public.clientes FOR SELECT 
USING (true);

-- PERFIS: 
-- O usuário só pode ver e alterar O PRÓPRIO PERFIL, e talvez ler os perfis da própria empresa.
-- Como primeiro passo, ele só pode ler/alterar a si mesmo.
CREATE POLICY "Usuário pode ver o próprio perfil" 
ON public.perfis FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuário pode atualizar o próprio perfil" 
ON public.perfis FOR UPDATE 
USING (auth.uid() = id);

-- ==========================================
-- GATILHOS (TRIGGERS) PARA NOVOS USUÁRIOS
-- Toda vez que criarmos um usuário no "auth.users", ele cria uma linha vazia no perfis
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_novo_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfis (id, email, nome)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'nome');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_novo_usuario();
