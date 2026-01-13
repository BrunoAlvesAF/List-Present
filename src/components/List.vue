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
      <p>
        Queridos amigos e familiares, ficamos muito felizes com a sua presença em nosso casamento. 
        Esta lista foi criada com muito carinho para compartilhar os itens da nossa nova jornada.
      </p>
    </section>

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
            <div class="card-tag">🍴 {{ item.categoria }}</div>
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

              <button @click="handleReserve(item)" 
                :disabled="item.quantidade <= 0" 
                :class="['reserve-btn', {'btn-disabled': item.quantidade <= 0 }]">
                {{ item.quantidade > 0 ? '🛒 Reservar' : 'Reservado' }}
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
      <div class="modal-card">
        <div class="modal-border">
          <div class="ornament">✦</div>
          <header class="modal-header">
            <h2>Um Presente Especial</h2>
            <p>Você escolheu presentear com:</p>
            <span class="item-name">{{ itemParaReservar.titulo }}</span>
          </header>
          <div class="modal-body">
            <div class="input-wrapper">
              <label>Como devemos te identificar?</label>
              <input v-model="nomeReserva" type="text" placeholder="Digite seu nome completo">
            </div>
          </div>
          <footer class="modal-footer">
            <button @click="confirmarReserva" class="btn-primary">Confirmar Escolha</button>
            <button @click="cancelarReserva" class="btn-link">Ainda estou decidindo</button>
          </footer>
        </div>
      </div>
    </div>

    <transition name="toast">
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
      this.itemParaReservar = item;
      this.showModal = true;
    },
    cancelarReserva() {
      this.showModal = false;
      this.nomeReserva = '';
    },
    async confirmarReserva() {
      if (!this.nomeReserva.trim()) return alert("Por favor, digite seu nome!");
      
      try {
        const docRef = doc(db, 'presentes', this.itemParaReservar.id);
        await updateDoc(docRef, {
          quantidade: 0, 
          reservadoPor: this.nomeReserva,
          dataReserva: new Date().toISOString()
        });
        this.cancelarReserva();
        this.mostrarToast(); 
      } catch (e) { 
        console.error(e); 
      }
    },
    mostrarToast() { 
      this.toastAtivo = true;
      setTimeout(() => { this.toastAtivo = false; }, 3000);
    }
  } 
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600&display=swap');

  :root {
  --bg-principal: #fdfcf8;      
  --tom-areia: #d2b4a0;         
  --dourado-luxo: #c5a059;      
  --marrom-suave: #8b7d77;     
  --texto-corpo: #666666;       
  --branco-puro: #ffffff;       
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .wedding-app { 
    font-family: 'Montserrat', sans-serif; 
    background: #fdfcf8; 
    color: #555; 
  }

  /* HERO SECTION */
  .hero {
    height: 60vh;
    background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)),
    url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069') center / cover;
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: white; 
    text-align: center;
  }

  .names { 
    font-family: 'Playfair Display', serif; 
    font-size: 
    clamp(2.5rem, 8vw, 4rem); 
  }
  .title-divider { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 15px; 
    margin: 10px 0; 
  }
  .line { 
    width: 45px; 
    height: 1px; 
    background: rgba(255, 255, 255, 0.6); 
  }
  .label { 
    letter-spacing: 3px; 
    font-size: 0.8rem; 
    font-weight: 300; 
  }
  .data { 
    border: 1px solid rgba(255, 255, 255, 0.7); 
    padding: 10px 30px; 
    border-radius: 50px; 
    background: rgba(255, 255, 255, 0.1); 
    backdrop-filter: blur(4px); 
  }

  /* WELCOME MSG */
  .welcome-msg { 
    text-align: center; 
    padding: 40px 20px; 
    max-width: 700px; 
    margin: -30px auto 0; 
    position: relative; 
    z-index: 10; 
    background: #fdfcf8; 
    border-radius: 20px 20px 0 0; 
  }
  .ornament {
     color: #c5a059;
    font-size: 1.5rem; 
    margin-bottom: 10px; 
    }
  .welcome-msg h2 { 
    font-family: 'Playfair Display', serif; 
    font-size: 1.8rem; 
    color: #333; 
    margin-bottom: 15px;
   }
  .welcome-msg p { 
    line-height: 1.7; 
    color: #777; 
    font-size: 0.95rem; 
  }

  /* GRID & CARDS */
  .container { 
    max-width: 1100px; 
    margin: 0 auto; 
    padding: 20px; 
  }
  .categories { 
    display: flex; 
    gap: 10px; overflow-x: auto; 
    padding-bottom: 30px; 
    justify-content: center; 
  }
  .cat-btn { 
    padding: 10px 20px; 
    border-radius: 30px; 
    border: 1px solid #eee; 
    background: white; 
    cursor: pointer; 
    transition: 0.3s; 
    white-space: nowrap; 
  }
  .cat-btn.active { 
    background: #d2b4a0; 
    color: white; 
    border-color: #d2b4a0; 
  }

  .products-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    gap: 30px; 
  }
  .card { 
  background: var(--branco-puro);
  border-radius: 12px;
  border: 1px solid rgba(210, 180, 160, 0.15);
  box-shadow: 0 10px 30px rgba(139, 125, 119, 0.05);   
}
  .card:hover { 
    transform: translateY(-5px); 
  }
  .card-img { 
    width: 100%; 
    height: 220px; 
    position: relative; 
    padding: 20px; display: flex; 
    align-items: center; 
    justify-content: center; 
    background: #fff; 
  }
  .card-img img { 
    max-width: 100%; 
    max-height: 100%; 
    object-fit: contain; 
  }
  .card-tag { 
    position: absolute; 
    top: 15px; left: 15px; 
    background: rgba(255,255,255,0.9); 
    padding: 5px 12px; 
    border-radius: 20px; 
    font-size: 0.7rem; 
    font-weight: 600; 
    color: #8b7d77; 
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); 
  }
  .card-body { 
    padding: 20px; 
  }
  .card-body h3 { 
    font-family: 'Playfair Display', serif; 
    font-size: 1.4rem; 
    margin-bottom: 8px; 
    color: #333; 
  }
  .price { 
    color: var(--dourado-luxo); 
    font-family: 'playfair display', sans-serif;
    font-weight: 700;
  }

  .card-footer { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-top: 15px; 
  }
  .reserve-btn { 
     background: #d2b4a0;
      color: white;
      border: none;
      padding: 12px 22px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: 0.3s;
  }
  .btn-disabled { 
    background: #eee; 
    color: #aaa; 
    cursor: not-allowed; 
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


  /* MODAL PREMIUM STYLES */
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(44, 42, 41, 0.7); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  }
  .modal-card { 
    background: #fff; 
    width: 100%; 
    max-width: 480px; 
    padding: 12px; border-radius: 4px; 
    box-shadow: 0 30px 60px rgba(0,0,0,0.3); 
  }
  .modal-border { 
    border: 1px solid #d2b4a0; 
    padding: 40px 30px; 
    text-align: center; 
  }
  .item-name { 
    display: block; 
    font-family: 'Playfair Display', serif; 
    font-size: 1.6rem; color: #c5a059; 
    margin: 15px 0; 
    font-style: italic; 
  }
  
  .input-wrapper {
     text-align: left; 
     margin: 25px 0; 
    }
  .input-wrapper label { 
    font-size: 0.7rem; 
    color: #8b7d77; 
    letter-spacing: 1px; 
    text-transform: uppercase; 
    margin-bottom: 8px; 
    display: block; 
  }
  .input-wrapper input { 
    width: 100%; 
    border: none; 
    border-bottom: 1px solid #eee; 
    padding: 10px 0; 
    font-size: 1rem; 
    background: transparent;
     transition: 0.3s; 
    }
  .input-wrapper input:focus { 
    outline: none;
    border-bottom-color: #c5a059; 
    }

  .btn-primary { 
    background: #8b7d77; 
    color: white; 
    border: none; 
    padding: 16px; 
    width: 100%; 
    font-weight: 600; 
    text-transform: uppercase;
    letter-spacing: 2px; 
    cursor: pointer; 
    transition: 0.3s; 
  }
  .btn-primary:hover { 
    background: #333; 
  }
  .btn-link { 
    background: none; 
    border: none; 
    color: #bbb; 
    font-size: 0.8rem; 
    cursor: pointer; 
    text-decoration: underline; 
    margin-top: 15px;
   }

  /* TOAST */
  .toast-success { 
    position: fixed; 
    bottom: 20px; 
    right: 20px; 
    background: #6a8e61; 
    color: white; 
    padding: 15px 25px; 
    border-radius: 8px; 
    z-index: 2000; 
  }
  
  @media(max-width: 600px) {
    .hero { height: 50vh; }
    .welcome-msg { margin-top: -20px; padding: 30px 15px; }
  }

 .footer-dark{
  background-color: #8b7d77; 
  color: white; 
  padding: 60px 20px; 
  text-align: center;
 }

 .footer-names {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  letter-spacing: 2px;
  margin: 15px 0;
  color: var(--branco-puro);
}

.footer-content p {
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  letter-spacing: 1px;
  opacity: 0.8;
}

/* Container Principal */
.pix-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background-color: #fdfcf8; /* Fundo creme suave da página */
}

</style>