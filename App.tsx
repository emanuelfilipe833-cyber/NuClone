
import React, { useState, useEffect } from 'react';
import { 
  Eye, EyeOff, ChevronRight, QrCode, Smartphone, 
  ArrowUpCircle, ArrowDownCircle, CreditCard, 
  HelpCircle, Bell, User, Plus, Search, 
  CheckCircle2, X, Briefcase, Heart, TrendingUp,
  UserPlus, ArrowLeftRight, Landmark, BadgeDollarSign,
  ShoppingBag, LayoutGrid, CircleDollarSign, ArrowLeft,
  Settings, MessageSquare
} from 'lucide-react';
import { Transaction, ViewState } from './types';
import { INITIAL_BALANCE, MOCK_TRANSACTIONS } from './constants.tsx';
import { getFinancialInsight } from './services/geminiService';

const App: React.FC = () => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [insight, setInsight] = useState<string>("Buscando sua dica do dia...");
  const [pixAmount, setPixAmount] = useState("");
  const [pixRecipient, setPixRecipient] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      const text = await getFinancialInsight(balance);
      setInsight(text);
    };
    fetchInsight();
  }, [balance]);

  const handlePixTransfer = () => {
    const amount = parseFloat(pixAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }
    if (amount > balance) {
      alert("Ops! Saldo insuficiente para esta transferência.");
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
    }, 1200);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const notImplemented = (feature: string) => {
    alert(`${feature} será implementado em breve!`);
  };

  const QuickAction = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button 
      onClick={onClick || (() => notImplemented(label))}
      className="flex flex-col items-center gap-2 min-w-[76px] group active:scale-95 transition-transform"
    >
      <div className="w-[68px] h-[68px] bg-[#1a1a1a] rounded-full flex items-center justify-center text-white">
        <Icon size={24} />
      </div>
      <span className="text-xs font-semibold text-white/90 text-center leading-tight">{label}</span>
    </button>
  );

  const HomeView = () => (
    <div className="flex flex-col min-h-screen bg-black text-white pb-24">
      {/* Dynamic Purple Header */}
      <div className="bg-[#820ad1] pt-6 pb-6 px-4">
        <div className="flex justify-between items-center mb-8">
          <div 
            className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            onClick={() => setCurrentView(ViewState.PROFILE)}
          >
            <User size={22} className="text-white" />
          </div>
          <div className="flex gap-5">
            <button onClick={() => setIsBalanceVisible(!isBalanceVisible)}>
              {isBalanceVisible ? <Eye size={22} /> : <EyeOff size={22} />}
            </button>
            <HelpCircle size={22} onClick={() => notImplemented("Ajuda")} />
            <UserPlus size={22} onClick={() => notImplemented("Indicar amigos")} />
          </div>
        </div>
        <h2 className="text-lg font-bold">Olá, Usuário</h2>
      </div>

      {/* Account Balance Section */}
      <div 
        className="p-6 cursor-pointer active:bg-[#121212] transition-colors" 
        onClick={() => setCurrentView(ViewState.ACCOUNT_DETAILS)}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">Conta</h3>
          <ChevronRight size={20} className="text-gray-500" />
        </div>
        <div className="h-10 flex items-center">
          {isBalanceVisible ? (
            <span className="text-2xl font-bold">{formatCurrency(balance)}</span>
          ) : (
            <div className="w-40 h-7 bg-[#1a1a1a] rounded-md animate-pulse" />
          )}
        </div>
      </div>

      {/* Quick Actions Scroll */}
      <div className="flex overflow-x-auto gap-3 px-6 py-4 no-scrollbar">
        <QuickAction icon={QrCode} label="Área Pix" onClick={() => setCurrentView(ViewState.PIX_FLOW)} />
        <QuickAction icon={ArrowUpCircle} label="Pagar" />
        <QuickAction icon={ArrowDownCircle} label="Transferir" onClick={() => setCurrentView(ViewState.PIX_FLOW)} />
        <QuickAction icon={Landmark} label="Depositar" />
        <QuickAction icon={Smartphone} label="Recarga" />
        <QuickAction icon={ArrowLeftRight} label="Cobrar" />
        <QuickAction icon={Heart} label="Doação" />
      </div>

      {/* Feature Cards */}
      <div className="px-6 mt-6 space-y-4">
        <div className="bg-[#1a1a1a] p-4 rounded-xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => notImplemented("Meus cartões")}>
          <CreditCard size={20} className="text-white" />
          <span className="text-sm font-semibold">Meus cartões</span>
        </div>

        {/* AI Insight Section */}
        <div className="bg-[#1a1a1a] p-5 rounded-xl border-l-4 border-[#820ad1]">
          <div className="flex items-center gap-2 mb-2 text-[#820ad1]">
            <BadgeDollarSign size={16} />
            <span className="text-xs font-black uppercase tracking-wider">Nu Dica</span>
          </div>
          <p className="text-[15px] leading-relaxed text-gray-200">
            {insight}
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            <div className="min-w-[280px] bg-[#1a1a1a] p-5 rounded-xl border border-transparent hover:border-white/10 cursor-pointer" onClick={() => notImplemented("Caixinhas")}>
                <p className="text-sm font-bold text-[#820ad1] mb-2">Conquiste seus planos</p>
                <p className="text-sm text-gray-400">As Caixinhas do Nu te ajudam a guardar dinheiro para o que importa.</p>
            </div>
            <div className="min-w-[280px] bg-[#1a1a1a] p-5 rounded-xl cursor-pointer" onClick={() => notImplemented("Seguro")}>
                <p className="text-sm font-bold text-[#820ad1] mb-2">Seguro Vida</p>
                <p className="text-sm text-gray-400">Um seguro que cabe no seu bolso e cuida de quem você ama.</p>
            </div>
        </div>
      </div>

      <div className="h-[1px] bg-[#121212] w-full my-6" />

      {/* Credit Card Section */}
      <div className="px-6 pb-6 cursor-pointer active:bg-[#121212] transition-colors" onClick={() => notImplemented("Detalhes do Cartão")}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Cartão de Crédito</h3>
            <ChevronRight size={20} className="text-gray-500" />
          </div>
          <p className="text-sm font-semibold text-gray-400 mb-2">Fatura atual</p>
          <p className="text-2xl font-bold text-[#00bcd4]">R$ 1.245,90</p>
          <p className="text-sm text-gray-500 mt-1 font-medium">Limite disponível de R$ 3.754,10</p>
          <button className="mt-4 px-4 py-2 bg-[#1a1a1a] rounded-full text-sm font-bold active:scale-95 transition-all">
            Parcelar fatura
          </button>
      </div>

      <div className="h-[1px] bg-[#121212] w-full my-2" />

      {/* Loan Section */}
      <div className="px-6 py-6 cursor-pointer active:bg-[#121212] transition-colors" onClick={() => notImplemented("Empréstimo")}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Empréstimo</h3>
            <ChevronRight size={20} className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-400 font-medium">Crie um empréstimo pessoal e realize seus projetos.</p>
      </div>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-[#121212] flex justify-around items-center h-[72px] px-2 z-50">
        <button className="p-3 text-[#820ad1] flex flex-col items-center">
          <LayoutGrid size={24} />
        </button>
        <button className="p-3 text-gray-500 flex flex-col items-center" onClick={() => notImplemented("Planejamento")}>
          <CircleDollarSign size={24} />
        </button>
        <button className="p-3 text-gray-500 flex flex-col items-center" onClick={() => notImplemented("Shopping")}>
          <ShoppingBag size={24} />
        </button>
        <button className="p-3 text-gray-500 flex flex-col items-center" onClick={() => notImplemented("Investimentos")}>
          <TrendingUp size={24} />
        </button>
      </nav>
    </div>
  );

  const AccountDetailsView = () => (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="p-4 flex items-center justify-between border-b border-[#121212]">
        <button onClick={() => setCurrentView(ViewState.HOME)} className="p-2 hover:bg-[#1a1a1a] rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-4">
          <Search size={22} className="text-white" onClick={() => notImplemented("Busca")} />
          <HelpCircle size={22} className="text-white" onClick={() => notImplemented("Ajuda")} />
        </div>
      </header>

      <div className="p-6">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Saldo disponível</p>
        <h2 className="text-3xl font-bold mb-8">{formatCurrency(balance)}</h2>

        <div className="flex overflow-x-auto gap-4 no-scrollbar mb-8">
            <QuickAction icon={Landmark} label="Depositar" />
            <QuickAction icon={ArrowUpCircle} label="Pagar" />
            <QuickAction icon={ArrowDownCircle} label="Transferir" onClick={() => setCurrentView(ViewState.PIX_FLOW)} />
            <QuickAction icon={Smartphone} label="Recarga" />
            <QuickAction icon={ArrowLeftRight} label="Cobrar" />
        </div>
      </div>

      <div className="bg-[#1a1a1a] h-2 w-full" />

      <div className="p-6 flex-1">
        <h3 className="text-xl font-bold mb-6">Histórico</h3>
        <div className="space-y-8 pb-10">
          {transactions.map(tx => (
            <div key={tx.id} className="flex justify-between items-center cursor-pointer active:opacity-70 transition-opacity">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                  {tx.type === 'pix' ? <ArrowUpCircle size={20} className="text-white" /> : <CreditCard size={20} />}
                </div>
                <div>
                  <p className="font-bold text-[15px]">{tx.title}</p>
                  <p className="text-sm text-gray-400">{tx.description}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-[15px] ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PixFlowView = () => (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="p-4 flex items-center justify-between">
        <button onClick={() => setCurrentView(ViewState.HOME)} className="p-2 hover:bg-[#1a1a1a] rounded-full">
          <X size={26} />
        </button>
        <h2 className="text-lg font-bold">Área Pix</h2>
        <HelpCircle size={22} className="text-gray-400" onClick={() => notImplemented("Ajuda Pix")} />
      </header>

      <div className="p-6 flex-1 flex flex-col gap-10">
        <div>
          <label className="text-gray-400 text-sm font-semibold mb-4 block">Qual o valor da transferência?</label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold">R$</span>
            <input 
              type="text"
              value={pixAmount}
              onChange={(e) => setPixAmount(e.target.value.replace(/[^0-9,]/g, ''))}
              placeholder="0,00"
              className="w-full bg-transparent border-b-2 border-[#820ad1] pl-12 py-3 text-5xl font-bold focus:outline-none placeholder:text-gray-800"
              autoFocus
            />
          </div>
          <p className="text-sm text-gray-500 mt-4 font-medium">
            Saldo em conta: <span className="text-white font-bold">{formatCurrency(balance)}</span>
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-gray-400 text-sm font-semibold block">Para quem você quer transferir?</label>
          <input 
            type="text"
            value={pixRecipient}
            onChange={(e) => setPixRecipient(e.target.value)}
            placeholder="Nome, CPF ou chave Pix"
            className="w-full bg-[#1a1a1a] rounded-xl px-4 py-5 font-medium focus:outline-none focus:ring-2 focus:ring-[#820ad1] placeholder:text-gray-600"
          />
        </div>

        <div className="mt-auto pb-6">
          <button 
            onClick={handlePixTransfer}
            disabled={isProcessing || !pixAmount || !pixRecipient}
            className={`w-full py-5 rounded-full font-bold text-lg transition-all transform active:scale-95 ${
              (isProcessing || !pixAmount || !pixRecipient) 
              ? 'bg-gray-900 text-gray-600 cursor-not-allowed' 
              : 'bg-[#820ad1] text-white'
            }`}
          >
            {isProcessing ? "Finalizando..." : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="flex flex-col h-screen bg-black text-white items-center justify-center p-8 text-center">
      <div className="w-28 h-28 bg-[#820ad1]/20 text-[#820ad1] rounded-full flex items-center justify-center mb-8 animate-in fade-in zoom-in duration-500">
        <CheckCircle2 size={72} />
      </div>
      <h1 className="text-3xl font-bold mb-3">Pix enviado!</h1>
      <p className="text-gray-400 text-lg mb-10 leading-relaxed px-4">
        Você transferiu <span className="text-white font-bold">{formatCurrency(parseFloat(pixAmount.replace(',', '.')))}</span> com sucesso para <span className="text-white font-bold">{pixRecipient}</span>.
      </p>
      
      <div className="w-full space-y-4">
        <button 
          onClick={() => {
            setCurrentView(ViewState.HOME);
            setPixAmount("");
            setPixRecipient("");
          }}
          className="w-full py-5 bg-[#820ad1] rounded-full font-bold text-lg active:scale-95 transition-transform"
        >
          Ok, entendi
        </button>
        <button className="w-full py-5 bg-[#1a1a1a] rounded-full font-bold text-lg active:scale-95 transition-transform" onClick={() => notImplemented("Comprovante")}>
          Ver comprovante
        </button>
      </div>
    </div>
  );

  const ProfileView = () => (
      <div className="flex flex-col h-screen bg-black text-white">
          <header className="p-4 flex items-center justify-between border-b border-[#121212]">
              <button onClick={() => setCurrentView(ViewState.HOME)} className="p-2">
                  <X size={26} />
              </button>
              <h2 className="text-lg font-bold">Perfil</h2>
              <div className="flex gap-4">
                <Settings size={22} className="text-white" onClick={() => notImplemented("Configurações")} />
              </div>
          </header>
          <div className="p-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-[#820ad1] rounded-full flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(130,10,209,0.3)]">
                    <User size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-1">Usuário Nu</h3>
                <p className="text-gray-400 font-medium">Agência 0001 • Conta 1053469-0</p>
                <div className="mt-4 px-3 py-1 bg-[#1a1a1a] rounded-full text-[10px] font-black uppercase tracking-tighter text-gray-500">
                    Membro desde 2021
                </div>
          </div>
          <div className="p-4 space-y-2 overflow-y-auto no-scrollbar">
              {[
                { label: 'Configurar Perfil', icon: User },
                { label: 'Segurança', icon: CheckCircle2 },
                { label: 'Configurar Cartão', icon: CreditCard },
                { label: 'Configurar Conta', icon: Landmark },
                { label: 'Ajuda', icon: HelpCircle },
                { label: 'Sair do App', icon: X }
              ].map((item) => (
                  <div key={item.label} className="p-5 bg-[#1a1a1a] rounded-xl flex justify-between items-center cursor-pointer active:scale-[0.99] transition-all" onClick={() => notImplemented(item.label)}>
                      <div className="flex items-center gap-4">
                        <item.icon size={20} className="text-gray-400" />
                        <span className="font-semibold text-[15px]">{item.label}</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-600" />
                  </div>
              ))}
          </div>
      </div>
  )

  return (
    <div className="max-w-md mx-auto min-h-screen shadow-2xl overflow-hidden font-sans relative selection:bg-[#820ad1] selection:text-white">
      {currentView === ViewState.HOME && <HomeView />}
      {currentView === ViewState.PIX_FLOW && <PixFlowView />}
      {currentView === ViewState.SUCCESS && <SuccessView />}
      {currentView === ViewState.PROFILE && <ProfileView />}
      {currentView === ViewState.ACCOUNT_DETAILS && <AccountDetailsView />}
    </div>
  );
};

export default App;
