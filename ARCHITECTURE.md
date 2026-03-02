# Lineage II Essence Clan Management System

## Arquitetura Backend

A arquitetura escolhida para este projeto é **Node.js com Express e React (Vite)**, utilizando **SQLite** (via \`better-sqlite3\`) para armazenamento de dados, o que permite uma execução rápida e sem dependências externas complexas no ambiente atual. Em um ambiente de produção em larga escala, o SQLite pode ser facilmente substituído por **PostgreSQL**.

### Stack Tecnológico
- **Frontend:** React 19, Tailwind CSS v4, Lucide React, React Router
- **Backend:** Node.js, Express
- **Banco de Dados:** SQLite (Relacional)
- **Autenticação:** Discord OAuth (preparado na estrutura de usuários)

---

## Estrutura de Pastas do Projeto

\`\`\`text
/
├── server.ts                 # Ponto de entrada do backend (Express)
├── db.ts                     # Configuração e schema do banco de dados SQLite
├── package.json              # Dependências e scripts
├── vite.config.ts            # Configuração do Vite
├── /src
│   ├── App.tsx               # Configuração de rotas do React
│   ├── main.tsx              # Ponto de entrada do frontend
│   ├── index.css             # Estilos globais (Tailwind)
│   ├── /components           # Componentes reutilizáveis
│   │   └── Layout.tsx        # Layout principal com sidebar e navegação
│   ├── /pages                # Telas da aplicação
│   │   ├── Dashboard.tsx     # Visão geral, estatísticas e atividades recentes
│   │   ├── Members.tsx       # Lista de membros e gerenciamento de DKP
│   │   ├── Events.tsx        # Calendário de raids e eventos
│   │   ├── Auctions.tsx      # Sistema de leilão de itens por DKP
│   │   └── LootHistory.tsx   # Histórico de distribuição de itens
│   └── /lib
│       └── utils.ts          # Funções utilitárias (ex: cn para Tailwind)
\`\`\`

---

## Estrutura do Banco de Dados Relacional

O banco de dados foi modelado para suportar todas as operações do clã:

1. **users:** Usuários autenticados (via Discord).
   - \`id\`, \`discord_id\`, \`username\`, \`avatar\`, \`role\`
2. **clans:** Clãs registrados no sistema.
   - \`id\`, \`name\`, \`server\`, \`leader_id\`
3. **members:** Personagens in-game vinculados aos usuários.
   - \`id\`, \`clan_id\`, \`user_id\`, \`in_game_name\`, \`class\`, \`role\`, \`dkp\`
4. **events:** Raids e eventos agendados.
   - \`id\`, \`clan_id\`, \`name\`, \`type\`, \`date\`, \`dkp_reward\`
5. **event_attendees:** Tabela de junção para presença em eventos.
   - \`event_id\`, \`member_id\`
6. **items:** Catálogo de itens do jogo (Epic Jewels, etc).
   - \`id\`, \`name\`, \`description\`, \`icon_url\`
7. **auctions:** Leilões de itens dropados.
   - \`id\`, \`clan_id\`, \`item_id\`, \`status\`, \`start_time\`, \`end_time\`, \`min_bid\`, \`winner_id\`, \`winning_bid\`
8. **bids:** Lances realizados nos leilões.
   - \`id\`, \`auction_id\`, \`member_id\`, \`amount\`, \`created_at\`
9. **loot_history:** Registro permanente de quem ganhou o quê.
   - \`id\`, \`clan_id\`, \`member_id\`, \`item_id\`, \`dkp_spent\`, \`date\`

---

## Endpoints da API

A API RESTful foi construída no \`server.ts\`:

- \`GET /api/health\` - Verifica o status do servidor.
- \`GET /api/clans/:clanId/members\` - Retorna a lista de membros de um clã, ordenada por DKP.
- \`GET /api/clans/:clanId/events\` - Retorna os eventos e raids agendados.
- \`GET /api/clans/:clanId/auctions\` - Retorna os leilões ativos e finalizados.
- \`GET /api/clans/:clanId/loot\` - Retorna o histórico de loot distribuído.

*(Endpoints de POST/PUT/DELETE para criação e atualização seriam adicionados seguindo o mesmo padrão, utilizando validação de permissões baseada no \`role\` do usuário logado).*

---

## Regras de Negócio do DKP (Dragon Kill Points)

1. **Ganho de DKP:**
   - Membros ganham DKP exclusivamente participando de eventos oficiais (Raids, Sieges, PvP massivo).
   - A presença é registrada pelos oficiais no sistema (\`event_attendees\`).
   - O valor de DKP é fixo por tipo de evento (ex: Epic Boss = 100 DKP, Siege = 50 DKP).

2. **Gasto de DKP (Leilão):**
   - Quando um item valioso (Loot) é dropado, um oficial cria um Leilão (\`auctions\`).
   - Apenas membros com DKP maior ou igual ao lance mínimo (\`min_bid\`) podem participar.
   - O sistema de leilão é "Blind Bid" (lance cego) ou "Open Bid" (lance aberto), definido na criação.
   - Um membro não pode dar um lance maior do que seu saldo atual de DKP.

3. **Resolução do Leilão:**
   - Ao fim do tempo estipulado (\`end_time\`), o membro com o maior lance vence.
   - O valor do lance vencedor é subtraído imediatamente do saldo de DKP do vencedor.
   - O item é registrado no \`loot_history\`.
   - Em caso de empate, o membro com maior presença (ou maior saldo total de DKP antes do lance) vence.

4. **Decaimento (DKP Decay):**
   - Para evitar acúmulo infinito e incentivar novos membros, aplica-se um decaimento semanal (ex: 10% do saldo total) a todos os membros inativos por mais de 14 dias.

---

## Wireframes e UI

A interface foi implementada e pode ser visualizada rodando a aplicação. Ela inclui:
- **Dashboard:** Visão geral com estatísticas rápidas e atividades recentes.
- **Members:** Tabela interativa com busca, mostrando classes, cargos e saldo de DKP.
- **Events:** Cards de eventos com data, recompensa em DKP e lista de presença.
- **Auctions:** Interface de leilão mostrando o item, lance atual, tempo restante e botão de lance.
- **Loot History:** Tabela de auditoria mostrando quem ganhou cada item e quanto pagou.
