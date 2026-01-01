<template>
  <div class="wedding-app">
    <header class="hero">
      <div class="overlay">
      <div class="names">Hellen & Bruno</div>
      <div class="title-divider">
        <span class="line"></span>
        <span class="label">Lista de Presentes</span>
        <span class="line"></span>
      </div>

      <div class="hearts">♡ ♡ ♡</div>
      <div class="data">17 de Junho de 2026</div>
      </div>
    </header>

    <section class="welcome-msg">
      <div class="ornament">✦</div>
      <h2>Nossa Lista de Presentes</h2>
      <h2>Queridos amigos e familiares, ficamos muitos felizes com a sua presença em nosso casamento. Esta lista foi criada com muito carinho para compartilhar os itens da nossa nova jornada.</h2>
    </section>

    <!-- categorias -->
    <div class="container">
      <nav class="categories">
        <button v-for="cat in categorias"
        :key="cat.nome"
        :class="['cat-btn', {active: selectedCat === cat.nome }]" 
         @click="selectedCat = cat.nome">
          <span>{{ cat.icon }}</span> {{ cat.nome }}
        </button>
      </nav>

       <div class="products-grid">
        <div v-for="item in filteredProducts" :key="item.id" class="card">
        <div class="card-img">
          <img :src="item.imagem" :alt="item.titulo"/>
          <div class="card-tag">🍴{{ item.categoria }}</div>
        </div>

        <div class="card-body">
          <h3>{{ item.titulo }}</h3>
          <p class="description">{{ item.descricao }}</p>

          <div class="price">R$ {{ item.preco }}</div>
        
        <div class="card-footer">
          <div v-if="item.quantidade > 0" class="status-pill">
            <span class="check-icon">✓</span>
            <span class="status-text">Disponível</span>
          </div>
          <div v-else class="status-pill soldout">
            <span class="check-icon">✕</span>
            <span class="status-text">Esgotado</span>
          </div>

            <button @click="handleReserve(item)" :disabled="item.quantidade <=0" :class="['reserve-btn', {'btn-disabled':item.quantidade <=0 }]">
              {{ item.quantidade > 0 ? '🛒Reservar': 'Reservado' }}
            </button>
        </div>
        </div>
        </div>
       </div>
    </div>

   <footer class="footer-dark">
      <div class="footer-content">
        <div class="ornament">✦</div>
        <h3 class="footer-names">Hellen & Bruno</h3>
        <p>Obrigado por fazer parte do nosso dia especial!</p>
      </div>
   </footer>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Reservar presente</h3>
      <p>Você está reservando: <strong>{{ itemParaReservar.titulo }}</strong></p>

      <div class="input-group">
        <label>Seu nome Completo</label>
        <input v-model="nomeReserva" placeholder="Digite seu nome" type="text">
      </div>

      <div class="modal-actions">
        <button @click="cancelarReserva" class="btn-cancelar">Cancelar</button>
        <button @click="confirmarReserva" class="btn-confirmar">Confirmar</button>
      </div>
    </div>
  </div>

 <transition class="toast">
  <div v-if="toastAtivo" class="toast-success">
    ✅ Reserva confirmada com sucesso!
  </div>
 </transition>

  </div>
</template>

<script>
 import { db } from '../firebase' 
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      selectedCat: 'Todos os Presentes',
      produtos: [],
      showModal: false,
      itemParaReservar: null,
      nomeReserva: '',
      toastAtivo: false, 
      categorias: [
        { nome: 'Todos os Presentes', icon: '🎁' },
        { nome: 'Cozinha', icon: '🍴' },
        { nome: 'Quarto', icon: '🛏' },
        { nome: 'Sala', icon: '🛋' }
      ]
    }
  },
  computed: {
    filteredProducts() {
      if (!this.produtos) return [];
      const itensDisponiveis = this.produtos.filter(p => p.quantidade > 0);
      if (this.selectedCat === 'Todos os Presentes') return itensDisponiveis;
      return itensDisponiveis.filter(p => p.categoria === this.selectedCat);
    },
    resumo() {
      const total = this.produtos.length
      const reservados = this.produtos.filter(p => p.quantidade <= 0).length
      const disponiveis = total - reservados
      const porcentagem = total > 0 ? Math.round((reservados / total) * 100) : 0
      return { total, disponiveis, reservados, porcentagem }
    }
  },
  mounted() {
    onSnapshot(collection(db, 'presentes'), snapshot => {
      this.produtos = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
    })
  },
  methods: { 
    handleReserve(item) {
      this.itemParaReservar = item
      this.showModal = true
    },
    cancelarReserva() {
      this.showModal = false
      this.nomeReserva = ''
    },
    async confirmarReserva() {
      if (!this.nomeReserva.trim()) return alert("Por favor, digite seu nome!")
      
      try {
        const docRef = doc(db, 'presentes', this.itemParaReservar.id)
        await updateDoc(docRef, {
          quantidade: 0, 
          reservadoPor: this.nomeReserva,
          dataReserva: new Date().toISOString()
        })
        this.cancelarReserva()
        this.mostrarToast() 
      } catch (e) { 
        console.error(e) 
      }
    },
    mostrarToast() { 
      this.toastAtivo = true
      setTimeout(() => {
        this.toastAtivo = false
      }, 3000)
    }
  } 
}
</script>


