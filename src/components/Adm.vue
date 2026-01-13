<template>
  <div class="adm-page">
    <div class="adm-container">
      <header class="adm-header">
        <h1>Painel dos Noivos 💍</h1>
        <router-link to="/" class="btn-voltar">Sair do Painel</router-link>
      </header>

      <nav class="adm-tabs">
        <button :class="['tab-btn', { active: abaAtiva === 'reservas' }]" @click="abaAtiva = 'reservas'">
          👥 Lista de Reservas
        </button>
        <button :class="['tab-btn', { active: abaAtiva === 'gerenciar' }]" @click="abaAtiva = 'gerenciar'">
          📦 Gerenciar Itens
        </button>
      </nav>

      <section v-if="abaAtiva === 'reservas'" class="adm-content">
        <div class="card-adm">
          <h3>Convidados que já escolheram</h3>
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
                <td class="nome-convidado">{{ p.reservadoPor }}</td>
                <td>{{ p.titulo }}</td>
                <td>
                  <button @click="liberarItem(p.id)" class="btn-liberar">Desfazer Reserva</button>
                </td>
              </tr>
              <tr v-if="produtosReservados.length === 0">
                <td colspan="3" class="empty-msg">Nenhuma reserva realizada ainda.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="abaAtiva === 'gerenciar'" class="adm-content">
        <div class="card-adm mb-20">
          <h3>Adicionar Novo Item</h3>
          <div class="adm-form-grid">
            <input v-model="novoItem.titulo" placeholder="Nome do Presente" />
            <input v-model="novoItem.descricao" placeholder="Descrição curta" />
            <input v-model="novoItem.imagem" placeholder="URL da Foto" />
            <div class="row">
              <select v-model="novoItem.categoria">
                <option value="Cozinha">Cozinha</option>
                <option value="Quarto">Quarto</option>
                <option value="Sala">Sala</option>
              </select>
              <input type="number" v-model.number="novoItem.quantidade" placeholder="Qtd" title="Quantidade inicial" />
            </div>
            <button @click="adicionarPresente" class="btn-save">Salvar na Lista</button>
          </div>
        </div>

        <div class="card-adm">
          <div class="filter-header">
            <h3>Itens Cadastrados</h3>
            <select v-model="filtroCategoria" class="filter-select">
              <option value="Todos">Todas as Categorias</option>
              <option value="Cozinha">Cozinha</option>
              <option value="Quarto">Quarto</option>
              <option value="Sala">Sala</option>
            </select>
          </div>
          
          <div class="item-list-adm">
            <div v-for="p in produtosFiltradosAdm" :key="p.id" class="item-row-adm">
              <span><strong>{{ p.titulo }}</strong> ({{ p.categoria }})</span>
              <button @click="excluirItem(p.id)" class="btn-excluir">🗑 Excluir</button>
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
      novoItem: {
        titulo: '',
        descricao: '',
        imagem: '',
        categoria: 'Cozinha',
        quantidade: 1 
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
    }
  },
  mounted() {
    onSnapshot(collection(db, 'presentes'), (snapshot) => {
      this.produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
  },
  methods: {
    async adicionarPresente() {
      if (!this.novoItem.titulo) return alert("Dê um nome ao presente!")
      try {
        await addDoc(collection(db, 'presentes'), this.novoItem)
        this.novoItem = { titulo: '', descricao: '', imagem: '', categoria: 'Cozinha', quantidade: 1 }
        alert("Item adicionado!")
      } catch (e) { console.error(e) }
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

<style>
 .adm-page{
  background: #fdfcf8;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'montserrat', sans-serif;
 }

 .adm-container{
  max-width: 800px;
  margin:0 auto;
 }

 .adm-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 10px solid #ddd;
  padding-bottom: 20px;
 }

 .btn-voltar{
  color: #8b7d77;
  text-decoration: none;
  font-weight: 600;
 }
.adm-tabs{
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}
.tab-btn{
  flex: 1;
  padding: 15px;
  border: none;
  background: #eee;
  cursor: pointer;
  border-radius: 9px;
  font-weight: bold;
  color: #777;
  transition: 0.3s;
}
.tab-btn.active{
  background: #8b7d77; 
  color: white;
}
.card-adm{
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}
.mb-20{
  margin-bottom: 20px;
}
.adm-form-grid{
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.adm-form-grid, .adm-form-grid select{
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.row{
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 10px;
}
.btn-save{
  background: #8b7d77;
  color: white;
  border: none;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

input[type=number]{
  width: 100%; 
  padding: 12px; 
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  box-sizing: border-box;

}

.filter-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.filter-select{
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.item-row-adm{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f9f9f9;
}
.btn-excluir{
  background: #fff1f1;
  color: #d9534f; 
  border: none;
  padding: 5px 10px;
  border-radius: 9px;
  cursor: pointer; 
}

.adm-table{
  width: 100%;
  border-collapse: collapse;
}
.adm-table th{
  text-align: left;
  color: #999;
  font-size: 0.8rem;
  padding-bottom: 15px;
}
.adm-table td{
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}
.nome-convidado{
  font-weight: bold;
  color: #8b7d77;
}
.btn-liberar{
  background: #f4f4f4;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  font-size: 0.8rem;
}
.empty-msg{
  text-align: center;
  padding: 30px;
  color: #ccc;
}
</style>