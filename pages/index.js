import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Busca cards aprovados
      const { data: cardsData } = await supabase
        .from('cards')
        .select('*')
        .eq('status', 'approved');

      // Busca anúncios ativos
      const { data: adsData } = await supabase
        .from('advertisers')
        .select('*')
        .eq('status', 'active');

      if (cardsData) setCards(cardsData);
      if (adsData) setAds(adsData);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2563eb' }}>Mural de Serviços do Condomínio</h1>
        <p>Encontre profissionais do próprio prédio e parceiros locais</p>
      </header>

      {/* Seção de Patrocinadores */}
      {ads.length > 0 && (
        <section style={{ marginBottom: '40px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, color: '#475569' }}>⭐ Parceiros do Bairro</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {ads.map(ad => (
              <div key={ad.id} style={{ fontWeight: 'bold', color: '#1e293b' }}>
                {ad.business_name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seção de Cards dos Moradores */}
      <main>
        <h3>🛠️ Serviços dos Moradores</h3>
        {loading ? (
          <p>Carregando serviços...</p>
        ) : cards.length === 0 ? (
          <p style={{ color: '#64748b' }}>Nenhum serviço cadastrado ainda no condomínio.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {cards.map(card => (
              <div key={card.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{card.headline}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>
                  Por: <strong>{card.resident_name}</strong> ({card.unit})
                </p>
                <p style={{ margin: '0 0 15px 0' }}>{card.description}</p>
                <a
                  href={`https://wa.me/${card.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-block', background: '#22c55e', color: '#fff', padding: '8px 16px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Falar no WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