<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&family=Montserrat:wght@300;400;600&display=swap');

  .wedding-app {
    font-family: 'Montserrat', sans-serif;
    background: #fdfcf8;
    color: #555;
  }

  .hero{
    height: 65vh;
    background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)),
    url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069') center / cover ;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
  }

  .names{
    font-family: 'playfair display', serif;
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 400;
  }

  .title-divider{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin: 10px 0;
  }

  .line{
    width: 45px;
    height: 1px;
    background: rgba(255, 255, 255, 0.6);
  }

  .label{
    letter-spacing: 3px;
    font-size: 0.8rem;
    font-weight: 300;
  }

  .hearts{
    font-size: 1.2rem;
    letter-spacing: 6px;
    margin-bottom: 20px;
  }

  .data{
    border: 1px solid rgba(255, 255, 255, 0.7);
    padding: 10px 30px;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    font-weight: 300;
  }

  .welcome-msg{
   text-align: center;
   padding: 60px 20px;
   max-width: 800px;
   margin: 0 auto;
  }

  .ornament{
    color: #c5a059;
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .welcome-msg h2{
    font-family: 'playfair display', serif;
    font-size: 2rem;
    color: #333;
    margin-bottom: 15px;
  }

    .welcome-msg p{
      line-height: 1.7;
      color: #777;
    }

    .container{
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px;
    }

    .categories{
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 30px;
      justify-content: center;
    }

    .cat-btn{
      padding: 10px 20px;
      border-radius: 30px;
      border: 1px solid #eee;
      background: white;
      cursor: pointer;
      transition: 0.3s;
      white-space: nowrap;
    }

    .cat-btn.active{
      background: #d2b4a0;
      color: white;
      border-color: #d2b4a0;
    }

    .products-grid{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    .card{
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
      transition: transform 0.3s;
    }

    .card:hover{
      transform: translateY(-5px);
    }

    .card-img{
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-color: #f9f9f9;
    }

    .card-img img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .card-tag{
      position: absolute;
      top: 15px;
      left: 15px;
      background: white;
      padding: 6px 15px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #444;
    }

    .card-body{padding: 25px; text-align: left;}
    .card-body h3{ font-family: 'playfair display', serif; font-size: 1.5rem; margin-bottom: 10px; color: #333;}
    .description{ font-size: 0.9rem; color: #888; line-height: 1.5; margin-bottom: 15px;}

    .price{
      color: #c5a059;
      font-size: 1.6rem;
      font-weight: bold;
      margin-bottom: 20px 0;
    }

    .card-footer{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }

    .status-pill{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 50px;
      font-size: 0.85rem;
      background-color: #f1f3f0;
      color: #6a8e61;
      }

    .check-icon{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background-color: #6a8e61;
      color: white;
      border-radius: 50%;
      font-size: 0.7rem;
    }

    .status{font-size: 0.85rem; font-weight: 500;}
    .status.online{color: #8ca38c;}
    .status.offline{color: #cc8b8b;}

    .reserve-btn{
      background: #d2b4a0;
      color: white;
      border: none;
      padding: 12px 22px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: 0.3s;
    }

    .reserve-btn:hover:not(:disabled){
      background: #c5a059;
    }

    .btn-disabled{
      background: #ddd;
      cursor: not-allowed;
    }

    @media(max-width:600px){
      .names{font-size: 2.8rem;}
      .products-grid{grid-template-columns: 1fr;}
    }

    .footer-dark{
      background-color: #8b7d77;
      color: white;
      padding: 8px 20px;
      text-align: center;
      margin-top: 50px;
    }

    .footer-names{
      font-family: 'playfair display', serif;
      font-size: 2.2rem;
      font-weight: 400;
      margin-bottom: 20px;
    }

    .resumo-topo { padding: 30px; text-align: center; background: #fdfcf8; }
.stats-grid { display: flex; justify-content: center; gap: 40px; }
.stat-value { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #d2b4a0; display: block; }
.stat-label { font-size: 0.65rem; color: #999; letter-spacing: 1px; }

.description-main { font-size: 0.95rem; color: #777; margin-bottom: 20px; min-height: 60px; }

.footer-dark { background-color: #8b7d77; color: white; padding: 60px 20px; text-align: center; }
.percent-number { font-family: 'Playfair Display', serif; font-size: 3.5rem; color: #fdfcf8; }
.percent-label { font-size: 0.75rem; letter-spacing: 2px; color: rgba(255,255,255,0.7); }
.ornament-line { width: 120px; filter: brightness(0) invert(1); margin: 20px 0; opacity: 0.7; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; backdrop-filter: blur(5px); }
.modal-content { background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; color: #333; }
.input-group input { width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ddd; border-radius: 5px; }
.modal-actions { margin-top: 20px; display: flex; gap: 10px; }
.btn-confirmar { background: #8b7d77; color: white; border: none; padding: 10px 20px; border-radius: 5px; flex: 1; cursor: pointer; }
.btn-cancelar { background: #eee; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }

.toast-success {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 9999;
  font-weight: bold;
}

/* Animação de entrada e saída */
.toast-enter-active, .toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>