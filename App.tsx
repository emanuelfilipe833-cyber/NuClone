
import React, { useState, useEffect } from 'react';
import { 
  Eye, EyeOff, ChevronRight, QrCode, Smartphone, 
  ArrowUpCircle, ArrowDownCircle, CreditCard, 
  HelpCircle, Bell, User, Plus, Search, 
  CheckCircle2, X, Briefcase, Heart, TrendingUp,
  UserPlus, ArrowLeftRight, Landmark, BadgeDollarSign,
  ShoppingBag, LayoutGrid, CircleDollarSign, ArrowLeft,
  Settings, SmartphoneNfc, Wallet
} from 'lucide-react';
import { Transaction, ViewState } from './types';
import { INITIAL_BALANCE, MOCK_TRANSACTIONS } from './constants';
import { getFinancialInsight } from './services/geminiService';

const App: React.FC = () => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [insight, setInsight] = useState<string>("Carregando sua dica financeira...");
  const [pixAmount, setPixAmount] = useState("");
  const [pixRecipient, setPixRecipient] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const text = await getFinancialInsight(balance);
        setInsight(text);
      } catch (e) {
        setInsight("Mantenha o controle das suas finanças com o Nu.");
      }
    };
    fetchInsight();
  }, [balance]);

  const handlePixTransfer = () => {
    const amountStr = pixAmount.replace(',', '.');
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
      alert("Valor inválido.");
      return;
    }
    if (amount > balance) {
      alert("Saldo insuficiente.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        title: 'Transferência enviada',
        description: pixRecipient || 'Contato Nu',
        amount: -amount,
        date: 'Hoje',
        type: 'pix',
        status: 'completed'
      };

      setBalance(prev => prev - amount);
      setTransactions(prev => [newTransaction, ...prev]);
      setIsProcessing(false);
      setCurrentView(ViewState.SUCCESS);
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const QuickAction = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button 
      onClick={onClick || (() => alert(`${label} em breve.`))}
      className="flex flex-col items-center gap-2 min-w-[76px] group active:scale-90 transition-transform"
    >
      <div className="w-[68px] h-[68px] bg-[#1a1a1a] rounded-full flex items-center justify-center text-white">
        <Icon size={26} />
      </div>
      <span className="text-xs font-bold text-white/90 text-center leading-tight tracking-tight">{label}</span>
    </button>
  );

  const SectionHeader = ({ title, onClick }: { title: string, onClick?: () => void }) => (
    <div className="flex justify-between items-center mb-3 cursor-pointer group" onClick={onClick}>
      <h3 className="text-xl font-bold tracking-tight group-active:opacity-60">{title}</h3>
      <ChevronRight size={20} className="text-gray-600" />
    </div>
  );

  const HomeView = () => (
    <div className="flex flex-col min-h-screen bg-black text-white pb-28">
      {/* Nubank Purple Header */}
      <div className="bg-[#820ad1] pt-10 pb-6 px-5">
        <div className="flex justify-between items-center mb-8">
          <div 
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-all"
            onClick={() => setCurrentView(ViewState.PROFILE)}
          >
            <User size={24} className="text-white" />
          </div>
          <div className="flex gap-6">
            <button onClick={() => setIsBalanceVisible(!isBalanceVisible)} className="active:scale-90 transition-transform">
              {isBalanceVisible ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
            <HelpCircle size={24} className="cursor-pointer active:scale-90 transition-transform" />
            <UserPlus size={24} className="cursor-pointer active:scale-90 transition-transform" />
          </div>
        </div>
        <h2 className="text-xl font-bold">Olá, Usuário</h2>
      </div>

      {/* Conta Card */}
      <div 
        className="p-6 cursor-pointer active:bg-[#0a0a0a] transition-colors" 
        onClick={() => setCurrentView(ViewState.ACCOUNT_DETAILS)}
      >
        <SectionHeader title="Conta" />
        <div className="h-10 flex items-center">
          {isBalanceVisible ? (
            <span className="text-2xl font-bold">{formatCurrency(balance)}</span>
          ) : (
            <div className="w-44 h-7 bg-[#1a1a1a] rounded-md animate-pulse" />
          )}
        </div>
      </div>

      {/* Horizontal Actions */}
      <div className="flex overflow-x-auto gap-3 px-6 py-4 no-scrollbar">
        <QuickAction icon={QrCode} label="Área Pix" onClick={() => setCurrentView(ViewState.PIX_FLOW)} />
        <QuickAction icon={ArrowUpCircle} label="Pagar" />
        <QuickAction icon={ArrowDownCircle} label="Transferir" onClick={() => setCurrentView(ViewState.PIX_FLOW)} />
        <QuickAction icon={Landmark} label="Depositar" />
        <QuickAction icon={Smartphone} label="Recarga" />
        <QuickAction icon={ArrowLeftRight} label="Cobrar" />
        <QuickAction icon={Heart} label="Doação" />
      </div>

      {/* My Cards & Insights */}
      <div className="px-6 mt-6 space-y-4">
        <div className="bg-[#1a1a1a] p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform">
          <CreditCard size={20} className="text-white" />
          <span className="text-sm font-bold">Meus cartões</span>
        </div>

        <div className="bg-[#1a1a1a] p-5 rounded-2xl border-l-4 border-[#820ad1]">
          <div className="flex items-center gap-2 mb-2 text-[#820ad1]">
            <BadgeDollarSign size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Dica do dia</span>
          </div>
          <p className="text-[15px] font-medium leading-tight text-gray-100 italic">
            "{insight}"
          </p>
        </div>

        {/* Promo Cards Scroll */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            <div className="min-w-[280px] bg-[#1a1a1a] p-6 rounded-2xl border border-transparent hover:border-white/10 cursor-pointer">
                <p className="text-sm font-bold text-[#820ad1] mb-2">Caixinhas</p>
                <p className="text-sm text-gray-400 font-medium">As Caixinhas do Nu te ajudam a guardar dinheiro para o que importa.</p>
            </div>
            <div className="min-w-[280px] bg-[#1a1a1a] p-6 rounded-2xl cursor-pointer">
                <p className="text-sm font-bold text-[#820ad1] mb-2">Seguro Vida</p>
                <p className="text-sm text-gray-400 font-medium">Um seguro que cabe no seu bolso e cuida de quem você ama.</p>
            </div>
        </div>
      </div>

      <div className="h-[1px] bg-[#1a1a1a] w-full my-6" />

      {/* Credit Card Section */}
      <div className="px-6 pb-6 cursor-pointer active:bg-[#0a0a0a] transition-colors">
          <SectionHeader title="Cartão de Crédito" />
          <p className="text-sm font-bold text-gray-400 mb-2">Fatura atual</p>
          <p className="text-2xl font-bold text-[#00bcd4]">R$ 1.245,90</p>
          <p className="text-sm text-gray-500 mt-1 font-bold">Limite disponível de R$ 3.754,10</p>
          <div className="flex gap-2 mt-5">
            <button className="px-5 py-2.5 bg-[#1a1a1a] rounded-full text-sm font-bold active:scale-95 transition-all">
                Pagar fatura
            </button>
            <button className="px-5 py-2.5 bg-[#1a1a1a] rounded-full text-sm font-bold active:scale-95 transition-all">
                Parcelar
            </button>
          </div>
      </div>

      <div className="h-[1px] bg-[#1a1a1a] w-full my-2" />

      {/* Empréstimo Section */}
      <div className="px-6 py-6 cursor-pointer active:bg-[#0a0a0a] transition-colors">
          <SectionHeader title="Empréstimo" />
          <p className="text-sm text-gray-400 font-bold leading-snug">Você tem até R$ 15.000,00 disponíveis para empréstimo pessoal.</p>
      </div>

      <div className="h-[1px] bg-[#1a1a1a] w-full my-2" />

      {/* Próximos Pagamentos */}
      <div className="px-6 py-6 cursor-pointer active:bg-[#0a0a0a] transition-colors">
          <SectionHeader title="Próximos pagamentos" />
          <div className="flex gap-4 items-center">
             <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center">
               <Smartphone size={20} className="text-gray-400" />
             </div>
             <div>
               <p className="font-bold text-sm">Fatura Vivo</p>
               <p className="text-xs text-gray-500">Vence em 3 dias • R$ 59,90</p>
             </div>
          </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-[#1a1a1a] flex justify-around items-center h-[76px] px-2 z-50 max-w-md mx-auto">
        <button className="p-3 text-[#820ad1] flex flex-col items-center">
          <LayoutGrid size={28} />
        </button>
        <button className="p-3 text-gray-500 flex flex-col items-center active:scale-90 transition-transform">
          <CircleDollarSign size={28} />
        </button>
        <button className="p-3 text-gray-500 flex flex-col items-center active:scale-90 transition-transform">
          <ShoppingBag size={28} />
        </button>
        <button className="p-3 text-gray-500 flex flex-col items-center active:scale-90 transition-transform">
          <TrendingUp size={28} />
        </button>
      </nav>
    </div>
  );

  const AccountDetailsView = () => (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="p-4 flex items-center justify-between border-b border-[#1a1a1a] sticky top-0 bg-black z-10">
        <button onClick={() => setCurrentView(ViewState.HOME)} className="p-2 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-5">
          <Search size={22} className="text-white cursor-pointer active:scale-90 transition-transform" />
          <HelpCircle size={22} className="text-white cursor-pointer active:scale-90 transition-transform" />
        </div>
      </header>

      <div className="p-6">
        <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">Saldo disponível</p>
        <h2 className="text-3xl font-bold mb-10">{formatCurrency(balance)}</h2>

        <div className="flex overflow-x-auto gap-4 no-scrollbar mb-6">
            <QuickAction icon={Landmark} label="Depositar" />
            <QuickAction icon={ArrowUpCircle} label="Pagar" />
            <QuickAction icon={ArrowDownCircle} label="Transferir" onClick={() => setCurrentView(ViewState.PIX_FLOW)} />
            <QuickAction icon={Smartphone} label="Recarga" />
            <QuickAction icon={ArrowLeftRight} label="Cobrar" />
        </div>
      </div>

      <div className="bg-[#1a1a1a] h-2 w-full" />

      <div className="p-6 flex-1">
        <h3 className="text-lg font-bold mb-8">Histórico</h3>
        <div className="space-y-10 pb-12">
          {transactions.map(tx => (
            <div key={tx.id} className="flex justify-between items-center group cursor-pointer active:opacity-50">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                  {tx.type === 'pix' ? <ArrowUpCircle size={20} className="text-white" /> : <CreditCard size={20} />}
                </div>
                <div>
                  <p className="font-bold text-[15px] leading-tight">{tx.title}</p>
                  <p className="text-sm text-gray-500 font-medium">{tx.description}</p>
                  <p className="text-[11px] text-gray-600 font-bold mt-0.5">{tx.date}</p>
                </div>
              </div>
              <p className={`font-bold text-[15px] ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PixFlowView = () => (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="p-4 flex items-center justify-between">
        <button onClick={() => setCurrentView(ViewState.HOME)} className="p-2 active:scale-90 transition-transform">
          <X size={28} />
        </button>
        <h2 className="text-lg font-bold">Enviar Pix</h2>
        <div className="w-10" />
      </header>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-10">
          <label className="text-gray-400 text-sm font-bold mb-6 block">Quanto você quer transferir?</label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold">R$</span>
            <input 
              type="text"
              inputMode="decimal"
              value={pixAmount}
              onChange={(e) => setPixAmount(e.target.value.replace(/[^0-9,]/g, ''))}
              placeholder="0,00"
              className="w-full bg-transparent border-b-2 border-[#820ad1] pl-12 py-4 text-5xl font-bold focus:outline-none placeholder:text-gray-900"
              autoFocus
            />
          </div>
          <p className="text-sm text-gray-500 mt-5 font-bold">
            Saldo em conta: <span className="text-white">{formatCurrency(balance)}</span>
          </p>
        </div>

        <div className="space-y-4 mb-10">
          <label className="text-gray-400 text-sm font-bold block">Para quem?</label>
          <input 
            type="text"
            value={pixRecipient}
            onChange={(e) => setPixRecipient(e.target.value)}
            placeholder="Nome, CPF ou chave Pix"
            className="w-full bg-[#1a1a1a] rounded-2xl px-5 py-5 font-bold focus:outline-none focus:ring-2 focus:ring-[#820ad1] placeholder:text-gray-700"
          />
        </div>

        <div className="mt-auto pb-10">
          <button 
            onClick={handlePixTransfer}
            disabled={isProcessing || !pixAmount || !pixRecipient}
            className={`w-full py-5 rounded-full font-black text-lg transition-all transform active:scale-95 shadow-xl ${
              (isProcessing || !pixAmount || !pixRecipient) 
              ? 'bg-gray-900 text-gray-700 cursor-not-allowed' 
              : 'bg-[#820ad1] text-white'
            }`}
          >
            {isProcessing ? "Enviando..." : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="flex flex-col h-screen bg-black text-white items-center justify-center p-8 text-center animate-in fade-in duration-700">
      <div className="w-28 h-28 bg-[#820ad1]/20 text-[#820ad1] rounded-full flex items-center justify-center mb-10 animate-bounce">
        <CheckCircle2 size={80} />
      </div>
      <h1 className="text-3xl font-black mb-4 tracking-tight">Pix enviado!</h1>
      <p className="text-gray-400 text-lg mb-12 leading-tight px-2 font-medium">
        Você enviou <span className="text-white font-bold">{formatCurrency(parseFloat(pixAmount.replace(',', '.')))}</span> para <span className="text-white font-bold">{pixRecipient}</span>.
      </p>
      
      <div className="w-full space-y-4">
        <button 
          onClick={() => {
            setCurrentView(ViewState.HOME);
            setPixAmount("");
            setPixRecipient("");
          }}
          className="w-full py-5 bg-[#820ad1] rounded-full font-black text-lg active:scale-95 transition-transform"
        >
          Fechar
        </button>
        <button className="w-full py-5 bg-[#1a1a1a] rounded-full font-black text-lg active:scale-95 transition-transform">
          Ver comprovante
        </button>
      </div>
    </div>
  );

  const ProfileView = () => (
      <div className="flex flex-col h-screen bg-black text-white">
          <header className="p-4 flex items-center justify-between border-b border-[#1a1a1a]">
              <button onClick={() => setCurrentView(ViewState.HOME)} className="p-2 active:scale-90 transition-transform">
                  <X size={28} />
              </button>
              <h2 className="text-lg font-bold">Perfil</h2>
              <Settings size={24} className="text-white cursor-pointer active:scale-90 transition-transform" />
          </header>
          <div className="p-10 flex flex-col items-center">
                <div className="w-28 h-28 bg-[#820ad1] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(130,10,209,0.4)]">
                    <User size={54} className="text-white" />
                </div>
                <h3 className="text-2xl font-black mb-1">Usuário Nu</h3>
                <p className="text-gray-500 font-bold text-sm tracking-tight">Agência 0001 • Conta 1053469-0</p>
                <div className="mt-5 px-4 py-1.5 bg-[#1a1a1a] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#820ad1]">
                    Nível Gold
                </div>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto no-scrollbar">
              {[
                { label: 'Segurança', icon: CheckCircle2 },
                { label: 'Configurar Cartão', icon: CreditCard },
                { label: 'Configurar Conta', icon: Landmark },
                { label: 'NuTag', icon: SmartphoneNfc },
                { label: 'Wallet', icon: Wallet },
                { label: 'Ajuda', icon: HelpCircle },
                { label: 'Sair do App', icon: X }
              ].map((item) => (
                  <div key={item.label} className="p-5 bg-[#1a1a1a] rounded-2xl flex justify-between items-center cursor-pointer active:scale-[0.98] transition-all">
                      <div className="flex items-center gap-4">
                        <item.icon size={22} className="text-gray-400" />
                        <span className="font-bold text-[15px]">{item.label}</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-700" />
                  </div>
              ))}
          </div>
      </div>
  )

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-black overflow-hidden font-sans relative selection:bg-[#820ad1] selection:text-white">
      {currentView === ViewState.HOME && <HomeView />}
      {currentView === ViewState.PIX_FLOW && <PixFlowView />}
      {currentView === ViewState.SUCCESS && <SuccessView />}
      {currentView === ViewState.PROFILE && <ProfileView />}
      {currentView === ViewState.ACCOUNT_DETAILS && <AccountDetailsView />}
    </div>
  );
};

export default App;
