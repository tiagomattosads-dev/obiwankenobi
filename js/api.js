// Alterado para 'clienteSupabase' para evitar conflito com a CDN oficial
const clienteSupabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const API = {
    // 1. Função para Cadastrar Novo Usuário
    async cadastrar(nome, email, senha, tratamento) {
        try {
            const { data, error } = await clienteSupabase.auth.signUp({
                email: email,
                password: senha,
                options: {
                    data: {
                        nome_operativo: nome,
                        tratamento: tratamento
                    }
                }
            });

            if (error) throw error;
            return { sucesso: true, dados: data };
            
        } catch (erro) {
            console.error("Erro no cadastro:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 2. Função para Fazer Login
    async login(email, senha) {
        try {
            const { data, error } = await clienteSupabase.auth.signInWithPassword({
                email: email,
                password: senha
            });

            if (error) throw error;
            return { sucesso: true, dados: data };

        } catch (erro) {
            console.error("Erro no login:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 3. Função para Fazer Logout
    async logout() {
        try {
            const { error } = await clienteSupabase.auth.signOut();
            if (error) throw error;
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro no logout:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // ==========================================
    // FUNÇÕES DO BANCO DE DADOS (CHAT)
    // ==========================================

    // 4. Criar Nova Pasta de Conversa
    async criarConversa(titulo) {
        try {
            // Descobre quem é o usuário logado agora
            const { data: userData, error: userError } = await clienteSupabase.auth.getUser();
            if (userError) throw userError;

            // Insere a conversa no banco ligada a esse usuário
            const { data, error } = await clienteSupabase
                .from('conversas')
                .insert([
                    { titulo: titulo, usuario_id: userData.user.id }
                ])
                .select()
                .single(); // Pega a linha criada de volta

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (erro) {
            console.error("Erro ao criar conversa:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 5. Puxar o Histórico do Usuário
    async obterConversas() {
        try {
            const { data, error } = await clienteSupabase
                .from('conversas')
                .select('*')
                .order('fixado', { ascending: false }) // Traz os fixados no topo
                .order('created_at', { ascending: false }); // Traz os mais novos depois

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (erro) {
            console.error("Erro ao buscar conversas:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 6. Atualizar Conversa (Serve para Renomear E para Fixar)
    async atualizarConversa(id, atualizacoes) {
        try {
            const { data, error } = await clienteSupabase
                .from('conversas')
                .update(atualizacoes)
                .eq('id', id)
                .select();

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (erro) {
            console.error("Erro ao atualizar conversa:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 7. Excluir Conversa (O Cascade apagará as mensagens dela junto)
    async excluirConversa(id) {
        try {
            const { error } = await clienteSupabase
                .from('conversas')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro ao excluir conversa:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    }, // <--- COLOQUE ESTA VÍRGULA AQUI!

    // ==========================================
    // 8. Puxar as Mensagens de uma Conversa
    // ==========================================
    async obterMensagens(conversaId) {
        try {
            const { data, error } = await clienteSupabase
                .from('mensagens')
                .select('*')
                .eq('conversa_id', conversaId)
                .order('created_at', { ascending: true }); // Cronológico (mais velhas em cima)

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (erro) {
            console.error("Erro ao buscar mensagens:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // ==========================================
    // 8. Puxar as Mensagens de uma Conversa
    // ==========================================
    async obterMensagens(conversaId) {
        try {
            const { data, error } = await clienteSupabase
                .from('mensagens')
                .select('*')
                .eq('conversa_id', conversaId)
                .order('created_at', { ascending: true }); // Cronológico (mais velhas em cima)

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (erro) {
            console.error("Erro ao buscar mensagens:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    }, // <--- COLOQUE ESTA VÍRGULA AQUI!

    // ==========================================
    // 9. Salvar Nova Mensagem
    // ==========================================
    async salvarMensagem(conversaId, autor, conteudo) {
        try {
            const { data, error } = await clienteSupabase
                .from('mensagens')
                .insert([
                    {
                        conversa_id: conversaId,
                        autor: autor, // Será 'user' ou 'ia'
                        conteudo: conteudo
                    }
                ])
                .select();

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (erro) {
            console.error("Erro ao salvar mensagem:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    }
    
}; // Fim do const API

