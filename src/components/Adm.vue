<template>
  <div class="adm-page">
    <div class="adm-container">
      <header class="adm-header">
        <div class="logo-area">
          <h1>Hellen & Bruno:</h1>
          <p class="subtitle">Painel admistrativo</p>
        </div>
        <router-link to="/" class="btn-voltar-minimal">✕</router-link>
      </header>

<nav class="adm-tabs">
  <button :class="['tab-pill', { active: abaAtiva === 'reservas' }]" @click="abaAtiva = 'reservas'">
    LISTA DE PRESENTES
  </button>
  <button :class="['tab-pill', { active: abaAtiva === 'gerenciar' }]" @click="abaAtiva = 'gerenciar'">
    GERENCIAR ITENS
  </button>
</nav>
      <section v-if="abaAtiva === 'reservas'" class="adm-content fade-in">
        <div class="wedding-card">
          <h3 class="card-title">Convidados que já escolheram</h3>
          <div class="table-wrapper">
            <table class="adm-table">
              <thead>
                <tr>
                  <th>Convidado</th>
                  <th>Presente</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in produtosReservados" :key="p.id">
                  <td class="nome-convidado-modern">{{ p.reservadoPor }}</td>
                  <td class="item-title-table">{{ p.titulo }}</td>
                  <td>
                    <button @click="liberarItem(p.id)" class="btn-text-action">Desfazer Reserva</button>
                  </td>
                </tr>
                <tr v-if="produtosReservados.length === 0">
                  <td colspan="3" class="empty-msg-modern">Nenhuma reserva realizada ainda.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section v-if="abaAtiva === 'gerenciar'" class="adm-content fade-in">
        <div class="wedding-card mb-25">
          <h3 class="card-title">Adicionar Novo Item</h3>
          <div class="wedding-form">
            <input v-model="novoItem.titulo" placeholder="Nome do Presente" class="line-input" />
            <input v-model="novoItem.descricao" placeholder="Descrição curta" class="line-input" />
            <input v-model="novoItem.imagem" placeholder="URL da Foto" class="line-input" />
            <input v-model="novoItem.link" placeholder="Link do Produto" class="line-input">
            
            <div class="form-row-modern">
              <div class="select-wrapper">
                <select v-model="novoItem.categoria" class="line-input">
                  <option value="Cozinha">Cozinha</option>
                  <option value="Quarto">Quarto</option>
                  <option value="Sala">Sala</option>
                </select>
              </div>
              <input type="number" v-model.number="novoItem.quantidade" placeholder="Qtd" title="Quantidade inicial" class="line-input narrow" />
              <input type="number" v-model.number="novoItem.preco" placeholder="Preço (R$)" title="Preço do item" class="price-input" />
            </div>
            <button @click="adicionarPresente" class="btn-terracotta">Salvar na Lista</button>
          </div>
        </div>

        <div class="wedding-card">
          <div class="filter-header-modern">
            <h3 class="card-title">Itens Cadastrados</h3>
            <select v-model="filtroCategoria" class="filter-minimal">
              <option value="Todos">Todas as Categorias</option>
              <option value="Cozinha">Cozinha</option>
              <option value="Quarto">Quarto</option>
              <option value="Sala">Sala</option>
            </select>
          </div>
          
          <div class="item-list-modern">
            <div v-for="p in produtosFiltradosAdm" :key="p.id" class="item-card-row">
              <div class="item-main-info">
                <div class="item-thumb-circle">🎁</div>
                <div>
                  <span class="item-name-bold">{{ p.titulo }}</span>
                  <span class="item-category-tag">({{ p.categoria }})</span>
                </div>
              </div>
              <div class="item-actions-minimal">
                <button @click="prepararEdicao(p)" class="btn-icon-edit">✏️</button>
                <button @click="excluirItem(p.id)" class="btn-icon-delete">Excluir</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
   </div> 
</template>

