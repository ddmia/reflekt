# Análise de Qualidade de Software — Reflekt

## Tabela de Avaliação

| Componente | Arquivo | Papel Esperado | Completude Funcional (0–10) | Responsabilidade Única (0–10) | Problemas Encontrados | Severidade |
|---|---|---|---|---|---|---|
| **TaskController** | `backend/src/controllers/TaskController.ts` | Receber req HTTP, delegar ao service, retornar resposta | 9 | 7 | Validação `!dto.title` (linha 35) é regra de negócio no controller; `filters: any` (linha 10) perde type-safety; valores de enum de `status`/`priority` nos query params não são validados | 🟡 Moderado |
| **NoteController** | `backend/src/controllers/NoteController.ts` | Receber req HTTP para notas, delegar ao service, retornar resposta | 6 | 7 | `update` (linha 30) e `delete` (linha 43) ignoram completamente `req.params.taskId` — qualquer `:id` de nota é aceito independente da tarefa; validação `!dto.content` (linhas 22 e 34) é lógica de negócio no controller | 🔴 Crítico |
| **TaskService** | `backend/src/services/TaskService.ts` | Orquestrar regras de negócio de tarefas | 7 | 8 | Não valida valores de enum (`priority`/`status`), delegando qualquer string ao repositório; defaults `'TODO'` e `'LOW'` estão no repositório, deveriam estar aqui | 🟡 Moderado |
| **NoteService** | `backend/src/services/NoteService.ts` | Orquestrar regras de negócio de notas | 6 | 6 | `update` e `delete` não recebem `taskId` como parâmetro — impossível validar ownership; `throw { status: 404, ... }` acopla o service a conceitos HTTP; sem `findById` para nota individual | 🟡 Moderado |
| **TaskRepository** | `backend/src/repositories/TaskRepository.ts` | Abstrair persistência de tarefas | 9 | 7 | Lógica de filtro (linhas 19–21) é predicado de domínio dentro do repositório; defaults `'TODO'` (linha 37) e `'LOW'` (linha 38) são regras de negócio, não responsabilidade de persistência | 🟡 Moderado |
| **NoteRepository** | `backend/src/repositories/NoteRepository.ts` | Abstrair persistência de notas | 9 | 9 | Nenhum problema significativo; interface `INoteRepository` bem definida com `deleteByTaskId` | 🟢 Leve |
| **Task DTO** | `backend/src/dtos/task.dto.ts` | Definir estruturas de entrada e saída para tarefas | 7 | 8 | `priority` e `status` tipados como `string` em vez de `TaskPriority`/`TaskStatus` — importados mas não usados como tipos; `TaskResponseDto = Task` é alias direto, acoplando contrato de API ao modelo de domínio | 🟡 Moderado |
| **Note DTO** | `backend/src/dtos/note.dto.ts` | Definir estruturas de entrada e saída para notas | 8 | 10 | `NoteResponseDto = Note` cria acoplamento DTO/domínio (menor, pois o domínio é simples) | 🟢 Leve |
| **Rotas** | `backend/src/routes/index.ts` | Mapear endpoints HTTP para métodos do controller | 9 | 10 | Ausência de `GET /tasks/:taskId/notes/:id` para buscar nota individual (menor omissão); sem middleware de validação de parâmetros de rota | 🟢 Leve |
| **Front-end** | `frontend/index.html` | Interface para todas as operações de gerenciamento | 8 | 3 | Arquivo único mistura: cliente HTTP, estado global, lógica de renderização, manipulação de DOM e utilitários; `selectTask` (linha 245) faz `fetch` direto quebrando o padrão de wrappers; `openEditNote` usa `window.prompt()` enquanto edição de tarefa tem formulário completo; zero tratamento de erros nas chamadas de API | 🔴 Crítico |

---

## Resumo Executivo

- **Nota geral de Completude Funcional: 7/10**
- **Nota geral de Responsabilidade Única: 7/10**

---

### Top 3 problemas prioritários para correção

#### 1. 🔴 Ausência de validação de ownership de nota — `NoteController.ts` + `NoteService.ts`

`PUT /tasks/:taskId/notes/:id` e `DELETE /tasks/:taskId/notes/:id` ignoram o `taskId` no controller e o service não recebe esse parâmetro. Isso cria um bug funcional: `PUT /tasks/1/notes/99` atualiza a nota 99 mesmo que ela pertença à tarefa 2.

**Correção objetiva:** adicionar `taskId` como parâmetro em `NoteService.update(taskId, id, dto)` e `NoteService.delete(taskId, id)`; buscar a nota pelo `id`, verificar que `note.task_id === taskId` e lançar 404 se não bater. O controller já tem o `taskId` disponível via `req.params.taskId`.

---

#### 2. 🔴 Front-end monolítico sem separação de responsabilidades — `frontend/index.html`

Todo o aplicativo está em um único arquivo HTML com `<script>` inline. Três responsabilidades distintas convivem no mesmo escopo: cliente HTTP (funções `fetch`), lógica de apresentação (`renderTaskDetail`, `openEditTask`) e estado global (`currentTasks`, `selectedTask`). Além disso, há zero tratamento de erros — falhas de rede ou respostas 4xx/5xx são silenciosas para o usuário.

**Correção objetiva:** extrair as funções `getTasks`, `createTask`, `updateTask`, `deleteTask`, `getNotes`, `createNote`, `updateNote`, `deleteNote` para um módulo `api.js` separado; mover a renderização para `ui.js`; adicionar `try/catch` com feedback visual nas chamadas assíncronas. Unificar a UX de edição de nota com um formulário, removendo o `window.prompt()`.

---

#### 3. 🟡 DTOs aliasados diretamente para entidades de domínio — `dtos/task.dto.ts`

`TaskResponseDto = Task` e `NoteResponseDto = Note` são aliases de tipo, não interfaces independentes. Isso acopla o contrato público da API ao modelo de domínio interno. Qualquer campo adicionado ao domínio vaza automaticamente para a resposta da API. Agravante: `priority` e `status` nos DTOs de entrada são `string` em vez de `TaskPriority`/`TaskStatus`, anulando a validação em tempo de compilação — os tipos são importados mas não usados.

**Correção objetiva:** criar interfaces independentes para `TaskResponseDto` e tipificar os campos de entrada com os unions corretos (`priority?: TaskPriority`, `status?: TaskStatus`). Adicionar uma função `toTaskResponseDto(task: Task): TaskResponseDto` no service ou em um mapper dedicado.

---

### Pontos positivos identificados na arquitetura

- **Inversão de dependência correta:** `ITaskRepository` e `INoteRepository` são interfaces bem definidas; services dependem de abstrações, não de implementações concretas — trocar o in-memory por um ORM não exige tocar nos services.
- **Cascade delete implementado corretamente:** `TaskService.delete` chama `noteRepo.deleteByTaskId(id)` antes de deletar a tarefa, garantindo consistência referencial.
- **NoteService valida existência da tarefa antes de criar nota** (linha 13–14): regra de negócio no lugar certo.
- **Error handler centralizado** (`middlewares/errorHandler.ts`) com tratamento de status customizado — elimina código repetitivo de tratamento de erro nos controllers.
- **Front-end previne XSS básico** via `escapeHtml` com tabela de substituição explícita, aplicado em todos os pontos de renderização de dados do usuário.
- **Filtros de lista** (status, prioridade, tag) cobertos de ponta a ponta: query param → controller → service → repository → UI.
