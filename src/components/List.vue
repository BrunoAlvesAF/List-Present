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

        <button class="cat-btn pix-special-btn" @click="showPixModal=true">
          <span class="pix-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="svg-pix">
        <path d="M306.4 356.5C311.8 351.1 321.1 351.1 326.5 356.5L403.5 433.5C417.7 447.7 436.6 455.5 456.6 455.5L471.7 455.5L374.6 552.6C344.3 582.1 295.1 582.1 264.8 552.6L167.3 455.2L176.6 455.2C196.6 455.2 215.5 447.4 229.7 433.2L306.4 356.5zM326.5 282.9C320.1 288.4 311.9 288.5 306.4 282.9L229.7 206.2C215.5 191.1 196.6 184.2 176.6 184.2L167.3 184.2L264.7 86.8C295.1 56.5 344.3 56.5 374.6 86.8L471.8 183.9L456.6 183.9C436.6 183.9 417.7 191.7 403.5 205.9L326.5 282.9zM176.6 206.7C190.4 206.7 203.1 212.3 213.7 222.1L290.4 298.8C297.6 305.1 307 309.6 316.5 309.6C325.9 309.6 335.3 305.1 342.5 298.8L419.5 221.8C429.3 212.1 442.8 206.5 456.6 206.5L494.3 206.5L552.6 264.8C582.9 295.1 582.9 344.3 552.6 374.6L494.3 432.9L456.6 432.9C442.8 432.9 429.3 427.3 419.5 417.5L342.5 340.5C328.6 326.6 304.3 326.6 290.4 340.6L213.7 417.2C203.1 427 190.4 432.6 176.6 432.6L144.8 432.6L86.8 374.6C56.5 344.3 56.5 295.1 86.8 264.8L144.8 206.7L176.6 206.7z"/>
      </svg>
          </span>
          Pix
        </button>
      </nav>

      <div v-if="showPixModal" class="modal-overlay" @click.self="showPixModal= false">
        <div class="modal-card">
          <div class="modal-border">
             <div class="ornament">✦</div>
             <header class="modal-header">
              <h2>Presente Pix</h2>
              <p>Agradecemos imensamente o carinho!</p>
             </header>
            <div class="modal-body">
              <div class="pix-info">
                 <div class="pix-qrcode">
                  <img src="/public/img/image.png" alt="QR CODE" class="pix-img">
                 </div>
                <p class="pix-label">CHAVE PIX</p>
                <p class="pix-key">hellen&bruno@gmail.com</p>
                <p class="pix-label">NOME</p>
                <p class="pix-name">Hellen ou Bruno</p>
              </div>
            </div>
            <button @click="showPixModal= false" class="btn-primary">fechar</button>
          </div>
        </div>
      </div>

      <div class="products-grid">
        <div v-for="item in filteredProducts" :key="item.id" class="card">
          <div class="card-img">
            <img :src="item.imagem" :alt="item.titulo"/>
            <div class="card-tag">🍴 {{ item.categoria }}</div>
          </div>

          <div class="card-body">
            <h3>{{ item.titulo }}</h3>
          
          <div class="price-container">
            <div class="price">R$ {{ item.preco }}</div>
            <span class="price-icon" title="O preço pode sofrer alterações.">i</span>
          </div>
            <p class="description">{{ item.descricao }}</p>
            
            
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

            <div class="model-item-title">
            <span class="item-name">{{ itemParaReservar.titulo }}</span>
             <a v-if="itemParaReservar.link"
            :href="itemParaReservar.link"
            target="_blank"
            class="store-link">
            <span class="info-icon">i</span>
            </a>
            </div>
          
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
      showPixModal: false,
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
    padding-bottom: 5px 20px 20px 20px; 
    justify-content: flex-start; 
  }

  .categories::-webkit-scrollbar{
    display: none;
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
    font-size: 1.5rem;
    font-weight: bold;
  }

  .price-container{
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 10px 0;
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

  /*toast*/
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


.pix-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background-color: #fdfcf8;
}

.pix-img{
  width: 140px;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #eee;
}

/*pix*/
.pix-special-btn{
  border-color: #32bcad !important;
  color: #32bcad !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pix-icon{
  width: 18px;
  height: 18px;
  display: flex;
}
.svg-pix{
  fill: #32bcad;
}
.pix-info{
  background: #f4fbfb;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #32bcad33;
  text-align: center;
  margin: 10px 0;
}
.pix-label{
  font-size: 0.7rem;
  color: #8b7d77;
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.pix-key{
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  font-size: 1.1rem;
}
.pix-name{
  font-weight: 600;
  color: #333;
}

.info-link{
  text-decoration: none;
  display: flex;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1.5px solid var(--tom-areia);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.info-icon{
  color: var(--tom-areia);
  font-family: 'Playfair display' serif;
  font-style: italic;
  font-weight: bold;
  font-size: 14px;
}

.info-icon-static{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid #d2b4a0; 
  border-radius: 50%;
  font-size: 11px;
  color: #8b7d77;
  cursor: help;
  font-style: italic;
}

.info-link:hover{
  background-color: var(--tom-areia);
}

.model-item-title {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 12px !important;
  margin: 15px 0 !important;
}

.price-icon{
  background-color: var(--marrom-suave);
  color: white;
  border-radius: 100%;
  width: 18px;
  align-items: center;
  justify-content:center;
  display: flex;
  font-style: italic; 
}

.store-link {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 28px !important; 
  height: 28px !important;
  background-color: #d2b4a0;; 
  border-radius: 50% !important;
  text-decoration: none !important;
  flex-shrink: 0 !important;
  transition: transform 0.2s ease;
}

.store-link .info-icon {
  color: #ffffff !important; 
  font-family: 'Playfair Display', serif !important;
  font-style: italic !important;
  font-weight: bold !important;
  font-size: 16px !important; 
  line-height: 1 !important;
}

.store-link:hover {
  transform: scale(1.1);
}
</style>