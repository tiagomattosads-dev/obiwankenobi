// Inicializa o cliente do Supabase usando as chaves do config.js
const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const API = {
    // 1. Função para Cadastrar Novo Usuário
    async cadastrar(nome, email, senha) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: senha,
                options: {
                    data: {
                        nome_operativo: nome
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
            const { data, error } = await supabase.auth.signInWithPassword({
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

    // 3. Função para Fazer Logout (NOVO)
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro no logout:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    }
};