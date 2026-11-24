document.addEventListener('DOMContentLoaded', () => {
    // === ÍCONES VETORIAIS MINIMALISTAS (ESTILO FLATICON / FEATHER MONOCHROME) ===
    const SVG_ICONS = {
        user: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        partner: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        ship: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>`,
        npc: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
        heart: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
        zap: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
        coins: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
        check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        chat: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
        dice: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect><circle cx="8.5" cy="8.5" r="1.2"></circle><circle cx="15.5" cy="8.5" r="1.2"></circle><circle cx="15.5" cy="15.5" r="1.2"></circle><circle cx="8.5" cy="15.5" r="1.2"></circle><circle cx="12" cy="12" r="1.2"></circle></svg>`,
        edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        shield: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
        terminal: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`
    };

    const limparPrefixoEmoji = (str = '') =>
        String(str)
            .replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\s]+/u, '')
            .trim();

    // === ELEMENTOS DO CHAT EXPANSÍVEL ===
    const chatInput = document.getElementById('chatInput');
    const expandBtn = document.getElementById('expandBtn');
    const expandIcon = document.getElementById('expandIcon');
    const inputContainer = document.getElementById('inputContainer');
    const inputSection = document.querySelector('.inputSection');
    const chatOverlay = document.getElementById('chatOverlay');

    // === ELEMENTOS DO MENU DE CONFIGURAÇÕES ===
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDrawer = document.getElementById('settingsDrawer');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const profileBtn = document.getElementById('profileBtn');

    // === ELEMENTOS DE ENVIO E MENSAGENS ===
    const sendBtn = document.getElementById('sendBtn');
    const messagesArea = document.getElementById('messagesArea');
    const glowEffects = document.querySelectorAll('.glowEffect');

    // === ELEMENTOS DA BARRA TÁTICA & MODAIS DO ECOSSISTEMA ===
    const campaignCodePill = document.getElementById('campaignCodePill');
    const campaignJoinCodeText = document.getElementById('campaignJoinCodeText');
    const scenePartyPills = document.getElementById('scenePartyPills');
    const manageSheetsBtn = document.getElementById('manageSheetsBtn');
    const openCanonBtn = document.getElementById('openCanonBtn');
    const openAutomationBtn = document.getElementById('openAutomationBtn');

    const sheetsModal = document.getElementById('sheetsModal');
    const modalJoinCodeDisplay = document.getElementById('modalJoinCodeDisplay');
    const sheetsModalList = document.getElementById('sheetsModalList');

    const canonModal = document.getElementById('canonModal');
    const canonSummaryTextarea = document.getElementById('canonSummaryTextarea');
    const saveCanonBtn = document.getElementById('saveCanonBtn');

    const automationModal = document.getElementById('automationModal');
    const prefEnabled = document.getElementById('prefEnabled');
    const prefCombat = document.getElementById('prefCombat');
    const prefItems = document.getElementById('prefItems');
    const prefCredits = document.getElementById('prefCredits');
    const prefXp = document.getElementById('prefXp');
    const prefSheetMgmt = document.getElementById('prefSheetMgmt');
    const saveAutomationBtn = document.getElementById('saveAutomationBtn');

    const profileModal = document.getElementById('profileModal');
    const profileNameInput = document.getElementById('profileNameInput');
    const profileTreatmentInput = document.getElementById('profileTreatmentInput');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    // === ELEMENTOS MOBILE UNIFICADOS, MENU (+) & ROLAGEM FÍSICA ===
    const mobileSceneSummaryBtn = document.getElementById('mobileSceneSummaryBtn');
    const mobileSceneTitle = document.getElementById('mobileSceneTitle');
    const mobileSceneSub = document.getElementById('mobileSceneSub');
    const mobileTableBtn = document.getElementById('mobileTableBtn');
    const mobileTableSheet = document.getElementById('mobileTableSheet');
    const mobileSheetJoinCode = document.getElementById('mobileSheetJoinCode');
    const mobileCopyCodeBtn = document.getElementById('mobileCopyCodeBtn');
    const mobileSheetPartyList = document.getElementById('mobileSheetPartyList');

    const attachBtn = document.getElementById('attachBtn');
    const quickToolsMenu = document.getElementById('quickToolsMenu');
    const physicalRollModal = document.getElementById('physicalRollModal');
    const physRollSkillInput = document.getElementById('physRollSkillInput');
    const physRollPreview = document.getElementById('physRollPreview');
    const resetPhysRollBtn = document.getElementById('resetPhysRollBtn');
    const insertPhysRollBtn = document.getElementById('insertPhysRollBtn');
    const sendPhysRollBtn = document.getElementById('sendPhysRollBtn');

    const physRollState = {
        success: 0,
        advantage: 0,
        triumph: 0,
        failure: 0,
        threat: 0,
        despair: 0,
        lightPip: 0,
        darkPip: 0
    };

    const fecharTodosOsModais = () => {
        document.querySelectorAll('.customModalOverlay.show').forEach((m) => m.classList.remove('show'));
        if (quickToolsMenu) quickToolsMenu.classList.remove('open');
    };

    // =========================================================================
    // TABELA 1-3 OFICIAL DO LIVRO BÁSICO (PÁG. 18) — CONVERSÃO DE DADOS NUMÉRICOS
    // =========================================================================
    const NUMERIC_DIE_DEFINITIONS = {
        yellow: {
            label: 'Amarelo (Proficiência)',
            poly: 'Role 1d12',
            sides: 12,
            faces: {
                1:  { text: 'Vazio', symbols: {} },
                2:  { text: '1 Sucesso', symbols: { success: 1 } },
                3:  { text: '1 Sucesso', symbols: { success: 1 } },
                4:  { text: '2 Sucessos', symbols: { success: 2 } },
                5:  { text: '2 Sucessos', symbols: { success: 2 } },
                6:  { text: '1 Vantagem', symbols: { advantage: 1 } },
                7:  { text: '1 Sucesso + 1 Vantagem', symbols: { success: 1, advantage: 1 } },
                8:  { text: '1 Sucesso + 1 Vantagem', symbols: { success: 1, advantage: 1 } },
                9:  { text: '1 Sucesso + 1 Vantagem', symbols: { success: 1, advantage: 1 } },
                10: { text: '2 Vantagens', symbols: { advantage: 2 } },
                11: { text: '2 Vantagens', symbols: { advantage: 2 } },
                12: { text: '1 Triunfo (+1 Sucesso)', symbols: { triumph: 1 } }
            }
        },
        green: {
            label: 'Verde (Habilidade)',
            poly: 'Role 1d8',
            sides: 8,
            faces: {
                1: { text: 'Vazio', symbols: {} },
                2: { text: '1 Sucesso', symbols: { success: 1 } },
                3: { text: '1 Sucesso', symbols: { success: 1 } },
                4: { text: '2 Sucessos', symbols: { success: 2 } },
                5: { text: '1 Vantagem', symbols: { advantage: 1 } },
                6: { text: '1 Vantagem', symbols: { advantage: 1 } },
                7: { text: '1 Sucesso + 1 Vantagem', symbols: { success: 1, advantage: 1 } },
                8: { text: '2 Vantagens', symbols: { advantage: 2 } }
            }
        },
        blue: {
            label: 'Azul (Ampliação)',
            poly: 'Role 1d6',
            sides: 6,
            faces: {
                1: { text: 'Vazio', symbols: {} },
                2: { text: 'Vazio', symbols: {} },
                3: { text: '1 Sucesso', symbols: { success: 1 } },
                4: { text: '1 Sucesso + 1 Vantagem', symbols: { success: 1, advantage: 1 } },
                5: { text: '2 Vantagens', symbols: { advantage: 2 } },
                6: { text: '1 Vantagem', symbols: { advantage: 1 } }
            }
        },
        purple: {
            label: 'Roxo (Dificuldade)',
            poly: 'Role 1d8',
            sides: 8,
            faces: {
                1: { text: 'Vazio', symbols: {} },
                2: { text: '1 Falha', symbols: { failure: 1 } },
                3: { text: '2 Falhas', symbols: { failure: 2 } },
                4: { text: '1 Ameaça', symbols: { threat: 1 } },
                5: { text: '1 Ameaça', symbols: { threat: 1 } },
                6: { text: '1 Ameaça', symbols: { threat: 1 } },
                7: { text: '2 Ameaças', symbols: { threat: 2 } },
                8: { text: '1 Falha + 1 Ameaça', symbols: { failure: 1, threat: 1 } }
            }
        },
        red: {
            label: 'Vermelho (Desafio)',
            poly: 'Role 1d12',
            sides: 12,
            faces: {
                1:  { text: 'Vazio', symbols: {} },
                2:  { text: '1 Falha', symbols: { failure: 1 } },
                3:  { text: '1 Falha', symbols: { failure: 1 } },
                4:  { text: '2 Falhas', symbols: { failure: 2 } },
                5:  { text: '2 Falhas', symbols: { failure: 2 } },
                6:  { text: '1 Ameaça', symbols: { threat: 1 } },
                7:  { text: '1 Ameaça', symbols: { threat: 1 } },
                8:  { text: '1 Falha + 1 Ameaça', symbols: { failure: 1, threat: 1 } },
                9:  { text: '1 Falha + 1 Ameaça', symbols: { failure: 1, threat: 1 } },
                10: { text: '2 Ameaças', symbols: { threat: 2 } },
                11: { text: '2 Ameaças', symbols: { threat: 2 } },
                12: { text: '1 Desespero (+1 Falha)', symbols: { despair: 1 } }
            }
        },
        black: {
            label: 'Preto (Contratempo)',
            poly: 'Role 1d6',
            sides: 6,
            faces: {
                1: { text: 'Vazio', symbols: {} },
                2: { text: 'Vazio', symbols: {} },
                3: { text: '1 Falha', symbols: { failure: 1 } },
                4: { text: '1 Falha', symbols: { failure: 1 } },
                5: { text: '1 Ameaça', symbols: { threat: 1 } },
                6: { text: '1 Ameaça', symbols: { threat: 1 } }
            }
        },
        white: {
            label: 'Branco (Força)',
            poly: 'Role 1d12',
            sides: 12,
            faces: {
                1:  { text: '1 Ponto Sombrio', symbols: { darkPip: 1 } },
                2:  { text: '1 Ponto Sombrio', symbols: { darkPip: 1 } },
                3:  { text: '1 Ponto Sombrio', symbols: { darkPip: 1 } },
                4:  { text: '1 Ponto Sombrio', symbols: { darkPip: 1 } },
                5:  { text: '1 Ponto Sombrio', symbols: { darkPip: 1 } },
                6:  { text: '1 Ponto Sombrio', symbols: { darkPip: 1 } },
                7:  { text: '2 Pontos Sombrios', symbols: { darkPip: 2 } },
                8:  { text: '1 Ponto de Luz', symbols: { lightPip: 1 } },
                9:  { text: '1 Ponto de Luz', symbols: { lightPip: 1 } },
                10: { text: '2 Pontos de Luz', symbols: { lightPip: 2 } },
                11: { text: '2 Pontos de Luz', symbols: { lightPip: 2 } },
                12: { text: '2 Pontos de Luz', symbols: { lightPip: 2 } }
            }
        }
    };

    let physRollMode = 'numeric'; // 'numeric' | 'symbols'
    let physNumericPool = []; // [{ id, type: 'yellow'|..., rolledValue: null | 1..12 }]
    let physActiveCardId = null;
    let physActiveDraftKey = 'free';
    let physPartyPools = []; // [{ characterId, characterName, skillName, yellow, green, blue, purple, red, black, white, difficultyLabel, formattedSummary }]
    let physActiveCharIdx = 0;
    let physDraftsByKey = {}; // { [draftKey]: { cardId, skill, narrative, activeCharIdx, charStates: [...] } }
    let suppressNextCoopBroadcast = false;
    let coopBroadcastTimer = null;
    let coopCampaignChannel = null;
    let fichasAtivasEmCenaCache = []; // Cache das fichas ativas na mesa (ex: Kilian, Nayla)
    const myClientInstanceId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const physNumericSection = document.getElementById('physNumericSection');
    const physSymbolsSection = document.getElementById('physSymbolsSection');
    const physNumericDiceList = document.getElementById('physNumericDiceList');
    const physRollNarrativeInput = document.getElementById('physRollNarrativeInput');
    const physCharacterTabs = document.getElementById('physCharacterTabs');
    const physActiveCharBadge = document.getElementById('physActiveCharBadge');
    const minimizePhysRollBtn = document.getElementById('minimizePhysRollBtn');
    const physDraftFloatingPill = document.getElementById('physDraftFloatingPill');
    const physDraftPillLabel = document.getElementById('physDraftPillLabel');
    const resumePhysDraftBtn = document.getElementById('resumePhysDraftBtn');
    const physCoopSyncBadge = document.getElementById('physCoopSyncBadge');

    const criarNumericPoolAPartirDePoolObj = (poolObj) => {
        const list = [];
        const addCount = (type, count) => {
            const n = Math.max(0, Math.min(12, Number(count || 0)));
            for (let i = 0; i < n; i++) {
                list.push({
                    id: `die-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${i}`,
                    type,
                    rolledValue: null
                });
            }
        };
        if (poolObj && typeof poolObj === 'object') {
            addCount('yellow', poolObj.yellow);
            addCount('green', poolObj.green);
            addCount('blue', poolObj.blue);
            addCount('purple', poolObj.purple);
            addCount('red', poolObj.red);
            addCount('black', poolObj.black);
            addCount('white', poolObj.white);
        } else {
            addCount('yellow', 1);
            addCount('green', 1);
            addCount('purple', 2);
        }
        return list;
    };

    const rascunhoTemConteudo = (draft) => {
        if (!draft) return false;
        if ((draft.narrative || '').trim().length > 0) return true;
        return (draft.charStates || []).some((cs) => {
            const hasRolledDie = (cs.numericPool || []).some((d) => d.rolledValue !== null);
            const hasSym = Object.values(cs.symbolsState || {}).some((v) => Number(v) > 0);
            return hasRolledDie || hasSym;
        });
    };

    const atualizarPilulaRascunhoFlutuante = () => {
        const draft = physDraftsByKey[physActiveDraftKey];
        const modalAberto = physicalRollModal && physicalRollModal.classList.contains('show');
        const temConteudo = rascunhoTemConteudo(draft);

        if (physDraftFloatingPill) {
            if (!modalAberto && temConteudo) {
                const charName = draft?.charStates?.[draft.activeCharIdx || 0]?.characterName || 'Operativo';
                const sk = draft?.skill || 'Teste';
                if (physDraftPillLabel) {
                    physDraftPillLabel.textContent = `Rascunho salvo (${charName} • ${sk})`;
                }
                physDraftFloatingPill.classList.remove('hidden');
            } else {
                physDraftFloatingPill.classList.add('hidden');
            }
        }

        // Atualiza texto do botão no Card caso haja rascunho em andamento
        if (draft?.cardId && messagesArea) {
            const physBtnSpan = messagesArea.querySelector(
                `[data-card-action="roll_physical"][data-card-id="${draft.cardId}"] span`
            );
            if (physBtnSpan) {
                physBtnSpan.textContent = temConteudo
                    ? 'Continuar Rolagem (Rascunho Salvo)'
                    : 'Digitar Dados Físicos';
            }
        }
    };

    const salvarEstadoAtualNoRascunho = (dispararBroadcast = true) => {
        const draft = physDraftsByKey[physActiveDraftKey];
        if (!draft) return;
        draft.skill = (physRollSkillInput?.value || '').trim();
        draft.narrative = physRollNarrativeInput ? physRollNarrativeInput.value : '';
        draft.activeCharIdx = physActiveCharIdx;
        if (draft.charStates && draft.charStates[physActiveCharIdx]) {
            draft.charStates[physActiveCharIdx].mode = physRollMode;
            draft.charStates[physActiveCharIdx].numericPool = JSON.parse(JSON.stringify(physNumericPool));
            draft.charStates[physActiveCharIdx].symbolsState = { ...physRollState };
        }
        atualizarPilulaRascunhoFlutuante();

        if (dispararBroadcast && !suppressNextCoopBroadcast && coopCampaignChannel) {
            if (coopBroadcastTimer) clearTimeout(coopBroadcastTimer);
            coopBroadcastTimer = setTimeout(() => {
                coopCampaignChannel.send({
                    type: 'broadcast',
                    event: 'roll_station_sync',
                    payload: {
                        senderClientId: myClientInstanceId,
                        senderName: localStorage.getItem('obiwan_user') || 'Parceiro',
                        action: 'update',
                        draftKey: physActiveDraftKey,
                        draft: JSON.parse(JSON.stringify(draft))
                    }
                });
            }, 180);
        }
    };

    const carregarCharStateAtivoNaTela = () => {
        const draft = physDraftsByKey[physActiveDraftKey];
        if (!draft) return;
        const cs = draft.charStates[physActiveCharIdx] || draft.charStates[0];
        if (!cs) return;

        if (physRollSkillInput) physRollSkillInput.value = draft.skill || cs.pool?.skillName || '';
        if (physRollNarrativeInput && document.activeElement !== physRollNarrativeInput) {
            physRollNarrativeInput.value = draft.narrative || '';
        }
        if (physActiveCharBadge) {
            physActiveCharBadge.textContent = cs.characterName || 'Operativo';
        }

        physRollMode = cs.mode || 'numeric';
        physNumericPool = JSON.parse(JSON.stringify(cs.numericPool || []));
        Object.keys(physRollState).forEach((k) => {
            physRollState[k] = Number(cs.symbolsState?.[k] || 0);
        });

        renderizarAbasPersonagensNoModal();
        renderizarListaDadosNumericos();
        document.querySelectorAll('.physRollModeTab').forEach((tab) => {
            tab.classList.toggle('active', tab.getAttribute('data-phys-tab') === physRollMode);
        });
        if (physNumericSection) physNumericSection.classList.toggle('hidden', physRollMode !== 'numeric');
        if (physSymbolsSection) physSymbolsSection.classList.toggle('hidden', physRollMode !== 'symbols');
        if (physRollMode === 'numeric') {
            recalcularSimbolosDosDadosNumericos();
        }
        atualizarPreviewRolagemFisica();
    };

    const renderizarAbasPersonagensNoModal = () => {
        if (!physCharacterTabs) return;
        const draft = physDraftsByKey[physActiveDraftKey];
        const charStates = draft?.charStates || [];
        if (charStates.length <= 1) {
            physCharacterTabs.classList.add('hidden');
            physCharacterTabs.innerHTML = '';
            return;
        }

        physCharacterTabs.classList.remove('hidden');
        physCharacterTabs.innerHTML = charStates
            .map((cs, idx) => {
                const isAct = idx === physActiveCharIdx;
                const rolledCount = (cs.numericPool || []).filter((d) => d.rolledValue !== null).length;
                const statusHint =
                    rolledCount > 0
                        ? `${rolledCount}/${cs.numericPool.length} dados marcados`
                        : `${cs.pool?.yellow || 0}A + ${cs.pool?.green || 0}V`;
                return `
                    <button type="button" class="physCharTabBtn ${isAct ? 'active' : ''}" data-phys-char-idx="${idx}">
                        <span>${cs.characterName || `Personagem ${idx + 1}`}</span>
                        <span class="physCharTabPoolHint">(${statusHint})</span>
                    </button>
                `;
            })
            .join('');
    };

    const recalcularSimbolosDosDadosNumericos = () => {
        Object.keys(physRollState).forEach((k) => {
            physRollState[k] = 0;
        });
        physNumericPool.forEach((die) => {
            if (!die.rolledValue) return;
            const def = NUMERIC_DIE_DEFINITIONS[die.type];
            const face = def?.faces?.[die.rolledValue];
            if (!face?.symbols) return;
            Object.entries(face.symbols).forEach(([sym, val]) => {
                if (sym in physRollState) {
                    physRollState[sym] += val;
                }
            });
        });
    };

    const renderizarListaDadosNumericos = () => {
        if (!physNumericDiceList) return;
        if (physNumericPool.length === 0) {
            physNumericDiceList.innerHTML =
                '<p class="obiModalSubtitle" style="padding: 8px 4px;">Clique nos botões acima (+ Amarelo, + Verde, + Roxo...) para montar os dados que você vai rolar na mesa.</p>';
            return;
        }

        const countsByType = {};
        physNumericDiceList.innerHTML = '';

        physNumericPool.forEach((die) => {
            const def = NUMERIC_DIE_DEFINITIONS[die.type];
            if (!def) return;
            countsByType[die.type] = (countsByType[die.type] || 0) + 1;
            const totalOfType = physNumericPool.filter((d) => d.type === die.type).length;
            const idxLabel = totalOfType > 1 ? ` #${countsByType[die.type]}` : '';

            const faceInfo = die.rolledValue ? def.faces[die.rolledValue] : null;
            const resultText = faceInfo
                ? `Caiu ${die.rolledValue} → ${faceInfo.text}`
                : 'Toque no número rolado';

            let btnsHtml = '';
            for (let n = 1; n <= def.sides; n++) {
                const isSel = die.rolledValue === n;
                btnsHtml += `<button type="button" class="physDieNumBtn ${isSel ? 'selected' : ''}" data-die-id="${die.id}" data-die-num="${n}">${n}</button>`;
            }

            const row = document.createElement('div');
            row.className = `physDieRow ${die.type}`;
            row.innerHTML = `
                <div class="physDieRowHeader">
                    <div class="physDieTitleGroup">
                        <span class="physDieName">${def.label}${idxLabel}</span>
                        <span class="physDiePolyBadge">${def.poly}</span>
                        <span class="physDieResultTag ${faceInfo ? 'rolled' : ''}">${resultText}</span>
                    </div>
                    <button type="button" class="physDieRemoveBtn" data-remove-die="${die.id}" title="Remover este dado">×</button>
                </div>
                <div class="physDieNumbersGrid">
                    ${btnsHtml}
                </div>
            `;
            physNumericDiceList.appendChild(row);
        });
    };

    const formatarRolagemDeUmCharState = (cs, skillLabel) => {
        const s = cs.symbolsState || {};
        const partes = [];
        if (s.success > 0) partes.push(`${s.success} ${s.success === 1 ? 'Sucesso' : 'Sucessos'}`);
        if (s.advantage > 0) partes.push(`${s.advantage} ${s.advantage === 1 ? 'Vantagem' : 'Vantagens'}`);
        if (s.triumph > 0) partes.push(`${s.triumph} ${s.triumph === 1 ? 'Triunfo' : 'Triunfos'}`);
        if (s.failure > 0) partes.push(`${s.failure} ${s.failure === 1 ? 'Falha' : 'Falhas'}`);
        if (s.threat > 0) partes.push(`${s.threat} ${s.threat === 1 ? 'Ameaça' : 'Ameaças'}`);
        if (s.despair > 0) partes.push(`${s.despair} ${s.despair === 1 ? 'Desespero' : 'Desesperos'}`);
        if (s.lightPip > 0) partes.push(`${s.lightPip} ${s.lightPip === 1 ? 'Ponto de Luz' : 'Pontos de Luz'}`);
        if (s.darkPip > 0) partes.push(`${s.darkPip} ${s.darkPip === 1 ? 'Ponto Sombrio' : 'Pontos Sombrios'}`);

        const rolledDiceDetails =
            cs.mode === 'numeric'
                ? (cs.numericPool || [])
                      .filter((d) => d.rolledValue !== null)
                      .map((d) => {
                          const def = NUMERIC_DIE_DEFINITIONS[d.type];
                          return `${def.label.split(' ')[0]}(d${def.sides}=${d.rolledValue})`;
                      })
                : [];

        if (partes.length === 0 && rolledDiceDetails.length === 0) return '';

        const textoSimbolos = partes.length > 0 ? partes.join(', ') : '0 Sucessos, 1 Falha';
        const charTag = cs.characterName ? ` (${cs.characterName})` : '';
        const prefixo = skillLabel
            ? `Resultado da rolagem de ${skillLabel}${charTag}`
            : `Resultado da rolagem${charTag}`;
        const detalheDados = rolledDiceDetails.length > 0 ? ` [Dados físicos: ${rolledDiceDetails.join(', ')}]` : '';
        return `${prefixo}: ${textoSimbolos}.${detalheDados}`;
    };

    const formatarTextoRolagemFisica = () => {
        salvarEstadoAtualNoRascunho(false);
        const draft = physDraftsByKey[physActiveDraftKey];
        const skill = (physRollSkillInput?.value || draft?.skill || '').trim();
        const narrativa = (physRollNarrativeInput?.value || draft?.narrative || '').trim();

        // Inclui todos os personagens da aba que tiveram dados rolados (ex: Kilian e/ou Nayla!)
        const linhasRolagem = [];
        if (draft && Array.isArray(draft.charStates)) {
            draft.charStates.forEach((cs) => {
                const linha = formatarRolagemDeUmCharState(cs, skill);
                if (linha) linhasRolagem.push(linha);
            });
        }

        if (linhasRolagem.length === 0 && !narrativa) return '';
        if (narrativa && linhasRolagem.length > 0) {
            return `${narrativa}\n\n${linhasRolagem.join('\n')}`;
        }
        return narrativa || linhasRolagem.join('\n');
    };

    const atualizarPreviewRolagemFisica = () => {
        Object.keys(physRollState).forEach((k) => {
            const el = document.querySelector(`.rollCounterVal[data-val="${k}"]`);
            if (el) el.textContent = String(physRollState[k]);
        });
        if (physRollPreview) {
            const draft = physDraftsByKey[physActiveDraftKey];
            const cs = draft?.charStates?.[physActiveCharIdx];
            const skill = (physRollSkillInput?.value || '').trim();
            const txtRollOnly = cs ? formatarRolagemDeUmCharState(cs, skill) : '';
            if (!txtRollOnly) {
                physRollPreview.textContent =
                    physRollMode === 'numeric'
                        ? 'Toque nos números tirados em cada dado para converter automaticamente pela Tabela 1-3.'
                        : 'Selecione os símbolos acima para montar o resultado.';
                return;
            }
            const netSucc = (physRollState.success + physRollState.triumph) - (physRollState.failure + physRollState.despair);
            const netAdv = physRollState.advantage - physRollState.threat;
            const ResumoLiquido = [];
            if (
                physRollState.success > 0 ||
                physRollState.failure > 0 ||
                physRollState.triumph > 0 ||
                physRollState.despair > 0 ||
                physRollState.advantage > 0 ||
                physRollState.threat > 0
            ) {
                ResumoLiquido.push(netSucc >= 1 ? `SUCESSO (${netSucc} líquido)` : `FALHA (${netSucc} líquido)`);
                if (netAdv > 0) ResumoLiquido.push(`${netAdv} Vantagem líquida`);
                else if (netAdv < 0) ResumoLiquido.push(`${Math.abs(netAdv)} Ameaça líquida`);
                if (physRollState.triumph > 0) ResumoLiquido.push(`${physRollState.triumph} Triunfo`);
                if (physRollState.despair > 0) ResumoLiquido.push(`${physRollState.despair} Desespero`);
            }
            if (physRollState.lightPip > 0) ResumoLiquido.push(`${physRollState.lightPip} Luz`);
            if (physRollState.darkPip > 0) ResumoLiquido.push(`${physRollState.darkPip} Sombrio`);

            physRollPreview.textContent =
                ResumoLiquido.length > 0 ? `${txtRollOnly} → Saldo Final: ${ResumoLiquido.join(' • ')}` : txtRollOnly;
        }
    };

    const alternarAbaRolagemFisica = (modo) => {
        physRollMode = modo === 'symbols' ? 'symbols' : 'numeric';
        document.querySelectorAll('.physRollModeTab').forEach((tab) => {
            tab.classList.toggle('active', tab.getAttribute('data-phys-tab') === physRollMode);
        });
        if (physNumericSection) physNumericSection.classList.toggle('hidden', physRollMode !== 'numeric');
        if (physSymbolsSection) physSymbolsSection.classList.toggle('hidden', physRollMode !== 'symbols');
        if (physRollMode === 'numeric') {
            recalcularSimbolosDosDadosNumericos();
        }
        salvarEstadoAtualNoRascunho(true);
        atualizarPreviewRolagemFisica();
    };

    const construirPartyPoolsParaModal = (poolObj) => {
        if (Array.isArray(poolObj?.partyPools) && poolObj.partyPools.length > 0) {
            return poolObj.partyPools;
        }
        const charsEmCena = (fichasAtivasEmCenaCache || []).filter(
            (f) => f?.entity && f.entity.entityType !== 'ship'
        );
        if (poolObj && typeof poolObj === 'object') {
            const lista = [poolObj];
            charsEmCena.forEach((f) => {
                if (f.entity.name && f.entity.name !== poolObj.characterName) {
                    lista.push({
                        ...poolObj,
                        characterId: f.characterId,
                        characterName: f.entity.name
                    });
                }
            });
            return lista;
        }
        if (charsEmCena.length > 0) {
            return charsEmCena.map((f) => ({
                characterId: f.characterId,
                characterName: f.entity.name,
                skillName: '',
                yellow: 1,
                green: 1,
                blue: 0,
                purple: 2,
                red: 0,
                black: 0,
                white: 0
            }));
        }
        return [
            {
                characterId: 'default',
                characterName: 'Operativo',
                skillName: '',
                yellow: 1,
                green: 1,
                blue: 0,
                purple: 2,
                red: 0,
                black: 0,
                white: 0
            }
        ];
    };

    const abrirModalRolagemFisica = (skillInicial = '', poolObj = null, cardId = null, preferredCharIdx = null, fromRemote = false) => {
        physActiveCardId = cardId || null;
        physActiveDraftKey = cardId || 'free';

        let draft = physDraftsByKey[physActiveDraftKey];
        if (!draft) {
            const pools = construirPartyPoolsParaModal(poolObj);
            draft = {
                cardId: physActiveCardId,
                skill: skillInicial || poolObj?.skillName || '',
                narrative: '',
                activeCharIdx: typeof preferredCharIdx === 'number' ? preferredCharIdx : 0,
                charStates: pools.map((p) => ({
                    characterId: p.characterId,
                    characterName: p.characterName || 'Operativo',
                    pool: p,
                    mode: 'numeric',
                    numericPool: criarNumericPoolAPartirDePoolObj(p),
                    symbolsState: {
                        success: 0,
                        advantage: 0,
                        triumph: 0,
                        failure: 0,
                        threat: 0,
                        despair: 0,
                        lightPip: 0,
                        darkPip: 0
                    }
                }))
            };
            physDraftsByKey[physActiveDraftKey] = draft;
        } else if (typeof preferredCharIdx === 'number' && draft.charStates[preferredCharIdx]) {
            draft.activeCharIdx = preferredCharIdx;
        }

        physActiveCharIdx = draft.activeCharIdx || 0;
        carregarCharStateAtivoNaTela();
        fecharTodosOsModais();
        if (physicalRollModal) physicalRollModal.classList.add('show');
        atualizarPilulaRascunhoFlutuante();

        if (!fromRemote && coopCampaignChannel) {
            if (physCoopSyncBadge) physCoopSyncBadge.classList.remove('hidden');
            coopCampaignChannel.send({
                type: 'broadcast',
                event: 'roll_station_sync',
                payload: {
                    senderClientId: myClientInstanceId,
                    senderName: localStorage.getItem('obiwan_user') || 'Parceiro',
                    action: 'open',
                    draftKey: physActiveDraftKey,
                    draft: JSON.parse(JSON.stringify(draft))
                }
            });
        }
    };

    const minimizarModalRolagemFisica = () => {
        salvarEstadoAtualNoRascunho(false);
        if (physicalRollModal) physicalRollModal.classList.remove('show');
        atualizarPilulaRascunhoFlutuante();
    };

    if (minimizePhysRollBtn) {
        minimizePhysRollBtn.addEventListener('click', minimizarModalRolagemFisica);
    }

    if (resumePhysDraftBtn) {
        resumePhysDraftBtn.addEventListener('click', () => {
            const draft = physDraftsByKey[physActiveDraftKey];
            if (draft) {
                abrirModalRolagemFisica(draft.skill, null, draft.cardId, draft.activeCharIdx);
            }
        });
    }

    if (physicalRollModal) {
        physicalRollModal.addEventListener('click', (e) => {
            const charTabBtn = e.target.closest('[data-phys-char-idx]');
            if (charTabBtn) {
                salvarEstadoAtualNoRascunho(false);
                const nextIdx = parseInt(charTabBtn.getAttribute('data-phys-char-idx') || '0', 10);
                physActiveCharIdx = nextIdx;
                if (physDraftsByKey[physActiveDraftKey]) {
                    physDraftsByKey[physActiveDraftKey].activeCharIdx = nextIdx;
                }
                carregarCharStateAtivoNaTela();
                salvarEstadoAtualNoRascunho(true);
                return;
            }

            const tabBtn = e.target.closest('[data-phys-tab]');
            if (tabBtn) {
                alternarAbaRolagemFisica(tabBtn.getAttribute('data-phys-tab'));
                return;
            }

            const addDieBtn = e.target.closest('[data-add-die]');
            if (addDieBtn) {
                const type = addDieBtn.getAttribute('data-add-die');
                if (NUMERIC_DIE_DEFINITIONS[type]) {
                    physNumericPool.push({
                        id: `die-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                        type,
                        rolledValue: null
                    });
                    renderizarListaDadosNumericos();
                    recalcularSimbolosDosDadosNumericos();
                    salvarEstadoAtualNoRascunho(true);
                    renderizarAbasPersonagensNoModal();
                    atualizarPreviewRolagemFisica();
                }
                return;
            }

            const removeDieBtn = e.target.closest('[data-remove-die]');
            if (removeDieBtn) {
                const dieId = removeDieBtn.getAttribute('data-remove-die');
                physNumericPool = physNumericPool.filter((d) => d.id !== dieId);
                renderizarListaDadosNumericos();
                recalcularSimbolosDosDadosNumericos();
                salvarEstadoAtualNoRascunho(true);
                renderizarAbasPersonagensNoModal();
                atualizarPreviewRolagemFisica();
                return;
            }

            const numBtn = e.target.closest('[data-die-num]');
            if (numBtn) {
                const dieId = numBtn.getAttribute('data-die-id');
                const numVal = parseInt(numBtn.getAttribute('data-die-num') || '0', 10);
                const targetDie = physNumericPool.find((d) => d.id === dieId);
                if (targetDie && numVal >= 1) {
                    targetDie.rolledValue = targetDie.rolledValue === numVal ? null : numVal;
                    renderizarListaDadosNumericos();
                    recalcularSimbolosDosDadosNumericos();
                    salvarEstadoAtualNoRascunho(true);
                    renderizarAbasPersonagensNoModal();
                    atualizarPreviewRolagemFisica();
                }
                return;
            }

            const btn = e.target.closest('.rollStepBtn');
            if (!btn) return;
            const card = btn.closest('.rollCounterCard');
            const sym = card?.getAttribute('data-symbol');
            const step = parseInt(btn.getAttribute('data-step') || '0', 10);
            if (!sym || !(sym in physRollState)) return;
            physRollState[sym] = Math.max(0, Math.min(20, physRollState[sym] + step));
            salvarEstadoAtualNoRascunho(true);
            atualizarPreviewRolagemFisica();
        });
    }

    if (physRollSkillInput) {
        physRollSkillInput.addEventListener('input', () => {
            salvarEstadoAtualNoRascunho(true);
            atualizarPreviewRolagemFisica();
        });
    }

    if (physRollNarrativeInput) {
        physRollNarrativeInput.addEventListener('input', () => {
            salvarEstadoAtualNoRascunho(true);
        });
    }

    if (resetPhysRollBtn) {
        resetPhysRollBtn.addEventListener('click', () => {
            Object.keys(physRollState).forEach((k) => {
                physRollState[k] = 0;
            });
            physNumericPool.forEach((d) => {
                d.rolledValue = null;
            });
            if (physRollNarrativeInput) physRollNarrativeInput.value = '';
            const draft = physDraftsByKey[physActiveDraftKey];
            if (draft) {
                draft.narrative = '';
                (draft.charStates || []).forEach((cs) => {
                    (cs.numericPool || []).forEach((d) => {
                        d.rolledValue = null;
                    });
                    Object.keys(cs.symbolsState || {}).forEach((k) => {
                        cs.symbolsState[k] = 0;
                    });
                });
            }
            renderizarAbasPersonagensNoModal();
            renderizarListaDadosNumericos();
            salvarEstadoAtualNoRascunho(true);
            atualizarPreviewRolagemFisica();
        });
    }

    if (insertPhysRollBtn) {
        insertPhysRollBtn.addEventListener('click', () => {
            const txt = formatarTextoRolagemFisica();
            if (!txt || !chatInput) return;
            chatInput.value = chatInput.value.trim() ? `${chatInput.value.trim()}\n${txt}` : txt;
            handleInputResize();
            physicalRollModal.classList.remove('show');
            atualizarPilulaRascunhoFlutuante();
            chatInput.focus();
        });
    }

    if (sendPhysRollBtn) {
        sendPhysRollBtn.addEventListener('click', async () => {
            const txt = formatarTextoRolagemFisica();
            if (!txt || !chatInput) return;
            if (physActiveCardId && messagesArea) {
                const badgeEl = messagesArea.querySelector(`[data-card-badge="${physActiveCardId}"]`);
                const cardBox = messagesArea.querySelector(`[data-card-box="${physActiveCardId}"]`);
                const controlsDiv = messagesArea.querySelector(`[data-card-controls="${physActiveCardId}"]`);
                if (badgeEl) badgeEl.textContent = 'ROLADO';
                if (cardBox) cardBox.classList.add('resolvedCard');
                if (controlsDiv) {
                    controlsDiv.innerHTML = `
                        <div class="kenobiAutoLogPill">
                            ${SVG_ICONS.dice}
                            <span>${txt.replace(/\n+/g, ' • ')}</span>
                        </div>
                    `;
                }
            }
            delete physDraftsByKey[physActiveDraftKey];
            atualizarPilulaRascunhoFlutuante();
            chatInput.value = txt;
            handleInputResize();
            physicalRollModal.classList.remove('show');
            await handleSendMessage();
        });
    }

    // Menu rápido do botão +
    if (attachBtn && quickToolsMenu) {
        attachBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            quickToolsMenu.classList.toggle('open');
        });

        quickToolsMenu.addEventListener('click', (e) => {
            const item = e.target.closest('[data-quick-tool]');
            if (!item) return;
            e.stopPropagation();
            const tool = item.getAttribute('data-quick-tool');
            quickToolsMenu.classList.remove('open');
            if (tool === 'physical_roll') abrirModalRolagemFisica('');
            else if (tool === 'sheets' && manageSheetsBtn) manageSheetsBtn.click();
            else if (tool === 'canon' && openCanonBtn) openCanonBtn.click();
            else if (tool === 'automation' && openAutomationBtn) openAutomationBtn.click();
        });
    }

    // Abertura do Bottom Sheet "Painel da Mesa" no Mobile
    const abrirPainelMesaMobile = async () => {
        if (!conversaAtualId) await iniciarNovaConversa();
        await atualizarBarraTatica();
        fecharTodosOsModais();
        if (mobileTableSheet) mobileTableSheet.classList.add('show');
    };

    if (mobileSceneSummaryBtn) mobileSceneSummaryBtn.addEventListener('click', abrirPainelMesaMobile);
    if (mobileTableBtn) mobileTableBtn.addEventListener('click', abrirPainelMesaMobile);

    if (mobileCopyCodeBtn) {
        mobileCopyCodeBtn.addEventListener('click', async () => {
            if (!campanhaAtualObj?.join_code) return;
            try {
                await navigator.clipboard.writeText(campanhaAtualObj.join_code);
                const old = mobileSheetJoinCode.textContent;
                mobileSheetJoinCode.textContent = 'COPIADO';
                setTimeout(() => {
                    mobileSheetJoinCode.textContent = old;
                }, 1400);
            } catch {}
        });
    }

    if (mobileTableSheet) {
        mobileTableSheet.addEventListener('click', (e) => {
            const tile = e.target.closest('[data-sheet-shortcut]');
            if (!tile) return;
            const target = tile.getAttribute('data-sheet-shortcut');
            mobileTableSheet.classList.remove('show');
            if (target === 'sheets' && manageSheetsBtn) manageSheetsBtn.click();
            else if (target === 'canon' && openCanonBtn) openCanonBtn.click();
            else if (target === 'automation' && openAutomationBtn) openAutomationBtn.click();
        });
    }

    let conversaAtualId = null;
    let campanhaAtualObj = null;

    // ==========================================
    // 0. LÓGICA DOS CUSTOM SELECTS (.obiCustomSelect)
    // ==========================================
    const setObiSelectValue = (inputId, value) => {
        const wrapper = document.querySelector(`.obiCustomSelect[data-target-input="${inputId}"]`);
        const hiddenInput = document.getElementById(inputId);
        if (!wrapper || !hiddenInput) return;

        hiddenInput.value = String(value);
        const textSpan = wrapper.querySelector('.obiSelectText');
        const options = wrapper.querySelectorAll('.obiSelectOptions li');
        options.forEach((li) => {
            if (li.getAttribute('data-value') === String(value)) {
                li.classList.add('selected');
                if (textSpan) textSpan.textContent = li.textContent;
            } else {
                li.classList.remove('selected');
            }
        });
    };

    document.querySelectorAll('.obiCustomSelect').forEach((wrapper) => {
        const trigger = wrapper.querySelector('.obiSelectTrigger');
        const options = wrapper.querySelectorAll('.obiSelectOptions li');
        const inputId = wrapper.getAttribute('data-target-input');

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.obiCustomSelect.open').forEach((other) => {
                    if (other !== wrapper) other.classList.remove('open');
                });
                wrapper.classList.toggle('open');
            });
        }

        options.forEach((option) => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = option.getAttribute('data-value');
                setObiSelectValue(inputId, val);
                wrapper.classList.remove('open');
            });
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.obiCustomSelect.open').forEach((w) => w.classList.remove('open'));
        document.querySelectorAll('.chatDropdown.show').forEach((menu) => menu.classList.remove('show'));
        if (quickToolsMenu) quickToolsMenu.classList.remove('open');
    });

    // ==========================================
    // 1. IDENTIDADE DO OPERATIVO & BOAS-VINDAS (CORRIGE "estudio.tiago.web")
    // ==========================================
    const sidebarUserName = document.getElementById('sidebarUserName');
    const cinematicWelcome = document.getElementById('cinematicWelcome');
    const welcomeTitle = document.getElementById('welcomeTitle');

    const atualizarExibicaoUsuario = (nome, tratamento) => {
        const tituloSideBar = tratamento === 'F' ? 'Mestra' : 'Mestre';
        if (sidebarUserName) {
            sidebarUserName.textContent = `${tituloSideBar} (${nome})`;
        }
    };

    const dispararBoasVindasCinematica = (nome, tratamento) => {
        if (!cinematicWelcome || !welcomeTitle) return;
        const saudacao = tratamento === 'F' ? 'Bem-vinda' : 'Bem-vindo';
        const titulo = tratamento === 'F' ? 'Mestra' : 'Mestre';
        const textToType = `${saudacao}, ${titulo} ${nome}.`;
        welcomeTitle.textContent = '';
        let charIndex = 0;

        setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (charIndex < textToType.length) {
                    welcomeTitle.textContent += textToType.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    setTimeout(() => {
                        cinematicWelcome.classList.add('hide');
                        if (chatInput) chatInput.focus();
                    }, 1200);
                }
            }, 65);
        }, 600);
    };

    const parecePrefixoDeEmail = (nome, email) => {
        if (!nome) return true;
        const prefixo = email ? email.split('@')[0].toLowerCase() : '';
        const n = nome.trim().toLowerCase();
        return n === prefixo || n.includes('.') || n.includes('@');
    };

    const sincronizarIdentidadeOperativo = async () => {
        const { data } = await API.clienteSupabase.auth.getSession();
        const user = data?.session?.user;
        if (!user) {
            localStorage.removeItem('obiwan_user');
            window.location.href = 'index.html';
            return;
        }

        let nome = user.user_metadata?.nome_operativo || localStorage.getItem('obiwan_user') || '';
        let tratamento = user.user_metadata?.tratamento || localStorage.getItem('obiwan_tratamento') || 'M';
        let precisaConfigurarPerfil = parecePrefixoDeEmail(nome, user.email);

        // Se a conta veio do Datapad sem 'nome_operativo' no Auth (ex: "estudio.tiago.web"),
        // busca o nome do primeiro Operativo salvo no Datapad ou sugere um nome limpo
        if (precisaConfigurarPerfil) {
            try {
                const { data: chars } = await API.clienteSupabase
                    .from('characters')
                    .select('data')
                    .eq('user_id', user.id);

                const firstPc = (chars || [])
                    .map((r) => r.data)
                    .find((d) => d && (!d.entityType || d.entityType === 'pc') && d.name && d.name !== 'Novo Personagem');

                if (firstPc?.name) {
                    nome = firstPc.name;
                } else {
                    nome = 'Tiago';
                }
            } catch {
                nome = 'Operativo';
            }
        }

        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const settingsProfileNameInput = document.getElementById('settingsProfileNameInput');
        const settingsProfileTreatmentSelect = document.getElementById('settingsProfileTreatmentSelect');
        const settingsNameCooldownHint = document.getElementById('settingsNameCooldownHint');
        const saveSettingsProfileBtn = document.getElementById('saveSettingsProfileBtn');

        const atualizarEstadoCooldownIdentidade = (nomeAtual, tratamentoAtual, lastUpdatedTs) => {
            if (settingsProfileNameInput) settingsProfileNameInput.value = nomeAtual || '';
            if (settingsProfileTreatmentSelect) settingsProfileTreatmentSelect.value = tratamentoAtual || 'M';
            if (profileNameInput) profileNameInput.value = nomeAtual || '';
            setObiSelectValue('profileTreatmentInput', tratamentoAtual || 'M');

            const ts = Number(lastUpdatedTs || localStorage.getItem('obiwan_nome_updated_at') || 0);
            const elapsed = ts > 0 ? Date.now() - ts : SEVEN_DAYS_MS + 1;
            const emCooldown = ts > 0 && elapsed < SEVEN_DAYS_MS;

            if (settingsNameCooldownHint) {
                if (emCooldown) {
                    const dias = Math.max(1, Math.ceil((SEVEN_DAYS_MS - elapsed) / (24 * 60 * 60 * 1000)));
                    settingsNameCooldownHint.textContent = `Nome bloqueado para alteração por mais ${dias} dia(s) (limite de 7 dias). Você ainda pode alterar o título Mestre/Mestra.`;
                    settingsNameCooldownHint.classList.add('locked');
                } else {
                    settingsNameCooldownHint.textContent = 'Troca de nome disponível (limite de 1 alteração a cada 7 dias).';
                    settingsNameCooldownHint.classList.remove('locked');
                }
            }
        };

        if (user.user_metadata?.nome_updated_at) {
            localStorage.setItem('obiwan_nome_updated_at', String(user.user_metadata.nome_updated_at));
        }

        localStorage.setItem('obiwan_user', nome);
        localStorage.setItem('obiwan_tratamento', tratamento);
        atualizarExibicaoUsuario(nome, tratamento);
        atualizarEstadoCooldownIdentidade(nome, tratamento, user.user_metadata?.nome_updated_at);
        dispararBoasVindasCinematica(nome, tratamento);

        // Se o metadata do Supabase Auth ainda não tinha nome_operativo válido, abre o modal de confirmação
        if (!user.user_metadata?.nome_operativo || parecePrefixoDeEmail(user.user_metadata?.nome_operativo, user.email)) {
            if (profileNameInput) profileNameInput.value = nome;
            setObiSelectValue('profileTreatmentInput', tratamento);
            if (profileModal) profileModal.classList.add('show');
        }
    };

    sincronizarIdentidadeOperativo();

    if (profileBtn && profileModal) {
        profileBtn.addEventListener('click', () => {
            const atualNome = localStorage.getItem('obiwan_user') || '';
            const atualTrat = localStorage.getItem('obiwan_tratamento') || 'M';
            if (profileNameInput) profileNameInput.value = atualNome;
            setObiSelectValue('profileTreatmentInput', atualTrat);
            profileModal.classList.add('show');
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', async () => {
            const novoNome = (profileNameInput?.value || '').trim();
            const novoTratamento = profileTreatmentInput?.value || 'M';
            if (!novoNome) return;

            saveProfileBtn.textContent = 'Salvando...';
            saveProfileBtn.disabled = true;
            const res = await API.atualizarPerfilUsuario(novoNome, novoTratamento);
            saveProfileBtn.textContent = 'Salvar Identificação';
            saveProfileBtn.disabled = false;

            if (!res.sucesso) {
                alert(res.erro || 'Não foi possível atualizar o nome agora.');
                return;
            }
            atualizarExibicaoUsuario(novoNome, novoTratamento);
            const sName = document.getElementById('settingsProfileNameInput');
            const sTrat = document.getElementById('settingsProfileTreatmentSelect');
            if (sName) sName.value = novoNome;
            if (sTrat) sTrat.value = novoTratamento;
            if (profileModal) profileModal.classList.remove('show');
        });
    }

    const saveSettingsProfileBtn = document.getElementById('saveSettingsProfileBtn');
    if (saveSettingsProfileBtn) {
        saveSettingsProfileBtn.addEventListener('click', async () => {
            const sName = document.getElementById('settingsProfileNameInput');
            const sTrat = document.getElementById('settingsProfileTreatmentSelect');
            const hint = document.getElementById('settingsNameCooldownHint');
            const novoNome = (sName?.value || '').trim();
            const novoTratamento = sTrat?.value || 'M';
            if (!novoNome) return;

            saveSettingsProfileBtn.textContent = 'Salvando...';
            saveSettingsProfileBtn.disabled = true;
            const res = await API.atualizarPerfilUsuario(novoNome, novoTratamento);
            saveSettingsProfileBtn.textContent = 'Salvar Identificação';
            saveSettingsProfileBtn.disabled = false;

            if (!res.sucesso) {
                if (hint) {
                    hint.textContent = res.erro;
                    hint.classList.add('locked');
                } else {
                    alert(res.erro);
                }
                if (sName) sName.value = localStorage.getItem('obiwan_user') || '';
                return;
            }

            atualizarExibicaoUsuario(novoNome, novoTratamento);
            if (hint) {
                hint.textContent = 'Identificação atualizada! Próxima troca de nome disponível em 7 dias.';
                hint.classList.add('locked');
            }
        });
    }

    // ==========================================
    // 2. AUTO-RESIZE E EXPANSÃO DO CHAT
    // ==========================================
    const handleInputResize = () => {
        if (!chatInput) return;
        chatInput.style.height = 'auto';
        const scrollHeight = chatInput.scrollHeight;
        const limitHeight = 120;

        if (!inputSection.classList.contains('expandedMode')) {
            if (scrollHeight > limitHeight) {
                chatInput.style.height = limitHeight + 'px';
                chatInput.style.overflowY = 'auto';
                expandBtn.classList.remove('hidden');
            } else {
                chatInput.style.height = scrollHeight + 'px';
                chatInput.style.overflowY = 'hidden';
                expandBtn.classList.add('hidden');
            }
        } else {
            chatInput.style.height = '100%';
        }
    };

    if (chatInput && expandBtn && inputContainer && inputSection) {
        chatInput.addEventListener('input', handleInputResize);

        const toggleExpandedMode = () => {
            inputSection.classList.toggle('expandedMode');
            chatOverlay.classList.toggle('showOverlay');

            if (inputSection.classList.contains('expandedMode')) {
                expandIcon.innerHTML = `
                    <polyline points="4 14 10 14 10 20"></polyline>
                    <polyline points="20 10 14 10 14 4"></polyline>
                    <line x1="14" y1="10" x2="21" y2="3"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                `;
                chatInput.style.height = '';
                chatInput.style.overflowY = '';
                chatInput.focus();
            } else {
                expandIcon.innerHTML = `
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                `;
                handleInputResize();
            }
        };

        expandBtn.addEventListener('click', toggleExpandedMode);
        chatOverlay.addEventListener('click', () => {
            if (inputSection.classList.contains('expandedMode')) toggleExpandedMode();
        });
    }

    // ==========================================
    // 3. PAINEL LATERAL DE CONFIGURAÇÕES & SIDEBAR
    // ==========================================
    if (settingsBtn && settingsDrawer && closeSettingsBtn && settingsOverlay) {
        const toggleSettingsDrawer = () => {
            settingsDrawer.classList.toggle('open');
            settingsOverlay.classList.toggle('active');
        };
        settingsBtn.addEventListener('click', toggleSettingsDrawer);
        closeSettingsBtn.addEventListener('click', toggleSettingsDrawer);
        settingsOverlay.addEventListener('click', toggleSettingsDrawer);
    }

    const menuToggle = document.getElementById('menuToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.getElementById('settingsOverlay');

    if (sidebar) {
        const toggleSidebar = () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('open');
                mobileOverlay.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        };

        if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
        if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);

        mobileOverlay.addEventListener('click', () => {
            if (sidebar.classList.contains('open') && window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    }

    // ==========================================
    // 4. BARRA TÁTICA DA CAMPANHA (PURE SVG, ZERO EMOJIS)
    // ==========================================
    const atualizarBarraTatica = async () => {
        if (!conversaAtualId) {
            if (campaignJoinCodeText) campaignJoinCodeText.textContent = '#------';
            if (scenePartyPills) {
                scenePartyPills.innerHTML = '<span class="emptyPartyHint">Inicie ou selecione uma aventura ao lado.</span>';
            }
            return;
        }

        const [campRes, fichasRes] = await Promise.all([
            API.obterCampanhaPorId(conversaAtualId),
            API.obterFichasDaCampanha(conversaAtualId)
        ]);

        if (campRes.sucesso && campRes.dados) {
            campanhaAtualObj = campRes.dados;
            const codeText = `#${campRes.dados.join_code}`;
            if (campaignJoinCodeText) campaignJoinCodeText.textContent = codeText;
            if (modalJoinCodeDisplay) modalJoinCodeDisplay.textContent = codeText;
            if (mobileSheetJoinCode) mobileSheetJoinCode.textContent = codeText;
            if (mobileSceneSub) mobileSceneSub.textContent = codeText;
        }

        if (!scenePartyPills) return;

        const ativas = (fichasRes.vinculadas || []).filter((f) => f.activeInScene);
        fichasAtivasEmCenaCache = ativas;
        if (ativas.length === 0) {
            scenePartyPills.innerHTML =
                '<span class="emptyPartyHint">Nenhuma ficha vinculada — clique em "Fichas" para adicionar.</span>';
            if (mobileSceneTitle) mobileSceneTitle.textContent = campanhaAtualObj?.titulo || 'Mestre Kenobi';
            if (mobileSheetPartyList) {
                mobileSheetPartyList.innerHTML =
                    '<p class="obiModalSubtitle">Nenhuma ficha vinculada ainda.</p>';
            }
            return;
        }

        const primeiraFicha = ativas[0].entity;
        if (mobileSceneTitle) {
            if (primeiraFicha.entityType === 'ship') {
                mobileSceneTitle.textContent = `${primeiraFicha.name} • AC ${primeiraFicha.hullTrauma?.current ?? 0}/${primeiraFicha.hullTrauma?.threshold ?? 15}`;
            } else {
                mobileSceneTitle.textContent = `${primeiraFicha.name} • ${primeiraFicha.wounds?.current ?? 0}/${primeiraFicha.wounds?.threshold ?? 10}`;
            }
        }

        scenePartyPills.innerHTML = '';
        if (mobileSheetPartyList) mobileSheetPartyList.innerHTML = '';
        ativas.forEach((item) => {
            const ent = item.entity;
            const pill = document.createElement('div');
            const isShip = ent.entityType === 'ship';
            const isPartner = !item.isOwnCharacter;
            pill.className = `partySheetPill ${isShip ? 'shipPill' : isPartner ? 'partnerPill' : ''}`;

            let statsHtml = '';
            if (isShip) {
                statsHtml = `
                    <span class="statItem">AC ${ent.hullTrauma?.current ?? 0}/${ent.hullTrauma?.threshold ?? 15}</span>
                    <span class="statItem">FS ${ent.systemStrain?.current ?? 0}/${ent.systemStrain?.threshold ?? 15}</span>
                `;
            } else {
                statsHtml = `
                    <span class="statItem" title="Ferimentos">${SVG_ICONS.heart} ${ent.wounds?.current ?? 0}/${ent.wounds?.threshold ?? 10}</span>
                    <span class="statItem" title="Fadiga">${SVG_ICONS.zap} ${ent.strain?.current ?? 0}/${ent.strain?.threshold ?? 10}</span>
                    ${typeof ent.credits === 'number' ? `<span class="statItem" title="Créditos">${SVG_ICONS.coins} ${ent.credits} CR</span>` : ''}
                `;
            }

            const svgIcon = isShip
                ? SVG_ICONS.ship
                : ent.entityType === 'npc'
                ? SVG_ICONS.npc
                : isPartner
                ? SVG_ICONS.partner
                : SVG_ICONS.user;

            pill.innerHTML = `
                ${svgIcon}
                <strong>${ent.name}</strong>
                <span class="partySheetStats">${statsHtml}</span>
            `;
            scenePartyPills.appendChild(pill);

            if (mobileSheetPartyList) {
                const row = document.createElement('div');
                row.className = 'sheetModalRow';
                row.innerHTML = `
                    <div class="sheetModalInfo">
                        <span class="sheetModalName">${svgIcon} <span>${ent.name}</span></span>
                        <span class="sheetModalMeta">${statsHtml}</span>
                    </div>
                `;
                mobileSheetPartyList.appendChild(row);
            }
        });
    };

    if (campaignCodePill) {
        campaignCodePill.addEventListener('click', async () => {
            if (!campanhaAtualObj?.join_code) return;
            try {
                await navigator.clipboard.writeText(campanhaAtualObj.join_code);
                const old = campaignJoinCodeText.textContent;
                campaignJoinCodeText.textContent = 'COPIADO';
                setTimeout(() => {
                    campaignJoinCodeText.textContent = old;
                }, 1500);
            } catch (e) {
                console.warn(e);
            }
        });
    }

    API.clienteSupabase
        .channel('kenobi-live-sheets')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'characters' }, () => {
            if (conversaAtualId) atualizarBarraTatica();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_characters' }, () => {
            if (conversaAtualId) atualizarBarraTatica();
        })
        .subscribe();

    // ==========================================
    // 5. ACTION CARDS INTERATIVOS (PURE SVG, ZERO EMOJIS)
    // ==========================================
    const construirActionCardsHtml = (actionCards = [], autoAppliedLogs = []) => {
        if ((!actionCards || actionCards.length === 0) && (!autoAppliedLogs || autoAppliedLogs.length === 0)) {
            return '';
        }

        let html = '<div class="kenobiCardsContainer">';

        (autoAppliedLogs || []).forEach((log) => {
            html += `
                <div class="kenobiAutoLogPill">
                    ${SVG_ICONS.terminal}
                    <span><strong>Sincronizado com Datapad:</strong> ${limparPrefixoEmoji(log.summary)}</span>
                </div>
            `;
        });

        (actionCards || []).forEach((card) => {
            const status = card.status || 'pending';
            const isPending = status === 'pending';
            const isSkillCheck = card.action_type === 'skill_check';
            const isCombatPrompt = card.action_type === 'combat_mode_prompt';
            const isTradeOrCredits = card.action_type === 'trade' || card.action_type === 'credits';

            const montarPillsDePool = (p) => {
                if (!p) return '';
                const pills = [];
                if (p.yellow > 0) pills.push(`<span class="dicePill yellow">${p.yellow} Amarelo(s) [Proficiência]</span>`);
                if (p.green > 0) pills.push(`<span class="dicePill green">${p.green} Verde(s) [Habilidade]</span>`);
                if (p.blue > 0) pills.push(`<span class="dicePill blue">${p.blue} Azul(is) [Ampliação]</span>`);
                if (p.red > 0) pills.push(`<span class="dicePill red">${p.red} Vermelho(s) [Desafio]</span>`);
                if (p.purple > 0) pills.push(`<span class="dicePill purple">${p.purple} Roxo(s) [Dificuldade]</span>`);
                if (p.black > 0) pills.push(`<span class="dicePill black">${p.black} Preto(s) [Contratempo]</span>`);
                if (p.white > 0) pills.push(`<span class="dicePill white">${p.white} Branco(s) [Força]</span>`);
                return pills.join('');
            };

            let cardCharTabsHtml = '';
            let dicePillsHtml = '';
            if (isSkillCheck && card.payload) {
                const partyPools =
                    Array.isArray(card.payload.partyPools) && card.payload.partyPools.length > 0
                        ? card.payload.partyPools
                        : [card.payload];

                if (partyPools.length > 1) {
                    const tabsBtns = partyPools
                        .map((pp, idx) => {
                            const encodedSingle = encodeURIComponent(
                                JSON.stringify({ ...pp, partyPools })
                            );
                            return `
                                <button type="button" class="cardCharTabBtn ${idx === 0 ? 'active' : ''}" data-card-char-tab="${card.id}" data-char-idx="${idx}" data-char-pool="${encodedSingle}">
                                    <span>${pp.characterName || `Personagem ${idx + 1}`}</span>
                                    <span class="physCharTabPoolHint">(${pp.yellow || 0}A + ${pp.green || 0}V)</span>
                                </button>
                            `;
                        })
                        .join('');
                    cardCharTabsHtml = `<div class="cardCharacterTabs" data-card-tabs="${card.id}">${tabsBtns}</div>`;
                }

                const initialPills = montarPillsDePool(partyPools[0]);
                if (initialPills) {
                    dicePillsHtml = `<div class="kenobiDicePills" data-card-pills="${card.id}">${initialPills}</div>`;
                }
            }

            let badgeLabel = 'AGUARDANDO DECISÃO';
            if (status === 'confirmed') badgeLabel = 'CONFIRMADO';
            if (status === 'cancelled') badgeLabel = 'CANCELADO';
            if (status === 'negotiating') badgeLabel = 'EM NEGOCIAÇÃO';

            let buttonsHtml = '';
            if (isPending) {
                if (isCombatPrompt) {
                    buttonsHtml = `
                        <div class="kenobiCardButtons">
                            <button class="kenobiCardBtn confirm" data-card-action="combat_auto" data-card-id="${card.id}">
                                ${SVG_ICONS.check}
                                <span>Automático nesta luta</span>
                            </button>
                            <button class="kenobiCardBtn negotiate" data-card-action="combat_manual" data-card-id="${card.id}">
                                ${SVG_ICONS.shield}
                                <span>Farei manualmente</span>
                            </button>
                        </div>
                    `;
                } else if (isSkillCheck) {
                    const encodedPool = encodeURIComponent(JSON.stringify(card.payload || {}));
                    const hasDraft = rascunhoTemConteudo(physDraftsByKey[card.id]);
                    const physBtnLabel = hasDraft ? 'Continuar Rolagem (Rascunho Salvo)' : 'Digitar Dados Físicos';
                    buttonsHtml = `
                        <div class="kenobiCardButtons">
                            <button class="kenobiCardBtn roll" data-card-action="roll_digital" data-card-id="${card.id}" data-pool="${encodedPool}" data-char-idx="0">
                                ${SVG_ICONS.dice}
                                <span>Rolar Dados no Sistema</span>
                            </button>
                            <button class="kenobiCardBtn negotiate" data-card-action="roll_physical" data-card-id="${card.id}" data-skill="${card.payload?.skillName || 'Perícia'}" data-pool="${encodedPool}" data-char-idx="0">
                                ${SVG_ICONS.edit}
                                <span>${physBtnLabel}</span>
                            </button>
                        </div>
                    `;
                } else {
                    const isCreateSheet = card.payload?.actionType === 'create_sheet';
                    const isNoteAdd = card.payload?.actionType === 'note_add';
                    const confirmLabel = isCreateSheet
                        ? 'Criar Ficha no Datapad'
                        : isNoteAdd
                        ? 'Salvar Anotação'
                        : 'Confirmar';
                    buttonsHtml = `
                        <div class="kenobiCardButtons">
                            <button class="kenobiCardBtn confirm" data-card-action="confirm" data-card-id="${card.id}">
                                ${SVG_ICONS.check}
                                <span>${confirmLabel}</span>
                            </button>
                            <button class="kenobiCardBtn cancel" data-card-action="cancel" data-card-id="${card.id}">
                                ${SVG_ICONS.close}
                                <span>Cancelar</span>
                            </button>
                            ${
                                isTradeOrCredits
                                    ? `<button class="kenobiCardBtn negotiate" data-card-action="negotiate" data-card-id="${card.id}">
                                        ${SVG_ICONS.chat}
                                        <span>Negociar</span>
                                       </button>`
                                    : ''
                            }
                        </div>
                    `;
                }
            } else if (card.payload?.rollResult?.summaryPtBr) {
                buttonsHtml = `
                    <div class="kenobiAutoLogPill">
                        ${SVG_ICONS.dice}
                        <span>${limparPrefixoEmoji(card.payload.rollResult.summaryPtBr)}</span>
                    </div>
                `;
            }

            const cardIcon = isSkillCheck
                ? SVG_ICONS.dice
                : isCombatPrompt
                ? SVG_ICONS.shield
                : SVG_ICONS.terminal;

            html += `
                <div class="kenobiActionCard ${isSkillCheck ? 'skillCheckCard' : ''} ${!isPending ? 'resolvedCard' : ''}" data-card-box="${card.id}">
                    <div class="kenobiCardHeader">
                        <span class="kenobiCardTitle">${cardIcon} <span data-card-title-text="${card.id}">${limparPrefixoEmoji(card.title)}</span></span>
                        <span class="kenobiCardBadge" data-card-badge="${card.id}">${badgeLabel}</span>
                    </div>
                    <p class="kenobiCardDesc">${card.description}</p>
                    ${cardCharTabsHtml}
                    ${dicePillsHtml}
                    <div data-card-controls="${card.id}">
                        ${buttonsHtml}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    };

    // ==========================================
    // 6. ENVIO E LOADING DA IA
    // ==========================================
    let typingBubble = null;

    const appendMessage = (text, isUser = true, messageId = null, extraMeta = {}) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'userMessage' : 'aiMessage'}`;

        if (messageId) {
            messageDiv.setAttribute('data-id', messageId);
        }

        const textoSeguro = text || 'Sinto um distúrbio na Força. O sinal foi perdido.';

        if (isUser) {
            const displayBtn = messageId ? 'flex' : 'none';
            const speakerLabel = extraMeta.senderLabel || '';
            messageDiv.innerHTML = `
                <div class="messageContent">
                    ${speakerLabel ? `<span class="coopSpeakerTag">${speakerLabel}</span>` : ''}
                    <span class="textContent">${textoSeguro.replace(/\n/g, '<br>')}</span>
                </div>
                <div class="msgActions">
                    <button class="actionIconBtn editMsgBtn" style="display: ${displayBtn};" aria-label="Editar" title="Editar linha do tempo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="actionIconBtn copyMsgBtn" style="display: ${displayBtn};" aria-label="Copiar" title="Copiar mensagem">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            `;
        } else {
            let htmlFormatado = `<p>${textoSeguro}</p>`;
            try {
                if (typeof marked !== 'undefined') {
                    htmlFormatado =
                        typeof marked.parse === 'function' ? marked.parse(textoSeguro) : marked(textoSeguro);
                }
            } catch (erroMarkdown) {
                console.error('Erro no tradutor:', erroMarkdown);
                htmlFormatado = `<p>${textoSeguro}</p>`;
            }

            const cardsHtml = construirActionCardsHtml(
                extraMeta.actionCards || [],
                extraMeta.autoAppliedLogs || []
            );

            messageDiv.innerHTML = `
                <div class="aiHeaderMobile">
                    <img src="assets/img/obiwankenobiprofile.webp" alt="Kenobi">
                    <span>Mestre Kenobi</span>
                </div>
                <div class="aiAvatar">
                    <img src="assets/img/obiwankenobiprofile.webp" alt="Kenobi">
                </div>
                <div class="aiContentWrapper">
                    <div class="messageContent markdown-body">
                        ${htmlFormatado}
                    </div>
                    ${cardsHtml}
                    <div class="msgActions">
                        <button class="actionIconBtn copyMsgBtn" aria-label="Copiar" title="Copiar resposta">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }

        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        return messageDiv;
    };

    const showTypingIndicator = () => {
        typingBubble = document.createElement('div');
        typingBubble.className = 'message aiMessage';
        typingBubble.innerHTML = `
            <div class="aiAvatar">
                <img src="assets/img/obiwankenobiprofile.webp" alt="Kenobi">
            </div>
            <div class="messageContent">
                <div class="typingIndicator">
                    <div class="typingDot"></div>
                    <div class="typingDot"></div>
                    <div class="typingDot"></div>
                </div>
            </div>
        `;
        messagesArea.appendChild(typingBubble);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    };

    const removeTypingIndicator = () => {
        if (typingBubble) {
            typingBubble.remove();
            typingBubble = null;
        }
    };

    const setAiLoading = (isLoading) => {
        glowEffects.forEach((glow) => {
            if (isLoading) glow.classList.add('pulsingGlow');
            else glow.classList.remove('pulsingGlow');
        });
    };

    const handleSendMessage = async (retryText = null, existingUserBubble = null) => {
        const isRetry = typeof retryText === 'string' && retryText.trim().length > 0;
        const text = isRetry ? retryText.trim() : chatInput.value.trim();
        if (!text) return;

        // 1. Feedback visual instantâneo: desenha o balão do usuário (ou reaproveita em retry) e limpa o input
        const balaoUsuarioAtual = existingUserBubble || appendMessage(text, true);

        if (!isRetry) {
            chatInput.value = '';
            chatInput.focus();
            if (typeof handleInputResize === 'function') handleInputResize();

            if (inputSection.classList.contains('expandedMode')) {
                document.getElementById('expandBtn').click();
            }
        }

        setAiLoading(true);
        showTypingIndicator();

        try {
            // 2. Se ainda não havia aventura ativa, cria agora no banco unificado
            if (!conversaAtualId) {
                const respostaNova = await API.criarConversa('Nova Transmissão...');
                if (!respostaNova.sucesso || !respostaNova.dados?.id) {
                    throw new Error(respostaNova.erro || 'Não foi possível iniciar a aventura no banco de dados.');
                }
                conversaAtualId = respostaNova.dados.id;
                await renderizarHistorico();
                await atualizarBarraTatica();
            }

            // 3. Envia para o cérebro /api/kenobi
            const dadosIA = await API.enviarMensagemParaKenobi(conversaAtualId, text);
            const textoIA = dadosIA.resposta || dadosIA.narrative;
            const idMensagemUsuario = dadosIA.userMessageId;
            const idMensagemIA = dadosIA.aiMessageId;

            if (idMensagemUsuario && balaoUsuarioAtual) {
                balaoUsuarioAtual.setAttribute('data-id', idMensagemUsuario);
                const btnEditar = balaoUsuarioAtual.querySelector('.editMsgBtn');
                const btnCopiar = balaoUsuarioAtual.querySelector('.copyMsgBtn');
                if (btnEditar) btnEditar.style.display = 'flex';
                if (btnCopiar) btnCopiar.style.display = 'flex';
            }

            removeTypingIndicator();
            appendMessage(textoIA, false, idMensagemIA, {
                actionCards: dadosIA.actionCards || [],
                autoAppliedLogs: dadosIA.autoAppliedLogs || []
            });

            await atualizarBarraTatica();
        } catch (erro) {
            console.error('Distúrbio na Força:', erro);
            removeTypingIndicator();
            const errBubble = appendMessage(
                `Sinto um distúrbio na Força: ${erro.message || 'Não foi possível contatar o Mestre.'}`,
                false
            );
            if (errBubble) {
                const retryWrap = document.createElement('div');
                retryWrap.className = 'kenobiRetryWrap';
                retryWrap.innerHTML = `
                    <button type="button" class="kenobiRetryBtn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        <span>Tentar novamente</span>
                    </button>
                `;
                const btnRetry = retryWrap.querySelector('.kenobiRetryBtn');
                if (btnRetry) {
                    btnRetry.addEventListener('click', () => {
                        errBubble.remove();
                        handleSendMessage(text, balaoUsuarioAtual);
                    });
                }
                const contentCol = errBubble.querySelector('.aiContentWrapper') || errBubble;
                const actionsEl = contentCol.querySelector('.msgActions');
                if (actionsEl) {
                    contentCol.insertBefore(retryWrap, actionsEl);
                } else {
                    contentCol.appendChild(retryWrap);
                }
            }
        } finally {
            setAiLoading(false);
        }
    };

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', () => handleSendMessage());
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    // ==========================================
    // 7. LOGOUT
    // ==========================================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            logoutBtn.innerHTML = 'Desconectando...';
            logoutBtn.style.opacity = '0.5';
            if (typeof API !== 'undefined') {
                await API.logout();
            }
            localStorage.removeItem('obiwan_user');
            window.location.href = 'index.html';
        });
    }

    // ==========================================
    // 8. HISTÓRICO E CAMPANHAS
    // ==========================================
    const newChatBtn = document.getElementById('newChatBtn');
    const chatHistoryList = document.getElementById('chatHistoryList');

    const conectarCanalRealtimeDaCampanha = (idCampanha) => {
        if (coopCampaignChannel) {
            API.clienteSupabase.removeChannel(coopCampaignChannel);
            coopCampaignChannel = null;
        }
        if (!idCampanha) return;

        coopCampaignChannel = API.clienteSupabase
            .channel(`kenobi-coop-room-${idCampanha}`, {
                config: { broadcast: { self: false } }
            })
            // 1. Novas mensagens enviadas pelo parceiro (Mestre Tiago / Mestra Helo) ou pelo Mestre Kenobi
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `campaign_id=eq.${idCampanha}`
                },
                async (payload) => {
                    const novaMsg = payload.new;
                    if (!novaMsg || novaMsg.campaign_id !== conversaAtualId || !messagesArea) return;
                    // Se a mensagem já foi desenhada localmente nesta aba, ignora
                    if (messagesArea.querySelector(`.message[data-id="${novaMsg.id}"]`)) return;

                    // Para mensagens da IA, aguarda breve instante caso o UPDATE de metadata (actionCards) venha logo em seguida
                    if (novaMsg.autor === 'ia') {
                        await new Promise((r) => setTimeout(r, 450));
                        const { data: freshMsg } = await API.clienteSupabase
                            .from('messages')
                            .select('*')
                            .eq('id', novaMsg.id)
                            .single();
                        const { data: cards } = await API.clienteSupabase
                            .from('pending_actions')
                            .select('*')
                            .eq('message_id', novaMsg.id)
                            .order('created_at', { ascending: true });

                        if (messagesArea.querySelector(`.message[data-id="${novaMsg.id}"]`)) return;
                        removeTypingIndicator();
                        const mUse = freshMsg || novaMsg;
                        appendMessage(mUse.conteudo, false, mUse.id, {
                            actionCards: (cards && cards.length > 0) ? cards : mUse.metadata?.actionCards || [],
                            autoAppliedLogs: mUse.metadata?.autoAppliedLogs || []
                        });
                        atualizarBarraTatica();
                    } else {
                        appendMessage(novaMsg.conteudo, true, novaMsg.id, {
                            senderLabel: novaMsg.metadata?.senderLabel || novaMsg.metadata?.senderName || ''
                        });
                    }
                }
            )
            // 2. Atualização de Action Cards (quando o parceiro confirma/cancela/rola um card)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'pending_actions',
                    filter: `campaign_id=eq.${idCampanha}`
                },
                (payload) => {
                    const updatedCard = payload.new;
                    if (!updatedCard || !messagesArea) return;
                    const badgeEl = messagesArea.querySelector(`[data-card-badge="${updatedCard.id}"]`);
                    const cardBox = messagesArea.querySelector(`[data-card-box="${updatedCard.id}"]`);
                    const controlsDiv = messagesArea.querySelector(`[data-card-controls="${updatedCard.id}"]`);
                    if (updatedCard.status !== 'pending') {
                        if (cardBox) cardBox.classList.add('resolvedCard');
                        if (badgeEl) {
                            badgeEl.textContent =
                                updatedCard.status === 'confirmed'
                                    ? 'CONFIRMADO NA MESA'
                                    : updatedCard.status === 'cancelled'
                                    ? 'CANCELADO'
                                    : 'EM NEGOCIAÇÃO';
                        }
                        if (controlsDiv && updatedCard.payload?.rollResult?.summaryPtBr) {
                            controlsDiv.innerHTML = `
                                <div class="kenobiAutoLogPill">
                                    ${SVG_ICONS.dice}
                                    <span>${limparPrefixoEmoji(updatedCard.payload.rollResult.summaryPtBr)}</span>
                                </div>
                            `;
                        }
                        atualizarBarraTatica();
                    }
                }
            )
            // 3. Sincronização ao Vivo da Estação de Rolagem (abre e atualiza na tela da Mestra Helo / Mestre Tiago)
            .on('broadcast', { event: 'roll_station_sync' }, (eventPayload) => {
                const data = eventPayload?.payload;
                if (!data || data.senderClientId === myClientInstanceId || !data.draft) return;

                suppressNextCoopBroadcast = true;
                try {
                    physDraftsByKey[data.draftKey || 'free'] = data.draft;
                    physActiveDraftKey = data.draftKey || 'free';
                    physActiveCardId = data.draft.cardId || null;
                    physActiveCharIdx = data.draft.activeCharIdx || 0;

                    if (physCoopSyncBadge) {
                        physCoopSyncBadge.textContent = `Sincronizado com ${data.senderName || 'Mesa'}`;
                        physCoopSyncBadge.classList.remove('hidden');
                    }

                    if (data.action === 'open') {
                        fecharTodosOsModais();
                        if (physicalRollModal) physicalRollModal.classList.add('show');
                    }

                    if (physicalRollModal && physicalRollModal.classList.contains('show')) {
                        carregarCharStateAtivoNaTela();
                    }
                    atualizarPilulaRascunhoFlutuante();
                } finally {
                    suppressNextCoopBroadcast = false;
                }
            })
            .subscribe();
    };

    const carregarConversa = async (id) => {
        conversaAtualId = id;
        conectarCanalRealtimeDaCampanha(id);
        renderizarHistorico();
        atualizarBarraTatica();

        if (messagesArea) {
            messagesArea.querySelectorAll('.message:not(.systemMsg)').forEach((msg) => msg.remove());
        }
        if (chatInput) chatInput.focus();

        const resposta = await API.obterMensagens(id);
        if (resposta.sucesso && resposta.dados.length > 0) {
            resposta.dados.forEach((msg) => {
                const isUser = msg.autor === 'user';
                appendMessage(msg.conteudo, isUser, msg.id, {
                    actionCards: msg.actionCards || [],
                    autoAppliedLogs: msg.autoAppliedLogs || [],
                    senderLabel: msg.metadata?.senderLabel || msg.metadata?.senderName || ''
                });
            });
        }
    };

    const renderizarHistorico = async () => {
        if (!chatHistoryList) return;
        chatHistoryList.innerHTML =
            '<li class="historyItem" style="justify-content:center; opacity:0.5;"><span class="navText">Buscando registros...</span></li>';

        const resposta = await API.obterConversas();
        if (!resposta.sucesso) {
            chatHistoryList.innerHTML =
                '<li class="historyItem" style="color:var(--danger); justify-content:center;"><span class="navText">Erro na rede segura.</span></li>';
            return;
        }

        chatHistoryList.innerHTML = '';

        if (resposta.dados.length === 0) {
            chatHistoryList.innerHTML =
                '<li class="historyItem" style="justify-content:center; opacity:0.5;"><span class="navText">Nenhuma transmissão ainda.</span></li>';
            return;
        }

        if (!conversaAtualId && resposta.dados.length > 0) {
            conversaAtualId = resposta.dados[0].id;
            carregarConversa(conversaAtualId);
            return;
        }

        resposta.dados.forEach((conversa) => {
            const isFixado = conversa.fixado;
            const iconSvg = isFixado
                ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.2V6a3 3 0 0 0-6 0v5.2a2 2 0 0 1-1.11 1.35l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>`
                : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;

            const li = document.createElement('li');
            li.className = 'historyItem';
            if (conversaAtualId === conversa.id) li.style.background = 'rgba(255,255,255,0.1)';

            li.setAttribute('data-id', conversa.id);
            li.setAttribute('data-fixado', isFixado);

            li.innerHTML = `
                <span class="chatIcon">${iconSvg}</span>
                <span class="chatTitle" title="${conversa.titulo}">${conversa.titulo}</span>
                
                <button class="optionsBtn" aria-label="Opções">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>

                <div class="chatDropdown">
                    <button class="dropdownItem action-pin">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.2V6a3 3 0 0 0-6 0v5.2a2 2 0 0 1-1.11 1.35l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                        ${isFixado ? 'Desfixar' : 'Fixar'}
                    </button>
                    <button class="dropdownItem action-rename">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Renomear
                    </button>
                    <button class="dropdownItem danger action-delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Excluir
                    </button>
                </div>
            `;
            chatHistoryList.appendChild(li);
        });
    };

    renderizarHistorico();

    const iniciarNovaConversa = async () => {
        if (messagesArea) {
            messagesArea.querySelectorAll('.message:not(.systemMsg)').forEach((msg) => msg.remove());
        }
        if (chatInput) {
            chatInput.value = '';
            chatInput.style.height = 'auto';
            chatInput.focus();
        }
        if (expandBtn) expandBtn.classList.add('hidden');

        const resposta = await API.criarConversa('Nova Aventura...');
        if (resposta.sucesso) {
            conversaAtualId = resposta.dados.id;
            await renderizarHistorico();
            await atualizarBarraTatica();
        }
    };

    if (newChatBtn) newChatBtn.addEventListener('click', iniciarNovaConversa);

    const fixarConversa = async (id, estadoAtual) => {
        const novoEstado = estadoAtual !== 'true';
        await API.atualizarConversa(id, { fixado: novoEstado });
        renderizarHistorico();
    };

    // ==========================================
    // 9. MODAIS (RENOMEAR, EXCLUIR, FICHAS, DIÁRIO CANÔNICO, AUTOMAÇÃO, PERFIL)
    // ==========================================
    const renameModal = document.getElementById('renameModal');
    const deleteModal = document.getElementById('deleteModal');
    const renameModalInput = document.getElementById('renameModalInput');
    let chatAlvoId = null;

    document.querySelectorAll('.cancelModalBtn').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (physicalRollModal && physicalRollModal.classList.contains('show')) {
                salvarEstadoAtualNoRascunho(false);
            }
            fecharTodosOsModais();
            atualizarPilulaRascunhoFlutuante();
            chatAlvoId = null;
        });
    });

    // Fecha Bottom Sheets / Modais ao tocar no fundo escuro (backdrop) preservando rascunho da rolagem
    document.querySelectorAll('.customModalOverlay').forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (overlay.id === 'physicalRollModal') {
                    salvarEstadoAtualNoRascunho(false);
                }
                overlay.classList.remove('show');
                atualizarPilulaRascunhoFlutuante();
                chatAlvoId = null;
            }
        });
    });

    // 9A. Modal: Entrar em Mesa Compartilhada por Código (#7FFEDA)
    const joinTableSidebarBtn = document.getElementById('joinTableSidebarBtn');
    const joinCampaignModal = document.getElementById('joinCampaignModal');
    const joinCampaignCodeInput = document.getElementById('joinCampaignCodeInput');
    const joinCampaignCharSelect = document.getElementById('joinCampaignCharSelect');
    const joinCampaignStatusMsg = document.getElementById('joinCampaignStatusMsg');
    const confirmJoinCampaignBtn = document.getElementById('confirmJoinCampaignBtn');

    const abrirModalEntrarPorCodigo = async () => {
        if (!joinCampaignModal) return;
        fecharTodosOsModais();
        if (joinCampaignCodeInput) joinCampaignCodeInput.value = '';
        if (joinCampaignStatusMsg) joinCampaignStatusMsg.textContent = '';
        joinCampaignModal.classList.add('show');

        if (joinCampaignCharSelect) {
            joinCampaignCharSelect.innerHTML = '<option value="">Carregando suas fichas do Datapad...</option>';
            try {
                const { data: userData } = await API.clienteSupabase.auth.getUser();
                const uid = userData?.user?.id;
                const { data: chars } = uid
                    ? await API.clienteSupabase.from('characters').select('id, data').eq('user_id', uid)
                    : { data: [] };

                if (!chars || chars.length === 0) {
                    joinCampaignCharSelect.innerHTML =
                        '<option value="">Nenhuma ficha encontrada (crie sua ficha no Datapad primeiro)</option>';
                } else {
                    joinCampaignCharSelect.innerHTML = chars
                        .map((c) => {
                            const ent = c.data || {};
                            const t =
                                ent.entityType === 'ship'
                                    ? 'Nave'
                                    : ent.entityType === 'npc'
                                    ? 'NPC'
                                    : 'Operativo';
                            return `<option value="${c.id}">${ent.name || 'Sem Nome'} (${t})</option>`;
                        })
                        .join('');
                }
            } catch {
                joinCampaignCharSelect.innerHTML = '<option value="">Usar ficha principal da conta</option>';
            }
        }
        setTimeout(() => joinCampaignCodeInput?.focus(), 100);
    };

    if (joinTableSidebarBtn) {
        joinTableSidebarBtn.addEventListener('click', abrirModalEntrarPorCodigo);
    }

    if (confirmJoinCampaignBtn) {
        confirmJoinCampaignBtn.addEventListener('click', async () => {
            const code = (joinCampaignCodeInput?.value || '').trim();
            const charId = joinCampaignCharSelect?.value || null;
            if (!code) {
                if (joinCampaignStatusMsg) {
                    joinCampaignStatusMsg.textContent = 'Digite o código de 6 caracteres da mesa (ex: 7FFEDA).';
                    joinCampaignStatusMsg.style.color = '#f87171';
                }
                return;
            }

            confirmJoinCampaignBtn.disabled = true;
            confirmJoinCampaignBtn.textContent = 'Conectando...';
            const res = await API.entrarCampanhaPorCodigo(code, charId);
            confirmJoinCampaignBtn.disabled = false;
            confirmJoinCampaignBtn.textContent = 'Conectar à Mesa';

            if (!res.sucesso) {
                if (joinCampaignStatusMsg) {
                    joinCampaignStatusMsg.textContent = res.erro || 'Não foi possível entrar na mesa.';
                    joinCampaignStatusMsg.style.color = '#f87171';
                }
                return;
            }

            joinCampaignModal.classList.remove('show');
            if (res.dados?.campaignId) {
                conversaAtualId = res.dados.campaignId;
                await renderizarHistorico();
                await carregarConversa(conversaAtualId);
            }
        });
    }

    const renomearConversa = (id) => {
        chatAlvoId = id;
        renameModalInput.value = '';
        renameModal.classList.add('show');
        setTimeout(() => renameModalInput.focus(), 100);
    };

    const excluirConversa = (id) => {
        chatAlvoId = id;
        deleteModal.classList.add('show');
    };

    document.getElementById('confirmRenameBtn').addEventListener('click', async () => {
        const novoNome = renameModalInput.value.trim();
        if (novoNome !== '') {
            await API.atualizarConversa(chatAlvoId, { titulo: novoNome });
            renderizarHistorico();
        }
        renameModal.classList.remove('show');
        chatAlvoId = null;
    });

    document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
        await API.excluirConversa(chatAlvoId);
        if (conversaAtualId === chatAlvoId) {
            conversaAtualId = null;
            if (messagesArea) {
                messagesArea.querySelectorAll('.message:not(.systemMsg)').forEach((msg) => msg.remove());
            }
        }
        renderizarHistorico();
        atualizarBarraTatica();
        deleteModal.classList.remove('show');
        chatAlvoId = null;
    });

    // 9B. Modal de Fichas do Datapad na Campanha (Zero Emojis)
    const abrirModalFichas = async () => {
        if (!conversaAtualId) {
            await iniciarNovaConversa();
        }
        if (!sheetsModal || !sheetsModalList) return;
        sheetsModal.classList.add('show');
        sheetsModalList.innerHTML = '<p class="obiModalSubtitle">Sincronizando fichas com o Nocturne Datapad...</p>';

        const res = await API.obterFichasDaCampanha(conversaAtualId);
        const idsVinculados = new Set((res.vinculadas || []).map((v) => v.characterId));

        sheetsModalList.innerHTML = '';

        (res.vinculadas || [])
            .filter((v) => !v.isOwnCharacter)
            .forEach((parceiro) => {
                const ent = parceiro.entity;
                const row = document.createElement('div');
                row.className = 'sheetModalRow';
                row.innerHTML = `
                    <div class="sheetModalInfo">
                        <span class="sheetModalName">${SVG_ICONS.partner} <span>${ent.name} (Conta Parceira)</span></span>
                        <span class="sheetModalMeta">${ent.species || ''} ${ent.career || ''} • Ferimentos ${ent.wounds?.current ?? 0}/${ent.wounds?.threshold ?? 10} • Fadiga ${ent.strain?.current ?? 0}/${ent.strain?.threshold ?? 10}</span>
                    </div>
                    <span class="kenobiCardBadge">VINCULADA</span>
                `;
                sheetsModalList.appendChild(row);
            });

        if ((res.minhasFichas || []).length === 0) {
            sheetsModalList.innerHTML +=
                '<p class="obiModalSubtitle">Nenhuma ficha encontrada na sua conta do Datapad.</p>';
            return;
        }

        res.minhasFichas.forEach((item) => {
            const ent = item.entity;
            const isLinked = idsVinculados.has(item.characterId);
            const tipoIcon =
                ent.entityType === 'ship'
                    ? SVG_ICONS.ship
                    : ent.entityType === 'npc'
                    ? SVG_ICONS.npc
                    : SVG_ICONS.user;
            const tipoLabel =
                ent.entityType === 'ship'
                    ? 'Nave'
                    : ent.entityType === 'npc'
                    ? 'NPC'
                    : 'Operativo';

            const row = document.createElement('div');
            row.className = 'sheetModalRow';
            row.innerHTML = `
                <div class="sheetModalInfo">
                    <span class="sheetModalName">${tipoIcon} <span>${ent.name}</span></span>
                    <span class="sheetModalMeta">${tipoLabel} • ${
                        ent.entityType === 'ship'
                            ? `${ent.hullType || 'Nave'} • Casco ${ent.hullTrauma?.current ?? 0}/${ent.hullTrauma?.threshold ?? 15}`
                            : `${ent.species || ''} ${ent.career || ent.role || ''} • Ferimentos ${ent.wounds?.current ?? 0}/${ent.wounds?.threshold ?? 10}`
                    }</span>
                </div>
                <button class="kenobiCardBtn ${isLinked ? 'cancel' : 'confirm'}" data-toggle-sheet="${item.characterId}" data-entity-type="${ent.entityType || 'pc'}" data-linked="${isLinked}">
                    ${isLinked ? `${SVG_ICONS.close} <span>Remover</span>` : `${SVG_ICONS.check} <span>Colocar em Cena</span>`}
                </button>
            `;
            sheetsModalList.appendChild(row);
        });
    };

    if (manageSheetsBtn) {
        manageSheetsBtn.addEventListener('click', abrirModalFichas);
    }

    if (sheetsModalList) {
        sheetsModalList.addEventListener('click', async (e) => {
            const btn = e.target.closest('[data-toggle-sheet]');
            if (!btn || !conversaAtualId) return;
            const charId = btn.getAttribute('data-toggle-sheet');
            const entityType = btn.getAttribute('data-entity-type') || 'pc';
            const currentlyLinked = btn.getAttribute('data-linked') === 'true';

            btn.disabled = true;
            btn.textContent = 'Sincronizando...';
            await API.alternarVinculoMinhaFicha(conversaAtualId, charId, entityType, !currentlyLinked);
            await abrirModalFichas();
            await atualizarBarraTatica();
        });
    }

    // 9C. Modal do Diário Canônico
    if (openCanonBtn && canonModal) {
        openCanonBtn.addEventListener('click', async () => {
            if (!conversaAtualId) await iniciarNovaConversa();
            const res = await API.obterCampanhaPorId(conversaAtualId);
            if (res.sucesso && res.dados) {
                campanhaAtualObj = res.dados;
                canonSummaryTextarea.value = res.dados.canon_summary || '';
            }
            canonModal.classList.add('show');
        });
    }

    if (saveCanonBtn) {
        saveCanonBtn.addEventListener('click', async () => {
            if (!conversaAtualId) return;
            saveCanonBtn.textContent = 'Salvando...';
            await API.atualizarConversa(conversaAtualId, {
                canon_summary: canonSummaryTextarea.value.trim()
            });
            saveCanonBtn.textContent = 'Salvar Registro';
            canonModal.classList.remove('show');
            atualizarBarraTatica();
        });
    }

    // 9D. Modal de Preferências de Automação (Com Custom Select Minimalista)
    if (openAutomationBtn && automationModal) {
        openAutomationBtn.addEventListener('click', async () => {
            if (!conversaAtualId) await iniciarNovaConversa();
            const res = await API.obterCampanhaPorId(conversaAtualId);
            if (res.sucesso && res.dados) {
                campanhaAtualObj = res.dados;
                const prefs = res.dados.automation_prefs || {};
                setObiSelectValue('prefEnabled', String(prefs.enabled !== false));
                setObiSelectValue('prefCombat', prefs.combat_damage || 'ask_on_combat_start');
                setObiSelectValue('prefItems', prefs.items || 'confirm_card');
                setObiSelectValue('prefCredits', prefs.credits || 'confirm_card');
                setObiSelectValue('prefXp', prefs.xp || 'manual');
                setObiSelectValue('prefSheetMgmt', prefs.sheet_management || 'confirm_card');
            }
            automationModal.classList.add('show');
        });
    }

    if (saveAutomationBtn) {
        saveAutomationBtn.addEventListener('click', async () => {
            if (!conversaAtualId) return;
            saveAutomationBtn.textContent = 'Salvando...';
            const nextPrefs = {
                enabled: prefEnabled.value === 'true',
                combat_damage: prefCombat.value,
                combat_strain: prefCombat.value,
                items: prefItems.value,
                credits: prefCredits.value,
                xp: prefXp.value,
                sheet_management: prefSheetMgmt ? prefSheetMgmt.value : 'confirm_card'
            };
            await API.atualizarConversa(conversaAtualId, {
                automation_prefs: nextPrefs
            });
            saveAutomationBtn.textContent = 'Salvar Preferências';
            automationModal.classList.remove('show');
            atualizarBarraTatica();
        });
    }

    // ==========================================
    // 10. CLIQUES NA BARRA LATERAL
    // ==========================================
    if (chatHistoryList) {
        chatHistoryList.addEventListener('click', (e) => {
            const optionsBtn = e.target.closest('.optionsBtn');
            if (optionsBtn) {
                e.stopPropagation();
                const liContainer = optionsBtn.closest('.historyItem');
                const dropdown = liContainer.querySelector('.chatDropdown');

                document.querySelectorAll('.chatDropdown.show').forEach((menu) => {
                    if (menu !== dropdown) menu.classList.remove('show');
                });
                dropdown.classList.toggle('show');
                return;
            }

            const dropdownItem = e.target.closest('.dropdownItem');
            if (dropdownItem) {
                e.stopPropagation();
                const liContainer = dropdownItem.closest('.historyItem');
                const chatId = liContainer.getAttribute('data-id');
                const estadoFixado = liContainer.getAttribute('data-fixado');

                if (dropdownItem.classList.contains('action-pin')) fixarConversa(chatId, estadoFixado);
                if (dropdownItem.classList.contains('action-rename')) renomearConversa(chatId);
                if (dropdownItem.classList.contains('action-delete')) excluirConversa(chatId);

                liContainer.querySelector('.chatDropdown').classList.remove('show');
                return;
            }

            const historyItem = e.target.closest('.historyItem');
            if (historyItem) {
                const chatId = historyItem.getAttribute('data-id');
                if (chatId && chatId !== conversaAtualId) {
                    carregarConversa(chatId);
                }
            }
        });
    }

    // ==========================================
    // 11. INTERAÇÃO NAS MENSAGENS (ACTION CARDS, MÁQUINA DO TEMPO E COPIAR)
    // ==========================================
    if (messagesArea) {
        messagesArea.addEventListener('click', async (e) => {
            // A0. Alternar aba de personagem dentro do próprio Action Card ([Kilian] [Nayla])
            const cardCharTab = e.target.closest('[data-card-char-tab]');
            if (cardCharTab) {
                const cardId = cardCharTab.getAttribute('data-card-char-tab');
                const charIdx = parseInt(cardCharTab.getAttribute('data-char-idx') || '0', 10);
                const encodedCharPool = cardCharTab.getAttribute('data-char-pool') || '';
                const cardBox = messagesArea.querySelector(`[data-card-box="${cardId}"]`);
                if (cardBox) {
                    cardBox.querySelectorAll('.cardCharTabBtn').forEach((b) => {
                        b.classList.toggle('active', b === cardCharTab);
                    });
                }
                try {
                    const p = JSON.parse(decodeURIComponent(encodedCharPool));
                    const pillsContainer = messagesArea.querySelector(`[data-card-pills="${cardId}"]`);
                    if (pillsContainer && p) {
                        const pills = [];
                        if (p.yellow > 0) pills.push(`<span class="dicePill yellow">${p.yellow} Amarelo(s) [Proficiência]</span>`);
                        if (p.green > 0) pills.push(`<span class="dicePill green">${p.green} Verde(s) [Habilidade]</span>`);
                        if (p.blue > 0) pills.push(`<span class="dicePill blue">${p.blue} Azul(is) [Ampliação]</span>`);
                        if (p.red > 0) pills.push(`<span class="dicePill red">${p.red} Vermelho(s) [Desafio]</span>`);
                        if (p.purple > 0) pills.push(`<span class="dicePill purple">${p.purple} Roxo(s) [Dificuldade]</span>`);
                        if (p.black > 0) pills.push(`<span class="dicePill black">${p.black} Preto(s) [Contratempo]</span>`);
                        if (p.white > 0) pills.push(`<span class="dicePill white">${p.white} Branco(s) [Força]</span>`);
                        pillsContainer.innerHTML = pills.join('');
                    }
                    const titleSpan = messagesArea.querySelector(`[data-card-title-text="${cardId}"]`);
                    if (titleSpan && p?.skillName && p?.characterName) {
                        titleSpan.textContent = `Teste de ${p.skillName} (${p.characterName})`;
                    }
                    const digitalBtn = messagesArea.querySelector(`[data-card-action="roll_digital"][data-card-id="${cardId}"]`);
                    const physBtn = messagesArea.querySelector(`[data-card-action="roll_physical"][data-card-id="${cardId}"]`);
                    if (digitalBtn) {
                        digitalBtn.setAttribute('data-pool', encodedCharPool);
                        digitalBtn.setAttribute('data-char-idx', String(charIdx));
                    }
                    if (physBtn) {
                        physBtn.setAttribute('data-pool', encodedCharPool);
                        physBtn.setAttribute('data-char-idx', String(charIdx));
                    }
                } catch {}
                return;
            }

            const cardBtn = e.target.closest('[data-card-action]');
            if (cardBtn) {
                const cardAction = cardBtn.getAttribute('data-card-action');
                const cardId = cardBtn.getAttribute('data-card-id');
                const controlsDiv = messagesArea.querySelector(`[data-card-controls="${cardId}"]`);
                const badgeEl = messagesArea.querySelector(`[data-card-badge="${cardId}"]`);
                const cardBox = messagesArea.querySelector(`[data-card-box="${cardId}"]`);

                if (cardAction === 'roll_physical') {
                    const skillName = cardBtn.getAttribute('data-skill') || '';
                    const encodedPool = cardBtn.getAttribute('data-pool') || '';
                    const charIdx = parseInt(cardBtn.getAttribute('data-char-idx') || '0', 10);
                    let pool = null;
                    try {
                        pool = encodedPool ? JSON.parse(decodeURIComponent(encodedPool)) : null;
                    } catch {
                        pool = null;
                    }
                    abrirModalRolagemFisica(skillName, pool, cardId, charIdx);
                    return;
                }

                if (cardAction === 'roll_digital') {
                    const encodedPool = cardBtn.getAttribute('data-pool') || '';
                    let pool = null;
                    try {
                        pool = JSON.parse(decodeURIComponent(encodedPool));
                    } catch {
                        pool = null;
                    }
                    cardBtn.disabled = true;
                    cardBtn.textContent = 'Rolando dados...';
                    try {
                        const res = await API.rolarTesteDePericia(cardId, pool);
                        const cleanMsg = limparPrefixoEmoji(res.suggestedPlayerMessage);
                        if (badgeEl) badgeEl.textContent = 'ROLADO';
                        if (cardBox) cardBox.classList.add('resolvedCard');
                        if (controlsDiv) {
                            controlsDiv.innerHTML = `
                                <div class="kenobiAutoLogPill">
                                    ${SVG_ICONS.dice}
                                    <span>${cleanMsg}</span>
                                </div>
                            `;
                        }
                        chatInput.value = cleanMsg;
                        await handleSendMessage();
                    } catch (err) {
                        cardBtn.disabled = false;
                        cardBtn.innerHTML = `${SVG_ICONS.dice} <span>Rolar Dados no Sistema</span>`;
                        alert(err.message || 'Erro ao rolar dados.');
                    }
                    return;
                }

                cardBtn.disabled = true;
                const oldHtml = cardBtn.innerHTML;
                cardBtn.textContent = 'Processando...';

                try {
                    const res = await API.resolverActionCard(cardId, cardAction);
                    if (cardBox) cardBox.classList.add('resolvedCard');

                    if (cardAction === 'cancel') {
                        if (badgeEl) badgeEl.textContent = 'CANCELADO';
                        if (controlsDiv) {
                            controlsDiv.innerHTML = `<span class="partySheetStats">${limparPrefixoEmoji(res.message)}</span>`;
                        }
                    } else if (cardAction === 'negotiate') {
                        if (badgeEl) badgeEl.textContent = 'NEGOCIANDO';
                        if (controlsDiv) {
                            controlsDiv.innerHTML = `<span class="partySheetStats">${limparPrefixoEmoji(res.message)}</span>`;
                        }
                        if (res.suggestedPlayerMessage) {
                            chatInput.value = limparPrefixoEmoji(res.suggestedPlayerMessage);
                            chatInput.focus();
                            handleInputResize();
                        }
                    } else {
                        if (badgeEl) badgeEl.textContent = 'APLICADO NO DATAPAD';
                        if (controlsDiv) {
                            controlsDiv.innerHTML = `
                                <div class="kenobiAutoLogPill">
                                    ${SVG_ICONS.check}
                                    <span>${limparPrefixoEmoji(res.message)}</span>
                                </div>
                            `;
                        }
                        await atualizarBarraTatica();
                    }
                } catch (err) {
                    cardBtn.disabled = false;
                    cardBtn.innerHTML = oldHtml;
                    alert(err.message || 'Erro ao aplicar ação na ficha.');
                }
                return;
            }

            // B. CLIQUE NO BOTÃO DE LÁPIS (Máquina do Tempo Inline)
            const editBtn = e.target.closest('.editMsgBtn');
            if (editBtn) {
                const messageDiv = editBtn.closest('.message');
                const contentContainer = messageDiv.querySelector('.messageContent');
                const textSpan = messageDiv.querySelector('.textContent');

                if (contentContainer.querySelector('.inlineEditForm')) return;

                const originalText = textSpan.innerText;
                editBtn.style.display = 'none';
                textSpan.style.display = 'none';

                const editForm = document.createElement('div');
                editForm.className = 'inlineEditForm';
                editForm.innerHTML = `
                    <textarea class="inlineEditTextarea">${originalText}</textarea>
                    <div class="inlineEditActions">
                        <button class="cancelEditBtn">Cancelar</button>
                        <button class="saveEditBtn">Atualizar</button>
                    </div>
                `;

                contentContainer.appendChild(editForm);

                const textarea = editForm.querySelector('textarea');
                textarea.style.height = textarea.scrollHeight + 'px';
                textarea.addEventListener('input', () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = textarea.scrollHeight + 'px';
                });

                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
                return;
            }

            // C. CLIQUE EM CANCELAR EDIÇÃO
            const cancelBtn = e.target.closest('.cancelEditBtn');
            if (cancelBtn) {
                const messageDiv = cancelBtn.closest('.message');
                const textSpan = messageDiv.querySelector('.textContent');
                const editBtnPencil = messageDiv.querySelector('.editMsgBtn');
                const editForm = messageDiv.querySelector('.inlineEditForm');

                editForm.remove();
                textSpan.style.display = 'block';
                editBtnPencil.style.display = 'flex';
                return;
            }

            // D. CLIQUE EM ATUALIZAR (Poda o banco + memórias futuras e reenvia)
            const saveBtn = e.target.closest('.saveEditBtn');
            if (saveBtn) {
                const messageDiv = saveBtn.closest('.message');
                const messageId = messageDiv.getAttribute('data-id');
                const editForm = messageDiv.querySelector('.inlineEditForm');
                const textarea = editForm.querySelector('textarea');
                const newText = textarea.value.trim();

                if (!newText) return;

                saveBtn.textContent = 'Ajustando o tempo...';
                saveBtn.disabled = true;
                textarea.disabled = true;

                if (messageId && typeof API.voltarNoTempo === 'function') {
                    const resPoda = await API.voltarNoTempo(messageId);
                    if (!resPoda.sucesso) {
                        console.error('Erro na poda da linha do tempo:', resPoda.erro);
                        saveBtn.textContent = 'Atualizar';
                        saveBtn.disabled = false;
                        textarea.disabled = false;
                        return;
                    }
                }

                let sibling = messageDiv;
                while (sibling) {
                    let next = sibling.nextElementSibling;
                    sibling.remove();
                    sibling = next;
                }

                if (chatInput) {
                    chatInput.value = newText;
                    handleInputResize();
                    handleSendMessage();
                }
                return;
            }

            // E. CLIQUE NO BOTÃO DE COPIAR
            const copyBtn = e.target.closest('.copyMsgBtn');
            if (copyBtn) {
                const messageDiv = copyBtn.closest('.message');
                const isUser = messageDiv.classList.contains('userMessage');

                let plainText = '';
                let htmlText = '';

                if (isUser) {
                    const textSpan = messageDiv.querySelector('.textContent');
                    plainText = textSpan.innerText;
                    htmlText = textSpan.innerHTML;
                } else {
                    const markdownBody = messageDiv.querySelector('.markdown-body');
                    plainText = markdownBody.innerText;
                    htmlText = markdownBody.innerHTML;
                }

                try {
                    if (navigator.clipboard && window.ClipboardItem) {
                        const htmlBlob = new Blob([htmlText], { type: 'text/html' });
                        const textBlob = new Blob([plainText], { type: 'text/plain' });
                        const clipboardItem = new ClipboardItem({
                            'text/html': htmlBlob,
                            'text/plain': textBlob
                        });
                        await navigator.clipboard.write([clipboardItem]);
                    } else {
                        await navigator.clipboard.writeText(plainText);
                    }

                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                    }, 2000);
                } catch (err) {
                    console.error('Falha ao copiar da Força: ', err);
                }
            }
        });
    }
});