<script>
import { db } from '../firebase'
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      abaAtiva: 'reservas',
      filtroCategoria: 'Todos',
      produtos: [],
      editandoId: null,
      novoItem: {
        titulo: '',
        descricao: '',
        imagem: '',
        link: '',
        categoria: 'Cozinha',
        quantidade: 1,
        preco: ''
      }
    }
  },
  computed: {
    produtosReservados() {
      return this.produtos.filter(p => p.quantidade <= 0 && p.reservadoPor)
    },
    produtosFiltradosAdm() {
      if (this.filtroCategoria === 'Todos') return this.produtos
      return this.produtos.filter(p => p.categoria === this.filtroCategoria)
    },
    textoBotao() {
      return this.editandoId ? 'Atualizar Item' : 'Salvar na Lista'
    }
  },
  mounted() {
    onSnapshot(collection(db, 'presentes'), (snapshot) => {
      this.produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
  },
  methods: {
    prepararEdicao(item) {
      this.editandoId = item.id;
      this.novoItem = { ...item }; 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    cancelarEdicao() {
      this.editandoId = null;
      this.novoItem = { 
        titulo: '', 
        descricao: '', 
        imagem: '', 
        link: '', 
        categoria: 'Cozinha', 
        quantidade: 1, 
        preco: '' 
      };
    },

    async adicionarPresente() {
      if (!this.novoItem.titulo) return alert("Dê um nome ao presente!");
      
      try {
        if (this.editandoId) {
          await updateDoc(doc(db, 'presentes', this.editandoId), this.novoItem);
          alert("Item atualizado com sucesso!");
        } else {
          await addDoc(collection(db, 'presentes'), this.novoItem);
          alert('Item adicionado à lista!');
        }
        this.cancelarEdicao();

      } catch (e) { 
        console.error("Erro ao salvar no Firestore:", e);
        alert("Ocorreu um erro ao salvar o item.");
      }
    },

    async liberarItem(id) {
      if (confirm("Liberar este item novamente?")) {
        await updateDoc(doc(db, 'presentes', id), { quantidade: 1, reservadoPor: null })
      }
    },

    async excluirItem(id) {
      if (confirm("Remover permanentemente este item?")) {
        await deleteDoc(doc(db, 'presentes', id))
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=Montserrat:wght@300;400;600&display=swap');


.adm-page {
  background-color: #fdfaf5; 
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Montserrat', sans-serif;
  color: #4a4a4a;
}

.adm-container {
  max-width: 500px; 
  margin: 0 auto;
}

/* Header */
.adm-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  display: block; 
}

.logo-area {
  margin-bottom: 20px; 
}

.adm-header h1 {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 26px;
  color: #2c3e50;
  margin: 0;
}

.subtitle {
  font-size: 11px;
  color: #c5a996;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-top: 5px;
}

.btn-voltar-minimal {
  position: absolute;
  right: 0;
  top: 5px; 
  text-decoration: none;
  color: #ccc;
  font-size: 20px;
  padding: 5px;
}

/* Tabs */
.adm-tabs {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  gap: 0; 
}

.tab-pill {
  flex: 1;
  border: none;
  padding: 14px;
  background: none;
  font-size: 11px;
  font-weight: 600;
  color: #c5a996;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.tab-pill.active {
  background: #343d46; 
  color: #ffffff;
}

/* Cards */
.wedding-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #333;
}

.price-input{
  width: 30%;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  padding: 15px 0;
  margin-bottom: 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  background-color: transparent; 
}

.line-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  padding: 15px 0;
  margin-bottom: 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  background-color: transparent; 
}

.line-input:focus {
  border-bottom-color: #c5a996;
}


.wedding-form {
  display: flex;
  flex-direction: column;
  gap: 5px; 
}

.form-row-modern {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  align-items: flex-end;
}

.form-row-modern .line-input.narrow {
  flex-shrink: 0; 
  width: 60px; 
  text-align: center;
}

.form-row-modern .line-input {
  flex-grow: 1; 
}

.select-wrapper {
  flex-grow: 2;
  position: relative;
}
.select-wrapper select.line-input {
  appearance: none; 
  padding-right: 30px; 
}

 .select-wrapper::after {
  content: '▼';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
  pointer-events: none;
} 


/* Botão Terracota */
.btn-terracotta {
  width: 100%;
  background: #c5a996;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  margin-top: 20px;
  transition: transform 0.2s, background 0.3s;
}

.btn-terracotta:hover {
  background: #b39683;
  transform: translateY(-2px);
}

.btn-cancel {
  background: none;
  border: none;
  color: #999;
  font-size: 13px;
  margin-top: 10px;
  cursor: pointer;
  text-decoration: underline;
}

/* Lista de Itens */
.filter-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-minimal {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  background-color: #fff;
  font-size: 12px;
  color: #777;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23cccccc%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.6-6.4H19.6c-5%200-9.3%202-12.8%205.8-3.5%203.7-5.5%208.2-5.5%2013.1%200%204.8%202%209.3%205.5%2013.1l128%20128c3.5%203.7%208%205.8%2013.1%205.8s9.6-2%2013.1-5.8l128-128c3.5-3.7%205.5-8.2%205.5-13.1s-2-9.4-5.5-13.1z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
}

.item-list-modern {
  margin-top: 15px;
}

.item-card-row {
  background: #fff;
  margin-bottom: 12px;
  padding: 18px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.01);
}

.item-main-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.item-thumb-circle {
  width: 45px;
  height: 45px;
  background: #fdfaf8;
  border: 1px solid #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #c5a996;}

.item-name-bold { font-weight: 600; display: block; font-size: 14px; color: #333; }
.item-category-tag { font-size: 11px; color: #aaa; text-transform: uppercase; margin-top: 2px; }

.item-actions-minimal {
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-icon-edit {
  background: none;
  border: none;
  cursor: pointer;
  color: #999; /* Cor cinza sutil para ícone */
  font-size: 16px;
  padding: 5px;
}

.btn-icon-delete {
  background: none;
  border: none;
  cursor: pointer;
  color: #e74c3c; /* Cor vermelha para excluir */
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 8px;
  background-color: #fff1f1;
}

/* Tabela de Reservas */
.table-wrapper {
  overflow-x: auto; 
}

.adm-table {
  width: 100%;
  border-collapse: collapse;
}

.adm-table th {
  text-align: left;
  font-size: 11px;
  color: #ccc;
  text-transform: uppercase;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0; 
}

.adm-table td {
  padding: 12px 0;
  border-bottom: 1px solid #f8f8f8; 
  font-size: 13px;
}

.nome-convidado-modern { font-weight: 600; color: #c5a996; }
.item-title-table { color: #555; }

.btn-text-action { 
  background: none; 
  border: none; 
  color: #999; 
  font-size: 12px; 
  cursor: pointer; 
  text-decoration: underline; 
  padding: 5px;
}

.empty-msg-modern {
  text-align: center;
  padding: 30px;
  color: #ccc;
  font-style: italic;
  font-size: 14px;
}

/* Utility classes */
.mb-25 { margin-bottom: 25px; }
.mb-15 { margin-bottom: 15px; }


/* Fade In Animation */
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>