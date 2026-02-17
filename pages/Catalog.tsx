
import React, { useState, useEffect, useMemo } from 'react';
import { Language, ServiceType, AnimalType, AdminSettings, Product, FeeItem } from '../types';
import { translations } from '../translations';
import { LOCATIONS } from '../constants';

interface Props {
  lang: Language;
  products: Product[];
  adminSettings: AdminSettings;
  onCheckout: (data: any) => void;
}

const Catalog: React.FC<Props> = ({ lang, products, adminSettings, onCheckout }) => {
  const t = translations[lang];
  const [selectedService, setSelectedService] = useState<ServiceType>(ServiceType.KURBAN);
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.service === selectedService);
  }, [products, selectedService]);

  const [selectedAnimal, setSelectedAnimal] = useState<Product | null>(null);
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].id);
  const [beneficiaries, setBeneficiaries] = useState<string[]>(['']);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      setSelectedAnimal(filteredProducts[0]);
      setSelectedWeight(0);
    } else {
      setSelectedAnimal(null);
    }
  }, [selectedService, filteredProducts]);

  // Fix: Added handleAddBeneficiary to manage list of names
  const handleAddBeneficiary = () => {
    if (beneficiaries.length < 7) {
      setBeneficiaries([...beneficiaries, '']);
    }
  };

  // Fix: Added handleBeneficiaryChange to update specific name in list
  const handleBeneficiaryChange = (index: number, value: string) => {
    const updated = [...beneficiaries];
    updated[index] = value;
    setBeneficiaries(updated);
  };

  // Fix: Added handleRemoveBeneficiary to remove specific name from list
  const handleRemoveBeneficiary = (index: number) => {
    if (beneficiaries.length > 1) {
      setBeneficiaries(beneficiaries.filter((_, i) => i !== index));
    }
  };

  const basePrice = useMemo(() => {
    if (!selectedAnimal || !selectedAnimal.variants[selectedWeight]) return 0;
    const variantPrice = selectedAnimal.variants[selectedWeight].price;
    const locationPrice = LOCATIONS.find(l => l.id === selectedLocation)?.additionalPrice || 0;
    return selectedAnimal.basePrice + variantPrice + locationPrice;
  }, [selectedAnimal, selectedWeight, selectedLocation]);
  
  const calculatedFees = useMemo(() => {
    return adminSettings.fees.map(fee => {
      const amount = fee.type === 'percentage' 
        ? (basePrice * fee.value) / 100 
        : fee.value;
      return { label: fee.label, amount };
    });
  }, [basePrice, adminSettings.fees]);

  const grandTotal = basePrice + calculatedFees.reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-brand-maroon mb-8 tracking-tighter">{t.services}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-red-50">
              <label className="block text-xs font-black text-brand-maroon uppercase tracking-[0.2em] mb-6 px-1">{t.selectServiceType}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[ServiceType.KURBAN, ServiceType.AQIQAH, ServiceType.DAM, ServiceType.SEDEKAH].map(s => (
                  <button key={s} onClick={() => setSelectedService(s)} className={`p-5 rounded-2xl border-2 transition-all font-black text-sm text-center flex flex-col items-center gap-2 ${selectedService === s ? 'border-brand-maroon bg-red-50 text-brand-maroon' : 'border-slate-50 text-slate-500 hover:border-red-200'}`}>
                    <span className="text-2xl">{s === ServiceType.KURBAN ? '🕋' : s === ServiceType.AQIQAH ? '👶' : s === ServiceType.DAM ? '⚖️' : '🍖'}</span>
                    {t[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-red-50">
                <label className="block text-xs font-black text-brand-maroon uppercase tracking-[0.2em] mb-6 px-1">{t.selectAnimal}</label>
                <div className="space-y-4">
                  {filteredProducts.map(p => (
                    <button key={p.id} onClick={() => { setSelectedAnimal(p); setSelectedWeight(0); }} className={`w-full flex items-center gap-5 p-5 rounded-2xl border-2 transition-all group ${selectedAnimal?.id === p.id ? 'border-brand-maroon bg-red-50' : 'border-slate-50 hover:border-red-100'}`}>
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-transform ${selectedAnimal?.id === p.id ? 'bg-brand-maroon text-white rotate-6' : 'bg-red-50 text-brand-maroon'}`}>
                        {p.type === AnimalType.GOAT ? '🐐' : p.type === AnimalType.COW ? '🐄' : p.type === AnimalType.CAMEL ? '🐪' : '🐃'}
                      </div>
                      <div className="text-left font-black text-brand-maroon capitalize text-lg leading-none">{p.type}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-red-50">
                <label className="block text-xs font-black text-brand-maroon uppercase tracking-[0.2em] mb-6 px-1">{t.selectWeight}</label>
                <div className="grid grid-cols-1 gap-4">
                  {selectedAnimal?.variants.map((v, idx) => (
                    <button key={idx} onClick={() => setSelectedWeight(idx)} className={`p-5 rounded-2xl border-2 transition-all font-black flex justify-between items-center ${selectedWeight === idx ? 'border-brand-maroon bg-red-50 text-brand-maroon' : 'border-slate-50 text-slate-400'}`}>
                      <span>{v.weight} kg</span>
                      <span className="text-xs px-2 py-1 rounded-lg bg-slate-100">+${v.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border-2 border-amber-100/50">
              <div className="flex justify-between items-center mb-10">
                <label className="text-sm font-black text-brand-maroon uppercase tracking-widest">{t.beneficiaryName}</label>
                <button onClick={handleAddBeneficiary} disabled={beneficiaries.length >= 7} className="bg-brand-maroon text-white px-6 py-3 rounded-2xl text-xs font-black disabled:opacity-30">+ {t.addPerson}</button>
              </div>
              <div className="space-y-4">
                {beneficiaries.map((name, idx) => (
                  <div key={idx} className="flex gap-4">
                    <input type="text" value={name} onChange={(e) => handleBeneficiaryChange(idx, e.target.value)} placeholder="Nama Lengkap Bin/Binti..." className="flex-grow px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:border-brand-maroon outline-none font-bold" />
                    {beneficiaries.length > 1 && <button onClick={() => handleRemoveBeneficiary(idx)} className="text-rose-400 p-5">✕</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-10 rounded-[3rem] shadow-2xl border border-red-50">
              <h3 className="text-2xl font-black text-brand-maroon mb-8 pb-6 border-b border-red-50">🧾 Ringkasan</h3>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Harga Dasar</span>
                  <span className="font-black text-brand-maroon">${basePrice}</span>
                </div>
                {calculatedFees.map((fee, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">{fee.label}</span>
                    <span className="font-black text-brand-maroon_light">+${fee.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-8 border-t border-red-50 flex flex-col gap-2">
                  <span className="text-slate-400 font-black uppercase text-[10px]">Grand Total</span>
                  <span className="text-5xl font-black text-brand-maroon tracking-tighter">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => onCheckout({ service: selectedService, animal: selectedAnimal?.type, weight: selectedAnimal?.variants[selectedWeight].weight, location: selectedLocation, beneficiaries, total: grandTotal, appliedFees: calculatedFees })} className="w-full bg-brand-maroon text-white py-6 rounded-[1.5rem] font-black text-xl shadow-xl shadow-red-200/50">
                {t.checkout}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
